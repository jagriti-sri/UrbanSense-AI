import mongoose from "mongoose";

const connectDB = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log(
      "MongoDB Connected to:",
      process.env.MONGO_URI.includes("mongodb+srv")
        ? "Atlas Cloud Cluster"
        : "Local MongoDB"
    );

  } catch (err) {

    console.error("DB Error:", err.message);

    process.exit(1);

  }
};

export default connectDB;