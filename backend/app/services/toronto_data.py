import httpx
from app.services.maps import get_client

# Toronto Open Data API
TORONTO_API = "https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action"

# Neighbourhood shape data (to map lat/lng to neighbourhood name)
NEIGHBOURHOODS_URL = "https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search"

async def get_neighbourhood_name(lat: float, lng: float) -> str:
    """Get Toronto neighbourhood name from lat/lng using reverse geocoding"""
    client = await get_client()
    try:
        resp = await client.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            params={
                "latlng": f"{lat},{lng}",
                "result_type": "neighborhood|sublocality",
                "key": __import__('app.config', fromlist=['settings']).settings.GOOGLE_MAPS_API_KEY
            }
        )
        data = resp.json()
        for result in data.get("results", []):
            for component in result.get("address_components", []):
                if "neighborhood" in component["types"] or "sublocality" in component["types"]:
                    return component["long_name"]
    except Exception:
        pass
    return ""


async def get_crime_data(lat: float, lng: float) -> dict:
    """Get crime statistics near a location from Toronto Police Open Data"""
    client = await get_client()
    try:
        # Major Crime Indicators dataset
        resp = await client.get(
            "https://services.arcgis.com/S9th0jAJ7bqgIRjw/arcgis/rest/services/Major_Crime_Indicators_Open_Data/FeatureServer/0/query",
            params={
                "geometry": f"{lng},{lat}",
                "geometryType": "esriGeometryPoint",
                "inSR": "4326",
                "spatialRel": "esriSpatialRelWithin",
                "distance": 500,
                "units": "esriSRUnit_Meter",
                "outFields": "MCI_CATEGORY",
                "where": "OCC_YEAR >= 2023",
                "returnCountOnly": "false",
                "f": "json",
                "resultRecordCount": 100,
            }
        )
        data = resp.json()
        features = data.get("features", [])

        # Count by category
        categories = {}
        for f in features:
            cat = f.get("attributes", {}).get("MCI_CATEGORY", "Other")
            categories[cat] = categories.get(cat, 0) + 1

        total = len(features)

        # Safety score: fewer crimes = higher score
        if total == 0:
            safety_score = 95
        elif total < 5:
            safety_score = 85
        elif total < 15:
            safety_score = 70
        elif total < 30:
            safety_score = 55
        elif total < 50:
            safety_score = 40
        else:
            safety_score = 25

        return {
            "safety_score": safety_score,
            "total_incidents": total,
            "breakdown": categories,
            "period": "2023–present",
            "radius_m": 500,
        }
    except Exception as e:
        print(f"Crime data error: {e}")
        return {"safety_score": None, "total_incidents": None, "breakdown": {}}


async def get_housing_data(neighbourhood: str) -> dict:
    """Get average housing/rent data for a Toronto neighbourhood"""
    client = await get_client()
    try:
        # Toronto Neighbourhood Profiles dataset
        resp = await client.get(
            f"{TORONTO_API}/datastore_search",
            params={
                "resource_id": "6e19a90f-971c-46b3-852c-0c48c436d1fc",
                "q": neighbourhood,
                "limit": 5,
            }
        )
        data = resp.json()
        records = data.get("result", {}).get("records", [])

        if records:
            record = records[0]
            return {
                "neighbourhood": record.get("Neighbourhood", neighbourhood),
                "avg_household_income": record.get("Average household total income ($)", "N/A"),
                "avg_shelter_cost_owner": record.get("Average monthly shelter costs for owned dwellings ($)", "N/A"),
                "avg_shelter_cost_renter": record.get("Average monthly shelter costs for rented dwellings ($)", "N/A"),
            }
    except Exception as e:
        print(f"Housing data error: {e}")

    return {
        "neighbourhood": neighbourhood,
        "avg_household_income": "N/A",
        "avg_shelter_cost_owner": "N/A",
        "avg_shelter_cost_renter": "N/A",
    }