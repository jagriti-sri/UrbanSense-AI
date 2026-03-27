import axios from "axios";

import {
extractCoordinates,
extractTimeIntent,
extractGoogleMapsCoords,
extractCity
}
from "../../services/nlp.service.js";


/*
REMOVE NON-GEOGRAPHIC WORDS
Improves geocoder accuracy
*/

function normalizePlaceQuery(query){

return query
.replace(/check\s*flood\s*risk\s*near/i,"")
.replace(/check\s*flood\s*risk/i,"")
.replace(/flood\s*risk/i,"")
.replace(/\bnear\b/i,"")
.replace(/\bcampus\b/i,"")
.replace(/\barea\b/i,"")
.replace(/\bzone\b/i,"")
.replace(/\bmarket\b/i,"")
.replace(/\broad\b/i,"")
.replace(/\btemple\b/i,"")
.replace(/\bcolony\b/i,"")
.replace(/\bjunction\b/i,"")
.replace(/\bstation\b/i,"")
.replace(/\bsector\b/i,"")
.replace(/\bblock\b/i,"")
.trim();

}


/*
EXPAND COMMON INSTITUTION ALIASES
*/

function expandInstitutionAliases(place){

const aliases = {

"manit bhopal":
"Maulana Azad National Institute of Technology Bhopal India",

"vit bhopal":
"VIT Bhopal University Sehore Madhya Pradesh India",

"aiims bhopal":
"AIIMS Bhopal India",

"mp nagar":
"Maharana Pratap Nagar Bhopal India",

"new market bhopal":
"New Market TT Nagar Bhopal India"

};

const lower = place.toLowerCase();

for(const key in aliases){

if(lower.includes(key)){

return aliases[key];

}

}

return place;

}


/*
Detect abbreviation-only queries
Triggers warning ONLY if abbreviation exists WITHOUT city
*/

function detectAmbiguousInstitution(query){

const abbreviations = [
"iit",
"nit",
"aiims",
"manit",
"vit"
];

const lower = query.toLowerCase();

const foundAbbreviation =
abbreviations.find(abbr =>
lower.includes(abbr)
);

if(!foundAbbreviation){
return null;
}

const detectedCity = extractCity(query);

if(detectedCity){
return null;
}

return foundAbbreviation.toUpperCase();

}


/*
SMART MULTI-ATTEMPT GEOCODER
*/

async function getLocationCoordinates(place, query){

try{

const attempts = [place];

const detectedCity = extractCity(query);

if(detectedCity){

attempts.push(`${place}, ${detectedCity}`);

}

attempts.push(`${place}, India`);

for(const attempt of attempts){

const response = await fetch(

`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(attempt)}&format=json&limit=5&countrycodes=in`,

{
headers:{
"User-Agent":"UrbanSense-AI Flood Prediction System"
}
}

);

if(!response.ok) continue;

const data = await response.json();

if(!data.length) continue;

const lowerPlace = place.toLowerCase();

let bestMatch = data.find(item =>
item.display_name.toLowerCase().includes(lowerPlace)
);

if(!bestMatch){

bestMatch = data[0];

}

return {

lat: parseFloat(bestMatch.lat),
lon: parseFloat(bestMatch.lon)

};

}

return null;

}

catch(error){

console.log("Geocoder error:", error.message);

return null;

}

}


/*
NLP FLOOD QUERY HANDLER
*/

export const handleFloodQuery = async(req,res)=>{

try{

const { query } = req.query;

if(!query){

return res.status(400).json({
error:"Query required"
});

}


/*
HANDLE "NEAR ME"
Frontend will send coordinates later
*/

if(
query.toLowerCase().includes("near me") ||
query.toLowerCase().includes("my location")
){

return res.json({
useBrowserLocation:true
});

}


/*
STEP 1
Extract coordinates if present
*/

let coords =
extractGoogleMapsCoords(query) ||
extractCoordinates(query);


/*
Track fallback usage
*/

let usedFallback = false;


/*
Normalize place text
*/

let placeQuery =
normalizePlaceQuery(query);


/*
Expand known aliases
*/

placeQuery =
expandInstitutionAliases(placeQuery);


/*
STEP 2
Exact location lookup
*/

if(!coords){

const exactCoords =
await getLocationCoordinates(placeQuery, query);

if(exactCoords){

coords = exactCoords;

}

}


/*
STEP 3
Fallback to city ONLY if exact lookup failed
*/

if(!coords){

const fallbackCity =
extractCity(query);

if(fallbackCity){

const fallbackCoords =
await getLocationCoordinates(fallbackCity, query);

if(fallbackCoords){

coords = fallbackCoords;

usedFallback = true;

}

}

}


/*
STEP 4
Still unresolved
*/

if(!coords){

return res.json({

message:
"Location not recognized. Please provide city or coordinates."

});

}


/*
STEP 5
Extract time intent
*/

const timeIntent =
extractTimeIntent(query);


/*
STEP 6
Call prediction engine
*/

const predictionResponse =
await axios.get(
`http://localhost:5000/api/flood/predict?lat=${coords.lat}&lon=${coords.lon}`
);


/*
STEP 7
Return structured response
*/

const ambiguous =
detectAmbiguousInstitution(query);

res.json({

query,
timeIntent,
location: coords,
prediction: predictionResponse.data,

message:
usedFallback && ambiguous
? `Approximate prediction shown for ${extractCity(query)}. For precise results specify full institute name (example: ${ambiguous} ${extractCity(query)}).`
: undefined

});

}

catch(error){

console.error(error);

res.status(500).json({

error:"NLP prediction failed"

});

}

};