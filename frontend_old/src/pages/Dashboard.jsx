import Navbar from "../components/Navbar";
import FloodCard from "../components/FloodCard";
import AQICard from "../components/AQICard";

export default function Dashboard() {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <div className="max-w-6xl mx-auto p-6">

        <h2 className="text-2xl font-bold mb-6">
          Environmental Monitoring Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FloodCard />
          <AQICard />
        </div>

      </div>

    </div>
  );
}
