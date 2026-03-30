const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
const BASE_URL = "http://127.0.0.1:5000";

export default BASE_URL;
export async function submitWasteReport(payload) {
  await wait();
  return { success: true, message: 'Waste report submitted successfully.', payload };
}

export async function submitLandReport(payload) {
  await wait();
  return { success: true, message: 'Land issue submitted successfully.', payload };
}

export async function submitContactForm(payload) {
  await wait();
  return { success: true, message: 'Support request submitted.', payload };
}

export const getFloodPrediction = async (lat, lon) => {
  const res = await fetch(
    `${BASE_URL}/api/flood/predict?lat=${lat}&lon=${lon}`
  );
  return res.json();
};