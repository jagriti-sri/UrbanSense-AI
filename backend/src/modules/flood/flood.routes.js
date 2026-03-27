import express from "express";
import { predictFloodFromCoords } from "./flood.controller.js";
import { handleFloodQuery }
from "./nlp.controller.js";



const router = express.Router();

router.get("/predict", predictFloodFromCoords);

router.get(
"/nlp-query",
handleFloodQuery
);

export default router;
