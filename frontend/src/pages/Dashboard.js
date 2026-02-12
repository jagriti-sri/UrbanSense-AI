import React from 'react'

import InfoCard from '../components/Cards/InfoCard'
import ChartCard from '../components/Chart/ChartCard'
import { Line } from 'react-chartjs-2'
import ChartLegend from '../components/Chart/ChartLegend'
import PageTitle from '../components/Typography/PageTitle'
import { BellIcon, ChartsIcon, TablesIcon, FormsIcon } from '../icons'
import RoundIcon from '../components/RoundIcon'

// Demo chart data (later from backend)
const floodChart = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'Flood Risk %',
      data: [40, 55, 70, 65, 80],
      borderColor: '#7c3aed',
      fill: false,
    },
  ],
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}

function Dashboard() {
  return (
    <>
      <PageTitle>UrbanSense Control Center</PageTitle>

      {/* Status Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">

        <InfoCard title="Flood Risk" value="78%">
          <RoundIcon
            icon={TablesIcon}
            iconColorClass="text-blue-500"
            bgColorClass="bg-blue-100"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Air Quality Index" value="185">
          <RoundIcon
            icon={ChartsIcon}
            iconColorClass="text-red-500"
            bgColorClass="bg-red-100"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Waste Alerts" value="5 Areas">
          <RoundIcon
            icon={FormsIcon}
            iconColorClass="text-green-500"
            bgColorClass="bg-green-100"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Active Warnings" value="3">
          <RoundIcon
            icon={BellIcon}
            iconColorClass="text-yellow-500"
            bgColorClass="bg-yellow-100"
            className="mr-4"
          />
        </InfoCard>

      </div>

      {/* Charts */}
      <PageTitle>Risk Prediction Trend</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2">

        <ChartCard title="Flood Risk Forecast">
          <div className="h-64">
            <Line data={floodChart} options={chartOptions} />
          </div>
        </ChartCard>

        <ChartCard title="Pollution Trend">
          <div className="h-64">
            <Line data={floodChart} options={chartOptions} />
          </div>
        </ChartCard>

      </div>
    </>
  )
}

export default Dashboard
