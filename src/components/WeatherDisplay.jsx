// WeatherDisplay.jsx
import React from "react";
import { Sun, Wind } from "lucide-react";

const WeatherDisplay = React.memo(({ weatherData, error, units }) => {
  if (error || !weatherData) return null;

  const { main, weather, sys, wind, name } = weatherData;
  const temperature = parseFloat(main.temp.toFixed(1));
  const feelsLike = parseFloat(main.feels_like.toFixed(1));

  // Dynamic text color depending on temperature
  let tempColor = "text-[#0db9d7]";
  const tempLimitCold = units === "imperial" ? 40 : 5;
  const tempLimitHot = units === "imperial" ? 80 : 27;

  if (temperature < tempLimitCold) {
    tempColor = "text-blue-400";
  } else if (temperature > tempLimitHot) {
    tempColor = "text-orange-400";
  } else {
    tempColor = "text-green-400";
  }

  const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const sunset = new Date(sys.sunset * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col items-center justify-center mx-auto w-[350px] p-6 rounded-xl bg-[#1a1a1a] border border-[#0db9d7] hover:border-orange-400 transition-all duration-500 shadow-xl hover:shadow-orange-500/50 transform hover:-translate-y-1 gap-6 opacity-0 animate-fadeIn">
      <div className="font-montserrat text-center text-[#e1d9d1] leading-relaxed tracking-wide flex flex-col items-center">
        <div className="text-gray-300 text-lg">{name}</div>
        <div className={`text-5xl font-extrabold mb-2 drop-shadow-lg ${tempColor} animate-pulse`}>
          {temperature}°{units === "imperial" ? "F" : "C"}
        </div>
        <div className="text-xl italic mb-1 text-gray-200">{weather[0].main}</div>
        <div className="text-sm text-gray-300 mb-2">
          Feels like: {feelsLike}°{units === "imperial" ? "F" : "C"}
        </div>
        <div className="text-sm text-gray-300 mb-1">Humidity: {main.humidity}%</div>
        <div className="text-sm text-gray-300 mb-1 flex items-center gap-1">
          <Wind size={16} /> Wind: {wind.speed} {units === "imperial" ? "mph" : "m/s"}
        </div>
        <div className="flex gap-4 text-sm text-gray-300 mb-2 items-center justify-center">
          <div className="flex items-center gap-1">
            <Sun size={16} /> Sunrise: {sunrise}
          </div>
          <div className="flex items-center gap-1">
            <Sun
              size={16}
              className="transform rotate-180"
            />{" "}
            Sunset: {sunset}
          </div>
        </div>
      </div>
    </div>
  );
});

export default WeatherDisplay;
