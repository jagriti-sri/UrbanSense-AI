import TerrainCache from "../modules/flood/terrainCache.model.js";

const OVERPASS =
"https://overpass-api.de/api/interpreter";

const memoryRiverCache = new Map();


const fetchWithTimeout = async (
url,
options = {},
timeout = 5000
) => {

return Promise.race([

fetch(url, options),

new Promise((_, reject) =>
setTimeout(
() => reject(new Error("River API timeout")),
timeout
))

]);

};


export const getDistanceFromRiver =
async (lat, lon, elevation, slope) => {

lat = Number(Number(lat).toFixed(3));
lon = Number(Number(lon).toFixed(3));

const key = `${lat},${lon}`;


/* MEMORY CACHE */

if(memoryRiverCache.has(key))
return memoryRiverCache.get(key);


/* DATABASE CACHE */

const cached =
await TerrainCache.findOne({ lat, lon });

if(cached?.distanceFromRiver !== undefined){

memoryRiverCache.set(
key,
cached.distanceFromRiver
);

return cached.distanceFromRiver;

}


/* API CALL */

try{

const query = `
[out:json][timeout:20];
(
way["waterway"="river"](around:30000,${lat},${lon});
relation["waterway"="river"](around:30000,${lat},${lon});
);
out center;
`;

const response =
await fetchWithTimeout(

OVERPASS,

{
method:"POST",
headers:{
"Content-Type":
"application/x-www-form-urlencoded"
},
body:
"data=" + encodeURIComponent(query)
}

);

const data =
await response.json();


if(data?.elements?.length){

let minDistance = Infinity;

for(const element of data.elements){

if(!element.center) continue;

const d = Math.sqrt(
(lat-element.center.lat)**2 +
(lon-element.center.lon)**2
)*111;

if(d < minDistance)
minDistance = d;

}

memoryRiverCache.set(key,minDistance);

await TerrainCache.findOneAndUpdate(

{ lat, lon },

{ distanceFromRiver:minDistance },

{ upsert:true }

);

return minDistance;

}

}catch(e){

console.log(
"Using terrain-based hydrological estimate for river proximity",
e?.message || e
);

}


/* FALLBACK MODEL */

let fallbackDistance = 12;

if(elevation < 120 && slope < 2)
fallbackDistance = 2;

else if(elevation < 250 && slope < 4)
fallbackDistance = 6;

else if(elevation < 400 && slope < 6)
fallbackDistance = 15;


memoryRiverCache.set(key,fallbackDistance);

await TerrainCache.findOneAndUpdate(

{ lat, lon },

{ distanceFromRiver:fallbackDistance },

{ upsert:true }

);

return fallbackDistance;

};


export function getRiverInfluenceScore(distance){

if(distance < 2) return 3;
if(distance < 8) return 2;
if(distance < 20) return 1;

return 0;

}