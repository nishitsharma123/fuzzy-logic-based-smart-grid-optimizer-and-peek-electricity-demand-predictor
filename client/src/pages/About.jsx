import React, { useState, useEffect } from "react";

/* ================= SLIDE CONTENT ================= */

const slides = [
  {
    title: "Introduction",
    content: (
      <>
        <p>
          <b>Smart Grid Optimizer</b> is an end-to-end AI-powered system developed
          to forecast electricity demand and analyze peak power consumption in a
          smart grid environment.
        </p>
        <p className="mt-4">
          Unlike traditional rule-based forecasting, this system leverages
          machine learning to automatically learn demand patterns from
          historical data and provide accurate, data-driven insights for grid
          stability and energy planning.
        </p>
      </>
    ),
  },

  {
    title: "Problem Statement",
    content: (
      <>
        <p>
          Electricity demand is highly dynamic and influenced by time, weather,
          and consumer behavior. Small forecasting errors during peak hours can
          cause grid overloads or energy wastage.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>Peak demand leads to grid instability</li>
          <li>Traditional forecasting methods are static</li>
          <li>Manual planning lacks adaptability</li>
        </ul>
        <p className="mt-3">
          Hence, the problem is formulated as a supervised regression task to
          predict hourly electricity demand accurately.
        </p>
      </>
    ),
  },

  {
    title: "Project Objectives",
    content: (
      <>
        <p>
          The primary objective is to design a reliable forecasting system that
          supports intelligent decision-making in power systems.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>Predict hourly electricity demand</li>
          <li>Detect and classify peak demand risk</li>
          <li>Understand urban vs rural demand behavior</li>
          <li>Provide explainable EDA dashboards</li>
          <li>Enable proactive grid optimization</li>
        </ul>
      </>
    ),
  },

  {
    title: "Methodology",
    content: (
      <>
        <p>
          The project follows a structured machine learning pipeline to ensure
          accuracy, generalization, and real-world applicability.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>Data collection and cleaning</li>
          <li>Time-series aware preprocessing</li>
          <li>Feature engineering using domain knowledge</li>
          <li>Model training and hyperparameter tuning</li>
          <li>Deployment via REST API</li>
        </ul>
      </>
    ),
  },

  {
    title: "Feature Engineering (Core ML Step)",
    content: (
      <>
        <p>
          Feature engineering plays a critical role in time-series forecasting,
          as machine learning models cannot inherently remember past values.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>Lag features: load(t−1), load(t−24), load(t−168)</li>
          <li>Rolling mean, max, and standard deviation</li>
          <li>Temporal indicators: hour, day, weekend</li>
        </ul>
        <p className="mt-3">
          These features capture temporal dependency and seasonality in demand
          patterns.
        </p>
      </>
    ),
  },

  {
    title: "Model Selection & Algorithms",
    content: (
      <>
        <p>
          XGBoost regression was selected due to its strong performance on
          structured tabular data and its ability to model non-linear
          relationships.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>Gradient Boosted Decision Trees</li>
          <li>Regularization to prevent overfitting</li>
          <li>Efficient handling of large datasets</li>
        </ul>
        <p className="mt-3">
          Objective Function: Minimize squared error between actual and predicted
          demand.
        </p>
      </>
    ),
  },

  {
    title: "Training Strategy",
    content: (
      <>
        <p>
          A time-aware training strategy was used to avoid data leakage and
          simulate real-world forecasting conditions.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>TimeSeries cross-validation</li>
          <li>Rolling-window evaluation</li>
          <li>RandomizedSearch for hyperparameters</li>
        </ul>
      </>
    ),
  },

  {
    title: "Evaluation Metrics",
    content: (
      <>
        <p>
          Multiple evaluation metrics were used to comprehensively assess model
          performance.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li><b>MAE</b>: Average absolute prediction error</li>
          <li><b>RMSE</b>: Penalizes large peak errors</li>
          <li><b>R² Score</b>: Measures variance explained by the model</li>
        </ul>
        <p className="mt-3">
          R² close to 1 indicates strong explanatory power.
        </p>
      </>
    ),
  },

  {
    title: "Results & Performance",
    content: (
      <>
        <p>
          The trained model demonstrates strong predictive capability on unseen
          future data.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>R² ≈ 0.89 (high variance explained)</li>
          <li>Low RMSE indicating accurate peak prediction</li>
          <li>SMAPE ≈ 5% ensuring scale-independent reliability</li>
        </ul>
      </>
    ),
  },

  {
    title: "Bias–Variance Tradeoff",
    content: (
      <>
        <p>
          Learning curves were analyzed to evaluate bias–variance behavior of the
          model.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>Training and validation errors converge</li>
          <li>No significant overfitting observed</li>
          <li>Model generalizes well with more data</li>
        </ul>
      </>
    ),
  },

  {
    title: "Comparison with Traditional Methods",
    content: (
      <>
        <p>
          Compared to traditional rule-based forecasting, the proposed system
          offers adaptive and data-driven predictions.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>Captures non-linear demand behavior</li>
          <li>Improved accuracy during peak hours</li>
          <li>Minimal manual intervention required</li>
        </ul>
      </>
    ),
  },

  {
    title: "Deployment & System Architecture",
    content: (
      <>
        <p>
          The model is deployed as a production-ready system with real-time
          inference capability.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>React frontend for visualization</li>
          <li>Flask REST API for predictions</li>
          <li>Serialized ML pipeline using joblib</li>
        </ul>
      </>
    ),
  },

  {
    title: "Scope & Benefits",
    content: (
      <>
        <p>
          The system provides significant operational and strategic benefits for
          energy stakeholders.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>Improved grid stability</li>
          <li>Reduced energy wastage</li>
          <li>Better demand-side management</li>
          <li>Support for renewable energy integration</li>
        </ul>
      </>
    ),
  },

  {
    title: "Limitations & Future Work",
    content: (
      <>
        <p>
          While effective, the current system has certain limitations that open
          avenues for future research.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>Depends on historical data quality</li>
          <li>No real-time IoT integration</li>
          <li>Deterministic predictions only</li>
        </ul>
        <p className="mt-3">
          Future work includes LSTM models, probabilistic forecasting, and
          real-time smart meter data streams.
        </p>
      </>
    ),
  },
];

/* ================= COMPONENT ================= */

const About = () => {
  const [index, setIndex] = useState(0);

  // Optional: keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        setIndex((i) => Math.min(i + 1, slides.length - 1));
      }
      if (e.key === "ArrowLeft") {
        setIndex((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-[1150px] h-[520px] mt-28 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl flex overflow-hidden">

        {/* LEFT CONTENT */}
        <div className="w-3/5 p-12 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold mb-6 text-gray-900">
              {slides[index].title}
            </h1>
            <div className="text-lg text-gray-700 leading-relaxed space-y-4">
              {slides[index].content}
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setIndex(Math.max(index - 1, 0))}
              disabled={index === 0}
              className="px-6 py-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30"
            >
              ◀ Previous
            </button>

            <span className="text-sm text-gray-500">
              Slide {index + 1} of {slides.length}
            </span>

            <button
              onClick={() => setIndex(Math.min(index + 1, slides.length - 1))}
              disabled={index === slides.length - 1}
              className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30"
            >
              Next ▶
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-2/5 relative overflow-hidden">
  {/* Animated Gradient Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 animate-pulse-slow" />

  {/* GRID OVERLAY (TECH DESIGN) */}
  <div
    className="absolute inset-0"
    style={{
      backgroundImage:
        "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)",
      backgroundSize: "20px 20px",
    }}
  />

  {/* CONTENT */}
  <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-6">
    <h2 className="text-3xl font-bold tracking-wide">
      Smart Grid Optimizer
    </h2>
    <p className="mt-4 text-sm opacity-90">
      AI-powered electricity demand intelligence
    </p>
  </div>
</div>

      </div>
    </div>
  );
};

export default About;
