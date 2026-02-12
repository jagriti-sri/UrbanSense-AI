import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-700 text-white min-h-screen p-5">

      <h1 className="text-2xl font-bold mb-8">
        UrbanSense AI
      </h1>

      <nav className="space-y-4">

        <Link to="/" className="block hover:bg-blue-600 p-2 rounded">
          Dashboard
        </Link>

        <Link to="/flood" className="block hover:bg-blue-600 p-2 rounded">
          Flood
        </Link>

        <Link to="/aqi" className="block hover:bg-blue-600 p-2 rounded">
          AQI
        </Link>

        <Link to="/waste" className="block hover:bg-blue-600 p-2 rounded">
          Waste
        </Link>

        <Link to="/weather" className="block hover:bg-blue-600 p-2 rounded">
          Weather
        </Link>

        <Link to="/reports" className="block hover:bg-blue-600 p-2 rounded">
          Reports
        </Link>

        <Link to="/admin" className="block hover:bg-blue-600 p-2 rounded">
          Admin
        </Link>

      </nav>

    </div>
  );
}
