import httpx
import csv
import io
from app.services.maps import get_client
from app.config import settings

# Toronto Open Data
TORONTO_API = "https://ckan0.cf.opendata.inter.prod-toronto.ca"

# Cache برای housing data
_housing_cache: dict = {}
_housing_loaded = False


async def _load_housing_data():
    """یه بار CSV رو دانلود و parse کن"""
    global _housing_cache, _housing_loaded
    if _housing_loaded:
        return

    client = await get_client()
    try:
        # پیدا کردن URL فایل CSV
        resp = await client.get(
            f"{TORONTO_API}/api/3/action/package_show",
            params={"id": "neighbourhood-profiles"},
            timeout=15.0
        )
        package = resp.json()
        resources = package.get("result", {}).get("resources", [])

        csv_url = None
        for r in resources:
            if "2016" in r.get("name", "") and r.get("format", "").upper() == "CSV":
                csv_url = r.get("url")
                break

        if not csv_url:
            print("Housing CSV not found")
            return

        # دانلود CSV
        csv_resp = await client.get(csv_url, timeout=30.0)
        content = csv_resp.text

        # Parse CSV
        reader = csv.DictReader(io.StringIO(content))
        for row in reader:
            category = row.get("Category", "")
            topic = row.get("Topic", "")
            # پیدا کردن ردیف‌های مربوط به shelter cost
            if "shelter" in topic.lower() or "shelter" in category.lower():
                for key, value in row.items():
                    if key not in ("Category", "Topic", "Data Source", "City of Toronto"):
                        if key not in _housing_cache:
                            _housing_cache[key] = {}
                        _housing_cache[key][topic] = value

        _housing_loaded = True
        print(f"Housing data loaded for {len(_housing_cache)} neighbourhoods")

    except Exception as e:
        print(f"Failed to load housing data: {e}")


async def get_neighbourhood_name(lat: float, lng: float) -> str:
    """Get Toronto neighbourhood name from lat/lng"""
    client = await get_client()
    try:
        resp = await client.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            params={
                "latlng": f"{lat},{lng}",
                "result_type": "neighborhood|sublocality",
                "key": settings.GOOGLE_MAPS_API_KEY
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
            },
            timeout=10.0
        )
        data = resp.json()
        features = data.get("features", [])

        categories = {}
        for f in features:
            cat = f.get("attributes", {}).get("MCI_CATEGORY", "Other")
            categories[cat] = categories.get(cat, 0) + 1

        total = len(features)

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
    """Get housing data for a neighbourhood"""
    await _load_housing_data()

    # fuzzy match neighbourhood name
    match = None
    neighbourhood_lower = neighbourhood.lower()
    for key in _housing_cache:
        if neighbourhood_lower in key.lower() or key.lower() in neighbourhood_lower:
            match = key
            break

    if match and _housing_cache[match]:
        data = _housing_cache[match]
        renter_cost = next((v for k, v in data.items() if "rented" in k.lower()), "N/A")
        owner_cost = next((v for k, v in data.items() if "owned" in k.lower()), "N/A")
        return {
            "neighbourhood": match,
            "avg_shelter_cost_renter": renter_cost,
            "avg_shelter_cost_owner": owner_cost,
        }

    return {
        "neighbourhood": neighbourhood,
        "avg_shelter_cost_renter": "N/A",
        "avg_shelter_cost_owner": "N/A",
    }