import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/air";

export const getTodayAirData = async () => {
  const res = await axios.get(`${BASE_URL}/today`);
  return res.data;
};

export const predictTomorrowAQI = async (payload) => {
  const res = await axios.post(`${BASE_URL}/predict`, payload);
  return res.data;
};

export const getHealthMessage = async (payload) => {
  const res = await axios.post(`${BASE_URL}/health-message`, payload);
  return res.data;
};