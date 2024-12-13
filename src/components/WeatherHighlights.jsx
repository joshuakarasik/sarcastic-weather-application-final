// WeatherHighlights.jsx

import React from "react";
import { Thermometer, Eye, Cloud, Wind } from "lucide-react";

const WeatherHighlights = ({ weatherData, units }) => {
  if (!weatherData) return null;

  // Destructure pressure from main
  const { pressure } = weatherData.main;

  // Destructure visibility and clouds from the root
  const { visibility, clouds } = weatherData;

  const windDirection = weatherData.wind.deg; // Wind direction in degrees

  // Function to convert wind direction in degrees to cardinal directions
  const getWindDirection = (deg) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    const index = Math.round(deg / 45);
    return directions[index];
  };

  return (
    <div className="w-full max-w-md p-4 bg-[#1a1a1a]/80 rounded-lg shadow-lg border border-[#0db9d7]">
      <h2 className="text-xl text-[#e1d9d1] font-bold mb-4 text-center">Today's Highlights</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pressure */}
        <div className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg">
          <Thermometer
            size={24}
            className="text-[#0db9d7]"
          />
          <div>
            <p className="text-gray-300">Pressure</p>
            <p className="text-lg font-semibold">{pressure} hPa</p>
          </div>
        </div>

        {/* Visibility */}
        <div className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg">
          <Eye
            size={24}
            className="text-[#0db9d7]"
          />
          <div>
            <p className="text-gray-300">Visibility</p>
            <p className="text-lg font-semibold">{visibility ? `${visibility / 1000} km` : "N/A"}</p>
          </div>
        </div>

        {/* Cloudiness */}
        <div className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg">
          <Cloud
            size={24}
            className="text-[#0db9d7]"
          />
          <div>
            <p className="text-gray-300">Cloudiness</p>
            <p className="text-lg font-semibold">{clouds && clouds.all !== undefined ? `${clouds.all}%` : "N/A"}</p>
          </div>
        </div>

        {/* Wind Direction */}
        <div className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg">
          <Wind
            size={24}
            className="text-[#0db9d7]"
          />
          <div>
            <p className="text-gray-300">Wind Direction</p>
            <p className="text-lg font-semibold">
              {windDirection !== undefined ? getWindDirection(windDirection) : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherHighlights;
