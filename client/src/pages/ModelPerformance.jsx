import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ScatterChart, Scatter,
  BarChart, Bar,
  ResponsiveContainer
} from "recharts";
import { BarChart3 } from "lucide-react";

const API = "http://localhost:3000/model/performance";

const MetricCard = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-5 text-center">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold text-blue-600 mt-2">{value}</p>
  </div>
);

const ModelPerformance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
const AnimatedLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white z-0">
    <div className="flex flex-col items-center">
      {/* Glow animation */}
      <div className="relative">
        <div className="absolute inset-0 w-24 h-24 bg-blue-400 rounded-full blur-3xl animate-ping" />
        <BarChart3
          size={64}
          className="relative text-blue-600 animate-bounce"
        />
      </div>

      <p className="mt-6 text-lg text-gray-700 animate-pulse">
        Generating insights from Machine Learning model…
      </p>

      <p className="mt-1 text-sm text-gray-400">
        Running performance analysis
      </p>
    </div>
  </div>
);

  useEffect(() => {
    axios.get(API)
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
  return (
    <>
      <AnimatedLoader />
      {/* <SkeletonDashboard /> */}
    </>
  );
}



  const { metrics, prediction_vs_actual, errors, learning_curve, peak_accuracy } = data;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-10 mt-20">
        Model Performance Evaluation
      </h1>

      {/* METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <MetricCard label="MAE" value={metrics.MAE} />
        <MetricCard label="RMSE" value={metrics.RMSE} />
        <MetricCard label="R² Score" value={metrics.R2} />
        <MetricCard label="SMAPE (%)" value={metrics.SMAPE} />
      </div>

      {/* PREDICTION VS ACTUAL */}
      <Section title="Prediction vs Actual Demand">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={prediction_vs_actual}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line dataKey="actual" stroke="#2563eb" name="Actual" />
            <Line dataKey="predicted" stroke="#16a34a" name="Predicted" />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* ERROR DISTRIBUTION */}
      <Section title="Prediction Error Over Time">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={errors}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line dataKey="error" stroke="#dc2626" />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* LEARNING CURVE */}
      <Section title="Bias–Variance (Learning Curve)">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={learning_curve.samples.map((s, i) => ({
            samples: s,
            train: learning_curve.train[i],
            val: learning_curve.val[i]
          }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="samples" />
            <YAxis />
            <Tooltip />
            <Line dataKey="train" stroke="#2563eb" name="Training Error" />
            <Line dataKey="val" stroke="#f97316" name="Validation Error" />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* PEAK ACCURACY */}
      <Section title="Peak Risk Classification Accuracy">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { level: "Normal", value: peak_accuracy.normal },
            { level: "High", value: peak_accuracy.high },
            { level: "Critical", value: peak_accuracy.critical }
          ]}>
            <XAxis dataKey="level" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </Section>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow p-6 mb-10">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

export default ModelPerformance;
