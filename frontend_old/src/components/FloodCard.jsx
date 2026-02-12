import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { day: "Mon", risk: 40 },
  { day: "Tue", risk: 55 },
  { day: "Wed", risk: 70 },
  { day: "Thu", risk: 60 },
  { day: "Fri", risk: 80 },
];

export default function FloodCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="font-bold mb-2">Flood Risk</h2>

      <p className="text-3xl font-bold text-orange-500">78%</p>
      <p className="text-sm mb-2">Medium Risk</p>

      <LineChart width={300} height={200} data={data}>
        <Line type="monotone" dataKey="risk" stroke="#f97316" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
}
