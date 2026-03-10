import React, { useState, useEffect, useCallback } from 'react';
import { BedDouble, Plus, Search, Edit3, Trash2, ArrowRight, X, AlertCircle, Check, RefreshCcw } from 'lucide-react';

const STATUS_COLORS = {
  Available:   'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 border-emerald-100',
  Occupied:    'bg-rose-50 text-rose-600 dark:bg-rose-900/30 border-rose-100',
  Cleaning:    'bg-amber-50 text-amber-600 dark:bg-amber-900/30 border-amber-100',
  Maintenance: 'bg-slate-100 text-slate-500 dark:bg-slate-800 border-slate-200',
};

const STATUSES = ['Available', 'Occupied', 'Cleaning', 'Maintenance'];

/* ── Add Room Modal ─────────────────────────────── */
const AddRoomModal = ({ hotelId, categories, onClose, onSaved }) => {
  const [form, setForm] = useState({ number: '', categoryId: categories[0]?.id || '', status: 'Available', hotelId });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!form.number) { setError('Room number is required'); return; }
    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/rooms', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      onSaved(await res.json());
      onClose();
    } catch { setError('Failed to save'); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-10 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Add New Room</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        {error && <p className="text-rose-500 text-xs font-black mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Room Number</label>
            <input type="text" value={form.number} onChange={e => setForm(p => ({ ...p, number: e.target.value }))}
              placeholder="e.g. 305"
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all" />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Category</label>
            <select value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:border-primary-500 transition-all">
              {categories.map(c => <option key={c.id} value={c.id}>{c.name} — {c.basePrice?.toLocaleString()} IQD</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:border-primary-500 transition-all">
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
          <button onClick={save} disabled={saving} className="flex-1 py-4 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 disabled:opacity-70">
            {saving ? 'Saving...' : 'Add Room'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Add Category Modal ─────────────────────────── */
const AddCategoryModal = ({ hotelId, onClose, onSaved }) => {
  const [form, setForm] = useState({ name: '', basePrice: '', totalRooms: '', capacity: 2, hotelId });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!form.name || !form.basePrice) { setError('Name and price are required'); return; }
    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/rooms/categories', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, basePrice: Number(form.basePrice), totalRooms: Number(form.totalRooms) || 10, capacity: Number(form.capacity) })
      });
      onSaved(await res.json());
      onClose();
    } catch { setError('Failed to save'); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-10 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Add Room Category</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        {error && <p className="text-rose-500 text-xs font-black mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</p>}
        <div className="space-y-4">
          {[
            { key: 'name',       label: 'Category Name',    type: 'text',   placeholder: 'e.g. Deluxe Suite'  },
            { key: 'basePrice',  label: 'Base Price (IQD)', type: 'number', placeholder: 'e.g. 350000'         },
            { key: 'totalRooms', label: 'Total Rooms',      type: 'number', placeholder: 'e.g. 10'             },
            { key: 'capacity',   label: 'Capacity (guests)',type: 'number', placeholder: 'e.g. 2'              },
          ].map(f => (
            <div key={f.key}>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all" />
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
          <button onClick={save} disabled={saving} className="flex-1 py-4 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 disabled:opacity-70">
            {saving ? 'Saving...' : 'Add Category'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main ─────────────────────────────────────────── */
const Rooms = ({ selectedHotelId }) => {
  const [categories, setCategories] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'room' | 'category'
  const [editingStatus, setEditingStatus] = useState(null); // roomId
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(() => {
    if (!selectedHotelId) return;
    setIsLoading(true);
    Promise.all([
      fetch(`http://localhost:5000/api/rooms/categories/${selectedHotelId}`).then(r => r.json()),
      fetch(`http://localhost:5000/api/rooms/hotel/${selectedHotelId}`).then(r => r.json()),
    ]).then(([cats, roomData]) => { setCategories(cats); setRooms(roomData); })
      .catch(console.error).finally(() => setIsLoading(false));
  }, [selectedHotelId]);

  useEffect(() => { load(); }, [load]);

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    await fetch(`http://localhost:5000/api/rooms/${id}`, { method: 'DELETE' });
    setRooms(prev => prev.filter(r => r.id !== id));
    showToast('Room deleted');
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category and all its inventory?')) return;
    await fetch(`http://localhost:5000/api/rooms/categories/${id}`, { method: 'DELETE' });
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category deleted');
  };

  const handleStatusChange = async (roomId, status) => {
    await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status } : r));
    setEditingStatus(null);
    showToast('Status updated');
  };

  const filtered = rooms.filter(r => {
    const matchSearch = r.number?.toLowerCase().includes(search.toLowerCase()) || r.category?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl text-white text-sm font-black flex items-center gap-3 shadow-2xl transition-all ${toast.ok ? 'bg-emerald-500' : 'bg-rose-500'}`}>
          {toast.ok ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />} {toast.msg}
        </div>
      )}

      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Rooms & Categories</h2>
          <p className="text-slate-500 font-medium mt-1">Configure room categories with prices and manage individual room statuses.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setModal('category')}
            className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-[2px] text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Category
          </button>
          <button onClick={() => setModal('room')} disabled={categories.length === 0}
            className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[2px] transition-all hover:shadow-xl shadow-primary-500/20 disabled:opacity-50">
            <Plus className="w-4 h-4" /> Add Room
          </button>
        </div>
      </div>

      {/* Categories */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[1,2,3].map(i => <div key={i} className="bg-white dark:bg-slate-900 h-40 rounded-[32px] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {categories.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4">No categories yet</p>
              <button onClick={() => setModal('category')} className="bg-primary-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all flex items-center gap-2 mx-auto">
                <Plus className="w-3.5 h-3.5" /> Add First Category
              </button>
            </div>
          ) : categories.map(cat => (
            <div key={cat.id} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-2xl transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-primary-50 dark:bg-primary-900/30 text-primary-500 rounded-2xl group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                  <BedDouble className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.totalRooms} Units</span>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{cat.name}</h3>
              <p className="text-2xl font-black text-primary-600 tracking-tighter mb-2">{cat.basePrice?.toLocaleString()} <span className="text-sm font-black text-slate-400">IQD / night</span></p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity: {cat.capacity} guests</p>
            </div>
          ))}
        </div>
      )}

      {/* Rooms Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4">
          <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Individual Room Status</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {['All', ...STATUSES].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-primary-500 text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input type="text" placeholder="Room # or Category" value={search} onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary-500/20 w-48" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/20">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Room #</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filtered.map(room => (
                <tr key={room.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-8 py-5 font-black text-slate-900 dark:text-white text-sm">#{room.number}</td>
                  <td className="px-8 py-5 text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">{room.category}</td>
                  <td className="px-8 py-5 text-center">
                    {editingStatus === room.id ? (
                      <select autoFocus defaultValue={room.status} onChange={e => handleStatusChange(room.id, e.target.value)}
                        onBlur={() => setEditingStatus(null)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border ${STATUS_COLORS[room.status]}`}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <span onClick={() => setEditingStatus(room.id)}
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer border ${STATUS_COLORS[room.status] || 'bg-slate-50 text-slate-600'}`}>
                        {room.status}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingStatus(room.id)} className="p-2 text-slate-400 hover:text-primary-500 transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteRoom(room.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !isLoading && (
                <tr><td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-black uppercase tracking-widest text-xs">No rooms found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal === 'room' && (
        <AddRoomModal hotelId={selectedHotelId} categories={categories} onClose={() => setModal(null)} onSaved={room => { setRooms(prev => [...prev, room]); showToast('Room added!'); }} />
      )}
      {modal === 'category' && (
        <AddCategoryModal hotelId={selectedHotelId} onClose={() => setModal(null)} onSaved={cat => { setCategories(prev => [...prev, cat]); showToast('Category added!'); }} />
      )}
    </div>
  );
};

export default Rooms;
