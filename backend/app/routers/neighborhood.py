from fastapi import APIRouter, Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.services.maps import geocode_address, get_nearby_places
from app.services.walkscore import get_walk_score
from app.services.ai_summary import generate_neighborhood_summary
import re

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


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

    # Geocode
    location = await geocode_address(address)
    if not location:
        raise HTTPException(status_code=404, detail="Address not found")

    # Get nearby places
    places = await get_nearby_places(location["lat"], location["lng"])

    # Calculate scores
    scores = await get_walk_score(address, location["lat"], location["lng"])

    # Count places by type
    restaurants = [p for p in places if p.get("type") == "restaurant"]
    schools = [p for p in places if p.get("type") == "school"]
    transit = [p for p in places if p.get("type") == "subway_station"]

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
    })

    return {
        "formatted_address": location["formatted_address"],
        "lat": location["lat"],
        "lng": location["lng"],
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
    }