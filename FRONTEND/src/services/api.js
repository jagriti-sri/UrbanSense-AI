const wait = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

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
