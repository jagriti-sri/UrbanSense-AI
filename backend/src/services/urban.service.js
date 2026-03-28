import TerrainCache from "../modules/flood/terrainCache.model.js";

const OVERPASS =
"https://overpass.kumi.systems/api/interpreter";

const memoryUrbanCache =
new Map();


/*
SAFE FETCH WITH TIMEOUT
Always throws proper Error object
*/

const fetchWithTimeout = async (
url,
options = {},
timeout = 12000
) => {

return Promise.race([

fetch(url, options),

new Promise((_, reject) =>
setTimeout(
() => reject(new Error("Urban API timeout")),
timeout
))

]);

};


/*
MAIN URBAN FLOOD FACTOR FUNCTION
*/

export const getUrbanFloodFactor =
async (lat, lon) => {

lat = Number(Number(lat).toFixed(3));
lon = Number(Number(lon).toFixed(3));

const cacheKey =
`${lat},${lon}`;


/*
STEP 1 — MEMORY CACHE
*/

if(memoryUrbanCache.has(cacheKey)){

return memoryUrbanCache.get(cacheKey);

}


/*
STEP 2 — DATABASE CACHE
*/

const cachedTerrain =
await TerrainCache.findOne({ lat, lon });

if(cachedTerrain?.urbanFloodFactor !== undefined){

memoryUrbanCache.set(
cacheKey,
cachedTerrain.urbanFloodFactor
);

return cachedTerrain.urbanFloodFactor;

}


try{

const radius = 500;


/*
PARALLEL OVERPASS QUERIES
*/

const [

buildingResponse,

roadResponse,

drainResponse

] = await Promise.all([

fetchWithTimeout(

OVERPASS,

{
method:"POST",

headers:{
"Content-Type":
"application/x-www-form-urlencoded"
},

body:
"data=" + encodeURIComponent(`
[out:json];
way["building"](around:${radius},${lat},${lon});
out body;
`)
}

),

fetchWithTimeout(

OVERPASS,

{
method:"POST",

headers:{
"Content-Type":
"application/x-www-form-urlencoded"
},

body:
"data=" + encodeURIComponent(`
[out:json];
way["highway"](around:${radius},${lat},${lon});
out body;
`)
}

),

fetchWithTimeout(

OVERPASS,

{
method:"POST",

headers:{
"Content-Type":
"application/x-www-form-urlencoded"
},

body:
"data=" + encodeURIComponent(`
[out:json];
way["waterway"="drain"](around:${radius},${lat},${lon});
out body;
`)
}

)

]);


/*
SAFE PARSE RESPONSES
Handles rural/desert empty results
*/

const [

buildingData,

roadData,

drainData

] = await Promise.all([

buildingResponse.json(),

roadResponse.json(),

drainResponse.json()

]);


/*
SAFE COUNT EXTRACTION
*/

const buildingCount =
buildingData?.elements?.length ?? 0;

const roadCount =
roadData?.elements?.length ?? 0;

const drainCount =
drainData?.elements?.length ?? 0;


/*
RUNOFF SCORE MODEL
*/

let runoffScore = 0;


/*
BUILDING DENSITY IMPACT
*/

if(buildingCount > 80)
runoffScore += 2;

else if(buildingCount > 30)
runoffScore += 1;


/*
ROAD IMPACT
*/

if(roadCount > 60)
runoffScore += 2;

else if(roadCount > 20)
runoffScore += 1;


/*
DRAINAGE REDUCES FLOOD RISK
*/

if(drainCount > 5)
runoffScore -= 1;


/*
MINIMUM LIMIT
*/

if(runoffScore < 0)
runoffScore = 0;


/*
STEP 3 — MEMORY CACHE STORE
*/

memoryUrbanCache.set(
cacheKey,
runoffScore
);


/*
STEP 4 — DATABASE CACHE STORE
*/

await TerrainCache.findOneAndUpdate(

{ lat, lon },

{ urbanFloodFactor: runoffScore },

{ upsert: true }

);


return runoffScore;

}


catch(err){

console.log(
"Using baseline urban runoff estimate from terrain model",
err?.message || err
);

/*
SAFE DEFAULT VALUE
Ensures prediction engine never crashes
*/

return 1;

}

};