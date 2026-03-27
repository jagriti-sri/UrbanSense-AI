const OVERPASS =
"https://overpass.kumi.systems/api/interpreter";


export const getDistanceFromRiver =
async (lat, lon, elevation, slope) => {

try {

const query = `
[out:json][timeout:20];
(
way["waterway"="river"](around:20000,${lat},${lon});
relation["waterway"="river"](around:20000,${lat},${lon});
);
out center;
`;

const response = await fetch(

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


if(data.elements?.length){

let minDistance = Infinity;

for(const element of data.elements){

if(!element.center) continue;

const d = Math.sqrt(

(lat - element.center.lat)**2 +

(lon - element.center.lon)**2

)*111;

if(d < minDistance)
minDistance = d;

}

return minDistance;

}

}
catch{}


/*
fallback estimator (runs only if API fails)
*/

if(elevation < 120 && slope < 2)
return 2;

if(elevation < 250 && slope < 4)
return 6;

if(elevation < 400 && slope < 6)
return 15;

return 999;

};



export function getRiverInfluenceScore(distance){

if(distance < 2) return 3;

if(distance < 8) return 2;

if(distance < 20) return 1;

return 0;

}