import React from 'react'
import PageTitle from '../components/Typography/PageTitle'
import ChartCard from '../components/Chart/ChartCard'
import { Line } from 'react-chartjs-2'

// Demo chart (later from ML/backend)
const floodPrediction = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'Flood Risk %',
      data: [35, 50, 65, 70, 85],
      borderColor: '#2563eb',
      fill: false,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}

function Flood() {
  const riskLevels = ["Low", "Medium", "High"];
const risk = riskLevels[Math.floor(Math.random() * 3)];

  return (
    <>
      <PageTitle>Flood Monitoring</PageTitle>

      {/* Status Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Water Level</p>
          <h3 className="text-xl font-bold">62 cm</h3>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Rainfall</p>
          <h3 className="text-xl font-bold">14 mm</h3>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <span className={`px-3 py-1 rounded-full text-white text-sm ${
  risk === "High"
    ? "bg-red-600"
    : risk === "Medium"
    ? "bg-yellow-500"
    : "bg-green-600"
}`}>
  {risk}
</span>

        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Affected Areas</p>
          <h3 className="text-xl font-bold">5 Zones</h3>
        </div>

      </div>

      {/* Prediction Chart */}
      <ChartCard title="Flood Risk Prediction (Next 5 Days)">
        <div className="h-64">
          <Line data={floodPrediction} options={chartOptions} />
        </div>
      </ChartCard>
        <div className="p-6 bg-white rounded-lg shadow mb-6">
  <h3 className="text-lg font-semibold mb-4">
    Affected Area Map
  </h3>

  <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
    Map Data From Backend Will Appear Here
  </div>
</div>

      {/* Action Section */}
      <div className="mt-8 bg-white p-6 rounded shadow">

        <h3 className="text-lg font-bold mb-4">Emergency Actions</h3>

        <div className="flex gap-4">

          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Send Warning Alert
          </button>

          <button className="px-4 py-2 bg-red-600 text-white rounded">
            Mark Area as Unsafe
          </button>

        </div>

      </div>
       {/* Drainage + Soil */}
<div className="grid grid-cols-2 gap-4 mb-6">

  <div className="p-4 bg-white rounded-lg shadow">
    <h4 className="text-sm text-gray-500">Drainage Capacity</h4>
    <p className="text-2xl font-bold text-green-600">72%</p>
  </div>

  <div className="p-4 bg-white rounded-lg shadow">
    <h4 className="text-sm text-gray-500">Soil Absorption</h4>
    <p className="text-2xl font-bold text-red-600">Low</p>
  </div>

</div>


{/* Flood Risk Map */}
<div className="p-6 bg-white rounded-lg shadow mb-6">

  <h3 className="mb-4 font-semibold text-lg">Flood Risk Map</h3>

  <div className="h-56 bg-gray-200 flex items-center justify-center rounded">
    <p className="text-gray-600">
      Map Visualization (Live Zones)
    </p>
  </div>

  <div className="flex gap-4 mt-4 text-sm">

    <span className="text-red-600">■ High</span>
    <span className="text-orange-500">■ Medium</span>
    <span className="text-green-600">■ Safe</span>

  </div>

</div>
  {/* Critical Locations */}
<div className="p-6 bg-white rounded-lg shadow mb-6">

  <h3 className="mb-4 font-semibold text-lg">
    Critical Locations
  </h3>

  <table className="w-full text-sm">

    <thead>
      <tr className="border-b">
        <th className="text-left py-2">Location</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>

      <tr className="border-b">
        <td className="py-2">Road 21</td>
        <td className="text-red-600">Waterlogging</td>
      </tr>

      <tr className="border-b">
        <td className="py-2">Bridge 3</td>
        <td className="text-orange-500">Overflow Risk</td>
      </tr>

      <tr>
        <td className="py-2">Sector 5</td>
        <td className="text-yellow-600">Low Drainage</td>
      </tr>

    </tbody>

  </table>

</div>

    </>
     
  )
}

export default Flood
