export const getTerrainRoughness =
async (lat, lon) => {

    try {

        const offset = 0.002;

        const points = [

            [lat+offset, lon],

            [lat-offset, lon],

            [lat, lon+offset],

            [lat, lon-offset]

        ];

        const elevations = [];

        for(const [la,lo] of points){

            const response =
            await fetch(
            `https://api.open-elevation.com/api/v1/lookup?locations=${la},${lo}`
            );

            const data =
            await response.json();

            elevations.push(
            data.results[0].elevation
            );

        }

        const variance =
        Math.max(...elevations)
        -
        Math.min(...elevations);

        return variance;

    } catch {

        return 5;

    }

};