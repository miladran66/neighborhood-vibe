from pydantic import BaseModel
from typing import Optional, List

class TransitInfo(BaseModel):
    walk_score: Optional[int] = None
    transit_score: Optional[int] = None
    bike_score: Optional[int] = None
    walk_description: Optional[str] = None
    transit_description: Optional[str] = None

class PlaceInfo(BaseModel):
    name: str
    rating: Optional[float] = None
    vicinity: Optional[str] = None
    type: Optional[str] = None

class NeighborhoodResponse(BaseModel):
    address: str
    formatted_address: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    transit: Optional[TransitInfo] = None
    nearby_places: Optional[List[PlaceInfo]] = None
    ai_summary: Optional[str] = None
    vibe_score: Optional[int] = None  # 0-100
