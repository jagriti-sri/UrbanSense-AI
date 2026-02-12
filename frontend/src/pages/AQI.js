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
    </>
  )
}

export default AQI
