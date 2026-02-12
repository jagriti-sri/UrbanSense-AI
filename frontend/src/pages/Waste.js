import React from 'react'
import PageTitle from '../components/Typography/PageTitle'
import ChartCard from '../components/Chart/ChartCard'
import { Doughnut } from 'react-chartjs-2'

// Demo bin distribution data (later from backend)
const wasteDistribution = {
  labels: ['Safe', 'Moderate', 'Overflow'],
  datasets: [
    {
      data: [60, 25, 15],
      backgroundColor: ['#16a34a', '#facc15', '#dc2626'],
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}

function Waste() {
  return (
    <>
      <PageTitle>Waste Management</PageTitle>

      {/* Waste Status Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Total Bins Monitored</p>
          <h3 className="text-xl font-bold">120</h3>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Overflow Bins</p>
          <h3 className="text-xl font-bold text-red-600">18</h3>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Pending Pickups</p>
          <h3 className="text-xl font-bold">7</h3>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Citizen Complaints</p>
          <h3 className="text-xl font-bold">12</h3>
        </div>

      </div>

      {/* Waste Distribution Chart */}
      <ChartCard title="Bin Fill Status Distribution">
        <div className="h-64">
          <Doughnut data={wasteDistribution} options={chartOptions} />
        </div>
      </ChartCard>

      {/* Action Section */}
      <div className="mt-8 bg-white p-6 rounded shadow">

        <h3 className="text-lg font-bold mb-4">Operational Actions</h3>

        <div className="flex gap-4 flex-wrap">

          <button className="px-4 py-2 bg-green-600 text-white rounded">
            Schedule Pickup
          </button>

          <button className="px-4 py-2 bg-yellow-600 text-white rounded">
            Mark Bin Serviced
          </button>

          <button className="px-4 py-2 bg-red-600 text-white rounded">
            Escalate Issue
          </button>

        </div>

      </div>
    </>
  )
}

export default Waste
