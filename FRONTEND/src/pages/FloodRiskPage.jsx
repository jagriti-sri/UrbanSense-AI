import { useState, useRef } from "react";
import "./FloodRiskPage.css";

import {
getFloodRiskFromQuery,
getFloodRiskFromCoords
} from "../services/floodApi";

import {
MapContainer,
TileLayer,
useMap,
Polygon,
Circle
} from "react-leaflet";

import L from "leaflet";

import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid
} from "recharts";
/*
MARKER COLORS BASED ON RISK
*/

const markerIcon = (risk)=>{

let color="green";

if(risk==="MEDIUM") color="orange";
if(risk==="HIGH") color="red";

return new L.Icon({

iconUrl:`https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",

iconSize:[25,41],
iconAnchor:[12,41]

});

};




function FitBoundary({ boundary, coords }){

const map = useMap();

try{

if(boundary && boundary.length > 2){

map.fitBounds(boundary);

}

else if(coords){

map.setView(coords,14);

}

}catch(err){

console.log("Map zoom fallback used");

}

return null;

}

const RainfallTrendChart = ({ result }) => {

if(!result) return null;

const data = [
{ name: "Last 24h", rain: result.rain_last_24h },
{ name: "Last 72h", rain: result.rain_last_72h },
{ name: "Next 72h", rain: result.rain_next_72h }
];

return (
<div className="rain-chart-wrapper">

<h3>🌧 Rainfall Trend</h3>

<ResponsiveContainer width="100%" height={220}>
<LineChart data={data}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="name" />
<YAxis domain={[0, 10]} />
<Tooltip formatter={(value) => `${value} mm`} />
<Line
type="monotone"
dataKey="rain"
stroke={
result.rain_next_72h > 20
? "#ef4444"
: result.rain_next_72h > 5
? "#f59e0b"
: "#22c55e"
}
strokeWidth={3}
dot={{ r: 6 }}
activeDot={{ r: 8 }}
/>
</LineChart>
</ResponsiveContainer>

</div>
);

};

/*
MAIN COMPONENT
*/


export default function FloodRiskPage(){
const suggestionCache = {};
const [query,setQuery]=useState("");
const [suggestions,setSuggestions]=useState([]);

const [coords,setCoords]=useState(null);

const [result,setResult]=useState(null);

const [zoom,setZoom]=useState(12);
const [loading,setLoading]=useState(false);

const [boundary,setBoundary]=useState(null);


const activeRequestId = useRef(0);

/*
RELIABILITY LABEL CONVERTER
*/

const getReliability=(score)=>{

if(score<40) return "Low";
if(score<70) return "Moderate";

return "High";

};
const getTerrainLabel = (score)=>{

if(score < 3) return "LOW";

if(score < 6) return "MEDIUM";

return "HIGH";

};

const getRiskReasons = result => {

let reasons = [];

if(result.riskLevel === "LOW"){

reasons.push("No nearby river influence detected");

reasons.push("Terrain slope supports drainage");

reasons.push("Low rainfall accumulation expected");

return reasons;

}

if(result.distanceFromRiver < 5)
reasons.push("Close to river influence");

if(result.slope < 1)
reasons.push("Low terrain slope slows drainage");

if(result.soilFactor > 1)
reasons.push("Clay soil reduces absorption");

return reasons;

};
/*
AUTOCOMPLETE + GEOJSON BOUNDARY
*/

const fetchSuggestions = async(text)=>{

const res = await fetch(
`https://photon.komoot.io/api/?q=${text}&limit=5`
);

const data = await res.json();

return data;

};

/*
INPUT HANDLER
*/

let debounceTimer;

const handleTyping = (e)=>{

const value = e.target.value;

setQuery(value);

if(value.trim().length < 3){

setSuggestions([]);

return;

}

clearTimeout(debounceTimer);

debounceTimer = setTimeout(async ()=>{

try{

const results = await fetchSuggestions(value);

setSuggestions(results.features || []);

}catch{

console.log("Suggestion fetch failed");

}

}, 400);

};

/*
SELECT SUGGESTION
*/

const selectSuggestion = async (place) => {

try{

const lon = place.geometry.coordinates[0];
const lat = place.geometry.coordinates[1];

setBoundary(null);

setCoords([lat,lon]);

setQuery(
`${place.properties.name}, ${place.properties.city || ""}, ${place.properties.state || ""}`
);

setSuggestions([]);

await runPrediction(
lat,
lon,
place.properties.name
);

}catch(error){

console.log(error);

alert("Prediction failed");

}

};

/*
MAIN PREDICTION
*/

const runPrediction = async(lat,lon,locationName)=>{

const requestId = Date.now();

activeRequestId.current = requestId;

try{

setLoading(true);

const prediction =
await getFloodRiskFromCoords(lat,lon);

/*
IGNORE OLD RESPONSES
*/

if(requestId !== activeRequestId.current) return;

setResult({

...prediction,
locationName

});

}catch{

alert("Prediction failed");

}

setLoading(false);

};

/*
ENTER SEARCH
*/

const handleSearch = async () => {
setResult(null);
setBoundary(null);
if(!query) return;

/*
IF suggestions exist
use first suggestion automatically
*/

if(suggestions.length > 0){

selectSuggestion(suggestions[0]);

return;

}

try{

setLoading(true);

const geo =
await getFloodRiskFromQuery(query);

const lat =
Number(geo.location.lat.toFixed(3));

const lon =
Number(geo.location.lon.toFixed(3));

setCoords([lat,lon]);

setBoundary(null);

await runPrediction(
lat,
lon,
geo.location.name || query
);

}
catch{

alert("Location not found");

}

setLoading(false);

};


/*
ZOOM HANDLER
*/

const handleZoomChange=(z)=>{

setZoom(z);

};


/*
ADVICE ENGINE
*/

const getAdvice=(risk)=>{

if(risk==="HIGH")

return "🚨 Flooding possible. Avoid travel.";

if(risk==="MEDIUM")

return "⚠ Water may collect in low-lying roads.";

return "✅ Area currently safe.";

};


/*
RISK COLOR FOR REGION HIGHLIGHT
*/

const getRiskColor=(risk)=>{

if(risk==="HIGH")

return "#d9534f";

if(risk==="MEDIUM")

return "#f0ad4e";

return "#5cb85c";

};
const getTrend = result => {

if(result.rain_next_72h > 30)
return "Risk increasing";

return "Risk stable";

};

/*
UI START
*/
const handleUseLocation = () => {

navigator.geolocation.getCurrentPosition(

(position)=>{

const lat = position.coords.latitude;
const lon = position.coords.longitude;

setCoords([lat,lon]);

runPrediction(lat,lon,"Your Current Location");

},

()=>{

alert("Location permission denied");

}

);

};

const timestamp = new Date().toLocaleString();
const rainfallStatus = mm => {

if(mm === 0) return "Dry";

if(mm < 20) return "Light rain";

return "Heavy rain";

};
return(

<div className="flood-page">

<h1>🌊 Flood Safety Monitor</h1>


<div className="search-box">

<input

value={query}

onChange={handleTyping}

onKeyDown={(e)=>{

if(e.key==="Enter")

handleSearch();

}}


placeholder="Search location (example: MANIT Bhopal)"


/>


<button onClick={handleSearch}>

🔎 Check Area Risk

</button>
<button onClick={handleUseLocation}>
📍 Use My Location
</button>

{suggestions.length>0 ? (

<div className="suggestions">

{suggestions.map((s,i)=>(

<div
key={i}
className="suggestion-item"
onClick={()=>selectSuggestion(s)}
>
{s.properties.name}, {s.properties.city || ""}, {s.properties.state || ""}
</div>

))}

</div>

) : query.length > 2 ? (
<div className="suggestion-loading">
Searching locations...
</div>
) : null}
<div className="system-status">

🟢 STATUS: LIVE FLOOD MONITORING ACTIVE

</div>

</div>


{coords &&(

<MapContainer

center={coords}

zoom={12}
scrollWheelZoom={true}
style={{

height:"380px",
borderRadius:"14px"


}}

>

<div className="map-layers">

<label><input type="checkbox" checked /> Rainfall</label>

<label><input type="checkbox" checked /> Terrain</label>

<label><input type="checkbox" checked /> River Influence</label>

</div>
<TileLayer

url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

/>


<FitBoundary boundary={boundary} coords={coords} />

{boundary ? (

<Polygon
positions={boundary}
pathOptions={{
color:getRiskColor(result?.riskLevel),
fillColor:getRiskColor(result?.riskLevel),
fillOpacity:0.25
}}
/>

) : coords && result ? (

<Circle
center={coords}
radius={1500}
pathOptions={{
color:getRiskColor(result.riskLevel),
fillColor:getRiskColor(result.riskLevel),
fillOpacity:0.25
}}
/>

) : null}



</MapContainer>

)}


{loading &&(

<div className="loading-box">

🌧 Analyzing terrain & rainfall...

</div>

)}

{result &&(

<div className="result-card">

<h2>
    

📍 {result.locationName}

<div className="timestamp">

🕒 Updated: {timestamp}

</div>
</h2>


<div className="metric-row">

<div className="metric-card">

<p className="metric-title">

🧭 Terrain Susceptibility

</p>

<div className="mini-meter">

<div
className="mini-fill"
style={{
width:`${result.susceptibilityScore * 10}%`
}}
></div>

</div>

<p className="metric-value">

{getTerrainLabel(result.susceptibilityScore)}

</p>

</div>
<div className="metric-card">

<p className="metric-title">

🚨 Flood Risk Today

</p>

<div className="mini-meter">

<div
className="mini-fill warning"
style={{
width:`${result.riskProbability}%`
}}
></div>

</div>

<p className="metric-value">

{result.riskLevel}

</p>

</div>

<div className="metric-card">

<p className="metric-title">

📊 Model Confidence

</p>

<div className="confidence-pill">

{getReliability(result.confidenceScore)}

</div>
<p>

📊 Data confidence:

<strong>

{result.dataConfidenceLevel}

</strong>

</p>

</div>

</div>


<div className="advice-box">
<div className="reason-panel">

<h3 className="section-title">

{result.riskLevel === "LOW"
? "✅ Why this area is safe"
: "⚠ Why this area has flood risk"}

</h3>

<ul>

{result.slope < 0.3 && (
<li>Low terrain slope slows drainage</li>
)}

{result.distanceFromRiver < 5 && (
<li>Close proximity to river increases overflow risk</li>
)}

{result.soilFactor > 1 && (
<li>Clay-dominant soil reduces absorption</li>
)}

{result.rain_last_72h > 10 && (
<li>Recent rainfall accumulation increases surface runoff</li>
)}

{result.rain_next_72h > 15 && (
<li>Heavy rainfall expected in next 72 hours</li>
)}

</ul>

</div>
{getAdvice(result.riskLevel)}
</div>
<div className="intel-row">
<div className="timeline-chart">
<h4 className="section-title">
📈 Risk Trend Timeline
</h4>

<div className="trend-timeline">

<div
className={`trend-block ${
result.rain_last_72h > 10
? "high"
: result.rain_last_72h > 2
? "medium"
: "low"
}`}
>
Past
</div>

<div
className={`trend-block ${result.riskLevel.toLowerCase()}`}
>
Today
</div>

<div
className={`trend-block ${
result.rain_next_72h > 20
? "high"
: result.rain_next_72h > 5
? "medium"
: "low"
}`}
>
Forecast
</div>

</div>

</div>


<div className="alerts-panel">

<h3 className="section-title">
🚨 Recent Alerts
</h3>

<ul className="alerts-list">

{result.rain_last_24h >= 2 && (
<li>Recent measurable rainfall detected</li>
)}

{result.rain_next_72h >= 10 && (
<li>Upcoming rainfall may increase flood risk</li>
)}

{result.distanceFromRiver < 5 && (
<li>Location close to river influence zone</li>
)}

{result.distanceFromSea < 20 && (
<li>Location inside coastal influence region</li>
)}

{result.urbanFloodFactor > 1 && (
<li>Urban runoff risk detected</li>
)}

{result.slope < 2 && (
<li>Low terrain slope slows water drainage</li>
)}

{result.riskLevel === "LOW" &&
result.rain_last_24h === 0 &&
result.rain_next_72h < 5 && (

<li>No active flood alerts in this area</li>

)}

</ul>

</div>

</div>


<div className="rainfall-panel">

<h3>🌧 Rainfall Conditions</h3>

<div className="rainfall-grid">
   <div className="rain-chart">

<div className="rain-bar">

<div
style={{height:result.rain_last_24h * 2 + 10}}
className="bar"
/>

<span>24h</span>

</div>

<div className="rain-bar">

<div
style={{height:result.rain_last_72h * 2 + 10}}
className="bar"
/>

<span>72h</span>

</div>

<div className="rain-bar">

<div
style={{height:result.rain_next_72h * 2 + 10}}
className="bar"
/>

<span>Forecast</span>


</div>


</div>

📈 Trend: {getTrend(result)}

</div>

<div>
<span>Last 24h</span>
<strong>
{result.rain_last_24h} mm
({rainfallStatus(result.rain_last_24h)})
</strong>
</div>

<div>
<span>Last 72h</span>
<strong>
{result.rain_last_72h} mm
({rainfallStatus(result.rain_last_72h)})
</strong>
</div>

<div>
<span>Forecast (72h)</span>
<strong>
{result.rain_next_72h} mm
({rainfallStatus(result.rain_next_72h)})
</strong>

</div>
<div className="rain-status">
{result.rain_last_24h === 0
? "☀ No rainfall recorded recently"
: "🌧 Rainfall detected recently"}
</div>
<RainfallTrendChart result={result} />
</div>

</div>


)}

</div>

)}




