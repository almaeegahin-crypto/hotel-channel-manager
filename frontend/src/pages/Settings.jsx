import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Globe, Bell, Shield, CreditCard, Layout, Sliders, Smartphone, Save, RotateCcw, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Settings = ({ selectedHotelId }) => {
  const { t } = useTranslation();
  
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchSettings = React.useCallback(async () => {
    if (!selectedHotelId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/settings/${selectedHotelId}`);
      if (res.ok) setSettings(await res.json());
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [selectedHotelId]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/settings/${selectedHotelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: settings.name,
          language: settings.language,
          taxRate: settings.taxRate
        })
      });
      if (res.ok) {
        showToast('Settings saved successfully!');
      } else throw new Error();
    } catch (e) {
      showToast('Failed to save settings', false);
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg, ok = true) => { setToast({msg, ok}); setTimeout(() => setToast(null), 3000); };

  const sections = [
    { id: 'general', label: 'General Info', icon: Layout },
    { id: 'localization', label: 'Localization', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: Sliders },
    { id: 'mobile', label: 'Mobile App', icon: Smartphone },
  ];

  const [activeSection, setActiveSection] = useState('general');

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl text-white text-sm font-black flex items-center gap-3 shadow-2xl transition-all ${toast.ok ? 'bg-emerald-500' : 'bg-rose-500'}`}>
          {toast.ok ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} {toast.msg}
        </div>
      )}

      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">System Settings</h2>
          <p className="text-slate-500 font-medium mt-1">Global configuration for Gate2Hotels Channel Manager.</p>
        </div>
        <div className="flex gap-4">
           <button onClick={fetchSettings} className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-[2px] text-slate-400 hover:text-slate-600 transition-all">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[3px] transition-all hover:shadow-2xl shadow-primary-500/30 hover:bg-primary-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Settings Navigation */}
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] transition-all duration-300 ${
                activeSection === section.id 
                  ? 'bg-primary-500 text-white font-black shadow-xl shadow-primary-500/20' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm p-10">
            {isLoading ? (
               <div className="h-64 flex items-center justify-center">
                 <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
               </div>
            ) : activeSection === 'general' && settings ? (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">Property Profile</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Company Name</label>
                       <input type="text" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">System Language</label>
                       <select value={settings.language} onChange={e => setSettings({...settings, language: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 outline-none appearance-none transition-all">
                         <option>English</option>
                         <option>Arabic</option>
                         <option>Kurdish</option>
                       </select>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-50 dark:border-slate-800">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">Currency & Fiscal</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Base Currency</label>
                       <div className="flex items-center gap-4">
                          <input type="text" value={settings.currency?.split(' - ')[0] || 'IQD'} disabled className="w-1/3 px-6 py-4 bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-black text-slate-400" />
                          <input type="text" value={settings.currency || 'IQD - Iraqi Dinar'} disabled className="flex-1 px-6 py-4 bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold text-slate-400" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Tax Rate (%)</label>
                       <input type="number" value={settings.taxRate} onChange={e => setSettings({...settings, taxRate: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 outline-none transition-all" />
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-50 dark:border-slate-800">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6">Regional Market</h3>
                  <div className="flex gap-4">
                    {['Iraq', 'Kurdistan Region', 'GCC'].map((region) => {
                      const isActive = (settings.regions || []).includes(region);
                      return (
                        <button key={region} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 hover:bg-primary-500 hover:text-white'}`}>
                          {region}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}
            
            {activeSection !== 'general' && (
              <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[24px] flex items-center justify-center mb-6">
                  <SettingsIcon className="w-10 h-10 text-slate-300 animate-spin-slow" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">Advanced Modules</h3>
                <p className="text-slate-500 font-medium text-center max-w-xs uppercase text-[10px] tracking-[2px] leading-loose">
                  Configuration for this section is coming soon in the next update.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
