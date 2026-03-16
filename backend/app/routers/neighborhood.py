from fastapi import APIRouter, Request, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.services.maps import geocode_address, get_nearby_places
from app.services.walkscore import calculate_scores
from app.services.ai_summary import get_ai_summary
import re

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


def validate_address(address: str) -> str:
    if not address or len(address.strip()) < 3:
        raise HTTPException(status_code=400, detail="Address too short")
    if len(address) > 200:
        raise HTTPException(status_code=400, detail="Address too long")
    # فقط کاراکترهای مجاز
    if not re.match(r"^[a-zA-Z0-9\s,.\-'#/]+$", address):
        raise HTTPException(status_code=400, detail="Invalid characters in address")
    # اگه toronto/ON نبود اضافه کن
    if not re.search(r'toronto|ontario|\bON\b', address, re.IGNORECASE):
        address = address + ", Toronto, ON"
    return address.strip()


@router.get("/api/neighborhood")
@limiter.limit("10/minute")
async def get_neighborhood(request: Request, address: str):
    # Validate input
    address = validate_address(address)

    # Geocode
    location = await geocode_address(address)
    if not location:
        raise HTTPException(status_code=404, detail="Address not found")

    # Get nearby places
    places = await get_nearby_places(location["lat"], location["lng"])

    # Calculate scores
    scores = calculate_scores(places)

    # AI summary
    ai_data = await get_ai_summary(
        address=location["formatted_address"],
        places=places,
        scores=scores
    )

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
        "vibe_score": ai_data.get("vibe_score", 50),
        "ai_summary": ai_data.get("summary", ""),
        "neighborhood_name": ai_data.get("neighborhood_name", ""),
    }