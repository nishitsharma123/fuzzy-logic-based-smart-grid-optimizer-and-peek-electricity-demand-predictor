// export default PowerPrediction;
import React, { useState } from "react";
import axios from "axios";
import { Info } from "lucide-react";
const PowerPrediction = () => {
  const [formData, setFormData] = useState({
    State: "",
    Temperature: 0,
    Electricity_Price: 0,
    UrbanRural_Classification: "",
    date: "",
    Time: "",
    City:""
    // Historical_Energy_Consumption: "",
    // Humidity: "",
    // Wind_Speed: "",
    // Solar_Radiation: "",
    // Grid_Load_Capacity: "",
    // Economic_Activity_Index: "",
    // Renewable_Energy_Contribution: "",
    // Population_Density: "",
    // City:"",
    // Industrial_Load_Factor: "",
    // Commercial_Residential_Split: "",
    // Household_Appliance_Penetration: "",
    // Work_from_Home_Trends: "",
    // Transmission_Distribution_Losses: "",
    // Power_Outage_Frequency: "",
    // Battery_Storage_Availability: "",
    // Backup_Generator_Usage: "",
    // Grid_Stability_Index: "",
    // Festival_Holiday_Energy_Consumption_Multiplier: "",
    // School_College_Operational_Days: "",
    // Event_Based_Load_Increase: "",
    // AC_Heater_Usage_Probability: "",
    // Dew_Point: "",
    // Cloud_Cover: "",
    // Rainfall: "",
    // AQI: "",
    // EV_Charging_Load: "",
    // Government_Subsidy_Impact_on_Electricity_Consumption: "",
    // Smart_Meter_Penetration: "",
    // Carbon_Emission_Reduction_Goals: "",
  });
// console.log(formData);
  const [predictedDemand, setPredictedDemand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => setIsOpen(!isOpen);


  const handleChange = (e) => {
    const { name, value } = e.target;
    const textFields = ["State", "UrbanRural_Classification", "date", "Time","City"];
    setFormData({
      ...formData,
      [name]: textFields.includes(name) ? value : value === "" ? "" : Number(value),
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const emptyFields = Object.entries(formData).filter(([_, val]) => val === "" || val === null);
    if (emptyFields.length > 0) {
      setError(`Please fill all required fields: ${emptyFields.map(([key]) => key).join(", ")}`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:3000/predict", formData);
      setPredictedDemand(response.data.predicted_demand);
    } catch (err) {
      setError(err.response?.data?.message || "Error predicting demand. Check inputs and API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen mx-auto p-6 bg-white rounded-2xl h-screen shadow-xl w-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700 mt-20">Power Peek Demand Prediction</h1>
      {/* Info Button */}
      <button
        onClick={togglePopup}
        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
      >
        <Info size={20} />
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div className="absolute top-10 left-16 w-[800px] mt-40 p-4 bg-gray-300 shadow-lg rounded-lg border z-10">
           <h3 className="text-lg font-semibold mb-2">Energy Consumption Data Instructions</h3>
    <p className="text-base text-gray-600">
      Please provide the following data in the specified format and units:
      <ul className="list-disc ml-4">
        <li><strong>State/Region:</strong> (Text) - Enter the name of the state or region (e.g., California, Maharashtra).</li>
        <li><strong>Date:</strong> (Date - YYYY-MM-DD) - Use the format Year-Month-Day (e.g., 2025-02-27).</li>
        <li><strong>Time:</strong> (Time - HH:MM, 24-hour format) - Use Hour:Minute in 24-hour format (e.g., 14:30).</li>
        <li><strong>Temperature:</strong> (Number - °C) - Ambient temperature in degrees Celsius.</li>
        <li><strong>Electricity Price:</strong> (Number - INR/kWh) - Price of electricity per kilowatt-hour in INR.</li>
        <li><strong>Urban vs Rural Classification:</strong> (Text - Urban/Rural) - Specify either Urban or Rural.</li>
        {/* <li><strong>Historical Energy Consumption:</strong> (Number - kWh) - Total energy consumption in kilowatt-hours.</li> */}
        {/* <li><strong>Humidity:</strong> (Number - %) - Humidity percentage (0–100%).</li> */}
        {/* <li><strong>Wind Speed:</strong> (Number - km/h) - Wind speed in kilometers per hour.</li> */}
        {/* <li><strong>Solar Radiation:</strong> (Number - W/m²) - Solar radiation in watts per square meter.</li> */}
        {/* <li><strong>Grid Load Capacity:</strong> (Number - %) - Percentage of grid capacity utilized.</li> */}
        {/* <li><strong>Economic Activity Index:</strong> (Number - 0–100) - Index representing economic activity level.</li> */}
        {/* <li><strong>Renewable Energy Contribution:</strong> (Number - %) - Contribution percentage of renewable sources.</li> */}
        {/* <li><strong>Population Density:</strong> (Number - people/km²) - Population per square kilometer.</li> */}
        {/* <li><strong>Industrial Load Factor:</strong> (Number - MW) - Industrial power load in megawatts.</li> */}
        {/* <li><strong>Commercial & Residential Split:</strong> (Number - %) - Percentage distribution between commercial and residential usage.</li> */}
        {/* <li><strong>Household Appliance Penetration:</strong> (Number - %) - Percentage of households with appliances.</li> */}
        {/* <li><strong>Work from Home Trends:</strong> (Number - %) - Percentage of people working from home.</li> */}
        {/* <li><strong>Transmission & Distribution Losses:</strong> (Number - %) - Energy losses in transmission and distribution.</li> */}
        {/* <li><strong>Power Outage Frequency:</strong> (Number - Hours/Month) - Average monthly outage duration.</li> */}
        {/* <li><strong>Battery Storage Availability:</strong> (Number - MW) - Total available battery storage in megawatts.</li> */}
        {/* <li><strong>Backup Generator Usage:</strong> (Number - %) - Percentage of backup generator use.</li> */}
        {/* <li><strong>Grid Stability Index:</strong> (Number - 0–100) - Index rating grid stability.</li> */}
        {/* <li><strong>Festival & Holiday Energy Consumption Multiplier:</strong> (Number) - Multiplier during festivals/holidays.</li> */}
        {/* <li><strong>School & College Operational Days:</strong> (Number - %) - Percentage of operational days per month.</li> */}
        {/* <li><strong>Event-Based Load Increase:</strong> (Number - MW) - Load increase due to specific events.</li> */}
        {/* <li><strong>AC & Heater Usage Probability:</strong> (Number - %) - Probability of AC/heater usage.</li> */}
        {/* <li><strong>Dew Point:</strong> (Number - °C) - Dew point temperature in degrees Celsius.</li> */}
        {/* <li><strong>Cloud Cover:</strong> (Number - %) - Percentage of cloud cover.</li> */}
        {/* <li><strong>Rainfall:</strong> (Number - mm/day) - Rainfall in millimeters per day.</li> */}
        {/* <li><strong>Air Quality Index (AQI):</strong> (Number) - AQI value representing air quality.</li> */}
        {/* <li><strong>EV Charging Load:</strong> (Number - MW) - Load from EV charging in megawatts.</li> */}
        {/* <li><strong>Government Subsidy Impact on Electricity Consumption:</strong> (Number - INR Crore) - Impact in INR Crore.</li> */}
        {/* <li><strong>Smart Meter Penetration:</strong> (Number - %) - Percentage of smart meter installations.</li> */}
        {/* <li><strong>Carbon Emission Reduction Goals:</strong> (Number - % target met) - Percentage of target achieved.</li> */}
      </ul>
    </p>
          <button
            onClick={togglePopup}
            className="mt-4 w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600 transition"
          >
            Close
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col mt-5">
            <label className="mb-2 text-grey-700 font-semibold" htmlFor={key}>
              {key.replace(/_/g, " ")}
            </label>
            <input
              type={key === "date" ? "date" : key === "Time" ? "Time" : typeof formData[key] === "number" ? "number" : "text"}
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="p-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className={`w-56 m-auto md:col-span-2 lg:col-span-3 p-3 text-white font-semibold rounded-2xl bg-blue-500 hover:bg-blue-600 transition-opacity ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {predictedDemand !== null && (
        <div className="mt-6 text-center bg-green-100 text-green-800 p-4 rounded-2xl">
          <h2 className="text-xl font-semibold">Predicted Power Demand:</h2>
          <p className="text-3xl font-bold">{predictedDemand} MW</p>
        </div>
      )}
    </div>
  );
};

export default PowerPrediction;
