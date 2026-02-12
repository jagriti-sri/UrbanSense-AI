import { lazy } from 'react'

// Pages
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Flood = lazy(() => import('../pages/Flood'))
const AQI = lazy(() => import('../pages/AQI'))
const Waste = lazy(() => import('../pages/Waste'))
const Reports = lazy(() => import('../pages/Reports'))
const Weather = lazy(() => import('../pages/Blank'))

const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/flood',
    component: Flood,
  },
  {
    path: '/aqi',
    component: AQI,
  },
  {
    path: '/waste',
    component: Waste,
  },
  {
    path: '/reports',
    component: Reports,
  },
  {
  path: '/weather',
  component: Weather,
},
]

export default routes
