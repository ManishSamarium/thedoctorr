from fastapi import FastAPI
from pydantic import BaseModel
from predictor import predict_disease

app = FastAPI()

class SymptomRequest(BaseModel):
    symptoms: list[str]

@app.post("/predict")
def predict(req: SymptomRequest):
    result = predict_disease(req.symptoms)
    return {"predictions": result}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"service": "thedoctor_ml_service", "status": "running"}
