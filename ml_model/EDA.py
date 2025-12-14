import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_style("whitegrid")

df = pd.read_csv("ml_model/models/electricity_demand_with_history.csv")
df["Datetime"] = pd.to_datetime(df["Datetime"])

print(df.shape)
print(df.head())

df.info()
df.isnull().sum()
df.describe()


plt.figure(figsize=(14,5))
plt.plot(df["Datetime"], df["Hourly_Electricity_Demand"], alpha=0.6)
plt.title("Hourly Electricity Demand Over Time")
plt.xlabel("Time")
plt.ylabel("Demand (MW)")
plt.show()



hourly_avg = df.groupby("Hour")["Hourly_Electricity_Demand"].mean()

plt.figure(figsize=(8,4))
hourly_avg.plot(kind="line", marker="o")
plt.title("Average Electricity Demand by Hour")
plt.xlabel("Hour of Day")
plt.ylabel("Avg Demand (MW)")
plt.show()



weekly_avg = df.groupby("DayOfWeek")["Hourly_Electricity_Demand"].mean()

plt.figure(figsize=(7,4))
weekly_avg.plot(kind="bar")
plt.xticks(range(7), ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], rotation=0)
plt.title("Average Demand by Day of Week")
plt.show()



monthly_avg = df.groupby("Month")["Hourly_Electricity_Demand"].mean()

plt.figure(figsize=(8,4))
monthly_avg.plot(kind="bar")
plt.title("Monthly Average Electricity Demand")
plt.show()



plt.figure(figsize=(6,5))
sns.scatterplot(
    x="Temperature",
    y="Hourly_Electricity_Demand",
    data=df,
    alpha=0.4
)
plt.title("Temperature vs Electricity Demand")
plt.show()



plt.figure(figsize=(6,4))
sns.boxplot(
    x="UrbanRural",
    y="Hourly_Electricity_Demand",
    data=df
)
plt.title("Demand Distribution: Urban vs Rural")
plt.show()



city_avg = df.groupby("City")["Hourly_Electricity_Demand"].mean().sort_values()

plt.figure(figsize=(8,4))
city_avg.plot(kind="bar")
plt.title("Average Electricity Demand by City")
plt.show()



lags = ["load_t_1", "load_t_24", "load_t_168"]

for lag in lags:
    corr = df[lag].corr(df["Hourly_Electricity_Demand"])
    print(f"Correlation with {lag}: {corr:.3f}")



df["Date"] = df["Datetime"].dt.date
daily_peak = df.groupby("Date")["Hourly_Electricity_Demand"].max()

plt.figure(figsize=(12,4))
daily_peak.plot()
plt.title("Daily Peak Electricity Demand")
plt.show()



plt.figure(figsize=(6,4))
sns.histplot(df["Hourly_Electricity_Demand"], bins=50, kde=True)
plt.title("Distribution of Electricity Demand")
plt.show()



plt.figure(figsize=(12,8))
corr = df.select_dtypes(include="number").corr()
sns.heatmap(corr, cmap="coolwarm", center=0)
plt.title("Feature Correlation Heatmap")
plt.show()

