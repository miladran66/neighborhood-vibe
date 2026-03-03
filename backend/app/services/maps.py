import httpx
from app.config import settings

BASE_URL = "https://maps.googleapis.com/maps/api"

async def geocode_address(address: str) -> dict:
    """Convert address to lat/lng + formatted address"""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{BASE_URL}/geocode/json",
            params={"address": address, "key": settings.GOOGLE_MAPS_API_KEY}
        )
        data = resp.json()
        if data["status"] == "OK":
            result = data["results"][0]
            loc = result["geometry"]["location"]
            return {
                "formatted_address": result["formatted_address"],
                "lat": loc["lat"],
                "lng": loc["lng"]
            }
        return {}

async def get_nearby_places(lat: float, lng: float, place_type: str, radius: int = 500) -> list:
    """Get nearby places by type (restaurant, school, subway_station, etc.)"""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{BASE_URL}/place/nearbysearch/json",
            params={
                "location": f"{lat},{lng}",
                "radius": radius,
                "type": place_type,
                "key": settings.GOOGLE_MAPS_API_KEY
            }
        )
        data = resp.json()
        places = []
        for p in data.get("results", [])[:5]:
            places.append({
                "name": p.get("name"),
                "rating": p.get("rating"),
                "vicinity": p.get("vicinity"),
                "type": place_type
            })
        return places
