import React from "react";

export default function MyTextInput({
  name,
  value,
  isRequired,
  handleChange,
  type = "text",
}) {
  return (
    <input
      autoFocus
      id={name}
      name={name}
      value={value}
      required={isRequired}
      className="border py-4 px-8 hover:border-slate-900 focus:outline-none focus:border-dashed"
      onChange={handleChange}
      type={type}
    />
  );
}
