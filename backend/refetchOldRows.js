import mongoose from "mongoose";
import dotenv from "dotenv";

import Flood from "./src/modules/flood/flood.model.js";

import {
generatePredictionFromCoords
} from "./src/modules/flood/flood.controller.js";

dotenv.config();


async function regenerateDataset(){

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB connected ✅");


const rows = await Flood.find({});

console.log("Rows found:", rows.length);


for(const row of rows){

if(!row.latitude || !row.longitude){

console.log("Skipping:", row._id);

continue;

}


const updatedData =
await generatePredictionFromCoords(
row.latitude,
row.longitude
);


await Flood.updateOne(
{ _id: row._id },
{ $set: updatedData }
);


console.log("Updated:", row._id);

}


console.log("Dataset regeneration complete ✅");

process.exit();

}


regenerateDataset();