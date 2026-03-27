import nlp from "compromise";


/*
Extract coordinates from query
*/

export function extractCoordinates(query){

const coordRegex =
/(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/;

const match = query.match(coordRegex);

if(match){

return {

lat: parseFloat(match[1]),
lon: parseFloat(match[2])

};

}

return null;

}


/*
Extract city name from query
*/

export function extractCity(query){

const doc = nlp(query);

const places = doc.places().out("array");

return places.length ? places[0] : null;

}


/*
Extract time intent
*/

export function extractTimeIntent(query){

query = query.toLowerCase();

if(query.includes("tomorrow"))
return "tomorrow";

if(query.includes("week"))
return "week";

if(query.includes("today"))
return "today";

return "now";

}

export function extractGoogleMapsCoords(query){

const regex =
/(?:google\.com\/maps.*?[?&]q=)(-?\d+\.\d+),(-?\d+\.\d+)/;

const match = query.match(regex);

if(match){

return {

lat: parseFloat(match[1]),
lon: parseFloat(match[2])

};

}

return null;

}