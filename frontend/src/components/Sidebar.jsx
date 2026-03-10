import React, { useState } from 'react';
import { 
  Hotel, 
  BedDouble, 
  CalendarCheck, 
  RefreshCcw, 
  BarChart3, 
  Users, 
  Settings,
  LogOut,
  Grid3X3,
  ChevronDown,
  CheckCircle2,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Menu,
  Building2,
  PieChart,
  UserCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isCollapsed, setIsCollapsed, hotels, selectedHotelId, onHotelChange, onLogout }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isPropertyOpen, setIsPropertyOpen] = useState(false);

  const selectedHotel = hotels.find(h => h.id === selectedHotelId) || hotels[0];
  const selectedHotelName = selectedHotel ? selectedHotel.name : 'Select Property';

  const menuSections = [
    {
      title: 'Overview',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Grid3X3, label: 'Inventory Grid', path: '/' },
        { icon: BarChart3, label: t('analytics'), path: '/analytics' },
      ]
    },
    {
      title: 'Management',
      items: [
        { icon: Hotel, label: t('hotels'), path: '/hotels' },
        { icon: BedDouble, label: t('rooms'), path: '/rooms' },
        { icon: CalendarCheck, label: t('bookings'), path: '/bookings' },
      ]
    },
    {
      title: 'System',
      items: [
        { icon: RefreshCcw, label: t('channels'), path: '/channels' },
        { icon: Users, label: t('users'), path: '/users' },
        { icon: Settings, label: t('settings'), path: '/settings' },
      ]
    }
  ];

  return (
    <div className={`${isCollapsed ? 'w-24' : 'w-64'} fixed top-0 left-0 bottom-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-900 flex flex-col transition-all duration-500 z-40 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.5)]`}>
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary-500/5 via-transparent to-transparent pointer-events-none"></div>
      
      {/* Footer Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-10 -right-4 w-9 h-9 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(240,73,97,0.4)] hover:scale-110 transition-all z-50 border-4 border-white dark:border-slate-950 cursor-pointer"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4 ml-0.5" />}
      </button>

      {/* Branding Section */}
      <div className={`p-8 pb-6 relative transition-all duration-500 ${isCollapsed ? 'items-center px-4' : ''}`}>
        <div className={`flex flex-col ${isCollapsed ? 'items-center' : 'items-start'} gap-1`}>
          <div className="flex items-baseline font-outfit">
            <span className={`text-3xl font-black text-primary-500 tracking-tighter drop-shadow-[0_0_12px_rgba(240,73,97,0.3)] ${isCollapsed ? 'text-4xl' : ''}`}>G</span>
            {!isCollapsed && (
              <>
                <span className="text-3xl font-black text-primary-500 tracking-tighter drop-shadow-[0_0_12px_rgba(240,73,97,0.3)]">ate</span>
                <span className="text-2xl font-black text-slate-400 dark:text-slate-500 mx-0.5">2</span>
                <span className="text-xl font-bold text-primary-500 tracking-tight">hotels</span>
              </>
            )}
          </div>
          {!isCollapsed && (
            <p className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] font-black mt-2">
              Channel Manager
            </p>
          )}
        </div>
      </div>

      {/* Property Switcher */}
      <div className={`px-4 mb-8 relative transition-all duration-500 ${isCollapsed ? 'px-2' : ''}`}>
        <div className="relative">
          <button 
            onClick={() => !isCollapsed && setIsPropertyOpen(!isPropertyOpen)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center py-4' : 'justify-between p-4'} bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl transition-all group backdrop-blur-md`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                <Hotel className="w-5 h-5 text-primary-500" />
              </div>
              {!isCollapsed && (
                <div className="text-left">
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest leading-none mb-1.5 whitespace-nowrap">Current Property</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{selectedHotelName}</p>
                </div>
              )}
            </div>
            {!isCollapsed && <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-500 ${isPropertyOpen ? 'rotate-180' : ''}`} />}
          </button>

          {!isCollapsed && isPropertyOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 py-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
              {hotels.map((hotel) => (
                <button
                  key={hotel.id}
                  onClick={() => {
                    onHotelChange(hotel.id);
                    setIsPropertyOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 text-xs font-bold transition-all ${
                    selectedHotelId === hotel.id 
                      ? 'text-primary-500 bg-primary-500/10 border-l-2 border-primary-500' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-primary-500 dark:hover:text-white border-l-2 border-transparent'
                  }`}
                >
                  {hotel.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} space-y-6 overflow-y-auto no-scrollbar relative pt-2`}>
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-1.5">
            {!isCollapsed && (
              <p className="px-5 text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-3">
                {section.title}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4 px-5'} py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? 'bg-primary-600 text-white font-black shadow-[0_8px_20px_rgba(240,73,97,0.25)]' 
                      : 'text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/40 to-transparent pointer-events-none"></div>
                  )}
                  <item.icon className={`w-5 h-5 transition-all duration-500 relative z-10 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'group-hover:scale-110'}`} />
                  {!isCollapsed && (
                    <span className={`text-[10px] uppercase font-black tracking-[0.15em] relative z-10 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer / Status */}
      <div className={`p-4 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/80 backdrop-blur-md relative transition-all duration-500 ${isCollapsed ? 'px-2' : ''}`}>
        {!isCollapsed && (
          <div className="bg-white dark:bg-slate-900/40 rounded-2xl p-4 mb-4 border border-slate-200 dark:border-slate-800/40 shadow-sm dark:ring-1 dark:ring-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Health</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping absolute"></div>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full relative"></div>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Online</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/70" />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-tight">Active sync</span>
            </div>
          </div>
        )}

        <button onClick={onLogout} className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-5'} py-4 w-full text-slate-400 dark:text-slate-500 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-500 rounded-2xl transition-all duration-500 font-black uppercase tracking-[0.2em] text-[10px] group border border-transparent hover:border-rose-500/20`}>
          <LogOut className={`w-4 h-4 ${!isCollapsed ? 'group-hover:-translate-x-1' : ''} transition-transform`} />
          {!isCollapsed && <span>{t('logout')}</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
