// SkeletonLoader.jsx
import React from "react";

const SkeletonLoader = ({ type }) => {
  if (type === "forecast") {
    return (
      <div className="flex flex-col items-center gap-4 w-full max-w-xl mt-4 p-4 bg-[#1a1a1a]/80 rounded-md border border-[#0db9d7] shadow-lg">
        <h2 className="text-xl text-[#e1d9d1] font-bold">5-Day Forecast</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-[#e1d9d1] p-3 bg-[#2a2a2a] rounded-lg"
            >
              <div className="w-24 h-4 bg-gray-600 rounded mb-2"></div>
              <div className="w-12 h-12 bg-gray-600 rounded-full mb-2"></div>
              <div className="w-16 h-6 bg-gray-600 rounded mb-2"></div>
              <div className="w-24 h-4 bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default Skeleton for WeatherDisplay
  return (
    <div className="flex flex-col items-center justify-center mx-auto w-[350px] p-6 rounded-xl bg-[#1a1a1a] border border-[#0db9d7] shadow-xl transition-opacity duration-500 opacity-0 animate-fadeIn">
      <div className="w-full h-6 bg-gray-600 rounded mb-4"></div>
      <div className="w-24 h-24 bg-gray-600 rounded-full mb-4 animate-pulse"></div>
      <div className="w-32 h-4 bg-gray-600 rounded mb-2"></div>
      <div className="w-40 h-4 bg-gray-600 rounded mb-2"></div>
      <div className="w-24 h-4 bg-gray-600 rounded mb-2"></div>
      <div className="w-28 h-4 bg-gray-600 rounded"></div>
    </div>
  );
};

export default SkeletonLoader;
