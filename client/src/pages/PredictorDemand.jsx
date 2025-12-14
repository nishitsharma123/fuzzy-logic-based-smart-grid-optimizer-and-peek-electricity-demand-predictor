import axios from "axios";
import { Info, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";
import stateCityMap from "../../../ml_model/data/state_city_map.json";
import { useState } from "react";

/* =========================
   CONFIG / CONSTANTS
========================= */

const API_URL = "http://localhost:3000/predict";

const STATES = Object.keys(stateCityMap);

const URBAN_RURAL = ["Urban", "Rural"];

/* =========================
   MAIN COMPONENT
========================= */

const PowerPrediction = () => {
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    State: "",
    City: "",
    UrbanRural: "Urban",

    Hour: 18,
    DayOfWeek: 2,
    Month: 6,
    IsWeekend: 0,

    Temperature: 30,
    Electricity_Price: 6,

    load_t_1: 900,
    load_t_24: 880,
    load_t_168: 860,
    rolling_mean_24: 890,
    rolling_max_24: 950,
    rolling_std_24: 45,
    rolling_mean_168: 870,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =========================
     HELPERS
  ========================= */

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const celebrate = () => {
    confetti({
      particleCount: 180,
      spread: 100,
      origin: { y: 0.6 },
    });
  };

  const submitPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(API_URL, formData);
      setResult(res.data);
      celebrate();
    } catch (e) {
      setError(e.response?.data?.error || "Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SLIDES
  ========================= */

  const slides = [
    {
      title: "Location Context",
      content: (
        <>
          <SelectInput
            label="State"
            value={formData.State}
            options={STATES}
            onChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                State: value,
                City: "", // reset city when state changes
              }));
            }}
          />

          <SelectInput
            label="City"
            value={formData.City}
            options={formData.State ? stateCityMap[formData.State] : []}
            disabled={!formData.State}
            onChange={(value) => updateField("City", value)}
          />

          <SelectInput
            label="Area Type"
            value={formData.UrbanRural}
            options={URBAN_RURAL}
            onChange={(v) => updateField("UrbanRural", v)}
          />
        </>
      ),
    },
    {
      title: "Time Context",
      content: (
        <>
          <NumberInput
            label="Hour (0–23)"
            value={formData.Hour}
            onChange={(v) => updateField("Hour", v)}
          />
          <NumberInput
            label="Day Of Week (0=Sun)"
            value={formData.DayOfWeek}
            onChange={(v) => updateField("DayOfWeek", v)}
          />
          <NumberInput
            label="Month (1–12)"
            value={formData.Month}
            onChange={(v) => updateField("Month", v)}
          />
          <SelectInput
            label="Weekend?"
            value={formData.IsWeekend}
            options={[
              { label: "No", value: 0 },
              { label: "Yes", value: 1 },
            ]}
            onChange={(v) => updateField("IsWeekend", Number(v))}
          />
        </>
      ),
    },
    {
      title: "Weather & Pricing",
      content: (
        <>
          <NumberInput
            label="Temperature (°C)"
            value={formData.Temperature}
            onChange={(v) => updateField("Temperature", v)}
          />
          <NumberInput
            label="Electricity Price (₹/kWh)"
            value={formData.Electricity_Price}
            onChange={(v) => updateField("Electricity_Price", v)}
          />
        </>
      ),
    },
    {
      title: "Historical Load Features",
      content: (
        <>
          <NumberInput
            label="Load t-1"
            value={formData.load_t_1}
            onChange={(v) => updateField("load_t_1", v)}
          />
          <NumberInput
            label="Load t-24"
            value={formData.load_t_24}
            onChange={(v) => updateField("load_t_24", v)}
          />
          <NumberInput
            label="Load t-168"
            value={formData.load_t_168}
            onChange={(v) => updateField("load_t_168", v)}
          />
          <NumberInput
            label="Rolling Mean (24h)"
            value={formData.rolling_mean_24}
            onChange={(v) => updateField("rolling_mean_24", v)}
          />
          <NumberInput
            label="Rolling Max (24h)"
            value={formData.rolling_max_24}
            onChange={(v) => updateField("rolling_max_24", v)}
          />
          <NumberInput
            label="Rolling Std (24h)"
            value={formData.rolling_std_24}
            onChange={(v) => updateField("rolling_std_24", v)}
          />
        </>
      ),
    },
    {
      title: "Review Inputs",
      content: <ReviewSummary data={formData} />,
    },
  ];

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="w-[950px] h-[550px] bg-white rounded-3xl shadow-xl p-10 flex flex-col justify-between mt-28">
        {/* HEADER */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Electricity Demand Predictor
        </h1>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto mt-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">
            {slides[step].title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slides[step].content}
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
            className="px-5 py-2 rounded-full bg-gray-200 disabled:opacity-40"
          >
            ◀ Back
          </button>

          {step < slides.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-2 rounded-full bg-blue-600 text-white"
            >
              Next ▶
            </button>
          ) : (
            <button
              onClick={submitPrediction}
              disabled={loading}
              className="px-6 py-2 rounded-full bg-green-600 text-white flex items-center gap-2"
            >
              <CheckCircle size={18} />
              {loading ? "Predicting..." : "Predict"}
            </button>
          )}
        </div>

        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
      </div>

      {/* RESULT MODAL */}
      {result && (
        <ResultModal result={result} onClose={() => setResult(null)} />
      )}
    </div>
  );
};

/* =========================
   INPUT COMPONENTS
========================= */

const NumberInput = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === "" ? "" : Number(v));
      }}
      className="mt-1 w-full p-2 border rounded-xl focus:ring-2 focus:ring-blue-400"
    />
  </div>
);

const SelectInput = ({ label, value, options, onChange, disabled }) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`mt-1 w-full p-2 border rounded-xl ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    >
      <option value="">Select</option>
      {options.map((opt) =>
        typeof opt === "string" ? (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ) : (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )
      )}
    </select>
  </div>
);

/* =========================
   REVIEW SUMMARY
========================= */

const ReviewSummary = ({ data }) => (
  <div className="col-span-2 space-y-4">
    {Object.entries(data).map(([k, v]) => (
      <div key={k} className="flex justify-between bg-gray-50 p-3 rounded-xl">
        <span className="text-gray-500">{k.replace(/_/g, " ")}</span>
        <span className="font-semibold">{v}</span>
      </div>
    ))}
  </div>
);

/* =========================
   RESULT MODAL
========================= */

const ResultModal = ({ result, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-[500px] rounded-2xl p-6 shadow-xl animate-scaleIn">
      <h2 className="text-2xl font-bold text-center mb-4">Prediction Result</h2>

      <div className="text-center">
        <p className="text-4xl font-extrabold text-blue-600">
          {result.predicted_hourly_demand} MW
        </p>
        <p className="mt-2 text-lg">
          Risk Level:
          <span className="ml-2 font-bold text-red-600">
            {result.peak_risk_level}
          </span>
        </p>
      </div>

      <div className="mt-4 text-sm bg-gray-50 p-4 rounded-xl">
        <b>Risk Explanation:</b>
        <p className="mt-1">
          Risk is determined using historical demand percentiles. Values above
          the 90th percentile are HIGH risk, and above the 95th percentile are
          CRITICAL.
        </p>
      </div>

      <button
        onClick={onClose}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-xl"
      >
        Close
      </button>
    </div>
  </div>
);

export default PowerPrediction;
