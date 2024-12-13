// ForecastDisplay.jsx
import React from "react";
import PropTypes from "prop-types";

const ForecastDisplay = React.memo(({ forecastData, units }) => {
  if (!forecastData) return null;

  // Group forecasts by day
  const forecastsByDay = {};

  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString([], { month: "short", day: "numeric" });

    if (!forecastsByDay[day]) {
      forecastsByDay[day] = [];
    }
    forecastsByDay[day].push(item);
  });

  // For each day, find the forecast closest to 12:00 PM
  const dailyForecasts = Object.keys(forecastsByDay)
    .slice(0, 5) // Limit to first 5 days
    .map((day) => {
      const forecasts = forecastsByDay[day];
      let closestForecast = forecasts[0];
      let minDiff = Math.abs(new Date(closestForecast.dt * 1000).getHours() - 12);

      forecasts.forEach((item) => {
        const forecastHour = new Date(item.dt * 1000).getHours();
        const diff = Math.abs(forecastHour - 12);
        if (diff < minDiff) {
          closestForecast = item;
          minDiff = diff;
        }
      });

      return {
        day,
        temp: closestForecast.main.temp.toFixed(1),
        condition: closestForecast.weather[0].main,
        icon: closestForecast.weather[0].icon,
        dt: closestForecast.dt, // Unique identifier
      };
    });

  // Handle case with insufficient forecast days
  if (dailyForecasts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-xl mt-4 p-4 bg-[#1a1a1a]/80 rounded-md border border-red-500 shadow-lg">
        <p className="text-red-500">No forecast data available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xl p-4 bg-[#1a1a1a]/80 rounded-md border border-[#0db9d7] shadow-lg transition-opacity duration-500 opacity-0 animate-fadeIn">
      <h2 className="text-xl text-[#e1d9d1] font-bold">5-Day Forecast</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full">
        {dailyForecasts.map((forecast) => (
          <div
            key={forecast.dt} // Use dt as the unique key
            className="flex flex-col items-center text-[#e1d9d1] p-3 bg-[#2a2a2a] rounded-lg transition-transform duration-300 hover:scale-105"
          >
            <div className="font-bold">{forecast.day}</div>
            <img
              src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
              alt={forecast.condition}
              className="h-12 w-12"
            />
            <div className="text-lg font-extrabold">
              {forecast.temp}°{units === "imperial" ? "F" : "C"}
            </div>
            <div className="text-sm italic text-gray-300">{forecast.condition}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

ForecastDisplay.propTypes = {
  forecastData: PropTypes.object.isRequired,
  units: PropTypes.oneOf(["imperial", "metric"]).isRequired,
};

export default ForecastDisplay;
