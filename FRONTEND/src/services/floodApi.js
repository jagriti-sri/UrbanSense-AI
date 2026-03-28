import axios from "axios";

const BASE_URL = "http://localhost:5000/api/flood";

export const getFloodRiskFromQuery = async (query) => {
  const res = await axios.get(`${BASE_URL}/nlp-query`, {
    params: { query },
  });

  return res.data;
};

export const getFloodRiskFromCoords = async (lat, lon) => {
  const res = await axios.get(`${BASE_URL}/predict`, {
    params: { lat, lon },
  });

  return res.data;
};