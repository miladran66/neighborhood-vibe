import json
import re
import anthropic
from app.config import settings

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

async def generate_neighborhood_summary(data: dict) -> tuple[str, int]:
    prompt = f"""
You are a friendly Toronto real estate expert. Based on this neighborhood data, write a 3-sentence summary 
that captures the vibe of this neighborhood for someone considering living there.
Also give a "Vibe Score" from 0-100 based on walkability, transit, amenities.

Data:
- Address: {data.get('formatted_address')}
- Walk Score: {data.get('walk_score')} ({data.get('walk_description')})
- Transit Score: {data.get('transit_score')} ({data.get('transit_description')})
- Bike Score: {data.get('bike_score')}
- Nearby restaurants: {data.get('restaurants_count', 0)}
- Nearby schools: {data.get('schools_count', 0)}
- Nearby transit stops: {data.get('transit_count', 0)}

Respond ONLY with raw JSON, no markdown, no code blocks:
{{"summary": "...", "vibe_score": 75}}
"""
    try:
        message = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}]
        )
        text = message.content[0].text.strip()
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text).strip()

        try:
            result = json.loads(text)
            return result.get("summary", ""), result.get("vibe_score", 50)
        except json.JSONDecodeError:
            summary_match = re.search(r'"summary"\s*:\s*"([^"]+)"', text)
            score_match = re.search(r'"vibe_score"\s*:\s*(\d+)', text)
            summary = summary_match.group(1) if summary_match else "A great Toronto neighborhood."
            score = int(score_match.group(1)) if score_match else 50
            return summary, score
    except Exception as e:
        print(f"AI summary error: {e}")
        return "A Toronto neighborhood worth exploring.", 50