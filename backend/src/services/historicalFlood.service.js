import TerrainCache from "../modules/flood/terrainCache.model.js";


const memoryHistoricalCache =
new Map();


const OVERPASS =
"https://overpass.kumi.systems/api/interpreter";


const fetchWithTimeout =
async (
url,
options = {},
timeout = 5000
) => {

return Promise.race([

fetch(url, options),

new Promise((_, reject) =>
setTimeout(
() => reject("Flood history timeout"),
timeout
))

]);

};


export const getHistoricalFloodScore =
async (
lat,
lon,
elevation,
riverDistance
) => {

lat = Number(Number(lat).toFixed(3));
lon = Number(Number(lon).toFixed(3));

const key =
`${lat},${lon}`;


/*
STEP 1 — MEMORY CACHE
*/

if(memoryHistoricalCache.has(key))
return memoryHistoricalCache.get(key);


/*
STEP 2 — DATABASE CACHE
*/

const cached =
await TerrainCache.findOne({ lat, lon });

if(cached?.historicalFloodScore !== undefined){

memoryHistoricalCache.set(
key,
cached.historicalFloodScore
);

return cached.historicalFloodScore;

}


/*
STEP 3 — COMPUTE SCORE
*/

try{

let score = 0;


/*
LOW ELEVATION FLOODPLAIN
*/

if(elevation < 120)
score += 2;


/*
RIVER FLOODPLAIN PROXIMITY
*/

if(riverDistance < 1)
score += 2;

else if(riverDistance < 3)
score += 1;


/*
CHECK FLOOD TAGS FROM OSM
*/

const query = `
[out:json];
(
way["flood_prone"](around:2000,${lat},${lon});
relation["flood_prone"](around:2000,${lat},${lon});
);
out body;
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


if(data.elements.length > 0)
score += 2;


/*
LIMIT SCORE
*/

if(score > 4)
score = 4;


/*
CACHE ONLY REAL VALUE
*/

memoryHistoricalCache.set(
key,
score
);


await TerrainCache.findOneAndUpdate(

{ lat, lon },

{ historicalFloodScore: score },

{ upsert:true }

);


return score ?? 0;

}

catch(err){

console.log(
"Using regional flood history baseline estimate",
err.message
);
return 1;

}

};