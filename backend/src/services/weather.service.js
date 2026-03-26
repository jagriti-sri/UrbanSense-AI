import { getNASARainfallAccumulation }
from "./nasaRainfall.service.js";


export const getRainForecast =
async (lat, lon) => {

    try {

        /*
        OPEN-METEO HOURLY FORECAST
        */

        const forecastURL =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation`;

        const forecastResponse =
        await fetch(forecastURL);

        const forecastData =
        await forecastResponse.json();


        const hourlyRain =
        forecastData.hourly.precipitation.slice(0,72);


        const rain_next_72h =
        hourlyRain.reduce((a,b)=>a+b,0);


        /*
        MAX HOURLY BURST LAST 24 HOURS
        */

        const rain_last_1h_peak =
        Math.max(...hourlyRain.slice(0,24));


        /*
        NASA SATELLITE RAIN LAST 72 HOURS
        */

        const rain_last_72h =
        await getNASARainfallAccumulation(lat,lon);


        /*
        NASA SATELLITE RAIN LAST 7 DAYS
        */

        const today =
        new Date();

        const formatDate =
        d => d.toISOString().split("T")[0].replace(/-/g,"");


        const start7 =
        new Date(today);

        start7.setDate(today.getDate()-7);


        const nasa7URL =
        `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOT&community=RE&longitude=${lon}&latitude=${lat}&format=JSON&start=${formatDate(start7)}&end=${formatDate(today)}`;


        const nasa7Response =
        await fetch(nasa7URL);

        const nasa7Data =
        await nasa7Response.json();


        const rainfall7days =
        Object.values(
        nasa7Data.properties.parameter.PRECTOT
        );


        const rain_last_7days =
        rainfall7days.reduce((a,b)=>a+b,0);


        /*
        NASA SATELLITE RAIN LAST 24 HOURS
        */

        const rain_last_24h =
        rainfall7days[
        rainfall7days.length-1
        ] ?? 0;


        return {

            rain_last_1h_peak,

            rain_last_24h,

            rain_last_72h,

            rain_last_7days,

            rain_next_72h

        };

    }

    catch {

        return {

            rain_last_1h_peak:0,

            rain_last_24h:0,

            rain_last_72h:0,

            rain_last_7days:0,

            rain_next_72h:0

        };

    }

};