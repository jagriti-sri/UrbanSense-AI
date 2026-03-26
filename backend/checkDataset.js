import mongoose from "mongoose";
import dotenv from "dotenv";

import Flood from "./src/modules/flood/flood.model.js";

dotenv.config();

async function checkDataset(){

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB connected ✅");


const missingTerrain =
await Flood.countDocuments({
terrainRoughness:{ $exists:false }
});

const missingUrban =
await Flood.countDocuments({
urbanFloodFactor:{ $exists:false }
});

const missingConfidence =
await Flood.countDocuments({
confidenceScore:{ $exists:false }
});


console.log("Missing terrainRoughness:", missingTerrain);

console.log("Missing urbanFloodFactor:", missingUrban);

console.log("Missing confidenceScore:", missingConfidence);


process.exit();

}

checkDataset();