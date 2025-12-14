import pandas as pd

# ======================================
# LOAD DATASET
# ======================================
df = pd.read_csv("synthetic_electricity_demand_10000.csv")

# Convert to datetime and sort
df['Datetime'] = pd.to_datetime(df['Datetime'])
df = df.sort_values('Datetime').reset_index(drop=True)

# ======================================
# ADD HISTORICAL LOAD FEATURES
# ======================================
# Lag features
df['load_t_1'] = df['Hourly_Electricity_Demand'].shift(1)
df['load_t_24'] = df['Hourly_Electricity_Demand'].shift(24)
df['load_t_168'] = df['Hourly_Electricity_Demand'].shift(168)

# Rolling statistics (trend capture)
df['rolling_mean_24'] = df['Hourly_Electricity_Demand'].rolling(window=24).mean()
df['rolling_max_24'] = df['Hourly_Electricity_Demand'].rolling(window=24).max()
df['rolling_std_24'] = df['Hourly_Electricity_Demand'].rolling(window=24).std()

df['rolling_mean_168'] = df['Hourly_Electricity_Demand'].rolling(window=168).mean()

# ======================================
# DROP NaN ROWS (created due to lagging)
# ======================================
df = df.dropna().reset_index(drop=True)

# ======================================
# SAVE UPDATED DATASET
# ======================================
df.to_csv("electricity_demand_with_history.csv", index=False)

print("✅ Historical load features added successfully!")
print("Final shape:", df.shape)
print("\nSample rows:")
print(df.head())
