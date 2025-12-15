import { Link } from "react-router-dom";
import image_logo from "../data/image_logo.png";

export default function Header() {
  return (
    <header
      className={
        "bg-transparent bg-opacity-40 backdrop-blur-sm fixed z-20 w-screen transition-transform duration-300"
      }
    >
      <div className="flex justify-between items-center max-w-6xl ml-2 md:mx-auto p-1 mt-3">
        <Link to="/">
          <h1 className="font-bold text-xl text-green-700">
            <img src={image_logo} className="w-60" />
          </h1>
        </Link>

        <ul
          className={`flex gap-4 items-center transition-all duration-[2000ms]  sm:flex sm:flex-row  `}
        >
          <Link to="/PredictorDemand">
            <li className=" text-center rounded-3xl p-2 bg-blue-500 hover:bg-blue-400 text-white hover:text-black transition duration-300 ease-in-out ">
              Demand predictor
            </li>{" "}
          </Link>

          <Link to="/optimizer">
            <li className="w-32 text-center rounded-3xl p-2 hover:bg-blue-400  bg-blue-500 text-white hover:text-black transition duration-300 ease-in-out ">
              Grid Optimizer
            </li>{" "}
          </Link>

          <Link to="/about">
            <li className=" w-32 text-center rounded-3xl p-2 hover:bg-blue-400 bg-blue-500 text-white hover:text-black transition duration-300 ease-in-out ">
              About
            </li>{" "}
          </Link>
          <Link to="/eda">
            <li className=" w-32 text-center rounded-3xl p-2 hover:bg-blue-400 bg-blue-500 text-white hover:text-black transition duration-300 ease-in-out ">
              EDA
            </li>{" "}
          </Link>
          <Link to="/modelPerformance">
            <li className=" w-32 text-center rounded-3xl p-2 hover:bg-blue-400 bg-blue-500 text-white hover:text-black transition duration-300 ease-in-out ">
              M_Performance
            </li>{" "}
          </Link>
        </ul>
      </div>
    </header>
  );
}
