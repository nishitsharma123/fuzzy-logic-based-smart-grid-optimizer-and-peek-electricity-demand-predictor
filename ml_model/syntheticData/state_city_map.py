import pandas as pd
import json

df = pd.read_csv("ml_model/models/electricity_demand_with_history.csv")

state_city_map = (
    df[["State", "City"]]
    .drop_duplicates()
    .groupby("State")["City"]
    .apply(list)
    .to_dict()
)

with open("state_city_map.json", "w") as f:
    json.dump(state_city_map, f, indent=2)

print("State–City mapping saved!")
