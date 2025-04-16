import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score
from xgboost import XGBRegressor
import joblib

# Load dataset
data = pd.read_csv('ml_model/data/modified_csv.csv')

# Encode categorical features
label_encoders = {}
for column in data.select_dtypes(include=['object']).columns:
    le = LabelEncoder()
    data[column] = le.fit_transform(data[column])
    label_encoders[column] = le

# Feature-target split
X = data.drop('Peak_Electricity_Demand', axis=1)
y = data['Peak_Electricity_Demand']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# XGBoost model
model = XGBRegressor(
    n_estimators=500,
    learning_rate=0.01,
    max_depth=8,
    random_state=42
)

# Model training
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Evaluation
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
print(f"Mean Squared Error: {mse:.2f}")
print(f"R^2 Score: {r2:.2f}")

# Save the model and encoders
joblib.dump(model, 'xgboost_peak_demand_model.pkl')
joblib.dump(label_encoders, 'label_encoders.pkl')

print("Model and encoders saved successfully.")
