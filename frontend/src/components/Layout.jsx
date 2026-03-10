import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Search, Bell, Globe, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Layout = ({ children, hotels, selectedHotelId, onHotelChange, user, onLogout }) => {
  const { t, i18n } = useTranslation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    document.dir = i18n.dir();
  }, [i18n, i18n.language]);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-inter transition-colors duration-300">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed}
        hotels={hotels}
        selectedHotelId={selectedHotelId}
        onHotelChange={onHotelChange}
        onLogout={onLogout}
      />
      <div className={`flex-1 flex flex-col transition-all duration-500 ${isSidebarCollapsed ? 'ml-24' : 'ml-64'}`}>
        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-10 flex items-center justify-between sticky top-0 z-30 transition-all">
          <div className="relative group w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder={t('search_placeholder')} 
              className="w-full pl-11 pr-4 py-3 bg-slate-100/50 dark:bg-slate-800/50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white dark:focus:bg-slate-800 dark:text-white transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl">
              <button 
                onClick={toggleDarkMode}
                className="p-2 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm rounded-xl transition-all"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>

              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-bold text-xs uppercase tracking-wider">
                  <Globe className="w-4 h-4" />
                  <span>{i18n.language}</span>
                </button>
                <div className="absolute right-0 mt-3 w-40 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden py-1">
                  <button onClick={() => changeLanguage('en')} className="w-full text-left px-5 py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">ENGLISH</button>
                  <button onClick={() => changeLanguage('ar')} className="w-full text-left px-5 py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-arabic">العربية</button>
                  <button onClick={() => changeLanguage('ku')} className="w-full text-left px-5 py-2.5 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-kurdish">KURDÎ</button>
                </div>
              </div>
            </div>
            
            <button className="p-3 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl relative transition-all active:scale-95">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-primary-500 ring-4 ring-white dark:ring-slate-900 rounded-full"></span>
            </button>

            <div className="flex items-center gap-4 group cursor-pointer bg-slate-100/50 dark:bg-slate-800/50 pr-2 pl-4 py-1.5 rounded-2xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              <div className="text-right">
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{user?.name || 'Ahmed Al-Iraqi'}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">{user?.role || 'Administrator'}</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg shadow-primary-500/20 border-2 border-white dark:border-slate-800 group-hover:-rotate-6 transition-transform">
                {user?.name?.substring(0, 2).toUpperCase() || 'AA'}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
