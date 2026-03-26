import express from "express";
import { predictFloodFromCoords } from "./flood.controller.js";

const router = express.Router();

router.get("/predict", predictFloodFromCoords);

export default router;