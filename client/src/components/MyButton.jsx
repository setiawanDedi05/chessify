import React from "react";

export default function MyButton({ label, handleClick, className }) {
  return (
    <button
      onClick={handleClick}
      className={`border rounded-md py-2 px-4 bg-slate-900 text-white font-mono font-bold hover:bg-white hover:text-slate-900 ${className}`}
    >
      {label}
    </button>
  );
}
