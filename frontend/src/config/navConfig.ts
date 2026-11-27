import {
  LayoutDashboard,
  MapPin,
  Route,
  Settings,
  Zap,
} from 'lucide-react'

export const navItems = [
  {
    title: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Route Planner',
    path: '/route-planner',
    icon: Route,
  },
  {
    title: 'Charging Stations',
    path: '/charging-stations',
    icon: Zap,
  },
  {
    title: 'Explore Map',
    path: '/map',
    icon: MapPin,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: Settings,
  },
]