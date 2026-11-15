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
  Settings,
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
import ErrorBoundary from '../components/common/ErrorBoundary';

export function DashboardLayout({ children }) {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navGroups = [
    {
      group: 'Overview',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'My Agriculture',
      items: [
        { name: 'My Farm & Map', path: '/dashboard/farm', icon: Compass },
        { name: 'Satellite Insights', path: '/dashboard/satellite', icon: Satellite },
        { name: 'Weather & Climate', path: '/dashboard/weather', icon: CloudSun },
        { name: 'Crop Planner', path: '/dashboard/crops', icon: Sprout },
        { name: 'Crop Calendar', path: '/dashboard/calendar', icon: Calendar },
        { name: 'Crop Rotation', path: '/dashboard/rotation', icon: Layers },
      ],
    },
    {
      group: 'Resources & Benefits',
      items: [
        { name: 'Government Schemes', path: '/dashboard/schemes', icon: Landmark },
        { name: 'Agricultural Support', path: '/dashboard/support', icon: PhoneCall },
        { name: 'Reports & Exports', path: '/dashboard/reports', icon: FileText },
      ],
    },
    {
      group: 'Account',
      items: [
        { name: 'Farmer Profile', path: '/dashboard/profile', icon: User },
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
                <span className="block text-[10px] font-semibold text-agri-sage tracking-wider uppercase font-malayalam">
                  അഗ്രിഷിഫ്റ്റ് കേരളം
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

          {/* Active Farm Quick Pill */}
          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-bold uppercase tracking-wider text-agri-sage/80">Active Parcel</div>
            <div className="text-sm font-bold text-white truncate mt-0.5">
              {profile?.farm_name || 'Kerala Farm'}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-white/70 mt-1">
              <MapPin className="w-3 h-3 text-agri-lightleaf shrink-0" />
              <span className="capitalize">{profile?.district || 'Palakkad'}, Kerala</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-6 overflow-y-auto max-h-[calc(100vh-280px)] pr-2">
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
                  : 'K'}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">
                  {profile?.full_name || 'Kerala Farmer'}
                </div>
                <div className="text-[10px] text-white/60 truncate">{user?.email || 'farmer@kerala.agri'}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-lg text-white/60 hover:text-red-300 hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top App Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-agri-sand h-18 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-agri-forest hover:bg-agri-sand"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div>
              <div className="text-base sm:text-lg font-display font-extrabold text-agri-forest">
                {profile?.full_name ? `Namaskaram, ${profile.full_name}` : 'AgriShift Kerala'}
              </div>
              <div className="text-xs text-agri-forest/60 flex items-center gap-2">
                <span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span>•</span>
                <span className="font-semibold text-agri-paddy capitalize">
                  {profile?.district || 'Palakkad'} District
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-agri-mist text-agri-forest text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-agri-leaf" />
              <span>NASA &amp; KAU Science Connected</span>
            </div>

            <button
              onClick={() => navigate('/dashboard/schemes')}
              className="p-2.5 rounded-xl border border-agri-sand text-agri-forest hover:bg-agri-sand/60 relative"
              title="Notifications & Schemes"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-agri-terracotta"></span>
            </button>
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
