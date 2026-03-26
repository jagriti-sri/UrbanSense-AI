import Flood from "./flood.model.js";

import { getRainForecast }
from "../../services/weather.service.js";

import { calculateSlope }
from "../../services/terrain.service.js";

import { getSoilFactor }
from "../../services/soil.service.js";

import { getTerrainRoughness }
from "../../services/roughness.service.js";

import { getUrbanFloodFactor }
from "../../services/urban.service.js";

import {
getDistanceFromRiver,
getRiverInfluenceScore
}
from "../../services/river.service.js";

import {
getDistanceFromSea,
getCoastalInfluenceScore
}
from "../../services/coastal.service.js";

import {
getHistoricalFloodScore
}
from "../../services/historicalFlood.service.js";


async function getElevation(lat, lon){

try{

const response =
await fetch(
`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`
);

const data =
await response.json();

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


if(susceptibilityScore > 6)
confidence += 20;


if(triggerFactor > 1)
confidence += 20;


if(historicalFloodScore > 2)
confidence += 20;


if(confidence > 95)
confidence = 95;


return confidence;

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


if(elevation < 150) score += 2;
else if(elevation < 400) score += 1;


if(slope < 2) score += 2;
else if(slope < 6) score += 1;


score += riverInfluenceScore;

score += coastalInfluenceScore;

score += soilFactor;

score += historicalFloodScore;


if(terrainRoughness < 10) score += 2;
else if(terrainRoughness < 25) score += 1;


score += urbanFloodFactor;


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

export async function generatePredictionFromCoords(lat, lon){

const rainData =
await getRainForecast(lat,lon);

const elevation =
await getElevation(lat,lon);

const slope =
await calculateSlope(lat,lon);

const distanceFromRiver =
await getDistanceFromRiver(lat,lon);

const riverInfluenceScore =
getRiverInfluenceScore(distanceFromRiver);

const distanceFromSea =
await getDistanceFromSea(lat,lon);

const coastalInfluenceScore =
getCoastalInfluenceScore(distanceFromSea);

const soilFactor =
await getSoilFactor(lat,lon);

const terrainRoughness =
await getTerrainRoughness(lat,lon);

const urbanFloodFactor =
await getUrbanFloodFactor(lat,lon);

const historicalFloodScore =
await getHistoricalFloodScore(
lat,
lon,
elevation,
distanceFromRiver
);

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

const triggerFactor =
rainfallTriggerFactor(

rainData.rain_last_1h_peak,
rainData.rain_last_24h,
rainData.rain_last_72h,
rainData.rain_last_7days,
rainData.rain_next_72h

);

const riskProbability =
Math.min(
Math.round(
susceptibilityScore *
triggerFactor *
10
),
95
);

const confidenceScore =
calculateConfidenceScore(

susceptibilityScore,
triggerFactor,
historicalFloodScore

);

const riskLevel =

riskProbability >= 70
? "HIGH"
: riskProbability >= 40
? "MEDIUM"
: "LOW";


return {

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

};

}

export const predictFloodFromCoords =
async (req,res)=>{

try{

const { lat, lon } = req.query;


if(!lat || !lon)
return res.status(400).json({
error:"Latitude & Longitude required"
});


const rainData =
await getRainForecast(lat,lon);


const elevation =
await getElevation(lat,lon);


const slope =
await calculateSlope(lat,lon);


const distanceFromRiver =
await getDistanceFromRiver(lat,lon);


const riverInfluenceScore =
getRiverInfluenceScore(distanceFromRiver);


const distanceFromSea =
await getDistanceFromSea(lat,lon);


const coastalInfluenceScore =
getCoastalInfluenceScore(distanceFromSea);


const soilFactor =
await getSoilFactor(lat,lon);


const terrainRoughness =
await getTerrainRoughness(lat,lon);


const urbanFloodFactor =
await getUrbanFloodFactor(lat,lon);


const historicalFloodScore =
await getHistoricalFloodScore(
lat,
lon,
elevation,
distanceFromRiver
);


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


const triggerFactor =
rainfallTriggerFactor(

rainData.rain_last_1h_peak,
rainData.rain_last_24h,
rainData.rain_last_72h,
rainData.rain_last_7days,
rainData.rain_next_72h

);


const riskProbability =
Math.min(
Math.round(
susceptibilityScore *
triggerFactor *
10
),
95
);


const confidenceScore =
calculateConfidenceScore(

susceptibilityScore,
triggerFactor,
historicalFloodScore

);


const riskLevel =

riskProbability >= 70
? "HIGH"
: riskProbability >= 40
? "MEDIUM"
: "LOW";


await Flood.create({

latitude:lat,
longitude:lon,

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