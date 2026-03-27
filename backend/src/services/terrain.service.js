const slopeCache = new Map();

/*
Utility delay function
Prevents Open-Elevation API rate limiting
*/
const sleep = (ms) =>
new Promise(resolve => setTimeout(resolve, ms));


/*
Terrain slope calculation using nearby elevation sampling
Returns slope in degrees
Rate-limit safe + cached + production-ready
*/

export const calculateSlope = async (lat, lon) => {

const cacheKey =
`${Number(lat).toFixed(4)},${Number(lon).toFixed(4)}`;


// return cached value if already calculated
if (slopeCache.has(cacheKey)) {

return slopeCache.get(cacheKey);

}


try {

/*
sampling offset (~200m grid)
smaller grid = more stable slope
*/

const offset = 0.002;


/*
approx distance between sampling points
*/

const approxDistanceMeters = 220;


/*
5 sampling points:
center + N + S + E + W
*/

const points = [

{ lat, lon },

{ lat: lat + offset, lon },

{ lat: lat - offset, lon },

{ lat, lon: lon + offset },

{ lat, lon: lon - offset }

];


const locations =
points.map(p => `${p.lat},${p.lon}`).join("|");


const url =
`https://api.open-elevation.com/api/v1/lookup?locations=${locations}`;


/*
delay to prevent rate-limit
*/

await sleep(450);


/*
retry logic
*/

let response = null;

for (let i = 0; i < 3; i++) {

response = await fetch(url);

if (response.ok) break;

await sleep(700);

}


/*
if still failed after retries
use adaptive fallback slope
*/

if (!response || !response.ok) {

console.log("Slope API failed — adaptive fallback used");

const fallbackSlope = adaptiveSlopeFallback(lat);

slopeCache.set(cacheKey, fallbackSlope);

return fallbackSlope;

}


const data = await response.json();


/*
validate response completeness
*/

if (!data?.results || data.results.length < 5) {

console.log("Incomplete elevation response — fallback slope used");

const fallbackSlope = adaptiveSlopeFallback(lat);

slopeCache.set(cacheKey, fallbackSlope);

return fallbackSlope;

}


/*
safe elevation extraction
*/

const elevations =
data.results.map(r => r?.elevation ?? 300);


const centerElevation = elevations[0];

let slopeSum = 0;


/*
compute slope difference
*/

for (let i = 1; i < elevations.length; i++) {

const elevationDiff =
Math.abs(centerElevation - elevations[i]);

const slopeRadians =
Math.atan(elevationDiff / approxDistanceMeters);

const slopeDegrees =
slopeRadians * (180 / Math.PI);

slopeSum += slopeDegrees;

}


const avgSlope = slopeSum / 4;


/*
cache computed slope
*/

slopeCache.set(cacheKey, avgSlope);

return avgSlope;

}


/*
catch block fallback
*/

catch (error) {

console.log("Slope calculation failed — fallback slope used:", error.message);

const fallbackSlope = adaptiveSlopeFallback(lat);

slopeCache.set(cacheKey, fallbackSlope);

return fallbackSlope;

}

};


/*
Adaptive fallback slope estimator
Uses latitude-based terrain heuristics
*/

function adaptiveSlopeFallback(lat) {

/*
rough terrain likelihood increases toward Himalayas
simple geographic heuristic
*/

if (lat > 32) return 7;

if (lat > 28) return 5;

if (lat > 22) return 3;

return 2;

}