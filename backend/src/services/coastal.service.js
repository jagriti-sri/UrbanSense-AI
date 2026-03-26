export const getDistanceFromSea = async (lat, lon) => {

try {

const query = `
[out:json];
(
way["natural"="coastline"](around:5000,${lat},${lon});
);
out center;
`;

const response =
await fetch(
"https://overpass-api.de/api/interpreter",
{
method:"POST",
body:query
});

const data =
await response.json();

if(!data.elements?.length)
return 999;


const element =
data.elements[0];

const distance =
Math.sqrt(
(lat-element.center.lat)**2 +
(lon-element.center.lon)**2
)*111;

return distance;

}

catch {

return 999;

}

};


export function getCoastalInfluenceScore(distance){

if(distance < 1) return 3;

if(distance < 3) return 2;

if(distance < 7) return 1;

return 0;

}