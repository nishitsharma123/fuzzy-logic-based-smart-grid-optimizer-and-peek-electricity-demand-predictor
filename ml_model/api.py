from flask import Flask, request, jsonify
import pandas as pd
import joblib
from flask_cors import CORS
import numpy as np
from sklearn.model_selection import learning_curve
from sklearn.metrics import mean_squared_error


app = Flask(__name__)
CORS(app)

# =====================================================
# LOAD ML MODEL (PIPELINE)
# =====================================================
MODEL_PATH = "ml_model/models/final_electricity_demand_model.pkl"
DATA_PATH = "ml_model/data/electricity_demand_with_history.csv"

model = joblib.load(MODEL_PATH)

# =====================================================
# LOAD DATASET FOR EDA (READ-ONLY)
# =====================================================
eda_df = pd.read_csv(DATA_PATH)
eda_df["Datetime"] = pd.to_datetime(eda_df["Datetime"])

# =====================================================
# PEAK RISK THRESHOLDS
# =====================================================
P90 = np.percentile(eda_df["Hourly_Electricity_Demand"], 90)
P95 = np.percentile(eda_df["Hourly_Electricity_Demand"], 95)

def classify_peak(value):
    if value >= P95:
        return "CRITICAL"
    elif value >= P90:
        return "HIGH"
    else:
        return "NORMAL"

# =====================================================
# HEALTH CHECK
# =====================================================
@app.route("/", methods=["GET"])
def health():
    return jsonify({
        "status": "Electricity Demand API is running",
        "endpoints": [
            "/predict",
            "/eda/hourly-trend",
            "/eda/daily-demand",
            "/eda/temp-vs-demand",
            "/eda/city-wise",
            "/eda/daily-peak"
        ]
    })

# =====================================================
# PREDICTION ENDPOINT
# =====================================================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        required_features = [
            "State", "City", "UrbanRural",
            "Hour", "DayOfWeek", "Month", "IsWeekend",
            "Temperature", "Electricity_Price",
            "load_t_1", "load_t_24", "load_t_168",
            "rolling_mean_24", "rolling_max_24",
            "rolling_std_24", "rolling_mean_168"
        ]

        for feature in required_features:
            if feature not in data:
                return jsonify({"error": f"Missing feature: {feature}"}), 400

        df = pd.DataFrame([data])

        prediction = model.predict(df)
        hourly_demand = round(float(prediction[0]), 2)
        risk_level = classify_peak(hourly_demand)

        return jsonify({
            "predicted_hourly_demand": hourly_demand,
            "peak_risk_level": risk_level
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# =====================================================
# ===================== EDA APIs ======================
# =====================================================

# -----------------------------------------------------
# 1. Hourly Demand Pattern
# -----------------------------------------------------
@app.route("/eda/hourly-trend", methods=["GET"])
def eda_hourly_trend():
    hourly_avg = (
        eda_df
        .groupby("Hour")["Hourly_Electricity_Demand"]
        .mean()
        .reset_index()
    )
    return jsonify(hourly_avg.to_dict(orient="records"))

# -----------------------------------------------------
# 2. Daily Average Demand (Optional City Filter)
# -----------------------------------------------------
@app.route("/eda/daily-demand", methods=["GET"])
def eda_daily_demand():
    city = request.args.get("city")

    temp_df = eda_df.copy()
    if city:
        temp_df = temp_df[temp_df["City"] == city]

    daily = (
        temp_df
        .groupby(temp_df["Datetime"].dt.date)["Hourly_Electricity_Demand"]
        .mean()
        .reset_index()
    )

    daily.columns = ["date", "avg_demand"]
    return jsonify(daily.to_dict(orient="records"))

# -----------------------------------------------------
# 3. Temperature vs Demand (Sampled)
# -----------------------------------------------------
@app.route("/eda/temp-vs-demand", methods=["GET"])
def eda_temp_vs_demand():
    sample = eda_df.sample(2000, random_state=42)
    return jsonify(
        sample[["Temperature", "Hourly_Electricity_Demand"]]
        .to_dict(orient="records")
    )

# -----------------------------------------------------
# 4. City-wise Average Demand
# -----------------------------------------------------
@app.route("/eda/city-wise", methods=["GET"])
def eda_city_wise():
    city_avg = (
        eda_df
        .groupby("City")["Hourly_Electricity_Demand"]
        .mean()
        .reset_index()
    )
    return jsonify(city_avg.to_dict(orient="records"))

# -----------------------------------------------------
# 5. Daily Peak Demand
# -----------------------------------------------------
@app.route("/eda/daily-peak", methods=["GET"])
def eda_daily_peak():
    daily_peak = (
        eda_df
        .groupby(eda_df["Datetime"].dt.date)["Hourly_Electricity_Demand"]
        .max()
        .reset_index()
    )
    daily_peak.columns = ["date", "peak_demand"]
    return jsonify(daily_peak.to_dict(orient="records"))

# -------------------
# 6. weekend-vs-weekday
# -------------------

@app.route("/eda/weekend-vs-weekday", methods=["GET"])
def eda_weekend_weekday():
    grouped = (
        eda_df
        .groupby("IsWeekend")["Hourly_Electricity_Demand"]
        .mean()
        .reset_index()
    )
    grouped["Type"] = grouped["IsWeekend"].map({0: "Weekday", 1: "Weekend"})
    return jsonify(grouped[["Type", "Hourly_Electricity_Demand"]].to_dict(orient="records"))


@app.route("/eda/urban-rural", methods=["GET"])
def eda_urban_rural():
    grouped = (
        eda_df
        .groupby("UrbanRural")["Hourly_Electricity_Demand"]
        .mean()
        .reset_index()
    )
    return jsonify(grouped.to_dict(orient="records"))


@app.route("/eda/demand-distribution", methods=["GET"])
def eda_demand_distribution():
    hist = np.histogram(eda_df["Hourly_Electricity_Demand"], bins=30)
    return jsonify({
        "bins": hist[1].tolist(),
        "counts": hist[0].tolist()
    })

@app.route("/eda/correlation", methods=["GET"])
def eda_correlation():
    corr = (
        eda_df
        .select_dtypes(include="number")
        .corr()["Hourly_Electricity_Demand"]
        .reset_index()
    )
    corr.columns = ["feature", "correlation"]
    return jsonify(corr.to_dict(orient="records"))


@app.route("/eda/rolling-trend", methods=["GET"])
def eda_rolling_trend():
    sample = eda_df.tail(500)
    return jsonify(
        sample[["Datetime", "Hourly_Electricity_Demand", "rolling_mean_24"]]
        .to_dict(orient="records")
    )

@app.route("/eda/bias-variance", methods=["GET"])
def eda_bias_variance():
    from sklearn.model_selection import learning_curve

    # Prepare features & target (same as training)
    df = eda_df.copy()
    df = df.drop(columns=["Datetime"])
    X = df.drop("Hourly_Electricity_Demand", axis=1)
    y = df["Hourly_Electricity_Demand"]

    train_sizes, train_scores, val_scores = learning_curve(
        model,
        X,
        y,
        cv=5,
        scoring="neg_mean_squared_error",
        train_sizes=np.linspace(0.1, 1.0, 6),
        n_jobs=-1
    )

    train_rmse = np.sqrt(-train_scores.mean(axis=1))
    val_rmse = np.sqrt(-val_scores.mean(axis=1))

    return jsonify({
        "train_sizes": train_sizes.tolist(),
        "train_rmse": train_rmse.tolist(),
        "val_rmse": val_rmse.tolist()
    })

# =====================================================
# RUN SERVER
# =====================================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
