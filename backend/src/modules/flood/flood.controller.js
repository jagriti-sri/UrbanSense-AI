import Flood from "./flood.model.js";
import { execFile } from "child_process";

import { getRainForecast } from "../../services/weather.service.js";
import { calculateSlope } from "../../services/terrain.service.js";
import { getSoilFactor } from "../../services/soil.service.js";
import { getTerrainRoughness } from "../../services/roughness.service.js";
import { getUrbanFloodFactor } from "../../services/urban.service.js";

import {
getDistanceFromRiver,
getRiverInfluenceScore
} from "../../services/river.service.js";

import {
getDistanceFromSea,
getCoastalInfluenceScore
} from "../../services/coastal.service.js";

import {
getHistoricalFloodScore
} from "../../services/historicalFlood.service.js";


/*
Elevation service
*/

async function getElevation(lat, lon){

try{

const response =
await fetch(
`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`
);

const data = await response.json();

return data.results?.[0]?.elevation ?? 300;

}

catch{

return 300;

}

}


/*
CONFIDENCE ENGINE
*/

function calculateConfidenceScore(
susceptibilityScore,
triggerFactor,
historicalFloodScore
){

let confidence = 40;

if(susceptibilityScore > 6) confidence += 20;
if(triggerFactor > 1) confidence += 20;
if(historicalFloodScore > 2) confidence += 20;

return Math.min(confidence,95);

}


/*
SUSCEPTIBILITY SCORE
*/

function calculateSusceptibilityScore(
elevation,
slope,
riverInfluenceScore,
coastalInfluenceScore,
soilFactor,
terrainRoughness,
urbanFloodFactor,
historicalFloodScore
){

let score = 0;

if(elevation < 120) score += 2;
else if(elevation < 300) score += 1;

if(elevation < 800){
if(slope < 1.5) score += 2;
else if(slope < 5) score += 1;
}
else{
if(slope < 1.5) score += 0.8;
}

if (elevation < 200)
score += riverInfluenceScore * 1.3;
else if (elevation < 600)
score += riverInfluenceScore * 0.8;
else
score += riverInfluenceScore * 0.4;

if (elevation < 200)
score += coastalInfluenceScore * 1.3;
else if (elevation < 600)
score += coastalInfluenceScore * 0.6;
else
score += coastalInfluenceScore * 0.2;

if (elevation < 800)
score += soilFactor * 0.4;
else
score += soilFactor * 0.2;

if (elevation < 800){
if(terrainRoughness < 8) score += 1.2;
else if(terrainRoughness < 20) score += 0.6;
}
else{
if(terrainRoughness < 8) score += 0.4;
}

if (urbanFloodFactor > 1)
score += urbanFloodFactor * 0.6;

if (historicalFloodScore > 1)
score += historicalFloodScore * 0.6;

return score;

}


/*
RAINFALL TRIGGER ENGINE
*/

function rainfallTriggerFactor(
rain_last_1h_peak,
rain_last_24h,
rain_last_72h,
rain_last_7days,
rain_next_72h
){

let factor = 0.3;

if(rain_last_1h_peak > 40) factor += 0.8;
else if(rain_last_1h_peak > 20) factor += 0.4;

if(rain_last_24h > 60) factor += 0.6;
else if(rain_last_24h > 25) factor += 0.3;

if(rain_last_72h > 120) factor += 0.6;
else if(rain_last_72h > 60) factor += 0.3;

if(rain_last_7days > 200) factor += 0.6;
else if(rain_last_7days > 100) factor += 0.3;

if(rain_next_72h > 80) factor += 0.6;
else if(rain_next_72h > 40) factor += 0.3;

return factor;

}


/*
MAIN PREDICTION ENGINE
*/

export const predictFloodFromCoords = async (req,res)=>{

try{

const { lat, lon } = req.query;


/*
CACHE CHECK
*/

const cachedPrediction =
await Flood.findOne({
latitude:Number(lat).toFixed(5),
longitude:Number(lon).toFixed(5)
});

let terrainData = null;

if(cachedPrediction){

console.log("Using cached terrain features");

terrainData = cachedPrediction;

}

if(!lat || !lon){

return res.status(400).json({
error:"Latitude & Longitude required"
});

}


/*
PARALLEL FEATURE FETCH
*/

let elevation, slope, soilFactor, terrainRoughness, urbanFloodFactor;

const rainData = await getRainForecast(lat, lon);

if(terrainData){

elevation = terrainData.elevation;
slope = terrainData.slope;
soilFactor = terrainData.soilFactor;
terrainRoughness = terrainData.terrainRoughness;
urbanFloodFactor = terrainData.urbanFloodFactor;

}else{

[
elevation,
slope,
soilFactor,
terrainRoughness,
urbanFloodFactor
] = await Promise.all([

getElevation(lat, lon),
calculateSlope(lat, lon),
getSoilFactor(lat, lon),
getTerrainRoughness(lat, lon),
getUrbanFloodFactor(lat, lon)

]);

}


/*
HYDROLOGY LOOKUP
*/

const distanceFromRiver =
await getDistanceFromRiver(lat,lon,elevation,slope);

const distanceFromSea =
await getDistanceFromSea(lat,lon,elevation);


/*
INFLUENCE SCORES
*/

const riverInfluenceScore =
getRiverInfluenceScore(distanceFromRiver);

const coastalInfluenceScore =
getCoastalInfluenceScore(distanceFromSea);


/*
HISTORICAL FLOOD MEMORY
*/

const historicalFloodScore =
await getHistoricalFloodScore(
lat,
lon,
elevation,
distanceFromRiver
);


/*
COMPUTE SUSCEPTIBILITY
*/

const susceptibilityScore =
calculateSusceptibilityScore(
elevation,
slope,
riverInfluenceScore,
coastalInfluenceScore,
soilFactor,
terrainRoughness,
urbanFloodFactor,
historicalFloodScore
);


/*
COMPUTE RAINFALL TRIGGER
*/

const triggerFactor =
rainfallTriggerFactor(
rainData.rain_last_1h_peak,
rainData.rain_last_24h,
rainData.rain_last_72h,
rainData.rain_last_7days,
rainData.rain_next_72h
);


/*
LEGACY PROBABILITY (kept for logging)
*/

const riskProbability =
Math.min(
Math.round(
susceptibilityScore * 10 +
triggerFactor * 25
),
95
);


/*
CONFIDENCE ENGINE
*/

const confidenceScore =
calculateConfidenceScore(
susceptibilityScore,
triggerFactor,
historicalFloodScore
);


/*
ML MODEL CLASSIFICATION
*/

const features = [

rainData.rain_last_1h_peak,
rainData.rain_last_24h,
rainData.rain_last_72h,
rainData.rain_last_7days,
rainData.rain_next_72h,

elevation,
slope,

distanceFromRiver,
distanceFromSea,

riverInfluenceScore,
coastalInfluenceScore,

soilFactor,
terrainRoughness,
urbanFloodFactor,

historicalFloodScore,

susceptibilityScore,
triggerFactor

];


const riskLevel = await new Promise((resolve,reject)=>{

execFile(
"python",
[
"ml-model/predict.py",
JSON.stringify(features)
],
(error,stdout)=>{

if(error){

console.error("ML prediction failed:",error);

reject(error);

return;

}

resolve(stdout.trim());

}

);

});


/*
STORE DATASET ROW
*/

await Flood.create({

latitude:Number(lat).toFixed(3),
longitude:Number(lon).toFixed(3),

...rainData,

elevation,
slope,

distanceFromRiver,
distanceFromSea,

riverInfluenceScore,
coastalInfluenceScore,

soilFactor,
terrainRoughness,
urbanFloodFactor,

historicalFloodScore,

susceptibilityScore,
triggerFactor,

riskProbability,
confidenceScore,

riskLevel

});


res.json({

...rainData,

elevation,
slope,

distanceFromRiver,
distanceFromSea,

riverInfluenceScore,
coastalInfluenceScore,

soilFactor,
terrainRoughness,
urbanFloodFactor,

historicalFloodScore,

susceptibilityScore,
triggerFactor,

riskProbability,
confidenceScore,

riskLevel

});

}

catch(error){

console.error(error);

res.status(500).json({
error:"Prediction failed"
});

}

};