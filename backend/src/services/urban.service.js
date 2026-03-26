export const getUrbanFloodFactor = async (lat, lon) => {

try {

const radius = 500;


/*
COUNT BUILDINGS
*/

const buildingQuery = `
[out:json];
(
way["building"](around:${radius},${lat},${lon});
);
out body;
`;

const buildingResponse =
await fetch(
"https://overpass-api.de/api/interpreter",
{
method:"POST",
body:buildingQuery
}
);

const buildingData =
await buildingResponse.json();

const buildingCount =
buildingData.elements.length;


/*
COUNT ROADS
*/

const roadQuery = `
[out:json];
(
way["highway"](around:${radius},${lat},${lon});
);
out body;
`;

const roadResponse =
await fetch(
"https://overpass-api.de/api/interpreter",
{
method:"POST",
body:roadQuery
}
);

const roadData =
await roadResponse.json();

const roadCount =
roadData.elements.length;


/*
CHECK DRAINAGE PRESENCE
*/

const drainQuery = `
[out:json];
(
way["waterway"="drain"](around:${radius},${lat},${lon});
);
out body;
`;

const drainResponse =
await fetch(
"https://overpass-api.de/api/interpreter",
{
method:"POST",
body:drainQuery
}
);

const drainData =
await drainResponse.json();

const drainCount =
drainData.elements.length;


/*
SURFACE RUNOFF INDEX
*/

let runoffScore = 0;


/*
BUILDING DENSITY EFFECT
*/

if(buildingCount > 80)
runoffScore += 2;

else if(buildingCount > 30)
runoffScore += 1;


/*
ROAD DENSITY EFFECT
*/

if(roadCount > 60)
runoffScore += 2;

else if(roadCount > 20)
runoffScore += 1;


/*
DRAINAGE REDUCES FLOOD RISK
*/

if(drainCount > 5)
runoffScore -= 1;


/*
MINIMUM SAFE VALUE
*/

if(runoffScore < 0)
runoffScore = 0;


return runoffScore;

}

catch {

return 1;

}

};