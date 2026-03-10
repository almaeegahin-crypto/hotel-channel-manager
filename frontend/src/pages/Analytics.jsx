import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  Calendar,
  Layers
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsCard = ({ title, children, icon: Icon }) => (
  <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm p-8 hover:shadow-xl transition-all group">
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-500">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">{title}</h3>
      </div>
    </div>
    <div className="h-64 relative">
      {children}
    </div>
  </div>
);

const Analytics = ({ selectedHotelId }) => {
  const { t } = useTranslation();
  const [stats, setStats] = React.useState(null);

  React.useEffect(() => {
    if (!selectedHotelId) return;
    fetch(`http://localhost:5000/api/stats/stats/${selectedHotelId}`)
      .then(r => r.json())
      .then(setStats)
      .catch(console.error);
  }, [selectedHotelId]);

  const barData = {
    labels: ['Single Room', 'Double Room', 'Deluxe Suite', 'Presidential'],
    datasets: [
      {
        label: 'Occupancy %',
        data: [82, 65, 45, 30],
        backgroundColor: [
          '#f04961',
          '#6366f1',
          '#10b981',
          '#f59e0b'
        ],
        borderRadius: 12,
      },
    ],
  };

  const donutData = {
    labels: ['OTA', 'Direct', 'Walk-in'],
    datasets: [
      {
        data: [60, 30, 10],
        backgroundColor: ['#f04961', '#6366f1', '#e2e8f0'],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Analytics & Insights</h2>
          <p className="text-slate-500 font-medium mt-1">Deep dive into your property performance metrics.</p>
        </div>
        <div className="flex gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
          {['7D', '30D', '90D', '1Y'].map((range) => (
            <button key={range} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${range === '30D' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-slate-400 hover:text-slate-600'}`}>
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-primary-600 to-rose-600 p-8 rounded-[32px] text-white shadow-xl shadow-primary-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Total Revenue (IQD)</p>
          <p className="text-3xl font-black tracking-tighter mb-4 text-white hover:scale-105 transition-transform origin-left">
            {stats ? stats.totalRevenue.toLocaleString() : '...'}
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black">
            <span className="bg-white/20 px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-white/30 transition-colors">
              <ArrowUpRight className="w-3 h-3" /> Booking Growth
            </span>
            <span className="opacity-60 uppercase tracking-widest">{stats ? `${stats.totalBookings} total bookings` : ''}</span>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[32px] text-white relative overflow-hidden group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2 text-slate-400">Avg. Occupancy</p>
          <p className="text-3xl font-black tracking-tighter mb-4 text-white hover:scale-105 transition-transform origin-left">
            {stats ? stats.occupancy : '...'}
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black">
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-emerald-500/30 transition-colors">
              <ArrowUpRight className="w-3 h-3" /> Live Rate
            </span>
            <span className="opacity-40 uppercase tracking-widest">Growth trend</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2 text-slate-400">Active Channels</p>
          <p className="text-3xl font-black tracking-tighter mb-4 text-slate-900 dark:text-white hover:scale-105 transition-transform origin-left">
            {stats ? stats.channels : '...'}
          </p>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500">
            <span className="bg-green-50 dark:bg-green-900/20 text-green-500 px-2 py-1 rounded-lg flex items-center gap-1 hover:bg-green-100 transition-colors">
              <ArrowUpRight className="w-3 h-3" /> Synced
            </span>
            <span className="opacity-60 uppercase tracking-widest text-slate-400">OTA Networks</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnalyticsCard title="Room Type Performance" icon={Layers}>
          <Bar 
            data={barData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
            }} 
          />
        </AnalyticsCard>

        <AnalyticsCard title="Booking Source Distribution" icon={PieChart}>
           <div className="flex items-center justify-around h-full">
             <div className="w-48 h-48">
               <Doughnut data={donutData} options={{ maintainAspectRatio: false }} />
             </div>
             <div className="space-y-4">
               {['OTA (Online)', 'Direct Booking', 'Walk-in'].map((source, i) => (
                 <div key={source} className="flex items-center gap-3">
                   <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-primary-500' : i === 1 ? 'bg-indigo-500' : 'bg-slate-200'}`}></div>
                   <div>
                     <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{source}</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase">{donutData.datasets[0].data[i]}% Share</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </AnalyticsCard>
      </div>
    </div>
  );
};

export default Analytics;
