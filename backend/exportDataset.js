import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

// recreate __dirname (not available in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// adjust path if needed
import Flood from "./src/modules/flood/flood.model.js";

const OUTPUT_PATH = path.join(
  __dirname,
  "ml-model",
  "dataset.csv"
);

async function exportDataset() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected ✅");

    const data = await Flood.find().lean();

    if (!data.length) {
      console.log("No data found in floods collection.");
      process.exit();
    }

    const headers = Object.keys(data[0]).filter(
      key => key !== "_id" && key !== "__v"
    );

    const csvRows = [];

    // header row
    csvRows.push(headers.join(","));

    // data rows
    data.forEach(row => {
      const values = headers.map(h => row[h]);
      csvRows.push(values.join(","));
    });

    fs.writeFileSync(
      OUTPUT_PATH,
      csvRows.join("\n")
    );

    console.log("Dataset exported successfully 🚀");
    console.log(`Rows exported: ${data.length}`);

    process.exit();

  } catch (err) {
    console.error("Export failed ❌");
    console.error(err);
  }
}

exportDataset();