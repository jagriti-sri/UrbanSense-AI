import React from 'react'
import PageTitle from '../components/Typography/PageTitle'
import ChartCard from '../components/Chart/ChartCard'
import { Line } from 'react-chartjs-2'

// Demo AQI forecast data (later from ML/backend)
const aqiForecast = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'AQI Forecast',
      data: [120, 145, 170, 160, 185],
      borderColor: '#dc2626',
      fill: false,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}

function AQI() {
  return (
    <>
      <PageTitle>AQI Monitoring</PageTitle>

      {/* AQI Status Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Current AQI</p>
          <h3 className="text-xl font-bold text-red-600">185</h3>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">PM2.5</p>
          <h3 className="text-xl font-bold">92 µg/m³</h3>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Air Quality Status</p>
          <h3 className="text-xl font-bold text-red-600">Unhealthy</h3>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Health Advisory</p>
          <h3 className="text-sm font-semibold text-gray-800">
            Avoid outdoor activities
          </h3>
        </div>

      </div>

      {/* AQI Forecast Chart */}
      <ChartCard title="AQI Forecast (Next 5 Days)">
        <div className="h-64">
          <Line data={aqiForecast} options={chartOptions} />
        </div>
      </ChartCard>

      {/* Advisory Section */}
      <div className="mt-8 bg-white p-6 rounded shadow">

        <h3 className="text-lg font-bold mb-4">Recommended Actions</h3>

        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Wear masks when outdoors</li>
          <li>Avoid morning exercise</li>
          <li>Use air purifiers indoors</li>
          <li>Limit vehicle usage</li>
        </ul>

      </div>
      {/* Pollution Sources */}
<div className="p-6 bg-white rounded-lg shadow mb-6">

  <h3 className="mb-4 font-semibold text-lg">
    Major Pollution Sources
  </h3>

  <div className="grid grid-cols-2 gap-4 text-sm">

    <p>🚗 Traffic: <b>42%</b></p>
    <p>🏭 Industry: <b>31%</b></p>
    <p>🔥 Burning: <b>17%</b></p>
    <p>🌫 Dust: <b>10%</b></p>

  </div>

</div>
   <div className="p-6 bg-white rounded-lg shadow mb-6">
  <h3 className="text-lg font-semibold mb-4">Area-wise AQI</h3>

  <table className="w-full border-collapse text-left">
    <thead>
      <tr className="border-b">
        <th className="py-2 w-1/3">Area</th>
        <th className="py-2 w-1/3 text-center">AQI</th>
        <th className="py-2 w-1/3 text-center">Status</th>
      </tr>
    </thead>

    <tbody>
      <tr className="border-b">
        <td className="py-2">Zone A</td>
        <td className="py-2 text-center">190</td>
        <td className="py-2 text-center text-red-500">Unhealthy</td>
      </tr>

      <tr className="border-b">
        <td className="py-2">Zone B</td>
        <td className="py-2 text-center">160</td>
        <td className="py-2 text-center text-orange-500">Poor</td>
      </tr>

      <tr>
        <td className="py-2">Zone C</td>
        <td className="py-2 text-center">120</td>
        <td className="py-2 text-center text-green-500">Moderate</td>
      </tr>
    </tbody>
  </table>
</div>

     
     {/* Policy Suggestions */}
<div className="p-6 bg-white rounded-lg shadow">

  <h3 className="mb-4 font-semibold text-lg">
    Suggested Measures
  </h3>

  <ul className="list-disc ml-6 text-sm text-gray-700">

    <li>Traffic restrictions</li>
    <li>Construction halt</li>
    <li>Water sprinkling</li>
    <li>Public advisory</li>

  </ul>

</div>

    </>
  )
}

export default AQI
