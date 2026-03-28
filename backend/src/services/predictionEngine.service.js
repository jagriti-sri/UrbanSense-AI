import TerrainCache from "../modules/flood/terrainCache.model.js";

import { calculateSlope } from "./terrain.service.js";
import { getDistanceFromRiver } from "./river.service.js";
import { getDistanceFromSea } from "./coastal.service.js";
import { getSoilFactor } from "./soil.service.js";
import { getUrbanFloodFactor } from "./urban.service.js";
import { getHistoricalFloodScore } from "./historicalFlood.service.js";


export default async function generatePrediction(lat, lon){

lat = Number(Number(lat).toFixed(3));
lon = Number(Number(lon).toFixed(3));


let cached =
await TerrainCache.findOne({ lat, lon });


if(!cached){

cached = {};

}


/*
STEP 1 — elevation baseline
*/

const elevation =
cached.elevation ?? 500;


/*
STEP 2 — slope
*/

let slope = cached.slope;

if(slope === undefined){

console.log("Computing slope once");

slope =
await calculateSlope(lat, lon);

}


/*
STEP 3 — river distance
*/

let distanceFromRiver =
cached.distanceFromRiver;

if(distanceFromRiver === undefined){

console.log("Computing river distance once");

distanceFromRiver =
await getDistanceFromRiver(
lat,
lon,
elevation,
slope
);

}


/*
STEP 4 — sea distance
*/

let distanceFromSea =
cached.distanceFromSea;

if(distanceFromSea === undefined){

distanceFromSea =
await getDistanceFromSea(
lat,
lon,
elevation
);

}


/*
STEP 5 — soil factor
*/

let soilFactor =
cached.soilFactor;

if(soilFactor === undefined){

soilFactor =
await getSoilFactor(lat, lon);

}


/*
STEP 6 — urban flood factor
*/

let urbanFloodFactor =
cached.urbanFloodFactor;

if(urbanFloodFactor === undefined){

urbanFloodFactor =
await getUrbanFloodFactor(lat, lon);

}


/*
STEP 7 — historical flood score
*/

let historicalFloodScore =
cached.historicalFloodScore;

if(historicalFloodScore === undefined){

historicalFloodScore =
await getHistoricalFloodScore(
lat,
lon,
elevation,
distanceFromRiver
);

}


/*
STEP 8 — SAVE UPDATED CACHE
*/

await TerrainCache.findOneAndUpdate(

{ lat, lon },

{

lat,
lon,

elevation,

slope,

distanceFromRiver,

distanceFromSea,

soilFactor,

urbanFloodFactor,

historicalFloodScore

},

{ upsert:true }

);


console.log("Using cached terrain intelligence");


return {

elevation,

slope,

distanceFromRiver,

distanceFromSea,

soilFactor,

urbanFloodFactor,

historicalFloodScore

};

}