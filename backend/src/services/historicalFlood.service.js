export const getHistoricalFloodScore =
async (lat, lon, elevation, riverDistance) => {

try{

let score = 0;


/*
LOW ELEVATION FLOODPLAINS
*/

if(elevation < 120)
score += 2;


/*
RIVER FLOODPLAIN PROXIMITY
*/

if(riverDistance < 1)
score += 2;

else if(riverDistance < 3)
score += 1;


/*
CHECK FLOODPLAIN TAGS FROM OSM
*/

const query = `
[out:json];
(
way["flood_prone"](around:2000,${lat},${lon});
relation["flood_prone"](around:2000,${lat},${lon});
);
out body;
`;

const response =
await fetch(
"https://overpass-api.de/api/interpreter",
{
method:"POST",
body:query
}
);

const data =
await response.json();


if(data.elements.length > 0)
score += 2;


/*
FINAL LIMIT
*/

if(score > 4)
score = 4;


return score;

}

catch{

return 1;

}

};