import Flood from "./flood.model.js";
import { execFile } from "child_process";

import { getRainForecast } from "../../services/weather.service.js";
import generatePrediction from "../../services/predictionEngine.service.js";

import {
getRiverInfluenceScore
} from "../../services/river.service.js";

import {
getCoastalInfluenceScore
} from "../../services/coastal.service.js";

import {
getNASARainfallAccumulation,
getForecastRainfall
}
from "../../services/nasaRainfall.service.js";
console.log("Rainfall service loaded");


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

}else{

if(slope < 1.5) score += 0.8;

}


score += riverInfluenceScore * 0.8;
score += coastalInfluenceScore * 0.6;
score += (soilFactor - 1) * 0.4;


if(terrainRoughness < 8) score += 1.2;
else if(terrainRoughness < 20) score += 0.6;


if(urbanFloodFactor > 1)
score += urbanFloodFactor * 0.6;


if(historicalFloodScore > 1)
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



}

/*
MAIN PREDICTION ENGINE
*/

export const predictFloodFromCoords = async (req, res) => {

try {

const lat = Number(req.query.lat);
const lon = Number(req.query.lon);

let fallbackCount = 0;


/*
STEP 1 — RAINFALL
*/

const rainData =
await getRainForecast(lat, lon) || {

rain_last_1h_peak: 0,
rain_last_24h: 0,
rain_last_72h: 0,
rain_last_7days: 0,
rain_next_72h: 0

};


/*
STEP 2 — TERRAIN INTELLIGENCE
*/

const terrain =
await generatePrediction(lat, lon) || {};

const elevation =
terrain.elevation ?? 250;

const slope =
terrain.slope ?? 3;

const soilFactor =
terrain.soilFactor ?? 1;

const urbanFloodFactor =
terrain.urbanFloodFactor ?? 1;

const historicalFloodScore =
terrain.historicalFloodScore ?? 0;

const distanceFromRiver =
terrain.distanceFromRiver ?? 12;

const distanceFromSea =
terrain.distanceFromSea ?? 999;


/*
STEP 3 — INFLUENCE SCORES
*/

const riverInfluenceScore =
getRiverInfluenceScore(distanceFromRiver);

const coastalInfluenceScore =
getCoastalInfluenceScore(distanceFromSea);


/*
STEP 4 — TERRAIN ROUGHNESS
*/

const terrainRoughness =
Math.abs(slope * 6);


/*
STEP 5 — SUSCEPTIBILITY SCORE
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

) || 0;


/*
STEP 6 — RAIN TRIGGER
*/

const triggerFactor =
rainfallTriggerFactor(

rainData.rain_last_1h_peak ?? 0,
rainData.rain_last_24h ?? 0,
rainData.rain_last_72h ?? 0,
rainData.rain_last_7days ?? 0,
rainData.rain_next_72h ?? 0

) || 0;


/*
STEP 7 — FINAL PROBABILITY
*/

const riskProbability = Math.min(

Math.round(
(susceptibilityScore * 10) +
(triggerFactor * 25)
),

95

);


/*
STEP 8 — CONFIDENCE SCORE
*/

const confidenceScore =
calculateConfidenceScore(

susceptibilityScore,
triggerFactor,
historicalFloodScore

) || 50;


/*
STEP 9 — CLASSIFICATION
*/

let riskLevel = "LOW";

if (riskProbability >= 70)
riskLevel = "HIGH";

else if (riskProbability >= 40)
riskLevel = "MEDIUM";


/*
STEP 10 — SAVE DATASET
*/

await Flood.create({

latitude: lat.toFixed(3),
longitude: lon.toFixed(3),

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

let dataConfidenceLevel = "HIGH";

if (fallbackCount >= 3) {

dataConfidenceLevel = "LIMITED";

}

else if (fallbackCount >= 1) {

dataConfidenceLevel = "MODERATE";

}
/*
STEP 11 — RESPONSE
*/

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

riskLevel,

dataConfidenceLevel

});

}

catch(error){

console.error(error);

res.status(500).json({
error: "Prediction failed"
});

}

};