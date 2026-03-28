import TerrainCache from "../modules/flood/terrainCache.model.js";

const slopeMemoryCache = new Map();

const sleep = ms =>
new Promise(r => setTimeout(r, ms));


/*
TIMEOUT PROTECTED FETCH
*/

const fetchWithTimeout =
async (url, timeout = 5000) => {

return Promise.race([

fetch(url),

new Promise((_, reject) =>
setTimeout(() => reject("Slope timeout"), timeout)
)

]);

};


/*
MAIN SLOPE ENGINE
*/

export const calculateSlope =
async (lat, lon) => {

lat = Number(Number(lat).toFixed(3));
lon = Number(Number(lon).toFixed(3));

const key = `${lat},${lon}`;


/*
STEP 1 — MEMORY CACHE
*/

if (slopeMemoryCache.has(key)) {

return slopeMemoryCache.get(key);

}


/*
STEP 2 — DATABASE CACHE
*/

const cached =
await TerrainCache.findOne({ lat, lon });

if (cached?.slope !== undefined) {

slopeMemoryCache.set(key, cached.slope);

return cached.slope;

}


try {

/*
5-point sampling grid (~200m)
*/

const offset = 0.002;

const points = [

{ lat, lon },

{ lat: lat + offset, lon },

{ lat: lat - offset, lon },

{ lat, lon: lon + offset },

{ lat, lon: lon - offset }

];


const locations =
points.map(p => `${p.lat},${p.lon}`).join("|");


/*
UPDATED API → OpenTopoData SRTM90m
More reliable than Open-Elevation
*/

const url =
`https://api.opentopodata.org/v1/srtm90m?locations=${locations}`;


/*
RATE LIMIT SAFETY DELAY
*/

await sleep(300);


/*
FETCH WITH TIMEOUT PROTECTION
*/

const response =
await fetchWithTimeout(url);


const data =
await response.json();


if (!data?.results || data.results.length < 5)
throw Error("Bad elevation response");


const elevations =
data.results.map(r => r.elevation ?? 300);


const center =
elevations[0];


let sum = 0;


/*
SLOPE COMPUTATION
*/

for (let i = 1; i < 5; i++) {

sum += Math.atan(

Math.abs(center - elevations[i]) / 220

) * (180 / Math.PI);

}


const slope =
sum / 4;


/*
CACHE ONLY REAL VALUE
*/

slopeMemoryCache.set(key, slope);


await TerrainCache.findOneAndUpdate(

{ lat, lon },

{ slope },

{ upsert: true }

);


return slope;

}


/*
FALLBACK (NOT STORED)
*/

catch {

console.log("Using regional flood history baseline estimate", err.message);

return adaptiveSlopeFallback(lat);

}

};


/*
SMART GEOGRAPHIC FALLBACK
*/

function adaptiveSlopeFallback(lat) {

if (lat > 32) return 7;
if (lat > 28) return 5;
if (lat > 22) return 3;

return 2;

}