import json
import pandas as pd
from pathlib import Path
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import os
import re

# -------------------------
# Groq (Free LLM Summary)
# -------------------------
from groq import Groq

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


BASE_DIR = Path(__file__).resolve().parent
EXCEL_PATH = BASE_DIR / "data" / "Sample_data.xlsx"


def load_excel():
    """Load and normalize Excel data"""
    if not EXCEL_PATH.exists():
        return None
    df = pd.read_excel(EXCEL_PATH)
    df.columns = [c.lower().strip() for c in df.columns]
    return df


def clean_query(text):
    """Extract only location name like 'Wakad' from sentences"""
    words = re.findall(r"[a-zA-Z]+", text.lower())
    ignore = {"analyze", "analysis", "show", "tell", "in", "at", "of", "give", "info"}
    filtered = [w for w in words if w not in ignore]
    return " ".join(filtered).strip()


def llm_summary(area, df):
    """Generate AI summary via Groq"""
    if client is None or df.empty:
        return None

    try:
        sample = df.head(10).to_dict(orient="records")
        prompt = f"""
        Act as a real estate market analyst.
        Create a short and actionable analysis for area '{area}'.
        Data: {sample}
        
        Include:
        - Pricing trend
        - Demand signals
        - Overall investment potential
        
        Keep it professional, easy to understand.
        4–6 lines max.
        """

        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=180
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print("Groq Error:", e)
        return None


def mock_summary(area, df):
    """Backup summary if Groq fails"""
    if df.empty:
        return f"No real estate data found for '{area}'."
    avg_rate = df["flat - weighted average rate"].mean()
    return f"Average flat rate in {area.capitalize()} is {avg_rate:.2f} INR."


@csrf_exempt
def analyze(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        body = json.loads(request.body)
        raw_query = body.get("query")
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    area = clean_query(raw_query)
    df = load_excel()

    if df is None:
        return JsonResponse({"error": "Excel missing"}, status=500)

    filtered = df[df["final location"].str.contains(area, case=False, na=False)]

    # Summary (Groq → fallback to simple summary)
    summary = llm_summary(area, filtered) or mock_summary(area, filtered)

    # Chart Data
    chart = {"years": [], "prices": []}
    if not filtered.empty and "year" in filtered.columns:
        grouped = filtered.groupby("year")["flat - weighted average rate"].mean()
        chart["years"] = grouped.index.tolist()
        chart["prices"] = grouped.values.tolist()

    # Save filtered rows for download
    filtered.to_csv(BASE_DIR / "latest_filtered.csv", index=False)

    return JsonResponse({
        "summary": summary,
        "chart": chart,
        "table": filtered.head(100).to_dict(orient="records")
    })


def download_data(request):
    """Download last filtered data"""
    file_path = BASE_DIR / "latest_filtered.csv"
    if not file_path.exists():
        return JsonResponse({"error": "No data to download"}, status=404)

    with open(file_path, "rb") as f:
        response = HttpResponse(f.read(), content_type="text/csv")
        response["Content-Disposition"] = "attachment; filename=filtered_data.csv"
        return response
