import React, { useState } from "react"

import InfoCard from "../components/Cards/InfoCard"
import ChartCard from "../components/Chart/ChartCard"
import { Line } from "react-chartjs-2"
import PageTitle from "../components/Typography/PageTitle"
import { BellIcon, ChartsIcon, TablesIcon, FormsIcon } from "../icons"
import RoundIcon from "../components/RoundIcon"

import AreaSelector from "../components/AreaSelector/AreaSelector"

// ---------------- DEMO DATA ---------------- //

const areaData = {
  "Zone A": { flood: 78, aqi: 190, waste: 5, alerts: 3 },
  "Zone B": { flood: 52, aqi: 160, waste: 2, alerts: 1 },
  "Zone C": { flood: 34, aqi: 120, waste: 1, alerts: 0 },
}

// Chart template
const makeChart = (label, data, color) => ({
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    {
      label,
      data,
      borderColor: color,
      backgroundColor: color,
      fill: false,
      tension: 0.4,
    },
  ],
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}

// ------------------------------------------- //

function Dashboard() {
  const [area, setArea] = useState("Zone A")

  const current = areaData[area]

  const floodChart = makeChart(
    "Flood Risk %",
    [40, 55, 70, 65, current.flood],
    "#7c3aed"
  )

  const aqiChart = makeChart(
    "AQI Level",
    [120, 145, 170, 160, current.aqi],
    "#ef4444"
  )

  return (
    <>
      <PageTitle>UrbanSense Control Center</PageTitle>

      {/* Area Selector */}
      <div className="mb-6">
        <AreaSelector selected={area} onChange={setArea} />
      </div>

      {/* STATUS CARDS */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">

        <InfoCard title="Flood Risk" value={`${current.flood}%`}>
          <RoundIcon
            icon={TablesIcon}
            iconColorClass="text-blue-500"
            bgColorClass="bg-blue-100"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Air Quality Index" value={current.aqi}>
          <RoundIcon
            icon={ChartsIcon}
            iconColorClass="text-red-500"
            bgColorClass="bg-red-100"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Waste Alerts" value={`${current.waste} Areas`}>
          <RoundIcon
            icon={FormsIcon}
            iconColorClass="text-green-500"
            bgColorClass="bg-green-100"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Active Warnings" value={current.alerts}>
          <RoundIcon
            icon={BellIcon}
            iconColorClass="text-yellow-500"
            bgColorClass="bg-yellow-100"
            className="mr-4"
          />
        </InfoCard>

      </div>

      {/* CHARTS */}
      <PageTitle>Risk Prediction Trend</PageTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2">

        <ChartCard title={`Flood Forecast - ${area}`}>
          <div className="h-64">
            <Line data={floodChart} options={chartOptions} />
          </div>
        </ChartCard>

        <ChartCard title={`AQI Trend - ${area}`}>
          <div className="h-64">
            <Line data={aqiChart} options={chartOptions} />
          </div>
        </ChartCard>

      </div>
    </>
  )
}

export default Dashboard
