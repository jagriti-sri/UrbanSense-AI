import mongoose from "mongoose";

import generatePrediction
from "../src/services/predictionEngine.service.js";

import dotenv from "dotenv";

dotenv.config();


/*
CONNECT TO MONGODB FIRST
*/

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB connected");


/*
LOCATIONS TO PRE-CACHE
*/

const demoLocations = [

[23.2599,77.4126], // MANIT

[23.2399,77.3546], // Upper Lake

[23.2324,77.4321], // MP Nagar

[23.2000,77.0833], // Sehore Bus Stand

[23.1800,76.8500]  // VIT Sehore

];


/*
RUN CACHE WARMUP
*/

(async ()=>{

for(const loc of demoLocations){

console.log("Caching:",loc);

await generatePrediction(
loc[0],
loc[1]
);

}

console.log("Cache warm complete");

process.exit();

})();