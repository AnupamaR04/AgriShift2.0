import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  Satellite,
  CloudSun,
  Calendar,
  Layers,
  Landmark,
  PhoneCall,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  MapPin,
  Bell,
  ChevronRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import { useTranslation } from '../context/LanguageContext';
import LanguageSelector from '../components/common/LanguageSelector';
import LocationSearchBar from '../components/common/LocationSearchBar';
import ErrorBoundary from '../components/common/ErrorBoundary';

export function DashboardLayout({ children }) {
  const { user, profile, logout } = useAuth();
  const { selectedLocation } = useLocationContext();
  const { t, isMalayalam } = useTranslation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navGroups = [
    {
      group: t('group_overview'),
      items: [
        { name: t('nav_dashboard'), path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: t('group_agriculture'),
      items: [
        { name: t('nav_farm'), path: '/dashboard/farm', icon: Compass },
        { name: t('nav_satellite'), path: '/dashboard/satellite', icon: Satellite },
        { name: t('nav_weather'), path: '/dashboard/weather', icon: CloudSun },
        { name: t('nav_crops'), path: '/dashboard/crops', icon: Sprout },
        { name: t('nav_calendar'), path: '/dashboard/calendar', icon: Calendar },
        { name: t('nav_rotation'), path: '/dashboard/rotation', icon: Layers },
      ],
    },
    {
      group: t('group_resources'),
      items: [
        { name: t('nav_schemes'), path: '/dashboard/schemes', icon: Landmark },
        { name: t('nav_support'), path: '/dashboard/support', icon: PhoneCall },
        { name: t('nav_reports'), path: '/dashboard/reports', icon: FileText },
      ],
    },
    {
      group: t('group_account'),
      items: [
        { name: t('nav_profile'), path: '/dashboard/profile', icon: User },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-agri-cream flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-agri-forest text-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-agri-paddy flex items-center justify-center text-agri-mist shadow-soft">
                <Sprout className="w-5 h-5 text-agri-lightleaf" />
              </div>
              <div>
                <span className="text-xl font-display font-extrabold text-white tracking-tight">AgriShift</span>
                <span className="block text-[10px] font-semibold text-agri-sage tracking-wider uppercase">
                  {isMalayalam ? 'അഗ്രിഷിഫ്റ്റ് 2.0' : '2.0 Worldwide'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Farm / Selected Worldwide Location Quick Pill */}
          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-bold uppercase tracking-wider text-agri-sage/80">
              {t('loc_active')}
            </div>
            <div className="text-sm font-bold text-white truncate mt-0.5">
              {selectedLocation?.name || profile?.farm_name || 'Active Parcel'}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/70 mt-1">
              <MapPin className="w-3 h-3 text-agri-lightleaf shrink-0" />
              <span className="truncate">
                {selectedLocation?.country ? `${selectedLocation.name}, ${selectedLocation.country}` : (profile?.district || 'Palakkad, Kerala')}
              </span>
            </div>
            <div className="text-[10px] font-mono text-agri-sage/70 mt-1">
              {Number(selectedLocation?.latitude ?? 10.7867).toFixed(4)}°, {Number(selectedLocation?.longitude ?? 76.6548).toFixed(4)}°
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-6 overflow-y-auto max-h-[calc(100vh-320px)] pr-2">
            {navGroups.map((group, idx) => (
              <div key={idx}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-3 mb-2">
                  {group.group}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.path === '/dashboard'}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-agri-paddy text-white shadow-soft font-bold'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 shrink-0 text-agri-sage" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-white/10 bg-black/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-agri-paddy flex items-center justify-center font-bold text-xs text-white shrink-0">
                {typeof profile?.full_name === 'string' && profile.full_name.trim().length > 0
                  ? profile.full_name.trim().charAt(0).toUpperCase()
                  : 'F'}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">
                  {profile?.full_name || user?.fullName || 'Active Farmer'}
                </div>
                <div className="text-[10px] text-white/60 truncate">{user?.email || 'farmer@domain.com'}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title={t('nav_logout')}
              className="p-2 rounded-lg text-white/60 hover:text-red-300 hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top App Bar with Worldwide Location Search and Language Selector */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-agri-sand py-2.5 px-4 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-agri-forest hover:bg-agri-sand"
                aria-label="Open sidebar"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="hidden sm:block">
                <div className="text-base sm:text-lg font-display font-extrabold text-agri-forest">
                  {profile?.full_name ? `Welcome, ${profile.full_name}` : 'AgriShift Worldwide'}
                </div>
                <div className="text-xs text-agri-forest/60 flex items-center gap-2">
                  <span>{new Date().toLocaleDateString(isMalayalam ? 'ml-IN' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>•</span>
                  <span className="font-semibold text-agri-paddy">
                    {selectedLocation?.name || 'Palakkad'} ({selectedLocation?.country || 'Global'})
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Compact Worldwide Location Search Bar */}
            <div className="flex-1 max-w-md">
              <LocationSearchBar compact={true} />
            </div>

            {/* Right: Language Selector and Notifications */}
            <div className="flex items-center gap-2.5 shrink-0">
              <LanguageSelector />

              <button
                onClick={() => navigate('/dashboard/schemes')}
                className="p-2 rounded-xl border border-agri-sand text-agri-forest hover:bg-agri-sand/60 relative"
                title="Notifications & Schemes"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-agri-terracotta"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Child Page Rendering */}
        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
