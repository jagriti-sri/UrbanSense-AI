import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { day: "Mon", aqi: 120 },
  { day: "Tue", aqi: 150 },
  { day: "Wed", aqi: 180 },
  { day: "Thu", aqi: 170 },
  { day: "Fri", aqi: 190 },
];

export default function AQICard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="font-bold mb-2">AQI Forecast</h2>

      <p className="text-3xl font-bold text-red-500">185</p>
      <p className="text-sm mb-2">Unhealthy</p>

      <BarChart width={300} height={200} data={data}>
        <Bar dataKey="aqi" fill="#ef4444" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
      </BarChart>
    </div>
  );
}
