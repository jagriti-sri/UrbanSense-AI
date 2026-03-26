import { getRainData } from "./services/weather.service.js";

const run = async () => {
  const rain = await getRainData();
  console.log(rain);
};

run();