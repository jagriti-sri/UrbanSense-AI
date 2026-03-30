import TerrainCache from "../modules/flood/terrainCache.model.js";

const OVERPASS =
"https://overpass.kumi.systems/api/interpreter";

const memorySeaCache =
new Map();


const fetchWithTimeout =
async(url,options={},timeout=5000)=>{

return Promise.race([

fetch(url,options),

new Promise((_,reject)=>
setTimeout(
()=>reject(new Error("Sea timeout")),
timeout
))

]);

};


export const getDistanceFromSea =
async(lat,lon,elevation)=>{

lat=Number(lat.toFixed(3));
lon=Number(lon.toFixed(3));

const key=`${lat},${lon}`;


/* MEMORY CACHE */

if(memorySeaCache.has(key))
return memorySeaCache.get(key);


/* DATABASE CACHE */

const cached=
await TerrainCache.findOne({lat,lon});

if(cached?.distanceFromSea!==undefined){

memorySeaCache.set(
key,
cached.distanceFromSea
);

return cached.distanceFromSea;

}


/* API CALL */

try{

const query=`
[out:json][timeout:20];
(
way["natural"="water"]["water"="sea"](around:70000,${lat},${lon});
relation["natural"="water"]["water"="sea"](around:70000,${lat},${lon});
node["place"="sea"](around:70000,${lat},${lon});
);
out center;
`;

const response=
await fetchWithTimeout(

OVERPASS,

{
method:"POST",
headers:{
"Content-Type":
"application/x-www-form-urlencoded"
},
body:"data="+encodeURIComponent(query)
}

);

const data=
await response.json();


if(data?.elements?.length){

let minDistance=Infinity;

for(const el of data.elements){

const lat2=
el.lat??el.center?.lat;

const lon2=
el.lon??el.center?.lon;

if(!lat2||!lon2) continue;

const d=Math.sqrt(

(lat-lat2)**2+
(lon-lon2)**2

)*111;

if(d<minDistance)
minDistance=d;

}

memorySeaCache.set(key,minDistance);

await TerrainCache.findOneAndUpdate(

{lat,lon},

{distanceFromSea:minDistance},

{upsert:true}

);

return minDistance;

}

}catch(e){

console.log(
"Using elevation-based coastal influence estimate",
e?.message || e
);
}


/* FALLBACK MODEL */

let fallbackDistance = 999;

if(elevation<30)
fallbackDistance = 10;

else if(elevation<80)
fallbackDistance = 40;

else if(elevation<150)
fallbackDistance = 90;


memorySeaCache.set(key,fallbackDistance);

await TerrainCache.findOneAndUpdate(

{lat,lon},

{distanceFromSea:fallbackDistance},

{upsert:true}

);

return fallbackDistance;

};


export function getCoastalInfluenceScore(distance){

if(distance<20) return 3;
if(distance<80) return 2;
if(distance<150) return 1;

return 0;

}