import json
import joblib
import numpy as np

# Load artifacts (load once at startup)
model = joblib.load("artifacts/viral_disease_model.pkl")
label_encoder = joblib.load("artifacts/label_encoder.pkl")

with open("artifacts/symptoms.json", "r") as f:
    ALL_SYMPTOMS = json.load(f)


def predict_disease(selected_symptoms):
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
