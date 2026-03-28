import TerrainCache from "../modules/flood/terrainCache.model.js";

const memorySoilCache = new Map();


/*
INDIA SOIL FLOOD PERMEABILITY MODEL
Based on regional hydrology characteristics
*/

export const getSoilFactor =
async (lat, lon) => {

lat = Number(Number(lat).toFixed(3));
lon = Number(Number(lon).toFixed(3));

const key = `${lat},${lon}`;


/*
STEP 1 — MEMORY CACHE
*/

if(memorySoilCache.has(key))
return memorySoilCache.get(key);


/*
STEP 2 — DATABASE CACHE
*/

const cached =
await TerrainCache.findOne({ lat, lon });

if(cached?.soilFactor !== undefined){

memorySoilCache.set(
key,
cached.soilFactor
);

return cached.soilFactor;

}


/*
STEP 3 — INDIA SOIL ZONE MODEL
Hydrologically meaningful approximation
*/

let soilFactor;


/*
HIMALAYAN BELT (rocky / steep runoff)
*/

if(lat > 30){

soilFactor = 0.9;

}
/*
THAR DESERT ZONE
very high infiltration
low runoff
*/

else if(lat > 24 && lat < 29 && lon < 73){

soilFactor = 0.8;

}

/*
CENTRAL INDIA (clay-loam dominant)
MP / Bhopal / Sehore region
HIGH runoff risk
*/

else if(lat > 23 && lat <= 30 && lon > 74){
soilFactor = 1.2;

}


/*
DECCAN BASALT ZONE
moderate permeability
*/

else if(lat > 15 && lat <= 21){

soilFactor = 1.1;

}


/*
COASTAL ALLUVIAL SOIL
lower runoff risk
*/

else{

soilFactor = 1.0;

}


/*
STEP 4 — CACHE RESULT
*/

memorySoilCache.set(key, soilFactor);


await TerrainCache.findOneAndUpdate(

{ lat, lon },

{ soilFactor },

{ upsert: true }

);


return soilFactor;

};