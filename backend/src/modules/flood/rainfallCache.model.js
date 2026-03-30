import mongoose from "mongoose";

const rainfallCacheSchema = new mongoose.Schema({

lat: Number,
lon: Number,

data: Object,

updatedAt: {
type: Date,
default: Date.now
}

});

export default mongoose.model(
"RainfallCache",
rainfallCacheSchema
);