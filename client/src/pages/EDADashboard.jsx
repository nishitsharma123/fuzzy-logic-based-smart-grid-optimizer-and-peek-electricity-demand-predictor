import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart3 } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  ScatterChart, Scatter,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

const API = "http://localhost:3000";

const EDADashboard = () => {
  const [hourly, setHourly] = useState([]);
  const [daily, setDaily] = useState([]);
  const [peak, setPeak] = useState([]);
  const [city, setCity] = useState([]);
  const [temp, setTemp] = useState([]);
  const [weekend, setWeekend] = useState([]);
  const [urban, setUrban] = useState([]);
  const [distribution, setDistribution] = useState(null);
  const [correlation, setCorrelation] = useState([]);
  const [rolling, setRolling] = useState([]);
  const [loading, setLoading] = useState(true);
  const [biasVariance, setBiasVariance] = useState(null);

// const SkeletonChart = () => (
//   <div className="bg-white p-6 rounded-xl shadow mb-10 animate-pulse">
//     {/* Title skeleton */}
//     <div className="h-6 w-1/3 bg-gray-200 rounded mb-4" />

//     {/* Chart skeleton */}
//     <div className="h-64 bg-gray-100 rounded-lg" />
//   </div>
// );

// const SkeletonDashboard = () => (
//   <div className="p-6 bg-gray-50 min-h-screen">
//     <h1 className="text-3xl font-bold text-center mb-10 mt-20">
//       Electricity Demand – Exploratory Data Analysis
//     </h1>

//     {[1, 2, 3, 4, 5, 6].map((i) => (
//       <SkeletonChart key={i} />
//     ))}
//   </div>
// );

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
        Generating insights from electricity data…
      </p>

      <p className="mt-1 text-sm text-gray-400">
        Running EDA & aggregations
      </p>
    </div>
  </div>
);


  useEffect(() => {
    Promise.all([
      axios.get(`${API}/eda/hourly-trend`),
      axios.get(`${API}/eda/daily-demand`),
      axios.get(`${API}/eda/daily-peak`),
      axios.get(`${API}/eda/city-wise`),
      axios.get(`${API}/eda/temp-vs-demand`),
      axios.get(`${API}/eda/weekend-vs-weekday`),
      axios.get(`${API}/eda/urban-rural`),
      axios.get(`${API}/eda/demand-distribution`),
      axios.get(`${API}/eda/correlation`),
      axios.get(`${API}/eda/rolling-trend`),
      axios.get(`${API}/eda/bias-variance`)

    ])
      .then(([
        h, d, p, c, t, w, u, dist, corr, roll, biasVariance
      ]) => {
        setHourly(h.data);
        setDaily(d.data);
        setPeak(p.data);
        setCity(c.data);
        setTemp(t.data);
        setWeekend(w.data);
        setUrban(u.data);
        setDistribution(dist.data);
        setCorrelation(corr.data);
        setRolling(roll.data);
        setLoading(false);
        setBiasVariance(biasVariance.data);

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



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-10 mt-20">
        Electricity Demand – Exploratory Data Analysis
      </h1>

      <Section title="Average Electricity Demand by Hour">
        <LineChartWrapper data={hourly} x="Hour" y="Hourly_Electricity_Demand" />
      </Section>

      <Section title="Daily Average Demand Over Time">
        <LineChartWrapper data={daily} x="date" y="avg_demand" />
      </Section>

      <Section title="Daily Peak Demand">
        <AreaChartWrapper data={peak} x="date" y="peak_demand" />
      </Section>

      <Section title="City-wise Average Demand">
        <BarChartWrapper data={city} x="City" y="Hourly_Electricity_Demand" />
      </Section>

      <Section title="Temperature vs Electricity Demand">
        <ScatterChartWrapper data={temp} />
      </Section>

      <Section title="Weekend vs Weekday Demand">
        <WeekendWeekdayChart data={weekend} />
      </Section>

      <Section title="Urban vs Rural Demand">
        <UrbanRuralChart data={urban} />
      </Section>

      <Section title="Demand Distribution">
        {distribution && <DemandDistribution data={distribution} />}
      </Section>

      <Section title="Feature Correlation with Demand">
        <CorrelationChart data={correlation} />
      </Section>

      <Section title="Rolling Demand Trend (Model Justification)">
        <LineChartWrapper
          data={rolling}
          x="Datetime"
          y="Hourly_Electricity_Demand"
          extra="rolling_mean_24"
        />
      </Section>

      
  <Section title="Bias–Variance Tradeoff (Learning Curve)">
    <BiasVarianceChart data={biasVariance} />
  </Section>


    </div>
  );
};

/* ==================== REUSABLE COMPONENTS ==================== */

const Section = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow mb-10">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const LineChartWrapper = ({ data, x, y, extra }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={x} />
      <YAxis />
      <Tooltip />
      <Line dataKey={y} stroke="#2563eb" strokeWidth={2} />
      {extra && <Line dataKey={extra} stroke="#16a34a" />}
    </LineChart>
  </ResponsiveContainer>
);

const AreaChartWrapper = ({ data, x, y }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={x} hide />
      <YAxis />
      <Tooltip />
      <Area dataKey={y} stroke="#16a34a" fill="#bbf7d0" />
    </AreaChart>
  </ResponsiveContainer>
);

const BarChartWrapper = ({ data, x, y }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={x} />
      <YAxis />
      <Tooltip />
      <Bar dataKey={y} fill="#9333ea" />
    </BarChart>
  </ResponsiveContainer>
);

const ScatterChartWrapper = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ScatterChart>
      <CartesianGrid />
      <XAxis dataKey="Temperature" />
      <YAxis dataKey="Hourly_Electricity_Demand" />
      <Tooltip />
      <Scatter data={data} fill="#dc2626" />
    </ScatterChart>
  </ResponsiveContainer>
);

const WeekendWeekdayChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey="Type" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="Hourly_Electricity_Demand" fill="#f97316" />
    </BarChart>
  </ResponsiveContainer>
);

const UrbanRuralChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <XAxis dataKey="UrbanRural" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="Hourly_Electricity_Demand" fill="#14b8a6" />
    </BarChart>
  </ResponsiveContainer>
);

const DemandDistribution = ({ data }) => {
  const chartData = data.counts.map((c, i) => ({
    range: `${Math.round(data.bins[i])}-${Math.round(data.bins[i + 1])}`,
    count: c
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <XAxis dataKey="range" hide />
        <YAxis />
        <Tooltip />
        <Area dataKey="count" fill="#60a5fa" stroke="#2563eb" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const CorrelationChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={data} layout="vertical">
      <XAxis type="number" domain={[-1, 1]} />
      <YAxis dataKey="feature" type="category" width={160} />
      <Tooltip />
      <Bar dataKey="correlation" fill="#ef4444" />
    </BarChart>
  </ResponsiveContainer>
);
const BiasVarianceChart = ({ data }) => {
  const chartData = data.train_sizes.map((size, i) => ({
    trainSize: size,
    Train_RMSE: data.train_rmse[i],
    Validation_RMSE: data.val_rmse[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="trainSize" />
        <YAxis />
        <Tooltip />
        <Line
          dataKey="Train_RMSE"
          stroke="#16a34a"
          strokeWidth={2}
          name="Training Error"
        />
        <Line
          dataKey="Validation_RMSE"
          stroke="#dc2626"
          strokeWidth={2}
          name="Validation Error"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};


export default EDADashboard;
