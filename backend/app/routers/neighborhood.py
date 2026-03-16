from fastapi import APIRouter, Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.services.maps import geocode_address, get_nearby_places
from app.services.walkscore import get_walk_score
from app.services.ai_summary import generate_neighborhood_summary
from app.services.toronto_data import get_crime_data, get_housing_data, get_neighbourhood_name
import asyncio
import re
import json
import redis.asyncio as aioredis

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

# Redis client
_redis: aioredis.Redis | None = None


async def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        _redis = aioredis.from_url("redis://redis-service:6379", decode_responses=True)
    return _redis

CACHE_TTL = 60 * 60 * 24  # 24 ساعت


def validate_address(address: str) -> str:
    if not address or len(address.strip()) < 3:
        raise HTTPException(status_code=400, detail="Address too short")
    if len(address) > 200:
        raise HTTPException(status_code=400, detail="Address too long")
    if not re.match(r"^[a-zA-Z0-9\s,.\-'#/]+$", address):
        raise HTTPException(status_code=400, detail="Invalid characters in address")
    if not re.search(r'toronto|ontario|\bON\b', address, re.IGNORECASE):
        address = address + ", Toronto, ON"
    return address.strip()


@router.get("/api/neighborhood")
@limiter.limit("10/minute")
async def get_neighborhood(request: Request, address: str):
    address = validate_address(address)
    cache_key = f"vibe:{address.lower()}"

    # Check cache
    try:
        r = await get_redis()
        cached = await r.get(cache_key)
        if cached:
            return json.loads(cached)
    except Exception:
        pass

    # Geocode
    location = await geocode_address(address)
    if not location:
        raise HTTPException(status_code=404, detail="Address not found")

    lat, lng = location["lat"], location["lng"]

    # Run all data fetches in parallel
    (restaurants, schools, transit), scores, neighbourhood_name, crime_data = await asyncio.gather(
        asyncio.gather(
            get_nearby_places(lat, lng, "restaurant"),
            get_nearby_places(lat, lng, "school"),
            get_nearby_places(lat, lng, "subway_station"),
        ),
        get_walk_score(address, lat, lng),
        get_neighbourhood_name(lat, lng),
        get_crime_data(lat, lng),
    )
    places = restaurants + schools + transit

    # Housing data (needs neighbourhood name first)
    housing_data = await get_housing_data(neighbourhood_name) if neighbourhood_name else {}

    # AI summary
    summary, vibe_score = await generate_neighborhood_summary({
        "formatted_address": location["formatted_address"],
        "walk_score": scores["walk_score"],
        "walk_description": scores["walk_description"],
        "transit_score": scores["transit_score"],
        "transit_description": scores["transit_description"],
        "bike_score": scores["bike_score"],
        "restaurants_count": len(restaurants),
        "schools_count": len(schools),
        "transit_count": len(transit),
        "safety_score": crime_data.get("safety_score"),
        "total_incidents": crime_data.get("total_incidents"),
    })

    result = {
        "formatted_address": location["formatted_address"],
        "lat": lat,
        "lng": lng,
        "transit": {
            "walk_score": scores["walk_score"],
            "walk_description": scores["walk_description"],
            "transit_score": scores["transit_score"],
            "transit_description": scores["transit_description"],
            "bike_score": scores["bike_score"],
        },
        "nearby_places": places,
        "vibe_score": vibe_score,
        "ai_summary": summary,
        "crime": crime_data,
        "housing": housing_data,
    }

    # Save to cache
    try:
        r = await get_redis()
        await r.setex(cache_key, CACHE_TTL, json.dumps(result))
    except Exception:
        pass

    return result