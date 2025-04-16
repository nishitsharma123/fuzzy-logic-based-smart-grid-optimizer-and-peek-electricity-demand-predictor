// import React from 'react'
import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import video1 from '../data/video1.mp4';
export default function optimizer() {
  const [result, setResult] = useState('');
  const [resultManual, setResultManual] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showDashboardManual, setShowDashboardManual] = useState(false);
  const handleShowDashboard = () => {
    setShowDashboard(true); // Show iframe on button click
    setShowDashboardManual(false);
  };
  const handleShowDashboardManual = () => {
    setShowDashboardManual(true); // Show iframe on button click
    setShowDashboard(false);
  };



  return (
    <div className='flex flex-col'>
      <div className='w-5/6 m-auto h-[500px] flex flex-row'>
      <div>
      <h1 className='text-6xl font-bold p-5 mt-32'>Grid Optimizer <br/>& real time analysis</h1>
      <p className='pl-5 w-[900px]'>Our product provides real-time electricity peak demand analysis through interactive charts. By leveraging advanced forecasting models, it helps businesses and energy providers monitor, predict, and optimize energy consumption trends efficiently.</p>
      {/* <button>Real Time Analysis</button> */}
      <button
        onClick={handleShowDashboard}
        className="bg-blue-500 text-white px-4 py-2 ml-5 mt-8 rounded-xl"
      >
        Real Time Analysis
      </button>
      <button
        onClick={handleShowDashboardManual}
        className="bg-blue-500 text-white px-4 py-2 ml-5 mt-8 rounded-xl"
      >
        Manual Analysis
      </button>
      </div>
      <div><video muted loop autoPlay src={video1} className='mt-32 h-[400px] w-96 object-cover rounded-3xl'></video></div>
      

      
      </div>
      {showDashboard ? (
  <iframe
    src="http://localhost:8050/"
    title="Energy Management Dashboard"
    width="100%"
    height="600px"
    style={{ border: 'none', marginTop: '100px' }}
  />
) : showDashboardManual ? (
  <iframe
    src="http://localhost:5000/"
    title="Energy Management Dashboard"
    width="100%"
    height="600px"
    style={{ border: 'none', marginTop: '100px' }}
  />
) : null}

    </div>
  )
}
