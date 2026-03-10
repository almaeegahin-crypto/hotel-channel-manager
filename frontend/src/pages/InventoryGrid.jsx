import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Save, RotateCcw, Zap, Hotel, Layers, ArrowRight, Plus,
  Check, X, Edit2, RefreshCcw, AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

/** ─── Editable Cell ─────────────────────────────────────── */
const EditableCell = ({ value, type, onChange, isWeekend }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    const n = Number(draft);
    if (!isNaN(n) && n !== value) onChange(n);
    setEditing(false);
  };

  if (editing) {
    return (
      <td className="p-1 border-r border-slate-100 dark:border-slate-800">
        <div className="relative flex items-center">
          <input
            autoFocus
            type="number"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
            className="w-full h-12 rounded-xl text-center text-xs font-black bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 border-2 border-indigo-400 dark:border-indigo-500 outline-none px-1"
          />
        </div>
      </td>
    );
  }

  if (type === 'avail') {
    return (
      <td onClick={() => { setDraft(value); setEditing(true); }} className="p-1.5 border-r border-slate-100 dark:border-slate-800 cursor-pointer group/cell">
        <div className={`w-full h-12 rounded-xl flex items-center justify-center text-xs font-black transition-all group-hover/cell:ring-2 group-hover/cell:ring-indigo-400 group-hover/cell:scale-105 shadow-sm ${value > 5 ? 'bg-emerald-500 text-white shadow-emerald-500/20'
            : value > 0 ? 'bg-amber-500 text-white shadow-amber-500/20'
              : 'bg-rose-500 text-white shadow-rose-500/20'
          } ${isWeekend ? 'ring-1 ring-rose-300 dark:ring-rose-800 ring-inset' : ''}`}>
          {value}
        </div>
      </td>
    );
  }

  return (
    <td onClick={() => { setDraft(value); setEditing(true); }} className="p-1.5 border-r border-slate-100 dark:border-slate-800 cursor-pointer group/cell">
      <div className={`w-full h-11 rounded-xl flex items-center justify-center text-[11px] font-black transition-all group-hover/cell:ring-2 group-hover/cell:ring-indigo-400 group-hover/cell:bg-indigo-50 dark:group-hover/cell:bg-indigo-900/30 cursor-pointer ${isWeekend ? 'bg-amber-50/50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100' : 'bg-[#fff8ef] dark:bg-slate-800/40 text-slate-600 dark:text-slate-300'
        }`}>
        {value?.toLocaleString()}
      </div>
    </td>
  );
};

/** ─── Add Room Category Modal ───────────────────────────── */
const AddCategoryModal = ({ hotelId, onClose, onSaved }) => {
  const [form, setForm] = useState({ name: '', basePrice: '', totalRooms: '', capacity: 1 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!form.name || !form.basePrice || !form.totalRooms) { setError('All fields are required.'); return; }
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/rooms/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, hotelId, basePrice: Number(form.basePrice), totalRooms: Number(form.totalRooms), capacity: Number(form.capacity) })
      });
      const data = await res.json();
      onSaved(data);
      onClose();
    } catch (e) { setError('Failed to save.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-10 w-full max-w-md shadow-2xl ring-1 ring-white/10">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Add Room Category</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="w-5 h-5" /></button>
        </div>
        {error && <p className="text-rose-500 text-xs font-black mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</p>}
        <div className="space-y-4">
          {[
            { key: 'name', label: 'Category Name', placeholder: 'e.g. Deluxe Suite' },
            { key: 'basePrice', label: 'Base Price (IQD)', placeholder: 'e.g. 350000' },
            { key: 'totalRooms', label: 'Total Rooms', placeholder: 'e.g. 10' },
            { key: 'capacity', label: 'Capacity (guests)', placeholder: 'e.g. 2' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 block">{f.label}</label>
              <input
                type={f.key === 'name' ? 'text' : 'number'}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:text-white transition-all"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-4 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 disabled:opacity-70">
            {saving ? 'Saving...' : 'Add Category'}
          </button>
        </div>
      </div>
    </div>
  );
};

/** ─── Edit Category Modal ───────────────────────────── */
const EditCategoryModal = ({ category, onClose, onSaved }) => {
  const [form, setForm] = useState({ name: category.name, basePrice: category.basePrice });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!form.name || !form.basePrice) { setError('Name and Base Price are required.'); return; }
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/rooms/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, basePrice: Number(form.basePrice) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to sync');
      onSaved(data);
      onClose();
    } catch (e) { setError(e.message || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-10 w-full max-w-md shadow-2xl ring-1 ring-white/10">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Edit Rate Plan</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="w-5 h-5" /></button>
        </div>
        {error && <p className="text-rose-500 text-xs font-black mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 block">Rate Plan Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Standard Rate"
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:text-white transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 block">Base Rate (IQD)</label>
            <input
              type="number"
              value={form.basePrice}
              onChange={e => setForm(p => ({ ...p, basePrice: e.target.value }))}
              placeholder="e.g. 150000"
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:text-white transition-all"
            />
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-4 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 disabled:opacity-70">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

/** ─── Room/Rate Setup Content ────────────────────────────── */
const RoomRateSetup = ({ selectedHotelId, onCategoryAdded }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCat, setEditingCat] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/rooms/categories/${selectedHotelId}`);
      setCategories(await res.json());
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [selectedHotelId]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="p-8 animate-in fade-in duration-500 bg-white dark:bg-slate-900 mx-8 mt-6 rounded-[32px] border border-slate-200/60 dark:border-slate-800/60 shadow-2xl">
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl text-white text-sm font-black flex items-center gap-3 shadow-2xl bg-emerald-500">
          <Check className="w-4 h-4" /> {toast}
        </div>
      )}
      <div className="mb-8 flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Rate Plans & Master Setup</h2>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">Manage global baseline rates synced directly to your channels.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-16 text-center">
          <Hotel className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
          <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4">No setup found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[24px] border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white dark:bg-slate-800 text-primary-500 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg text-[9px] font-black text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 uppercase tracking-widest">{cat.totalRooms} Units</span>
                </div>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{cat.name}</h3>
              <div className="flex items-end gap-2 mb-6">
                <p className="text-2xl font-black text-primary-600 tracking-tighter">{cat.basePrice?.toLocaleString()}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-1">IQD / Night</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1.5"><Zap className="w-3 h-3 text-amber-500" /> Active on API</span>
                <button
                  onClick={() => setEditingCat(cat)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all flex items-center gap-2"
                >
                  <Edit2 className="w-3 h-3" /> Edit Setup
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingCat && (
        <EditCategoryModal
          category={editingCat}
          onClose={() => setEditingCat(null)}
          onSaved={() => { fetchCategories(); showToast('Rate Plan Updated!'); onCategoryAdded(); }}
        />
      )}
    </div>
  );
};

/** ─── Main Component ─────────────────────────────────────── */
const InventoryGrid = ({ selectedHotelId }) => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; });
  const [roomTypes, setRoomTypes] = useState([]);
  const [pendingChanges, setPendingChanges] = useState({}); // { 'catId|isoDate|type': value }
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error'
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'setup'

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + i);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      isWeekend: d.getDay() === 6 || d.getDay() === 0,
      isoDate: d.toISOString().split('T')[0]
    };
  });

  const fetchInventory = useCallback(async () => {
    if (!selectedHotelId) return;
    setIsLoading(true);
    try {
      const startDate = dates[0].isoDate;
      const endDate = dates[13].isoDate;
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/hotel/${selectedHotelId}?startDate=${startDate}&endDate=${endDate}`);
      const categories = await res.json();

      const mappedData = categories.map(cat => {
        const availArray = dates.map(d => {
          const inv = cat.inventory.find(i => i.date === d.isoDate);
          return inv ? inv.available : 0;
        });
        const ratesArray = dates.map(d => {
          const inv = cat.inventory.find(i => i.date === d.isoDate);
          return inv ? inv.price : cat.basePrice;
        });
        return {
          name: cat.name, id: cat.id, basePrice: cat.basePrice,
          ratePlans: [{ label: 'Standard Rate', channels: 'ALL CHANNELS', avail: availArray, rates: ratesArray }]
        };
      });
      setRoomTypes(mappedData);
      setPendingChanges({});
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  }, [selectedHotelId, currentDate]);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  const handleCellChange = (catId, isoDate, type, value) => {
    const key = `${catId}|${isoDate}|${type}`;
    setPendingChanges(prev => ({ ...prev, [key]: value }));
    setRoomTypes(prev => prev.map(rt => {
      if (rt.id !== catId) return rt;
      return {
        ...rt,
        ratePlans: rt.ratePlans.map(plan => {
          const dayIdx = dates.findIndex(d => d.isoDate === isoDate);
          if (dayIdx === -1) return plan;
          const arr = type === 'avail' ? [...plan.avail] : [...plan.rates];
          arr[dayIdx] = value;
          return type === 'avail' ? { ...plan, avail: arr } : { ...plan, rates: arr };
        })
      };
    }));
  };

  const handleSave = async () => {
    if (Object.keys(pendingChanges).length === 0) return;
    setIsSaving(true);
    try {
      // Group changes by catId + date
      const updates = {};
      for (const [key, value] of Object.entries(pendingChanges)) {
        const [catId, date, type] = key.split('|');
        const k = `${catId}|${date}`;
        if (!updates[k]) {
          const rt = roomTypes.find(r => r.id === catId);
          const dayIdx = dates.findIndex(d => d.isoDate === date);
          updates[k] = {
            categoryId: catId,
            date,
            price: rt?.ratePlans[0]?.rates[dayIdx] ?? rt?.basePrice ?? 0,
            available: rt?.ratePlans[0]?.avail[dayIdx] ?? 0
          };
        }
        if (type === 'avail') updates[k].available = value;
        if (type === 'rate') updates[k].price = value;
      }

      await Promise.all(Object.values(updates).map(u =>
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inventory/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(u)
        })
      ));
      setPendingChanges({});
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (e) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally { setIsSaving(false); }
  };

  const hasPending = Object.keys(pendingChanges).length > 0;

  if (!selectedHotelId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] dark:bg-slate-950">
        <div className="text-center">
          <Hotel className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2">No Hotel Selected</h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm">Go to Hotels and select a property to view inventory.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen font-sans text-slate-700 dark:text-slate-200 pb-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Channel Manager</h1>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">Live Inventory Control — Click any cell to edit</p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === 'success' && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
              <Check className="w-4 h-4" /> Saved!
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
              <X className="w-4 h-4" /> Save failed
            </div>
          )}
          {hasPending && !saveStatus && (
            <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-2 rounded-xl uppercase tracking-widest">
              {Object.keys(pendingChanges).length} unsaved
            </span>
          )}
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <Plus className="w-3.5 h-3.5" /> Add Category
          </button>
        </div>
      </div>

      {/* Sub-Header Tabs */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 mt-6">
        <div className="flex gap-8">
          <div onClick={() => setActiveTab('grid')} className={`px-2 py-4 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 cursor-pointer transition-colors relative ${activeTab === 'grid' ? 'border-primary-500 text-slate-900 dark:text-white' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
            Inventory Grid
            {activeTab === 'grid' && <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-500 shadow-[0_0_12px_rgba(240,73,97,0.5)]" />}
          </div>
          <div onClick={() => setActiveTab('setup')} className={`px-2 py-4 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 cursor-pointer transition-colors relative ${activeTab === 'setup' ? 'border-primary-500 text-slate-900 dark:text-white' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}>
            Room/Rate Setup
            {activeTab === 'setup' && <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-500 shadow-[0_0_12px_rgba(240,73,97,0.5)]" />}
          </div>
        </div>
      </div>

      {activeTab === 'setup' ? (
        <RoomRateSetup selectedHotelId={selectedHotelId} onCategoryAdded={() => fetchInventory()} />
      ) : (
        <>
          {/* Action Bar */}
          <div className="px-6 py-6 flex flex-wrap justify-between items-center gap-6">
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-1.5 shadow-sm hover:shadow-md transition-shadow">
              <button onClick={() => fetchInventory()} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-primary-500 transition-colors"><RotateCcw className="w-4 h-4 scale-x-[-1]" /></button>
              <div className="w-px h-6 bg-slate-100 dark:bg-slate-800 mx-1" />
              <button onClick={() => setCurrentDate(d => { const n = new Date(d); n.setDate(n.getDate() - 14); return n; })} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"><ChevronsLeft className="w-4 h-4" /></button>
              <button onClick={() => setCurrentDate(d => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; })} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-primary-500 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <span className="px-6 font-black text-slate-900 dark:text-white tracking-tight text-lg min-w-[160px] text-center">
                {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <button onClick={() => setCurrentDate(d => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; })} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-primary-500 transition-colors"><ChevronRight className="w-4 h-4" /></button>
              <button onClick={() => setCurrentDate(d => { const n = new Date(d); n.setDate(n.getDate() + 14); return n; })} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors"><ChevronsRight className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { fetchInventory(); setPendingChanges({}); }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
              <button
                onClick={handleSave}
                disabled={!hasPending || isSaving}
                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 relative overflow-hidden transition-all shadow-xl ${hasPending
                    ? 'bg-primary-600 text-white shadow-primary-500/30 hover:bg-primary-700 hover:-translate-y-1'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}>
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : `Save Changes${hasPending ? ` (${Object.keys(pendingChanges).length})` : ''}`}
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="px-6 pb-6 flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> &gt;5 Available</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> 1-5 Available</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Sold Out</span>
            <span className="flex items-center gap-2 ml-4 text-indigo-500"><Edit2 className="w-3 h-3" /> Click any cell to edit</span>
          </div>

          {/* Grid */}
          <div className="mx-6 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/50">
            {isLoading ? (
              <div className="p-16 text-center">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400 dark:text-slate-500 font-black text-xs uppercase tracking-widest">Loading inventory...</p>
              </div>
            ) : roomTypes.length === 0 ? (
              <div className="p-16 text-center">
                <Hotel className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4">No room categories found</p>
                <button onClick={() => setShowAddModal(true)} className="bg-primary-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all flex items-center gap-2 mx-auto">
                  <Plus className="w-3.5 h-3.5" /> Add First Category
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                      <th className="p-4 px-6 min-w-[200px] border-r border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <Layers className="w-5 h-5 text-slate-400" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Room / Rate Types</span>
                        </div>
                      </th>
                      <th className="w-20 border-r border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50" />
                      {dates.map((d, i) => (
                        <th key={i} className={`p-4 text-center border-r border-slate-100 dark:border-slate-800 min-w-[68px] relative overflow-hidden group ${d.isWeekend ? 'bg-rose-50/30 dark:bg-rose-900/10' : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/50'}`}>
                          {d.isWeekend && <div className="absolute top-0 inset-x-0 h-1 bg-rose-400/50 dark:bg-rose-500/30" />}
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mb-1">{d.day}</div>
                          <div className={`text-lg font-black tracking-tighter ${d.isWeekend ? 'text-rose-500 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>{d.date}</div>
                          <div className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mt-1">{d.month}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {roomTypes.map(room => (
                      <React.Fragment key={room.id}>
                        {/* Room Header */}
                        <tr className="bg-slate-100/30 dark:bg-slate-800/20 group">
                          <td className="p-6 font-black text-slate-900 dark:text-white flex items-center gap-4 border-r border-slate-100 dark:border-slate-800">
                            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700"><Hotel className="w-5 h-5 text-primary-500" /></div>
                            <div>
                              <span className="text-sm uppercase tracking-tight">{room.name}</span>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">Base: {room.basePrice?.toLocaleString()} IQD</p>
                            </div>
                          </td>
                          <td className="border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30" />
                          {dates.map((d, i) => <td key={i} className="border-r border-slate-100 dark:border-slate-800" />)}
                        </tr>

                        {/* Rate Plans */}
                        {room.ratePlans.map((plan, pIdx) => (
                          <React.Fragment key={pIdx}>
                            {/* AVAIL Row */}
                            <tr className="border-b border-slate-50 dark:border-slate-800/50 group hover:bg-slate-50/40 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="p-5 pl-10 border-r border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">{plan.label}</span>
                                    <p className="text-[9px] font-black text-primary-500 uppercase tracking-[0.2em] mt-1 flex items-center gap-1">
                                      {plan.channels} <ArrowRight className="w-2.5 h-2.5" />
                                    </p>
                                  </div>
                                  <Zap className="w-4 h-4 text-indigo-400/30 dark:text-indigo-400/20 group-hover:text-amber-400 transition-colors" />
                                </div>
                              </td>
                              <td className="bg-slate-50/80 dark:bg-slate-800/50 border-r border-slate-100 dark:border-slate-800 p-2 text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest text-center uppercase">AVAIL</td>
                              {plan.avail.map((v, i) => (
                                <EditableCell
                                  key={i}
                                  value={v}
                                  type="avail"
                                  isWeekend={dates[i].isWeekend}
                                  onChange={n => handleCellChange(room.id, dates[i].isoDate, 'avail', n)}
                                />
                              ))}
                            </tr>

                            {/* RATES Row */}
                            <tr className="border-b border-slate-50 dark:border-slate-800/50 group hover:bg-slate-50/40 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="p-5 pl-10 border-r border-slate-100 dark:border-slate-800 text-[11px]" />
                              <td className="bg-slate-50/80 dark:bg-slate-800/50 border-r border-slate-100 dark:border-slate-800 p-2 text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-widest text-center uppercase">Rate</td>
                              {plan.rates.map((v, i) => (
                                <EditableCell
                                  key={i}
                                  value={v}
                                  type="rate"
                                  isWeekend={dates[i].isWeekend}
                                  onChange={n => handleCellChange(room.id, dates[i].isoDate, 'rate', n)}
                                />
                              ))}
                            </tr>
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {showAddModal && (
        <AddCategoryModal
          hotelId={selectedHotelId}
          onClose={() => setShowAddModal(false)}
          onSaved={() => fetchInventory()}
        />
      )}
    </div>
  );
};

export default InventoryGrid;
