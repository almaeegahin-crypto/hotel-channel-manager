import React, { useState, useEffect, useCallback } from 'react';
import { CalendarCheck, Search, ArrowUpRight, Download, MoreHorizontal, Plus, X, AlertCircle, Check } from 'lucide-react';

const STATUS_STYLES = {
  Confirmed: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30',
  Pending: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30',
  'Checked In': 'bg-primary-50 text-primary-600 dark:bg-primary-900/30',
  Cancelled: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30',
  Completed: 'bg-slate-100 text-slate-500 dark:bg-slate-800',
};

const TABS = ['All', 'Confirmed', 'Pending', 'Checked In', 'Completed', 'Cancelled'];

/* ── New Booking Modal ─────────────────────────── */
const NewBookingModal = ({ hotelId, hotels, onClose, onSaved }) => {
  const [form, setForm] = useState({
    hotelId: hotelId || hotels[0]?.id || '',
    guestName: '', source: 'Direct', status: 'Confirmed',
    checkIn: '', checkOut: '', totalAmount: '', roomNumber: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!form.guestName || !form.checkIn || !form.checkOut || !form.totalAmount) {
      setError('Please fill all required fields'); return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, totalAmount: Number(form.totalAmount), hotelName: hotels.find(h => h.id === form.hotelId)?.name || '' })
      });
      onSaved(await res.json());
      onClose();
    } catch { setError('Failed to save booking'); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-10 w-full max-w-lg shadow-2xl my-4">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">New Reservation</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        {error && <p className="text-rose-500 text-xs font-black mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Property</label>
            <select value={form.hotelId} onChange={e => setForm(p => ({ ...p, hotelId: e.target.value }))}
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:border-primary-500 transition-all">
              {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
          {[
            { key: 'guestName', label: 'Guest Name *', type: 'text', placeholder: 'Full name' },
            { key: 'roomNumber', label: 'Room Number', type: 'text', placeholder: 'e.g. 201' },
            { key: 'totalAmount', label: 'Total Amount (IQD)*', type: 'number', placeholder: 'e.g. 500000' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Check-In *</label>
              <input type="date" value={form.checkIn} onChange={e => setForm(p => ({ ...p, checkIn: e.target.value }))}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:border-primary-500 transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Check-Out *</label>
              <input type="date" value={form.checkOut} onChange={e => setForm(p => ({ ...p, checkOut: e.target.value }))}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:border-primary-500 transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Source</label>
              <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:border-primary-500 transition-all">
                {['Direct', 'Booking.com', 'Expedia', 'Agoda', 'Airbnb', 'Walk-in'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:border-primary-500 transition-all">
                {['Confirmed', 'Pending', 'Checked In'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
          <button onClick={save} disabled={saving} className="flex-1 py-4 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 disabled:opacity-70">
            {saving ? 'Saving...' : 'Create Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main ─────────────────────────────────────────── */
const Bookings = ({ selectedHotelId }) => {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    fetch('http://localhost:5000/api/hotels').then(r => r.json()).then(setHotels).catch(console.error);
  }, []);

  const load = useCallback(() => {
    const url = selectedHotelId
      ? `http://localhost:5000/api/bookings?hotelId=${selectedHotelId}`
      : `http://localhost:5000/api/bookings`;
    setIsLoading(true);
    fetch(url).then(r => r.json()).then(setBookings).catch(console.error).finally(() => setIsLoading(false));
  }, [selectedHotelId]);

  useEffect(() => { load(); }, [load]);

  const filtered = bookings.filter(b => {
    const matchSearch = b.guestName?.toLowerCase().includes(search.toLowerCase()) || b.id?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || b.status === filter;
    return matchSearch && matchFilter;
  });

  const totalRevenue = filtered.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl text-white text-sm font-black flex items-center gap-3 shadow-2xl ${toast.ok ? 'bg-emerald-500' : 'bg-rose-500'}`}>
          {toast.ok ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} {toast.msg}
        </div>
      )}

      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Reservations</h2>
          <p className="text-slate-500 font-medium mt-1">All bookings across your network — <span className="text-primary-600 font-black">{filtered.length}</span> results, total <span className="text-primary-600 font-black">{totalRevenue.toLocaleString()} IQD</span></p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-[2px] text-slate-600 hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[2px] transition-all hover:shadow-xl shadow-primary-500/20">
            <CalendarCheck className="w-4 h-4" /> New Booking
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setFilter(tab)}
                className={`text-xs font-black uppercase tracking-widest pb-1 whitespace-nowrap transition-colors border-b-2 ${filter === tab ? 'text-primary-500 border-primary-500' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
                {tab} {tab !== 'All' && bookings.filter(b => b.status === tab).length > 0 && (
                  <span className="ml-1 text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">{bookings.filter(b => b.status === tab).length}</span>
                )}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary-500/20 w-64" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/20">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Guest</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Dates</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={7} className="px-8 py-12 text-center text-slate-400 font-black uppercase tracking-widest text-xs">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-8 py-12 text-center text-slate-400 font-black uppercase tracking-widest text-xs">No bookings found</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <td className="px-8 py-5 text-sm font-black text-primary-600">{b.id}</td>
                  <td className="px-8 py-5">
                    <p className="font-black text-slate-900 dark:text-white text-sm">{b.guestName}</p>
                    <p className="text-[10px] font-black text-primary-500 uppercase tracking-tighter">{b.source}</p>
                  </td>
                  <td className="px-8 py-5 text-slate-500 dark:text-slate-400 text-sm font-medium">{b.hotelName}</td>
                  <td className="px-8 py-5 text-center">
                    <div className="text-[10px] font-black text-slate-500 uppercase">{b.checkIn} <ArrowUpRight className="inline w-2 h-2 mx-1" /> {b.checkOut}</div>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-slate-900 dark:text-white text-sm whitespace-nowrap">{b.totalAmount?.toLocaleString()} IQD</td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${STATUS_STYLES[b.status] || 'bg-slate-50 text-slate-500'}`}>{b.status}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <NewBookingModal hotelId={selectedHotelId} hotels={hotels}
          onClose={() => setShowModal(false)}
          onSaved={bk => { setBookings(prev => [bk, ...prev]); showToast('Booking created!'); }} />
      )}
    </div>
  );
};

export default Bookings;
