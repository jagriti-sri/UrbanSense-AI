const OVERPASS =
"https://overpass.kumi.systems/api/interpreter";


export const getDistanceFromSea =
async (lat, lon, elevation) => {

try {

const query = `
[out:json][timeout:20];
(
way["natural"="water"]["water"="sea"](around:60000,${lat},${lon});
relation["natural"="water"]["water"="sea"](around:60000,${lat},${lon});
node["place"="sea"](around:60000,${lat},${lon});
);
out center;
`;

const response =
await fetch(

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

const lat2 =
element.lat ??
element.center?.lat;

const lon2 =
element.lon ??
element.center?.lon;

if(!lat2 || !lon2) continue;

const d = Math.sqrt(

(lat-lat2)**2 +

(lon-lon2)**2

)*111;

if(d < minDistance)
minDistance = d;

}

return minDistance;

}

}
catch{}


/*
fallback coastal estimator
*/

if(elevation < 30)
return 10;

if(elevation < 80)
return 40;

if(elevation < 150)
return 90;

return 999;

};



export function getCoastalInfluenceScore(distance){

if(distance < 20) return 3;

if(distance < 80) return 2;

if(distance < 150) return 1;

return 0;

}