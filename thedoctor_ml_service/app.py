from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class SymptomRequest(BaseModel):
    symptoms: list[str]


@app.on_event("startup")
def load_models_on_startup():
    try:
        # Import here to avoid import-time failures when artifacts are missing
        from predictor import load_artifacts

        load_artifacts()
        print("Model artifacts loaded on startup")
    except Exception as e:
        # Log and continue so the process doesn't crash; prediction endpoint will return 503
        import logging

        logging.exception("Failed to load model artifacts on startup")


@app.post("/predict")
def predict(req: SymptomRequest):
    try:
        from predictor import predict_disease

        result = predict_disease(req.symptoms)
        return {"predictions": result}
    except Exception as e:
        return {"error": str(e)}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"service": "thedoctor_ml_service", "status": "running"}
