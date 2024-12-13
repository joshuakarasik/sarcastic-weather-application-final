// WeatherApp.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Search, Star, MapPin } from "lucide-react";
import WeatherDisplay from "./WeatherDisplay";
import ForecastDisplay from "./ForecastDisplay";
import SarcasticComment from "./SarcasticComment";
import WeatherHighlights from "./WeatherHighlights"; // New Component
import sarcasticComments from "./sarcasticComments";
import SkeletonLoader from "./SkeletonLoader"; // Skeleton Loader Component

const citySuggestions = [
  "Los Angeles",
  "New York",
  "Chicago",
  "London",
  "Tokyo",
  "Sydney",
  "Paris",
  "Berlin",
  "Toronto",
  // Add more cities as needed
];

const WeatherApp = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedComment, setSelectedComment] = useState("");
  const [units, setUnits] = useState("imperial"); // 'imperial' or 'metric'
  const [searchHistory, setSearchHistory] = useState([]);
  const [favorite, setFavorite] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // Load from localStorage on mount
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(savedHistory);
    const savedFavorite = localStorage.getItem("favorite");
    if (savedFavorite) setFavorite(savedFavorite);

    const savedData = JSON.parse(localStorage.getItem("lastData"));
    if (savedData) {
      setWeatherData(savedData.weather);
      setSelectedComment(savedData.comment);
      setForecastData(savedData.forecast);
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Save favorite to localStorage whenever it changes
  useEffect(() => {
    if (favorite) {
      localStorage.setItem("favorite", favorite);
    }
  }, [favorite]);

  // Save last fetched data to localStorage
  const saveLastData = useCallback((weather, comment, forecast) => {
    const dataToSave = {
      weather,
      comment,
      forecast,
    };
    localStorage.setItem("lastData", JSON.stringify(dataToSave));
  }, []);

  // Fetch Forecast Data
  const fetchForecastData = useCallback(
    async (lat, lon, comment, currentData) => {
      try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
        const forecastRes = await fetch(forecastUrl);
        if (!forecastRes.ok) {
          throw new Error("Unable to fetch forecast data");
        }
        const forecast = await forecastRes.json();
        setForecastData(forecast);
        saveLastData(currentData, comment, forecast);
      } catch (err) {
        console.error("Forecast Error:", err);
        setError("Failed to fetch forecast data.");
      }
    },
    [apiKey, units, saveLastData]
  );

  // Fetch Weather Data
  const fetchWeatherData = useCallback(
    async (city = location, lat = null, lon = null) => {
      setWeatherData(null);
      setForecastData(null);
      setError(null);
      setLoading(true);

      let apiUrl = "";
      if (lat && lon) {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
      } else {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
      }

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Unable to fetch weather data");
        }
        const data = await response.json();
        setWeatherData(data);

        // Determine sarcastic comment
        const weatherCondition = data.weather[0].main;
        const temperature = data.main.temp;
        let comments = ["I have no words for this weather..."];
        const tempLimitCold = units === "imperial" ? 40 : 5;
        const tempLimitHot = units === "imperial" ? 80 : 27;

        if (sarcasticComments[weatherCondition]) {
          if (temperature < tempLimitCold) {
            comments = sarcasticComments[weatherCondition].cold;
          } else if (temperature > tempLimitHot) {
            comments = sarcasticComments[weatherCondition].hot;
          } else {
            comments = sarcasticComments[weatherCondition].mild;
          }
        }

        const randomIndex = Math.floor(Math.random() * comments.length);
        const chosenComment = comments[randomIndex];
        setSelectedComment(chosenComment);

        // Add to search history if city-based search
        if (!lat && !lon && !searchHistory.includes(city)) {
          setSearchHistory([...searchHistory, city]);
        }

        // Fetch forecast data
        const { coord } = data;
        await fetchForecastData(coord.lat, coord.lon, chosenComment, data);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
    [apiKey, location, units, searchHistory, fetchForecastData]
  );

  // Handle Geolocation
  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherData(null, latitude, longitude);
      },
      (err) => {
        console.error(err);
        setError("Unable to retrieve your location.");
        setLoading(false);
      }
    );
  };

  // Toggle Units
  const toggleUnits = () => {
    const newUnits = units === "imperial" ? "metric" : "imperial";
    setUnits(newUnits);
  };

  // Handle Favorite
  const handleFavorite = () => {
    if (weatherData) {
      setFavorite(weatherData.name);
    }
  };

  // Handle Suggestion Click
  const handleSuggestionClick = (city) => {
    setLocation(city);
    setShowSuggestions(false);
    fetchWeatherData(city);
  };

  // Filtered Suggestions
  const filteredSuggestions = citySuggestions.filter((c) => c.toLowerCase().startsWith(location.toLowerCase()));

  // Re-fetch data when units change
  useEffect(() => {
    if (weatherData) {
      const city = weatherData.name;
      fetchWeatherData(city);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  return (
    <div className="font-orbitron bg-gradient-to-br from-[#121212] via-[#1e1e1e] to-[#121212] text-white p-5 min-h-screen flex flex-col items-center justify-between gap-6 relative overflow-hidden">
      {/* Subtle decorative background */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_bottom_left,_#0db9d7_10%,_transparent_50%)]"></div>

      {/* Header */}
      <header className="text-center">
        <h1 className="text-5xl font-bold text-[#0db9d7] mb-2 tracking-wide drop-shadow-lg animate-pulse">weather</h1>
        <h3 className="text-sm italic text-gray-300">for now...</h3>
      </header>

      {/* Search and Controls */}
      <div className="flex flex-col items-center justify-between w-full max-w-md text-sm text-gray-300 mb-3 px-5">
        <div className="flex justify-between items-center w-full mb-2">
          <button
            className="flex items-center gap-1 hover:text-[#0db9d7] transition-colors"
            onClick={handleGeoLocation}
            aria-label="Use my location"
          >
            <MapPin size={16} /> Use my location
          </button>
          {weatherData && (
            <button
              className="flex items-center gap-1 hover:text-[#0db9d7] transition-colors"
              onClick={handleFavorite}
              aria-label="Add to favorites"
            >
              <Star size={16} /> Favorite
            </button>
          )}
        </div>
        <button
          onClick={toggleUnits}
          className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0db9d7]"
          aria-label="Toggle temperature units"
        >
          {units === "imperial" ? "Switch to °C" : "Switch to °F"}
        </button>
        {favorite && (
          <div className="font-bold mt-2">
            Favorite: <span className="text-[#0db9d7]">{favorite}</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-start gap-6 w-full max-w-4xl">
        {/* Left Column: Search, Search History, and Weather Highlights */}
        <div className="flex flex-col gap-4 items-center w-full max-w-md bg-[#1a1a1a]/80 p-5 rounded-lg shadow-xl">
          {/* Search Bar Container */}
          <div className="relative w-full">
            <div className="flex gap-3 w-full">
              <input
                type="text"
                placeholder="search city..."
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                className="p-3 rounded-l-md bg-[#e1d9d1] text-black w-full font-montserrat focus:outline-none focus:ring-2 focus:ring-[#0db9d7] transition-all duration-300"
                aria-label="Search city"
              />
              <button
                type="button"
                onClick={() => fetchWeatherData(location)}
                disabled={loading}
                className={`flex items-center justify-center px-4 py-2 rounded-r-md text-[#e1d9d1] cursor-pointer transition-all duration-300 ease-in-out 
                  ${
                    loading
                      ? "bg-gray-500"
                      : "bg-[#0db9d7] hover:bg-gradient-to-r hover:from-pink-500 hover:to-yellow-500 transform hover:scale-105"
                  }
                  focus:outline-none focus:ring-2 focus:ring-[#0db9d7] active:scale-95`}
                aria-label="Search"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Search size={20} />
                )}
              </button>
            </div>
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-[#1a1a1a] border border-[#0db9d7] z-10 rounded-b-md transition-opacity duration-300 opacity-100">
                {filteredSuggestions.map((city) => (
                  <div
                    key={city}
                    className="p-2 hover:bg-[#0db9d7] hover:text-black cursor-pointer transition-colors"
                    onClick={() => handleSuggestionClick(city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Display search history below search bar */}
          {searchHistory.length > 0 && (
            <div className="flex gap-2 overflow-x-auto max-w-full mt-3 text-sm text-gray-300 items-center justify-center w-full">
              {searchHistory.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setLocation(city);
                    fetchWeatherData(city);
                  }}
                  className="underline hover:text-[#0db9d7]"
                  aria-label={`Search history: ${city}`}
                >
                  {city}
                </button>
              ))}
            </div>
          )}

          {/* Weather Highlights */}
          <WeatherHighlights
            weatherData={weatherData}
            units={units}
          />
        </div>

        {/* Right Column: Sarcastic Comment and Current Weather */}
        <div className="flex flex-col gap-4 w-full">
          {/* Sarcastic Comment - Separate Box */}
          <SarcasticComment comment={selectedComment} />

          {/* Weather Display */}
          {loading ? (
            <SkeletonLoader />
          ) : (
            <WeatherDisplay
              weatherData={weatherData}
              error={error}
              units={units}
            />
          )}
        </div>
      </div>

      {/* 5-Day Forecast - Centered at the Bottom */}
      <div className="w-full max-w-4xl mt-6 mx-auto flex justify-center">
        {loading ? (
          <SkeletonLoader type="forecast" />
        ) : (
          forecastData && (
            <ForecastDisplay
              forecastData={forecastData}
              units={units}
            />
          )
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center justify-center p-4 rounded-lg bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-lg shadow-red-900/50 w-full max-w-md text-center transition-opacity duration-500">
          <span className="text-white font-bold tracking-wide">{error}. Check spelling or try another city.</span>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
