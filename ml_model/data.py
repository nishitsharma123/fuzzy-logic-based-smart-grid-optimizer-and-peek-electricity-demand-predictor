import pandas as pd
import numpy as np

# Set random seed for reproducibility
np.random.seed(42)

# Ensure number of rows is a multiple of 24 for proper hour-wise division
num_days = 10000 // 24  
num_rows = num_days * 24  # Adjust rows to be exactly divisible by 24

# Generate date and hour columns
dates = pd.date_range(start="2024-01-01", periods=num_days, freq="D")  # Generate unique dates
dates = np.repeat(dates, 24)  # Repeat each date for 24 hours
hours = np.tile(np.arange(24), num_days)  # Repeat hours for each day

# Generate peak demand per day (constant for 24 hours)
daily_peak_demand = np.random.uniform(150000, 210000, num_days)  # Peak demand per day
peak_demand = np.repeat(daily_peak_demand, 24)  # Repeat for 24 hours

# Generate other values based on peak demand
avg_demand = peak_demand * np.random.uniform(0.6, 0.8, num_rows)  
hourly_demand = avg_demand * np.random.uniform(0.7, 1.3, num_rows)  
peak_grid_load = peak_demand * np.random.uniform(0.9, 1.1, num_rows)  
min_grid_load = peak_demand * np.random.uniform(0.3, 0.5, num_rows)  
current_grid_load = np.random.uniform(min_grid_load, peak_grid_load)  
available_power = peak_demand * np.random.uniform(1.05, 1.2, num_rows)  

# Create DataFrame
df = pd.DataFrame({
    "Date": dates,
    "Hour": hours,
    "Peak Demand (MW)": peak_demand,
    "Average Demand (MW)": avg_demand,
    "Hourly Demand (MW)": hourly_demand,
    "Current Grid Load (MW)": current_grid_load,
    "Peak Grid Load (MW)": peak_grid_load,
    "Minimum Grid Load (MW)": min_grid_load,
    "Available Power (MW)": available_power
})

# Save the dataset as an Excel file
file_path = "india_power_demand_with_time.xlsx"
df.to_excel(file_path, index=False)

print(f"Dataset saved as {file_path}")
