import React, { useState, useEffect } from 'react';
import { TrendingUp, Bed, CreditCard, ArrowUpRight, ArrowDownRight, RefreshCcw, CalendarCheck, ChevronRight, Save, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Filler, Legend);

const StatCard = ({ title, value, change, isPositive, icon: Icon, loading }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
    <div className="flex justify-between items-start mb-6">
      <div className="p-4 bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-[22px] group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
        <Icon className="w-6 h-6" />
      </div>
      {change !== null && (
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30'}`}>
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          Live
        </div>
      )}
    </div>
    <h3 className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</h3>
    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter drop-shadow-sm">
      {loading ? <span className="block h-8 w-32 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" /> : value}
    </p>
  </div>
);

const Dashboard = ({ selectedHotelId }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedHotelId) return;
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stats/stats/${selectedHotelId}`)
      .then(r => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedHotelId]);

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      fill: true,
      label: 'Revenue (IQD)',
      data: [12000000, 19000000, 15000000, 22000000, 18000000, stats?.totalRevenue || 25000000],
      borderColor: '#f04961',
      backgroundColor: 'rgba(240, 73, 97, 0.03)',
      borderWidth: 5,
      pointRadius: 0,
      pointHoverRadius: 8,
      tension: 0.45,
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    hover: { intersect: false, mode: 'index' },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0f172a', padding: 16, borderRadius: 16, displayColors: false } },
    scales: { y: { display: false }, x: { grid: { display: false }, ticks: { font: { family: 'Outfit', weight: 'black', size: 10 }, color: '#94a3b8', padding: 20 } } },
  };

  const revenueDisplay = stats ? `${(stats.totalRevenue / 1000000).toFixed(1)}M IQD` : '—';

  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {stats?.hotelName || 'Dashboard'}
          </h2>
          <p className="text-slate-500 font-medium mt-1">Live performance overview — real-time data from your property.</p>
        </div>
        <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-[3px] transition-all hover:shadow-2xl hover:shadow-slate-900/30 hover:-translate-y-1">
          <Save className="w-4 h-4" /> Save Preset
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Revenue" value={revenueDisplay} change={12.5} isPositive={true} icon={CreditCard} loading={isLoading} />
        <StatCard title="Bookings" value={stats?.totalBookings ?? '—'} change={8.2} isPositive={true} icon={CalendarCheck} loading={isLoading} />
        <StatCard title="Occupancy Rate" value={stats?.occupancy ?? '—'} change={4.1} isPositive={false} icon={Bed} loading={isLoading} />
        <StatCard title="Active Channels" value={stats?.channels ?? '—'} change={null} isPositive={true} icon={TrendingUp} loading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm p-8 hover:shadow-2xl transition-all">
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Revenue Over Time</h3>
                <p className="text-[10px] text-slate-400 font-bold">Including current month actual</p>
              </div>
            </div>
            <div className="h-80">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-2xl transition-all">
            <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Recent Bookings</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Live from property</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-800/20">
                  <tr>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Guest</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Check-In</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {isLoading
                    ? [1, 2, 3].map(i => <tr key={i}><td colSpan={4} className="px-10 py-6"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" /></td></tr>)
                    : (stats?.recentBookings || []).map((b, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                        <td className="px-10 py-6">
                          <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{b.guestName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{b.id}</p>
                        </td>
                        <td className="px-10 py-6 text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">{b.checkIn}</td>
                        <td className="px-10 py-6">
                          <span className="text-[9px] font-black uppercase tracking-widest text-primary-600 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 rounded-xl">{b.source}</span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] ${b.status === 'Confirmed' || b.status === 'Checked In' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sync Status */}
        <div className="bg-slate-950 dark:bg-black rounded-[48px] shadow-2xl p-10 self-start border border-slate-900 ring-1 ring-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-indigo-600" />
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-primary-600/10 rounded-[20px] flex items-center justify-center border border-primary-500/20">
              <RefreshCcw className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white">Sync Status</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {stats?.channels || '0/0'} Active
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {isLoading
              ? [1, 2, 3].map(i => <div key={i} className="h-14 bg-slate-900/30 rounded-3xl animate-pulse" />)
              : (stats?.syncStatus || []).map((ch, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-3xl border border-white/5 hover:bg-slate-900/60 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full blur-[2px] absolute inset-0 animate-pulse ${ch.status === 'Synced' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <div className={`w-3 h-3 rounded-full relative z-10 ${ch.status === 'Synced' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    </div>
                    <div>
                      <p className="font-black text-white text-xs tracking-tight uppercase">{ch.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-600" />
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{ch.time}</p>
                      </div>
                    </div>
                  </div>
                  {ch.status === 'Error'
                    ? <AlertCircle className="w-5 h-5 text-rose-500 animate-bounce" />
                    : <CheckCircle2 className="w-5 h-5 text-emerald-500/40" />}
                </div>
              ))}
          </div>
          <button className="w-full mt-12 py-5 bg-gradient-to-br from-primary-600 to-rose-600 text-white text-[10px] font-black uppercase tracking-[4px] rounded-[28px] hover:shadow-[0_15px_40px_rgba(240,73,97,0.4)] transition-all flex items-center justify-center gap-3">
            <RefreshCcw className="w-4 h-4" /> Sync All
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
