import React, { useState, useEffect } from 'react';
import { RefreshCcw, ExternalLink, ShieldCheck, Zap, ArrowRight, Share2, CheckCircle2, AlertCircle } from 'lucide-react';

const CHANNEL_COLORS = {
  'Booking.com': 'bg-blue-600',
  'Expedia': 'bg-yellow-500',
  'Agoda': 'bg-rose-500',
  'Airbnb': 'bg-rose-400',
};

const Channels = ({ selectedHotelId }) => {
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchChannels = () => {
    if (!selectedHotelId) return;
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/channels/status/${selectedHotelId}`)
      .then(r => r.json()).then(setChannels).catch(console.error).finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchChannels(); }, [selectedHotelId]);

  const handleSync = async () => {
    setSyncing(true);
    await fetch('http://localhost:5000/api/channels/sync', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hotelId: selectedHotelId }) });
    setTimeout(() => { setSyncing(false); fetchChannels(); }, 1500);
  };

  const timeSince = (dateStr) => {
    const secs = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (secs < 60) return `${secs}s ago`;
    if (secs < 3600) return `${Math.floor(secs / 60)} mins ago`;
    return `${Math.floor(secs / 3600)}h ago`;
  };

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Channel Connections</h2>
          <p className="text-slate-500 font-medium mt-1">Manage synchronization with OTAs and direct booking engines.</p>
        </div>
        <button onClick={handleSync} disabled={syncing}
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 disabled:opacity-70">
          <RefreshCcw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} /> {syncing ? 'Syncing...' : 'Sync All Channels'}
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="bg-white dark:bg-slate-900 h-56 rounded-[40px] animate-pulse border border-slate-100 dark:border-slate-800" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {channels.map(channel => (
            <div key={channel.id} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-2 h-full ${channel.isActive ? 'bg-primary-500' : 'bg-slate-300'}`} />
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 ${CHANNEL_COLORS[channel.channelName] || 'bg-slate-500'} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    <RefreshCcw className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{channel.channelName}</h3>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${channel.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {channel.isActive ? 'Synced' : 'Auth Error'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[2px] mb-1">Last Sync</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white">{timeSince(channel.lastSync)}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[2px] mb-1">Bookings</p>
                  <p className="text-xs font-black text-slate-900 dark:text-white">{channel.bookings || 0}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[2px] mb-1">Commission</p>
                  <p className="text-xs font-black text-primary-500">{channel.commission}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-500 tracking-tight uppercase">PCI-DSS Compliant</span>
                </div>
                <button className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${channel.isActive ? 'bg-slate-900 text-white hover:bg-primary-600' : 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'}`}>
                  {channel.isActive ? 'Manage Sync' : 'Re-Authenticate'} <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {channels.length === 0 && (
            <div className="col-span-2 py-16 text-center">
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No channels configured for this property.</p>
            </div>
          )}

          {/* Global Engine card */}
          <div className="bg-gradient-to-br from-slate-900 to-black p-10 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-widest">Global Engine</h3>
              </div>
              <p className="text-slate-400 font-medium mb-10 leading-loose">Your direct booking engine is live. Commission-free bookings processed directly from your website.</p>
            </div>
            <button className="bg-white text-black px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-primary-500 hover:text-white transition-all shadow-xl self-end">
              Engine Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Channels;
