import React, { useState, useEffect } from 'react';
import { Hotel, Plus, MapPin, Phone, Mail, ArrowRight, MoreVertical, Wifi, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HOTEL_IMAGES = {
  'h1': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=300&h=200',
  'h2': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=300&h=200',
  'h3': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=300&h=200',
};

const Hotels = ({ selectedHotelId, onHotelChange }) => {
  const { t } = useTranslation();
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHotel, setNewHotel] = useState({ name: '', city: '', address: '', email: '', contact: '' });

  const fetchHotels = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/hotels`);
      const data = await res.json();
      setHotels(data);
    } catch (e) {
      console.error('Failed to fetch hotels:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleAddHotel = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHotel)
      });
      if (res.ok) {
        const addedHotel = await res.json();
        setHotels(prev => [...prev, addedHotel]);
        setShowAddModal(false);
        setNewHotel({ name: '', city: '', address: '', email: '', contact: '' });
      }
    } catch (e) {
      console.error('Failed to create hotel:', e);
    }
  };

  return (
    <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Property Portfolio</h2>
          <p className="text-slate-500 font-medium mt-1">Manage your hotel locations across Iraq. Select a hotel to view its inventory.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-[2px] hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> Add New Hotel
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse h-80" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {hotels.map((hotel, idx) => {
            const isSelected = selectedHotelId === hotel.id;
            const imgUrl = HOTEL_IMAGES[hotel.id] || `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=300&h=200`;
            return (
              <div
                key={hotel.id}
                onClick={() => onHotelChange && onHotelChange(hotel.id)}
                className={`bg-white dark:bg-slate-900 rounded-[32px] border-2 shadow-sm hover:shadow-2xl transition-all group overflow-hidden cursor-pointer ${isSelected
                    ? 'border-primary-500 shadow-primary-500/20 ring-2 ring-primary-500/20'
                    : 'border-slate-100 dark:border-slate-800 hover:border-primary-300'
                  }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={imgUrl} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {isSelected && (
                      <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary-500 text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                    <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white">
                      Live
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 border-4 border-primary-500/30 rounded-[28px] pointer-events-none" />
                  )}
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-xl font-black uppercase tracking-tight line-clamp-1 transition-colors ${isSelected ? 'text-primary-600' : 'text-slate-900 dark:text-white'}`}>
                      {hotel.name}
                    </h3>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <MapPin className="w-4 h-4 text-primary-500" />
                      {hotel.address}, {hotel.city}
                    </div>
                    {hotel.email && (
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <Mail className="w-3.5 h-3.5" />
                        {hotel.email}
                      </div>
                    )}
                    {hotel.contact && (
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                        <Phone className="w-3.5 h-3.5" />
                        {hotel.contact}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); onHotelChange && onHotelChange(hotel.id); }}
                    className={`w-full py-4 text-[10px] font-black uppercase tracking-[3px] rounded-2xl transition-all flex items-center justify-center gap-2 group/btn ${isSelected
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-primary-500 hover:text-white'
                      }`}
                  >
                    {isSelected ? 'Currently Selected' : 'Select Property'}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Hotel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-10 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Add New Hotel</h3>
            <div className="space-y-4">
              {['name', 'city', 'address', 'email', 'contact'].map(field => (
                <div key={field}>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">{field}</label>
                  <input
                    type="text"
                    value={newHotel[field]}
                    onChange={e => setNewHotel(prev => ({ ...prev, [field]: e.target.value }))}
                    placeholder={`Enter ${field}`}
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHotel}
                className="flex-1 py-4 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30"
              >
                Add Hotel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotels;
