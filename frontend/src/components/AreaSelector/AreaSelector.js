import React from "react";

function AreaSelector({ area, setArea }) {
  return (
    <select
      value={area}
      onChange={(e) => setArea(e.target.value)}
      className="px-3 py-1 bg-gray-800 text-white rounded border border-gray-600"
    >
      <option>Zone A</option>
      <option>Zone B</option>
      <option>Zone C</option>
    </select>
  );
}

export default AreaSelector;
