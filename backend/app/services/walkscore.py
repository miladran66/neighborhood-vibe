import httpx
import asyncio
from app.config import settings

BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

# Category definitions for scoring
WALK_CATEGORIES = [
    {"type": "grocery_or_supermarket", "radius": 500, "weight": 20},
    {"type": "restaurant",             "radius": 400, "weight": 15},
    {"type": "cafe",                   "radius": 400, "weight": 10},
    {"type": "pharmacy",               "radius": 600, "weight": 10},
    {"type": "bank",                   "radius": 600, "weight": 8},
    {"type": "convenience_store",      "radius": 400, "weight": 7},
    {"type": "gym",                    "radius": 600, "weight": 5},
    {"type": "park",                   "radius": 600, "weight": 5},
]

TRANSIT_CATEGORIES = [
    {"type": "subway_station",  "radius": 600, "weight": 40},
    {"type": "train_station",   "radius": 800, "weight": 35},
    {"type": "bus_station",     "radius": 400, "weight": 20},
    {"type": "transit_station", "radius": 500, "weight": 20},
]

BIKE_CATEGORIES = [
    {"type": "park",           "radius": 800,  "weight": 30},
    {"type": "bicycle_store",  "radius": 1000, "weight": 20},
    {"type": "gym",            "radius": 800,  "weight": 15},
]


async def _count_places(lat: float, lng: float, place_type: str, radius: int) -> int:
    """Return how many places of a given type exist within radius."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            BASE_URL,
            params={
                "location": f"{lat},{lng}",
                "radius": radius,
                "type": place_type,
                "key": settings.GOOGLE_MAPS_API_KEY
            }
        )
        data = resp.json()
        return len(data.get("results", []))


def _score_label(score: int, mode: str) -> str:
    """Human-friendly description based on score and mode."""
    if mode == "walk":
        if score >= 90: return "Walker's Paradise"
        if score >= 70: return "Very Walkable"
        if score >= 50: return "Somewhat Walkable"
        if score >= 25: return "Car-Friendly"
        return "Car-Dependent"
    elif mode == "transit":
        if score >= 90: return "Rider's Paradise"
        if score >= 70: return "Excellent Transit"
        if score >= 50: return "Good Transit"
        if score >= 25: return "Some Transit"
        return "Minimal Transit"
    elif mode == "bike":
        if score >= 90: return "Biker's Paradise"
        if score >= 70: return "Very Bikeable"
        if score >= 50: return "Bikeable"
        return "Minimal Infrastructure"
    return ""


async def get_walk_score(address: str, lat: float, lng: float) -> dict:
    """
    Calculate Walk, Transit, and Bike scores using Google Maps Places API.
    No external scoring API needed — scores derived from nearby amenity density.
    """
    # --- Walk Score ---
    walk_counts = await asyncio.gather(*[
        _count_places(lat, lng, cat["type"], cat["radius"])
        for cat in WALK_CATEGORIES
    ])
    walk_raw = sum(min(c, 3) * cat["weight"] for c, cat in zip(walk_counts, WALK_CATEGORIES))
    walk_max = sum(3 * cat["weight"] for cat in WALK_CATEGORIES)
    walk_score = min(100, int((walk_raw / walk_max) * 100))

    # --- Transit Score ---
    transit_counts = await asyncio.gather(*[
        _count_places(lat, lng, cat["type"], cat["radius"])
        for cat in TRANSIT_CATEGORIES
    ])
    transit_raw = sum(min(c, 3) * cat["weight"] for c, cat in zip(transit_counts, TRANSIT_CATEGORIES))
    transit_max = sum(3 * cat["weight"] for cat in TRANSIT_CATEGORIES)
    transit_score = min(100, int((transit_raw / transit_max) * 100))

    # --- Bike Score ---
    bike_counts = await asyncio.gather(*[
        _count_places(lat, lng, cat["type"], cat["radius"])
        for cat in BIKE_CATEGORIES
    ])
    bike_raw = sum(min(c, 3) * cat["weight"] for c, cat in zip(bike_counts, BIKE_CATEGORIES))
    bike_max = sum(3 * cat["weight"] for cat in BIKE_CATEGORIES)
    bike_score = min(100, int((bike_raw / bike_max) * 100))

    return {
        "walk_score": walk_score,
        "walk_description": _score_label(walk_score, "walk"),
        "transit_score": transit_score,
        "transit_description": _score_label(transit_score, "transit"),
        "bike_score": bike_score,
    }
