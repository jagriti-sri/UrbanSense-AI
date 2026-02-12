import React from 'react'
import PageTitle from '../components/Typography/PageTitle'
import ChartCard from '../components/Chart/ChartCard'
import { Line } from 'react-chartjs-2'

// Demo weather forecast data (later from API/backend)
const weatherForecast = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'Rainfall (mm)',
      data: [5, 12, 25, 18, 30],
      borderColor: '#0284c7',
      fill: false,
    },
    {
      label: 'Temperature (°C)',
      data: [30, 32, 29, 28, 27],
      borderColor: '#f97316',
      fill: false,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}

function Weather() {
  return (
    <>
      <PageTitle>Weather Alerts</PageTitle>

      {/* Weather Status Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Current Temperature</p>
          <h3 className="text-xl font-bold">29°C</h3>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Humidity</p>
          <h3 className="text-xl font-bold">78%</h3>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Rainfall Today</p>
          <h3 className="text-xl font-bold">18 mm</h3>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Alert Level</p>
          <h3 className="text-xl font-bold text-orange-500">Heavy Rain Warning</h3>
        </div>

      </div>

      {/* Forecast Chart */}
      <ChartCard title="5-Day Weather Forecast">
        <div className="h-64">
          <Line data={weatherForecast} options={chartOptions} />
        </div>
      </ChartCard>

      {/* Alert Section */}
      <div className="mt-8 bg-white p-6 rounded shadow">

        <h3 className="text-lg font-bold mb-4">Emergency Weather Alerts</h3>

        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li>Heavy rainfall expected in low-lying areas</li>
          <li>Possible waterlogging in Zone 3 and Zone 5</li>
          <li>Strong winds expected after 6 PM</li>
          <li>Avoid unnecessary travel during storms</li>
        </ul>

        <div className="flex gap-4 flex-wrap">

          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Notify Citizens
          </button>

          <button className="px-4 py-2 bg-red-600 text-white rounded">
            Issue Emergency Alert
          </button>

          <button className="px-4 py-2 bg-green-600 text-white rounded">
            Update Forecast
          </button>

        </div>

      </div>
    </>
  )
}

export default Weather
