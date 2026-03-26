import { getDistanceFromSea, getCoastalInfluenceScore } from "./coastal.service.js";
import { getDistanceFromRiver } from "./river.service.js";
import { getSoilFactor } from "./soil.service.js";
import { getTerrainData } from "./terrain.service.js";
import { getUrbanFloodFactor } from "./urban.service.js";
import { getRainfallData } from "./weather.service.js";
import { getHistoricalFloodScore } from "./historicalFlood.service.js";

export default async function generatePrediction(lat, lon) {

    const rainfall = await getRainfallData(lat, lon);

    const terrain = await getTerrainData(lat, lon);

    const distanceFromRiver = await getDistanceFromRiver(lat, lon);

    const distanceFromSea = await getDistanceFromSea(lat, lon);

    const coastalInfluenceScore =
        getCoastalInfluenceScore(distanceFromSea);

    const soilFactor = await getSoilFactor(lat, lon);

    const urbanFloodFactor =
        await getUrbanFloodFactor(lat, lon);

    const historicalFloodScore =
        await getHistoricalFloodScore(lat, lon);


    return {

        ...rainfall,
        ...terrain,

        distanceFromRiver,

        distanceFromSea,
        coastalInfluenceScore,

        soilFactor,

        urbanFloodFactor,

        historicalFloodScore

    };

}