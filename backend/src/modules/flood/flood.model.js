import mongoose from "mongoose";

const floodSchema =
new mongoose.Schema({

latitude:Number,
longitude:Number,

rain_last_1h_peak:Number,
rain_last_24h:Number,
rain_last_72h:Number,
rain_last_7days:Number,
rain_next_72h:Number,

elevation:Number,
slope:Number,

distanceFromRiver:Number,
distanceFromSea:Number,

riverInfluenceScore:Number,
coastalInfluenceScore:Number,

soilFactor:Number,
terrainRoughness:Number,
urbanFloodFactor:Number,

historicalFloodScore:Number,

susceptibilityScore:Number,
triggerFactor:Number,

riskProbability:Number,
confidenceScore:Number,

riskLevel:String,

createdAt:{
type:Date,
default:Date.now
}

});

export default mongoose.model(
"Flood",
floodSchema
);