import httpx
import asyncio
from app.config import settings

BASE_URL = "https://maps.googleapis.com/maps/api"
TIMEOUT = httpx.Timeout(10.0, connect=5.0)

# Connection pool - shared across requests
_client: httpx.AsyncClient | None = None

async def get_client() -> httpx.AsyncClient:
    global _client
    if _client is None or _client.is_closed:
        _client = httpx.AsyncClient(timeout=TIMEOUT, limits=httpx.Limits(
            max_connections=20,
            max_keepalive_connections=10
        ))
    return _client


async def geocode_address(address: str) -> dict:
    client = await get_client()
    try:
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
    except httpx.TimeoutException:
        raise Exception("Google Maps API timeout")
    return {}


async def get_nearby_places(lat: float, lng: float, place_type: str, radius: int = 500) -> list:
    client = await get_client()
    try:
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
    except httpx.TimeoutException:
        return []