import RainfallCache from "../modules/flood/rainfallCache.model.js";


/*
FETCH WITH TIMEOUT
*/

const fetchWithTimeout = async (url, timeout = 20000) => {

return Promise.race([

fetch(url),

new Promise((_, reject) =>
setTimeout(() => reject("NASA rainfall timeout"), timeout)
)

]);

};



/*
PAST 72H RAINFALL (NASA)
*/

export const getNASARainfallAccumulation =
async (lat, lon) => {

lat = Number(lat.toFixed(3));
lon = Number(lon.toFixed(3));


/*
CHECK CACHE FIRST
*/

const cached =
await RainfallCache.findOne({ lat, lon });

if (cached) {

const ageHours =
(Date.now() - new Date(cached.timestamp)) / (1000 * 60 * 60);


/*
CACHE VALID FOR 6 HOURS
*/

if (ageHours < 6) {

console.log("Using cached rainfall");

return cached.rainfall;

}

}


try {

const today = new Date();

const formatDate = (date) =>
date
.toISOString()
.split("T")[0]
.replace(/-/g, "");


const endDate =
formatDate(today);


const start =
new Date(today);

start.setDate(today.getDate() - 3);


const startDate =
formatDate(start);


const url =
`https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOT&community=RE&longitude=${lon}&latitude=${lat}&format=JSON&start=${startDate}&end=${endDate}`;


const response =
await fetchWithTimeout(url);


const data =
await response.json();


const rainfallValues =
data?.properties?.parameter?.PRECTOT
? Object.values(data.properties.parameter.PRECTOT)
: [];


const totalRainfall =
rainfallValues.length
? rainfallValues.reduce((a,b)=>a+b,0)
: 0;


/*
SAVE CACHE
*/

await RainfallCache.findOneAndUpdate(

{ lat, lon },

{
lat,
lon,
rainfall: totalRainfall,
timestamp: new Date()
},

{ upsert: true }

);


console.log(
"NASA rainfall fetched:",
totalRainfall,
"mm"
);


return totalRainfall ?? 0;

}


catch(err){

console.log("Using NASA rainfall baseline estimate", err.message);

if (cached) {

return cached.rainfall;

}


return 12;

}

};



/*
FORECAST NEXT 72H (OPEN-METEO)
*/

export const getForecastRainfall =
async (lat, lon) => {

lat = Number(lat.toFixed(3));
lon = Number(lon.toFixed(3));


try {

const url =
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation&forecast_days=3`;


const response =
await fetch(url);


const data =
await response.json();


const rainfallArray =
data.hourly.precipitation || [];


const totalForecastRainfall =
rainfallArray.reduce((a, b) => a + b, 0);


console.log(
"Forecast rainfall next 72h:",
totalForecastRainfall,
"mm"
);


return totalForecastRainfall ?? 0;

}


catch (err) {

console.log(
"Forecast rainfall fetch failed"
);

return 0;

}

};