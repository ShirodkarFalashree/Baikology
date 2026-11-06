
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Baikology API",
    description="API for the Baikology women's health platform",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.get("/")
def root():
    return {
        "message": "Welcome to Baikology API",
        "status": "running",
    }


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "baikology-api",
    }


@app.get("/api/v1/features")
def get_features():
    return {
        "features": [
            "cycle_tracking",
            "mood_tracking",
            "health_education",
            "product_discovery",
            "health_information_assistant",
        ]
    }
