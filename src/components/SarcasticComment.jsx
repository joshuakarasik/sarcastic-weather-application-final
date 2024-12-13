// SarcasticComment.jsx
import React from "react";

const SarcasticComment = ({ comment }) => {
  if (!comment) return null;

  return (
    <div className="w-full max-w-md p-4 bg-[#1a1a1a]/90 rounded-lg shadow-lg border border-[#0db9d7] transition-opacity duration-500 opacity-0 animate-fadeIn">
      <p className="text-center font-roboto text-2xl italic text-[#e1d9d1] tracking-wide">{comment}</p>
    </div>
  );
};

export default SarcasticComment;
