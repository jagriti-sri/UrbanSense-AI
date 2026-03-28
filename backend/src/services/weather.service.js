import RainfallCache from "../modules/flood/rainfallCache.model.js";

import {
getForecastRainfall
} from "./nasaRainfall.service.js";


const CACHE_DURATION =
6 * 60 * 60 * 1000;


/*
OPEN-METEO HISTORICAL RAINFALL
(last 72h)
*/

const getOpenMeteoPastRainfall =
async (lat, lon) => {

try{

const today =
new Date();

const end =
today.toISOString().split("T")[0];

const start =
new Date(today);

start.setDate(today.getDate()-3);

const startDate =
start.toISOString().split("T")[0];


const url =
`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${end}&daily=precipitation_sum&timezone=auto`;


const response =
await fetch(url);

const data =
await response.json();


const rainfall =
data?.daily?.precipitation_sum ?? [];


/*
SAFE SUM
*/

const totalRainfall =
rainfall.reduce(
(a,b)=>a+b,
0
);


/*
REMOVE MICRO-NOISE (<2mm considered dry)
*/

return totalRainfall < 2
? 0
: Number(totalRainfall.toFixed(2));

}

catch(err){

console.log(
"OpenMeteo rainfall failed"
);

return 0;

}

};



/*
MAIN SERVICE
*/

export const getRainForecast =
async (lat, lon) => {

lat =
Number(lat.toFixed(3));

lon =
Number(lon.toFixed(3));


/*
STEP 1 — CACHE CHECK
*/

const cached =
await RainfallCache.findOne({ lat, lon });

if(

cached &&

Date.now() -
cached.updatedAt
< CACHE_DURATION

){

console.log(
"Using cached rainfall"
);

return cached.data;

}


/*
STEP 2 — FETCH LIVE DATA
*/

let rain_last_72h =
await getOpenMeteoPastRainfall(lat, lon);


/*
FORECAST RAINFALL
*/

let rain_next_72h =
await getForecastRainfall(lat, lon);

rain_next_72h =
Number(rain_next_72h.toFixed(2));


/*
STEP 3 — DERIVED VALUES
*/

let rain_last_24h =
Number(
(rain_last_72h * 0.4)
.toFixed(2)
);

if(rain_last_24h < 1)
rain_last_24h = 0;


let rain_last_7days =
Number(
(rain_last_72h * 1.8)
.toFixed(2)
);

if(rain_last_7days < 1)
rain_last_7days = 0;



/*
STEP 4 — PACKAGE OUTPUT
*/

const rainfallData = {

rain_last_1h_peak: 0,

rain_last_24h,

rain_last_72h,

rain_last_7days,

rain_next_72h

};


/*
STEP 5 — CACHE STORE
*/

await RainfallCache.findOneAndUpdate(

{ lat, lon },

{

lat,
lon,

data: rainfallData,

updatedAt: Date.now()

},

{ upsert:true }

);


console.log(
"OpenMeteo rainfall fetched"
);


return rainfallData;

};