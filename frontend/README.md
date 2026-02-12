# 📌 Frontend – UrbanSense AI

## Overview
The UrbanSense AI Frontend is a React-based dashboard application designed to visualize environmental monitoring data for smart city management.
It provides real-time monitoring and forecasting for:


- Flood Risk
- Air Quality Index (AQI)
- Waste Management
- Weather Alerts
- System Reports

The interface supports dynamic area-based filtering to display city-specific environmental data.

## 🛠 Tech Stack

- React.js
- Tailwind CSS
- Chart.js
- React Router
- Context API (for state management)

## 🚀 Features
### 1. Dashboard
- Real-time environmental status cards
- Flood & AQI trend visualization
- Dynamic area selector

### 2. Flood Monitoring Module
- Water level & rainfall indicators
- 5-day flood risk forecast chart
- Risk classification display
- Emergency action controls

### 3. AQI Monitoring Module
- Current AQI & PM2.5 levels
- Health advisory display
- 5-day AQI trend
- Area-wise AQI breakdown

### 4. Waste Management
- Bin fill distribution
- Operational action panel

### 5. Weather Alerts
- 5-day rainfall & temperature forecast
- Alert level indicator
- 🌍 Area-Based Dynamic Data

The UI supports dynamic filtering by city/zone using an Area Selector component.
All modules update automatically based on selected area.
(Currently uses structured local data. Backend integration pending.)

## 📦 Project Structure
- src/
-  ├── components/
-  │    ├── AreaSelector/
 - │    ├── Cards/
 - │    ├── Chart/
 - │    └── Sidebar/
 - ├── pages/
 - │    ├── Dashboard.js
 - │    ├── Flood.js
 - │    ├── AQI.js
 - │    ├── Waste.js
 - │    └── Weather.js
 - ├── data/
 - │    └── areaData.js


## 🔄 Future Integration
- Backend API integration
- Real-time sensor data streaming
- ML-based risk prediction models
- Authentication & role-based access
