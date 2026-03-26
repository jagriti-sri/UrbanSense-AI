const slopeCache = new Map();

/*
Terrain slope calculation using nearby elevation sampling
Returns slope in degrees
*/

export const calculateSlope = async (lat, lon) => {

    const cacheKey = `${lat},${lon}`;

    if (slopeCache.has(cacheKey)) {
        return slopeCache.get(cacheKey);
    }

    const offset = 0.003;
    const approxDistanceMeters = 111;

    const points = [
        { lat, lon },
        { lat: lat + offset, lon },
        { lat: lat - offset, lon },
        { lat, lon: lon + offset },
        { lat, lon: lon - offset }
    ];

    const locations = points
        .map(p => `${p.lat},${p.lon}`)
        .join("|");

    const url =
        `https://api.open-elevation.com/api/v1/lookup?locations=${locations}`;

    const response = await fetch(url);

    const data = await response.json();

    const elevations = data.results.map(r => r.elevation);

    const centerElevation = elevations[0];

    let slopeSum = 0;

    for (let i = 1; i < elevations.length; i++) {

        const elevationDiff =
            Math.abs(centerElevation - elevations[i]);

        const slopeRadians =
            Math.atan(elevationDiff / approxDistanceMeters);

        const slopeDegrees =
            slopeRadians * (180 / Math.PI);

        slopeSum += slopeDegrees;
    }

    const avgSlope = slopeSum / 4;

    slopeCache.set(cacheKey, avgSlope);

    return avgSlope;
};