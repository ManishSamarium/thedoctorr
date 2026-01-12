import os
import json
import joblib
import numpy as np
import requests
import shutil
from typing import Optional

# Paths and remote base URL (set MODEL_ARTIFACTS_BASE to a public URL or S3 HTTP URL)
ARTIFACT_DIR = os.environ.get("ARTIFACT_DIR", "artifacts")
MODEL_PATH = os.path.join(ARTIFACT_DIR, "viral_disease_model.pkl")
LE_PATH = os.path.join(ARTIFACT_DIR, "label_encoder.pkl")
SYMS_PATH = os.path.join(ARTIFACT_DIR, "symptoms.json")
REMOTE_BASE = os.environ.get("MODEL_ARTIFACTS_BASE")  # e.g. https://my-bucket.s3.amazonaws.com/thedoctor_ml_service

# Module-level objects (populated by load_artifacts)
model: Optional[object] = None
label_encoder: Optional[object] = None
ALL_SYMPTOMS: list[str] = []


def _download_if_missing(local_path, remote_name=None):
    if os.path.exists(local_path):
        return
    if not REMOTE_BASE:
        raise FileNotFoundError(f"Missing artifact {local_path} and MODEL_ARTIFACTS_BASE not set")
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    remote_name = remote_name or os.path.basename(local_path)
    url = REMOTE_BASE.rstrip("/") + "/" + remote_name
    r = requests.get(url, stream=True)
    r.raise_for_status()
    with open(local_path, "wb") as f:
        shutil.copyfileobj(r.raw, f)


def load_artifacts():
    """Ensure artifacts exist (download if needed) and load them into module state.

    Raises an exception if artifacts cannot be loaded.
    """
    global model, label_encoder, ALL_SYMPTOMS

    # Try to download if missing
    _download_if_missing(MODEL_PATH)
    _download_if_missing(LE_PATH)
    _download_if_missing(SYMS_PATH)

    # Load
    model = joblib.load(MODEL_PATH)
    label_encoder = joblib.load(LE_PATH)
    with open(SYMS_PATH, "r") as f:
        ALL_SYMPTOMS = json.load(f)


def is_loaded() -> bool:
    return model is not None and label_encoder is not None and len(ALL_SYMPTOMS) > 0


def predict_disease(selected_symptoms):
    if not is_loaded():
        raise RuntimeError("Model artifacts not loaded")

    # Create binary input vector
    input_vector = np.zeros(len(ALL_SYMPTOMS))

    for symptom in selected_symptoms:
        if symptom in ALL_SYMPTOMS:
            idx = ALL_SYMPTOMS.index(symptom)
            input_vector[idx] = 1

    # Predict probabilities
    probs = model.predict_proba([input_vector])[0]

    # Get top 2 predictions
    top_indices = np.argsort(probs)[-2:][::-1]
    diseases = label_encoder.inverse_transform(top_indices)

    # Convert to percentages
    p1 = probs[top_indices[0]] * 100
    p2 = probs[top_indices[1]] * 100

    # Soft normalization (for better UX)
    total = p1 + p2
    if total > 0:
        p1 = (p1 / total) * 100
        p2 = (p2 / total) * 100

    return [
        {"disease": diseases[0], "probability": round(p1, 2)},
        {"disease": diseases[1], "probability": round(p2, 2)}
    ]
