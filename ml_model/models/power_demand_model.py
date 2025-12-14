# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import LabelEncoder
# from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
# from xgboost import XGBRegressor
# import joblib

# # Load dataset
# data = pd.read_csv('ml_model/data/modified_csv.csv')

# # Encode categorical features
# label_encoders = {}
# for column in data.select_dtypes(include=['object']).columns:
#     le = LabelEncoder()
#     data[column] = le.fit_transform(data[column])
#     label_encoders[column] = le

# # Feature-target split
# X = data.drop('Peak_Electricity_Demand', axis=1)
# y = data['Peak_Electricity_Demand']

# # Train-test split
# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, random_state=42
# )

# # XGBoost model
# model = XGBRegressor(
#     n_estimators=500,
#     learning_rate=0.01,
#     max_depth=8,
#     random_state=42
# )

# # Model training
# model.fit(X_train, y_train)

# # Predictions
# y_pred = model.predict(X_test)

# # Evaluation
# mse = mean_squared_error(y_test, y_pred)
# r2 = r2_score(y_test, y_pred)
# print(f"Mean Squared Error: {mse:.2f}")
# print(f"R^2 Score: {r2:.2f}")
# mae = mean_absolute_error(y_test, y_pred)
# mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100

# print("MAE :", mae)
# print("MAPE:", mape)
# # Save the model and encoders
# joblib.dump(model, 'xgboost_peak_demand_model.pkl')
# joblib.dump(label_encoders, 'label_encoders.pkl')

# print("Model and encoders saved successfully.")
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import TimeSeriesSplit, RandomizedSearchCV
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from xgboost import XGBRegressor

# =====================================================
# 1. LOAD DATA
# =====================================================
df = pd.read_csv("ml_model/data/electricity_demand_with_history.csv")

df['Datetime'] = pd.to_datetime(df['Datetime'])
df = df.sort_values('Datetime').reset_index(drop=True)
datetime_series = df["Datetime"].copy()
df = df.drop(columns=["Datetime"])

# =====================================================
# 2. DEFINE TARGET
# =====================================================
TARGET = "Hourly_Electricity_Demand"

X = df.drop(TARGET, axis=1)
y = df[TARGET]

# =====================================================
# 3. FEATURE TYPES
# =====================================================
categorical_cols = X.select_dtypes(include=["object"]).columns
numerical_cols = X.select_dtypes(exclude=["object"]).columns

# =====================================================
# 4. PREPROCESSING
# =====================================================
preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_cols),
        ("num", "passthrough", numerical_cols)
    ]
)

# =====================================================
# 5. MODEL
# =====================================================
xgb = XGBRegressor(
    objective="reg:squarederror",
    tree_method="hist",
    eval_metric="rmse",
    random_state=42
)

pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("model", xgb)
])

# =====================================================
# 6. TIME SERIES CROSS VALIDATION
# =====================================================
tscv = TimeSeriesSplit(n_splits=5)

param_grid = {
    "model__n_estimators": [600, 800, 1000],
    "model__learning_rate": [0.03, 0.05, 0.1],
    "model__max_depth": [6, 8, 10],
    "model__subsample": [0.8, 1.0],
    "model__colsample_bytree": [0.8, 1.0]
}

search = RandomizedSearchCV(
    pipeline,
    param_distributions=param_grid,
    n_iter=25,
    scoring="neg_root_mean_squared_error",
    cv=tscv,
    n_jobs=-1,
    verbose=1,
    random_state=42
)

# =====================================================
# 7. TRAIN / TEST SPLIT (TIME AWARE)
# =====================================================
split_idx = int(len(X) * 0.8)

X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

# =====================================================
# 8. TRAIN MODEL
# =====================================================
search.fit(X_train, y_train)
best_model = search.best_estimator_

print("\n✅ Best Hyperparameters:")
print(search.best_params_)

# =====================================================
# 9. PREDICTION
# =====================================================
y_pred = best_model.predict(X_test)

# =====================================================
# 10. EVALUATION
# =====================================================
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

smape = np.mean(
    2 * np.abs(y_pred - y_test) /
    (np.abs(y_test) + np.abs(y_pred))
) * 100

print("\n📊 FINAL MODEL PERFORMANCE")
print(f"MAE   : {mae:.2f}")
print(f"RMSE  : {rmse:.2f}")
print(f"R²    : {r2:.3f}")
print(f"SMAPE : {smape:.2f}%")

# =====================================================
# 11. PEAK DEMAND DERIVATION (IMPORTANT)
# =====================================================
results = X_test.copy()
results["Actual_Demand"] = y_test.values
results["Predicted_Demand"] = y_pred
results["Datetime"] = datetime_series.iloc[X_test.index].values
results["Date"] = pd.to_datetime(results["Datetime"]).dt.date

daily_peak = results.groupby("Date")[["Actual_Demand", "Predicted_Demand"]].max()

print("\n📈 Sample Daily Peak Demand Prediction:")
print(daily_peak.head())

# =====================================================
# 12. PEAK RISK CLASSIFICATION
# =====================================================
p90 = np.percentile(y_train, 90)
p95 = np.percentile(y_train, 95)

def classify_peak(value):
    if value >= p95:
        return "CRITICAL"
    elif value >= p90:
        return "HIGH"
    else:
        return "NORMAL"

daily_peak["Risk_Level"] = daily_peak["Predicted_Demand"].apply(classify_peak)

print("\n⚠️ Peak Risk Levels:")
print(daily_peak.head())

# =====================================================
# 13. SAVE MODEL
# =====================================================
joblib.dump(best_model, "final_electricity_demand_model.pkl")

print("\n✅ Model saved as final_electricity_demand_model.pkl")
