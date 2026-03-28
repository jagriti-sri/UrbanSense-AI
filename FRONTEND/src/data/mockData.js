export const summaryCards = [
  { icon: '🌬️', title: "Today's AQI", value: '87', unit: 'AQI', status: 'Moderate', tone: 'caution', path: '/air' },
  { icon: '🔮', title: 'Tomorrow AQI', value: '62', unit: 'AQI', status: 'Good', tone: 'safe', path: '/air' },
  { icon: '🌧️', title: 'Rain Chance', value: '40', unit: '%', status: 'Watch', tone: 'info', path: '/rainfall' },
  { icon: '🌊', title: 'Flood Risk', value: 'Low', unit: '', status: 'Safe', tone: 'safe', path: '/flood' },
  { icon: '♻️', title: 'Waste Complaints', value: '2', unit: '', status: 'Pending', tone: 'caution', path: '/waste' },
  { icon: '🗺️', title: 'Land Alerts', value: '1', unit: '', status: 'Review', tone: 'danger', path: '/land' },
];

export const airTrend = [72, 95, 120, 87, 62, 55, 82];
export const trendDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const healthAdvice = [
  'Wear a mask outdoors for long periods, especially near traffic. / लंबे समय तक बाहर जाने पर मास्क पहनें।',
  'Avoid heavy outdoor exercise in the morning. Evening walks are safer. / सुबह भारी व्यायाम से बचें।',
  'Keep children indoors during peak hours (8 AM – 12 PM). / बच्चों को सुबह घर के अंदर रखें।',
  'Asthma patients should keep inhaler ready. / अस्थमा रोगी इनहेलर साथ रखें।',
];

export const rainfallForecast = [
  { day: 'Fri', icon: '🌧️', temp: '28°C', rain: '40%' },
  { day: 'Sat', icon: '⛅', temp: '30°C', rain: '20%' },
  { day: 'Sun', icon: '🌦️', temp: '27°C', rain: '55%' },
  { day: 'Mon', icon: '☁️', temp: '29°C', rain: '30%' },
];

export const wasteComplaints = [
  { title: 'Plastic dumping near market', location: 'New Market, Bhopal', status: 'Pending' },
  { title: 'Garbage overflow', location: 'MP Nagar Zone 2', status: 'In Progress' },
  { title: 'Collection completed', location: 'Shahpura', status: 'Resolved' },
];

export const landIssues = [
  'Blocked Drain / बंद नाला',
  'Illegal Construction / अवैध निर्माण',
  'Pond Closed / तालाब बंद',
  'River Obstruction / नदी अवरोध',
];

export const profileStats = [
  { label: 'Waste Reports', value: '3' },
  { label: 'Land Reports', value: '1' },
  { label: 'Resolved', value: '2' },
  { label: 'Days Active', value: '14' },
];
