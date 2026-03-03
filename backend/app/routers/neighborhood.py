from fastapi import APIRouter, HTTPException
from app.services import maps, walkscore, ai_summary
from app.models.neighborhood import NeighborhoodResponse, TransitInfo, PlaceInfo
import asyncio

router = APIRouter(prefix="/api", tags=["neighborhood"])

@router.get("/neighborhood", response_model=NeighborhoodResponse)
async def get_neighborhood_vibe(address: str):
    """
    Main endpoint: takes an address, returns full neighborhood vibe data.
    Example: GET /api/neighborhood?address=401+King+St+W,+Toronto
    """
    # 1. Geocode address
    geo = await maps.geocode_address(address)
    if not geo:
        raise HTTPException(status_code=404, detail="Address not found")

    lat, lng = geo["lat"], geo["lng"]
    formatted = geo["formatted_address"]

    # 2. Fetch all data in parallel
    walk_task = walkscore.get_walk_score(formatted, lat, lng)
    restaurants_task = maps.get_nearby_places(lat, lng, "restaurant")
    schools_task = maps.get_nearby_places(lat, lng, "school", radius=1000)
    transit_task = maps.get_nearby_places(lat, lng, "subway_station", radius=800)

    walk_data, restaurants, schools, transit_stops = await asyncio.gather(
        walk_task, restaurants_task, schools_task, transit_task
    )

    # 3. Generate AI summary
    summary_data = {
        "formatted_address": formatted,
        **walk_data,
        "restaurants_count": len(restaurants),
        "schools_count": len(schools),
        "transit_count": len(transit_stops),
    }
    summary, vibe_score = await ai_summary.generate_neighborhood_summary(summary_data)

    # 4. Build response
    all_places = (
        [PlaceInfo(**p) for p in restaurants] +
        [PlaceInfo(**p) for p in schools] +
        [PlaceInfo(**p) for p in transit_stops]
    )

    return NeighborhoodResponse(
        address=address,
        formatted_address=formatted,
        lat=lat,
        lng=lng,
        transit=TransitInfo(**walk_data),
        nearby_places=all_places,
        ai_summary=summary,
        vibe_score=vibe_score
    )

@router.get("/health")
async def health_check():
    return {"status": "ok", "service": "Neighborhood Vibe API"}
