from flask import Flask, request, jsonify
import pandas as pd
import pickle
from flask_cors import CORS
import xgboost as xgb

app = Flask(__name__)
CORS(app)  # Handle CORS issues

# Load trained XGBoost model
with open('ml_model/models/xgboost_peak_demand_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

# Load label encoder
with open('ml_model/models/label_encoders.pkl', 'rb') as encoder_file:
    label_encoder = pickle.load(encoder_file)


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        df = pd.DataFrame([data])

        # 🔄 Convert object columns to 'category' dtype
        for col in df.select_dtypes(include=['object']).columns:
            if col in label_encoder:
                df[col] = label_encoder[col].transform(df[col])
            else:
                df[col] = df[col].astype('category')

        # 🧮 Make prediction (NO xgb.DMatrix used here)
        prediction = model.predict(df)
        predicted_value = round(float(prediction[0]), 2)

        return jsonify({'predicted_demand': predicted_value})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
