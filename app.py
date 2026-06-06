from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import joblib

app = Flask(__name__)

CATEGORY_MAPPINGS = {
    "syndrome": {
        "HFRS": 0,
        "HPS": 1,
    },
    "virus_strain": {
        "Andes": 0,
        "Araraquara": 1,
        "Choclo": 2,
        "Dobrava": 3,
        "Hantaan": 4,
        "Laguna Negra": 5,
        "Puumala": 6,
        "Seoul": 7,
        "Sin Nombre": 8
    },
    "age_group": {
        "0-14": 0,
        "15-29": 1,
        "30-44": 2,
        "45-59": 3,
        "60+": 4
    },
    "gender": {
        "Female": 0,
        "Male": 1
    }
}

try:
    model = joblib.load('hantavirusmodel.joblib')
    expected_features = joblib.load('model_features.joblib')
    scaler = joblib.load('scaler.joblib')
except Exception as e:
    print(f"Error loading model or expected features: {e}")


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        data = request.get_json()
        input_df = pd.DataFrame([data])
        for col, mapping in CATEGORY_MAPPINGS.items(): # Map the categorical values to their corresponding codes for the model
            if col in input_df.columns:
                raw_val = input_df[col].iloc[0]
                input_df[col] = mapping.get(raw_val, -1)
        input_df = input_df.reindex(columns=expected_features, fill_value=0) # Ensure the input DataFrame has the same columns as the model expects
        for col in input_df.columns:
            input_df[col] = pd.to_numeric(input_df[col], errors='coerce').fillna(0).astype(float) # Convert all columns to numeric, filling non-convertible values with 0

        if 'incubation_days' in input_df.columns:
            input_df['incubation_days'] = scaler.transform(input_df[['incubation_days']]) # Scale the incubation_days feature using the same scaler used during training
        
        prediction = str(model.predict(input_df)[0])
        probability = model.predict_proba(input_df)[0]
        class_index = list(model.classes_).index(prediction)
        confidence = float(probability[class_index]) * 100
        
        return jsonify({
            "success": True,
            "prediction": prediction,
            "confidence": round(confidence, 2)
        })
if __name__ == '__main__':
    app.run(debug=True)