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
          <p className="text-sm text-gray-600">Risk Level</p>
          <h3 className="text-xl font-bold text-orange-500">Medium</h3>
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
    </>
  )
}

export default Flood
