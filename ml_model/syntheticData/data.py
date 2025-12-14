# import pandas as pd
# import numpy as np

# # Set random seed for reproducibility
# np.random.seed(42)

# # Ensure number of rows is a multiple of 24 for proper hour-wise division
# num_days = 10000 // 24  
# num_rows = num_days * 24  # Adjust rows to be exactly divisible by 24

# # Generate date and hour columns
# dates = pd.date_range(start="2024-01-01", periods=num_days, freq="D")  # Generate unique dates
# dates = np.repeat(dates, 24)  # Repeat each date for 24 hours
# hours = np.tile(np.arange(24), num_days)  # Repeat hours for each day

# # Generate peak demand per day (constant for 24 hours)
# daily_peak_demand = np.random.uniform(150000, 210000, num_days)  # Peak demand per day
# peak_demand = np.repeat(daily_peak_demand, 24)  # Repeat for 24 hours

# # Generate other values based on peak demand
# avg_demand = peak_demand * np.random.uniform(0.6, 0.8, num_rows)  
# hourly_demand = avg_demand * np.random.uniform(0.7, 1.3, num_rows)  
# peak_grid_load = peak_demand * np.random.uniform(0.9, 1.1, num_rows)  
# min_grid_load = peak_demand * np.random.uniform(0.3, 0.5, num_rows)  
# current_grid_load = np.random.uniform(min_grid_load, peak_grid_load)  
# available_power = peak_demand * np.random.uniform(1.05, 1.2, num_rows)  

# # Create DataFrame
# df = pd.DataFrame({
#     "Date": dates,
#     "Hour": hours,
#     "Peak Demand (MW)": peak_demand,
#     "Average Demand (MW)": avg_demand,
#     "Hourly Demand (MW)": hourly_demand,
#     "Current Grid Load (MW)": current_grid_load,
#     "Peak Grid Load (MW)": peak_grid_load,
#     "Minimum Grid Load (MW)": min_grid_load,
#     "Available Power (MW)": available_power
# })

# # Save the dataset as an Excel file
# file_path = "india_power_demand_with_time.xlsx"
# df.to_excel(file_path, index=False)

# print(f"Dataset saved as {file_path}")
import pandas as pd
import numpy as np

np.random.seed(42)

# ======================================
# BASIC CONFIG
# ======================================
NUM_ROWS = 10000
START_DATE = "2023-01-01"

states = {
    "Delhi": ["New Delhi"],
    "Maharashtra": ["Mumbai", "Pune"],
    "Karnataka": ["Bengaluru"],
    "Tamil Nadu": ["Chennai"],
    "Uttar Pradesh": ["Lucknow", "Noida"]
}

urban_rural_map = {
    "New Delhi": "Urban",
    "Mumbai": "Urban",
    "Pune": "Urban",
    "Bengaluru": "Urban",
    "Chennai": "Urban",
    "Noida": "Urban",
    "Lucknow": "Semi-Urban"
}

# ======================================
# CREATE TIME INDEX (HOURLY)
# ======================================
datetime_index = pd.date_range(
    start=START_DATE,
    periods=NUM_ROWS,
    freq="H"
)

data = []

# ======================================
# DATA GENERATION
# ======================================
for dt in datetime_index:
    state = np.random.choice(list(states.keys()))
    city = np.random.choice(states[state])
    urban_rural = urban_rural_map[city]

    hour = dt.hour
    day_of_week = dt.weekday()
    month = dt.month
    is_weekend = 1 if day_of_week >= 5 else 0

    # -----------------------------
    # Temperature (seasonal)
    # -----------------------------
    base_temp = {
        12: 12, 1: 10, 2: 15,
        3: 22, 4: 28, 5: 34,
        6: 36, 7: 32, 8: 31,
        9: 30, 10: 25, 11: 18
    }[month]

    temperature = base_temp + np.random.normal(0, 2)

    # -----------------------------
    # Electricity Price
    # -----------------------------
    electricity_price = np.random.uniform(4, 8)

    # -----------------------------
    # Base Demand (City Type)
    # -----------------------------
    base_demand = 800 if urban_rural == "Urban" else 500

    # Hourly effect
    if 18 <= hour <= 22:
        base_demand += 400  # evening peak
    elif 6 <= hour <= 9:
        base_demand += 250  # morning peak
    else:
        base_demand += 100

    # Temperature effect (AC load)
    temp_effect = max(0, temperature - 22) * 35

    # Weekend reduction
    if is_weekend:
        base_demand -= 150

    # Random noise
    noise = np.random.normal(0, 50)

    hourly_demand = base_demand + temp_effect + noise

    data.append([
        dt,
        state,
        city,
        urban_rural,
        hour,
        day_of_week,
        month,
        is_weekend,
        round(temperature, 2),
        round(electricity_price, 2),
        round(hourly_demand, 2)
    ])

# ======================================
# CREATE DATAFRAME
# ======================================
columns = [
    "Datetime",
    "State",
    "City",
    "UrbanRural",
    "Hour",
    "DayOfWeek",
    "Month",
    "IsWeekend",
    "Temperature",
    "Electricity_Price",
    "Hourly_Electricity_Demand"
]

df = pd.DataFrame(data, columns=columns)

# ======================================
# SAVE DATASET
# ======================================
df.to_csv("synthetic_electricity_demand_10000.csv", index=False)

print("✅ Dataset generated successfully!")
print(df.head())
print("\nTotal rows:", len(df))
