import mongoose from "mongoose";

const terrainCacheSchema = new mongoose.Schema(
{
    lat: Number,
    lon: Number,

    elevation: Number,
    slope: Number,

    distanceFromRiver: Number,
    riverInfluenceScore: Number,

    distanceFromSea: Number,
    coastalInfluenceScore: Number,

    soilFactor: Number,
    urbanFloodFactor: Number,
    historicalFloodScore: Number

},
{ timestamps: true }
);

export default mongoose.model(
    "TerrainCache",
    terrainCacheSchema
);