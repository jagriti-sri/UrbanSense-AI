export const getSoilFactor = async (lat, lon) => {

    try {

        const url =
        `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=clay&depth=0-5cm&value=mean`;

        const response = await fetch(url);

        const data = await response.json();

        const clayPercent =
        data.properties.layers[0]
        .depths[0]
        .values.mean;

        if (clayPercent > 40)
            return 2;

        if (clayPercent > 20)
            return 1.5;

        return 1;

    } catch {

        return 1.2;

    }

};