import React from 'react'
import PageTitle from '../components/Typography/PageTitle'

function Reports() {
  return (
    <>
      <PageTitle>System Reports</PageTitle>

      {/* Report Summary Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Flood Reports</p>
          <h3 className="text-xl font-bold">24 Generated</h3>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">AQI Reports</p>
          <h3 className="text-xl font-bold">18 Generated</h3>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Waste Reports</p>
          <h3 className="text-xl font-bold">15 Generated</h3>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Weather Reports</p>
          <h3 className="text-xl font-bold">21 Generated</h3>
        </div>

      </div>

      {/* Report Generation Section */}
      <div className="bg-white p-6 rounded shadow mb-8">

        <h3 className="text-lg font-bold mb-4">Generate New Report</h3>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <select className="border p-2 rounded">
            <option>Select Module</option>
            <option>Flood Monitoring</option>
            <option>AQI Monitoring</option>
            <option>Waste Management</option>
            <option>Weather Alerts</option>
          </select>

          <select className="border p-2 rounded">
            <option>Select Duration</option>
            <option>Last Week</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>Custom</option>
          </select>

          <input
            type="date"
            className="border p-2 rounded"
            placeholder="From Date"
          />

          <input
            type="date"
            className="border p-2 rounded"
            placeholder="To Date"
          />

        </div>

        <div className="mt-4 flex gap-4">

          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Generate PDF
          </button>

          <button className="px-4 py-2 bg-green-600 text-white rounded">
            Export CSV
          </button>

          <button className="px-4 py-2 bg-purple-600 text-white rounded">
            View Analytics
          </button>

        </div>

      </div>

      {/* Previous Reports Section */}
      <div className="bg-white p-6 rounded shadow">

        <h3 className="text-lg font-bold mb-4">Previous Reports</h3>

        <table className="w-full text-sm text-left">

          <thead>
            <tr className="border-b">
              <th className="p-2">Report ID</th>
              <th className="p-2">Module</th>
              <th className="p-2">Duration</th>
              <th className="p-2">Date</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-b">
              <td className="p-2">RPT-1021</td>
              <td className="p-2">Flood</td>
              <td className="p-2">Last Month</td>
              <td className="p-2">12 Jan 2026</td>
              <td className="p-2">
                <button className="text-blue-600">Download</button>
              </td>
            </tr>

            <tr className="border-b">
              <td className="p-2">RPT-1022</td>
              <td className="p-2">AQI</td>
              <td className="p-2">Last Week</td>
              <td className="p-2">05 Feb 2026</td>
              <td className="p-2">
                <button className="text-blue-600">Download</button>
              </td>
            </tr>

            <tr>
              <td className="p-2">RPT-1023</td>
              <td className="p-2">Waste</td>
              <td className="p-2">3 Months</td>
              <td className="p-2">01 Feb 2026</td>
              <td className="p-2">
                <button className="text-blue-600">Download</button>
              </td>
            </tr>

          </tbody>

        </table>

      </div>
    </>
  )
}

export default Reports
