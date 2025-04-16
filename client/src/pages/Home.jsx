import React from 'react'
import { Link } from 'react-router-dom'
import power_grid from '../data/power_grid.jpg';
export default function home() {
  

  return (
    
    <div className="p-4">
      {/* <video muted loop className=''></video> */}
      <div className='mt-28 h-[550px] w-[1500px] rounded-3xl shadow-md m-auto flex flex-row gap-20 pl-20'>
      <div>
      <h1 className='text-6xl font-bold p-5 mt-10'>Ultimate solution <br/>for peek power consumption <br/>and grid Stability</h1>
      <p className='pl-5 w-[900px]'>Our product provides a powerful electricity peak demand analysis tool that helps users visualize and predict energy consumption trends. By integrating real-time data with advanced forecasting models, our interactive charts allow businesses and energy providers to optimize resource allocation, reduce costs, and enhance grid stability.</p>
      {/* <button>Real Time Analysis</button> */}
      <Link to="/optimizer">
      <button
        className="bg-blue-500 text-white px-4 py-2 ml-5 mt-8 rounded-xl"
      >
        grid optimizer
      </button>
      </Link>
      <Link to="/PredictorDemand">
      <button
        className="bg-blue-500 text-white px-4 py-2 ml-5 mt-8 rounded-xl"
      >
        Peek demand prediction
      </button>
      </Link>
      </div>
      <div><img src={power_grid} className='h-[500px] rounded-3xl'/></div>
      </div>
      <div>
      {/* -- */}
      </div>
    </div>
  )
}
