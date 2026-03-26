export const getNASARainfallAccumulation = async (lat, lon) => {

    try {

        const today = new Date();

        const formatDate = (date) =>
            date.toISOString().split("T")[0].replace(/-/g, "");

        const endDate = formatDate(today);

        const start = new Date(today);
        start.setDate(today.getDate() - 3);

        const startDate = formatDate(start);

        const url =
        `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOT&community=RE&longitude=${lon}&latitude=${lat}&format=JSON&start=${startDate}&end=${endDate}`;

        const response = await fetch(url);

        const data = await response.json();

        const rainfallValues =
        Object.values(data.properties.parameter.PRECTOT);

        const totalRainfall =
        rainfallValues.reduce((a,b)=>a+b,0);

        return totalRainfall ?? 0;

    } catch {

        return 0;

    }

};