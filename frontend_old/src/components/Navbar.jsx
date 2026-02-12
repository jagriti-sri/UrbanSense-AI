export default function Navbar() {
  return (
    <div className="bg-blue-600 text-white px-8 py-4 flex justify-between items-center shadow">
      <h1 className="font-bold text-2xl">UrbanSense AI</h1>

      <div className="space-x-6 font-medium">
        <button className="hover:underline">Flood</button>
        <button className="hover:underline">AQI</button>
        <button className="hover:underline">Reports</button>
      </div>
    </div>
  );
}
