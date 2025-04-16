import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/about';
import Header from './components/Header';
import Optimizer from './pages/optimizer';
import PredictorDemand from './pages/PredictorDemand';
// import Charts from './pages/charts';
// import Graph from './pages/Graph';
export default function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />        
        <Route path="/about" element={<About/>} />
        <Route path="/optimizer" element={<Optimizer/>} />
        <Route path="/PredictorDemand" element={<PredictorDemand/>} />
        {/* <Route path="/graph" element={<Graph/>} /> */}
      </Routes>
    </BrowserRouter>
  )
}
