import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Hotel as HotelIcon, Star, Filter, ArrowRight, X, CheckCircle } from 'lucide-react';

const PublicHotelSearch = () => {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedHotelId, setExpandedHotelId] = useState(null);
  const [hotelInventory, setHotelInventory] = useState(null);
  const [hotelCategories, setHotelCategories] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  // Custom Search Calendar State
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState('checkIn');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [searchGuests, setSearchGuests] = useState('2');
  const [globalInventory, setGlobalInventory] = useState({});

  // Booking Modal State
  const [bookingHotel, setBookingHotel] = useState(null);
  const [bookingForm, setBookingForm] = useState({ checkIn: '', checkOut: '', categoryId: '', guestName: '', guests: 2 });
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/hotels`);
        const data = await res.json();
        setHotels(data);
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // 14 days range for hotel card calendar
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return {
      isoDate: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
    };
  });

  // 35 days range for custom global search calendar
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return {
      isoDate: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  useEffect(() => {
    const fetchGlobalAvailability = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/hotels');
        const allHotels = await res.json();
        const start = today.toISOString().split('T')[0];
        const endDate = new Date(today.getTime() + 35 * 86400000);
        const end = endDate.toISOString().split('T')[0];

        let agg = {};
        for (const h of allHotels) {
          const rr = await fetch(`http://localhost:5000/api/inventory/hotel/${h.id}?startDate=${start}&endDate=${end}`);
          const cats = await rr.json();
          cats.forEach(c => {
            c.inventory.forEach(inv => {
              agg[inv.date] = (agg[inv.date] || 0) + inv.available;
            });
          });
        }
        setGlobalInventory(agg);
      } catch (e) { console.warn(e); }
    };
    fetchGlobalAvailability();
  }, []);

  const handleDateSelect = (date) => {
    if (calendarMode === 'checkIn') {
      setCheckIn(date);
      if (checkOut && date >= checkOut) setCheckOut('');
      setCalendarMode('checkOut');
    } else {
      if (date <= checkIn) {
        setCheckIn(date);
        setCheckOut('');
      } else {
        setCheckOut(date);
        setShowCalendar(false);
      }
    }
  };

  const fetchInventory = async (hotelId) => {
    if (expandedHotelId === hotelId) {
      setExpandedHotelId(null);
      return;
    }
    setExpandedHotelId(hotelId);
    setLoadingInventory(true);
    try {
      const startDate = dates[0].isoDate;
      const endDate = dates[13].isoDate;
      const res = await fetch(`http://localhost:5000/api/inventory/hotel/${hotelId}?startDate=${startDate}&endDate=${endDate}`);
      const categories = await res.json();
      setHotelCategories(categories);

      // Calculate total availability per day across all categories
      const dailyAvail = {};
      dates.forEach(d => {
        let total = 0;
        categories.forEach(cat => {
          const inv = cat.inventory.find(i => i.date === d.isoDate);
          if (inv) total += inv.available;
        });
        dailyAvail[d.isoDate] = total;
      });
      setHotelInventory(dailyAvail);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInventory(false);
    }
  };

  useEffect(() => {
    if (searchQuery !== '') {
      setIsSearching(true);
      const timeout = setTimeout(() => setIsSearching(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [searchQuery]);

  const handleBookNow = (hotel) => {
    setBookingHotel(hotel);
    setBookingSuccess(false);
    // Auto-fill dates and guests from search if they exist
    setBookingForm({ ...bookingForm, checkIn: checkIn || dates[1].isoDate, checkOut: checkOut || dates[3].isoDate, categoryId: '', guestName: '', guests: searchGuests || 2 });
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setSubmittingBooking(true);
    try {
      const selectedCat = hotelCategories.find(c => c.id === bookingForm.categoryId);
      let nights = 1;
      if (bookingForm.checkIn && bookingForm.checkOut) {
        const days = Math.round((new Date(bookingForm.checkOut) - new Date(bookingForm.checkIn)) / (86400000));
        if (days > 0) nights = days;
      }
      const totalAmount = selectedCat ? (selectedCat.basePrice * nights) : 0;

      const payload = {
        hotelId: bookingHotel.id,
        guestName: bookingForm.guestName,
        checkIn: bookingForm.checkIn,
        checkOut: bookingForm.checkOut,
        status: "Confirmed",
        source: "Public Web",
        totalAmount,
        roomNumber: "TBD"
      };

      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingHotel(null);
          setBookingSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingBooking(false);
    }
  };

  const filteredHotels = hotels.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      {/* Navigation Top Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-50 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-500/30">
            G
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            Gate2<span className="text-primary-600">Hotels</span>
          </span>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all">
            Support
          </button>
          <a href="/" className="px-6 py-2.5 rounded-full text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-0.5">
            Partner Login
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
          Find your next <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-rose-500">perfect stay.</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl mb-12">
          Discover premium properties across our curated network. Book direct, get the best rates, and experience unparalleled hospitality.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-4xl bg-white p-3 rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row gap-3 relative z-30">
          <div className="flex-1 bg-slate-50 rounded-[20px] p-4 flex items-center gap-3 hover:bg-slate-100 transition-colors cursor-text group border border-transparent focus-within:border-primary-200 relative min-w-0">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors shrink-0" />
            <div className="flex-1 text-left min-w-0">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5 whitespace-nowrap">Location/Hotel</label>
              <input
                type="text"
                placeholder="Where to?"
                value={searchQuery}
                onFocus={() => setShowAutocomplete(true)}
                onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none font-bold text-slate-900 placeholder-slate-300"
              />
            </div>

            {/* Autocomplete Dropdown */}
            {showAutocomplete && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 max-h-96 overflow-y-auto">
                <div className="p-2">
                  {(() => {
                    const q = searchQuery.toLowerCase();
                    const matchedCities = [...new Set(hotels.map(h => h.city))].filter(c => c.toLowerCase().includes(q));
                    const matchedHotels = hotels.filter(h => h.name.toLowerCase().includes(q));

                    if (matchedCities.length === 0 && matchedHotels.length === 0) {
                      return <div className="p-4 text-center text-sm font-black text-slate-400">No matches found</div>;
                    }

                    return (
                      <>
                        {matchedCities.length > 0 && (
                          <div className="mb-2">
                            <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Destinations</p>
                            {matchedCities.map(city => (
                              <button
                                key={city}
                                onMouseDown={(e) => { e.preventDefault(); setSearchQuery(city); setShowAutocomplete(false); }}
                                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 rounded-xl transition-colors group/item"
                              >
                                <MapPin className="w-4 h-4 text-slate-400 group-hover/item:text-primary-500" />
                                <span className="font-bold text-slate-700">{city}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {matchedHotels.length > 0 && (
                          <div>
                            <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Properties</p>
                            {matchedHotels.map(hotel => (
                              <button
                                key={hotel.id}
                                onMouseDown={(e) => { e.preventDefault(); setSearchQuery(hotel.name); setShowAutocomplete(false); }}
                                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-slate-50 rounded-xl transition-colors group/item"
                              >
                                <HotelIcon className="w-4 h-4 text-slate-400 group-hover/item:text-primary-500" />
                                <div>
                                  <p className="font-bold text-slate-700">{hotel.name}</p>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{hotel.city}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Custom Date Picker Group */}
          <div className="hidden md:flex bg-slate-50 rounded-[20px] p-2 items-center gap-1 hover:bg-slate-100 transition-colors border border-transparent flex-[1.5] relative min-w-0">
            <div
              onClick={() => { setShowCalendar(!showCalendar); setCalendarMode('checkIn'); }}
              className={`flex-1 flex items-center gap-3 p-3 rounded-[14px] cursor-pointer transition-all ${calendarMode === 'checkIn' && showCalendar ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-slate-200/50'}`}
            >
              <Calendar className={`w-5 h-5 shrink-0 transition-colors ${calendarMode === 'checkIn' && showCalendar ? 'text-primary-500' : 'text-slate-400'}`} />
              <div className="text-left flex-1 min-w-0">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5 whitespace-nowrap cursor-pointer">Check In</label>
                <div className="font-bold text-slate-900 text-sm truncate">{checkIn || 'Add Date'}</div>
              </div>
            </div>

            <div className="w-[1px] h-8 bg-slate-200 shrink-0"></div>

            <div
              onClick={() => { setShowCalendar(!showCalendar); setCalendarMode('checkOut'); }}
              className={`flex-1 flex items-center gap-3 p-3 rounded-[14px] cursor-pointer transition-all ${calendarMode === 'checkOut' && showCalendar ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-slate-200/50'}`}
            >
              <Calendar className={`w-5 h-5 shrink-0 transition-colors ${calendarMode === 'checkOut' && showCalendar ? 'text-primary-500' : 'text-slate-400'}`} />
              <div className="text-left flex-1 min-w-0">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5 whitespace-nowrap cursor-pointer">Check Out</label>
                <div className="font-bold text-slate-900 text-sm truncate">{checkOut || 'Add Date'}</div>
              </div>
            </div>

            {/* Custom Calendar Popup */}
            {showCalendar && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 p-6 z-[120] w-[450px] animate-in fade-in slide-in-from-top-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Select {calendarMode === 'checkIn' ? 'Check-In' : 'Check-Out'} Date</h4>
                    <div className="flex gap-3 text-[9px] font-black uppercase tracking-widest text-slate-500 mt-2">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Limited</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Sold Out</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setShowCalendar(false); }} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((d, i) => {
                    const avail = globalInventory[d.isoDate] || 0;

                    const isSelected = d.isoDate === checkIn || d.isoDate === checkOut;
                    const isInRange = checkIn && checkOut && d.isoDate > checkIn && d.isoDate < checkOut;

                    let bgClass = '';
                    let textClass = 'text-slate-700';
                    let borderClass = 'border-transparent';

                    if (isSelected) {
                      bgClass = 'bg-slate-900';
                      textClass = 'text-white';
                    } else if (isInRange) {
                      bgClass = 'bg-slate-100';
                      textClass = 'text-slate-900';
                    } else if (avail > 15) {
                      bgClass = 'bg-emerald-50 hover:bg-emerald-100';
                      textClass = 'text-emerald-700';
                      borderClass = 'border-emerald-100';
                    } else if (avail > 0) {
                      bgClass = 'bg-amber-50 hover:bg-amber-100';
                      textClass = 'text-amber-700';
                      borderClass = 'border-amber-100';
                    } else {
                      bgClass = 'bg-rose-50/50 opacity-60 cursor-not-allowed';
                      textClass = 'text-rose-700';
                      borderClass = 'border-rose-100';
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (avail === 0 && !isSelected && !isInRange) return;
                          handleDateSelect(d.isoDate);
                        }}
                        className={`p-2 rounded-xl text-center border transition-all flex flex-col items-center justify-center ${bgClass} ${textClass} ${borderClass}`}
                      >
                        <span className="text-[9px] uppercase font-bold opacity-80 mb-0.5">{d.dayName}</span>
                        <span className="font-black text-[13px] tracking-tighter">{d.dateNum}</span>
                        <span className="text-[8px] uppercase font-bold opacity-80 mt-0.5">{d.monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:flex bg-slate-50 rounded-[20px] p-4 items-center gap-3 hover:bg-slate-100 transition-colors border border-transparent flex-1 relative min-w-0">
            <Users className="w-5 h-5 text-slate-400 shrink-0" />
            <div className="text-left flex-1 relative min-w-0">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5 whitespace-nowrap">Guests</label>
              <select
                value={searchGuests}
                onChange={(e) => setSearchGuests(e.target.value)}
                className="w-full bg-transparent border-none outline-none font-bold text-slate-900 text-sm cursor-pointer appearance-none z-10 relative"
              >
                <option value="1">1 Adult</option>
                <option value="2">2 Adults</option>
                <option value="3">3 Adults</option>
                <option value="4">4 Adults</option>
                <option value="5">5+ Adults</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' })}
            className="bg-primary-600 text-white rounded-[20px] px-8 py-4 font-black text-sm uppercase tracking-widest hover:bg-primary-700 transition-all hover:shadow-xl shadow-primary-500/30 md:ml-2"
          >
            Search
          </button>
        </div>
      </div>

      {/* Hotel Listings */}
      <div id="results-section" className="max-w-7xl mx-auto px-8 pb-32 pt-10">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Available Properties</h2>
          <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors px-4 py-2 border border-slate-200 rounded-xl hover:bg-white">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {isLoading || isSearching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 h-[400px] animate-pulse">
                <div className="h-48 bg-slate-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-200 rounded-md w-2/3"></div>
                  <div className="h-4 bg-slate-200 rounded-md w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100">
            <HotelIcon className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-xl font-black text-slate-900 mb-2">No properties found</h3>
            <p className="text-slate-500">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHotels.map(hotel => (
              <div key={hotel.id} className="group bg-white rounded-[32px] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-[0_20px_50px_-15px_rgba(240,73,97,0.15)] hover:-translate-y-2 transition-all duration-500 flex flex-col cursor-pointer">
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <HotelIcon className="w-20 h-20 text-white/5" />
                  </div>
                  {/* Decorative Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
                  <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-1 font-black text-xs text-slate-900 shadow-lg">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> 4.8
                  </div>
                  <div className="absolute bottom-4 left-6 z-20 text-white">
                    <h3 className="text-2xl font-black tracking-tight mb-1 group-hover:text-primary-400 transition-colors drop-shadow-md">{hotel.name}</h3>
                    <div className="flex items-center gap-1 text-sm font-medium text-white/80">
                      <MapPin className="w-3.5 h-3.5" /> {hotel.city}
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {hotel.regions && hotel.regions.map(r => (
                      <span key={r} className="px-2 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-lg">
                        {r}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Starting from</p>
                      <p className="text-xl font-black text-slate-900 tracking-tighter">
                        {hotel.startingPrice ? hotel.startingPrice.toLocaleString() : '150,000'} <span className="text-sm text-slate-400 font-bold uppercase ml-1">IQD</span>
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); fetchInventory(hotel.id); }}
                      className="bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white px-5 py-3 rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest transition-all group-hover:shadow-lg shadow-primary-500/20"
                    >
                      <Calendar className="w-4 h-4" /> Check Dates
                    </button>
                  </div>
                </div>

                {/* Extrapolated Live Availability Calendar */}
                {expandedHotelId === hotel.id && (
                  <div className="bg-slate-50 border-t border-slate-100 p-6 animate-in slide-in-from-top-4 fade-in duration-300 cursor-default" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Live Availability Next 14 Days</h4>
                      <div className="flex gap-3 text-[9px] font-black uppercase tracking-widest text-slate-500">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Sold Out</span>
                      </div>
                    </div>
                    {loadingInventory ? (
                      <div className="flex justify-center py-6">
                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-7 gap-2 mb-6">
                          {dates.map((d, i) => {
                            const avail = hotelInventory ? hotelInventory[d.isoDate] : 0;
                            const bgClass = avail > 5 ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                              : avail > 0 ? 'bg-amber-100 text-amber-700 border-amber-200'
                                : 'bg-rose-100 text-rose-700 border-rose-200 opacity-70';
                            return (
                              <div key={i} className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border ${bgClass}`}>
                                <span className="text-[9px] font-bold uppercase mb-0.5">{d.dayName}</span>
                                <span className="text-sm font-black tracking-tighter">{d.dateNum}</span>
                              </div>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => handleBookNow(hotel)}
                          className="w-full bg-slate-900 text-white rounded-xl py-4 font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all hover:-translate-y-0.5 shadow-xl shadow-slate-900/20"
                        >
                          Book Now at {hotel.name}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking ModalOverlay */}
      {bookingHotel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setBookingHotel(null)}></div>
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {bookingSuccess ? (
              <div className="p-16 flex flex-col items-center text-center">
                <CheckCircle className="w-24 h-24 text-emerald-500 mb-6" />
                <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Booking Confirmed!</h3>
                <p className="text-slate-500 font-medium text-lg">Your stay at {bookingHotel.name} is successfully booked.</p>
              </div>
            ) : (
              <div className="p-10">
                <button onClick={() => setBookingHotel(null)} className="absolute top-8 right-8 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
                <div className="mb-8 pl-2">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Book your stay</h3>
                  <p className="text-slate-500 font-medium flex items-center gap-2"><MapPin className="w-4 h-4" /> {bookingHotel.name}, {bookingHotel.city}</p>
                </div>

                <form onSubmit={submitBooking} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Check In</label>
                      <input type="date" required value={bookingForm.checkIn} onChange={e => setBookingForm({ ...bookingForm, checkIn: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Check Out</label>
                      <input type="date" required value={bookingForm.checkOut} onChange={e => setBookingForm({ ...bookingForm, checkOut: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Room Type</label>
                      <select required value={bookingForm.categoryId} onChange={e => setBookingForm({ ...bookingForm, categoryId: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 outline-none appearance-none transition-all">
                        <option value="">Select a room type...</option>
                        {hotelCategories.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} (Max {c.capacity} Guests) - {c.basePrice.toLocaleString()} IQD
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Guests</label>
                      <select required value={bookingForm.guests} onChange={e => setBookingForm({ ...bookingForm, guests: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 outline-none appearance-none transition-all">
                        <option value="1">1 Adult</option>
                        <option value="2">2 Adults</option>
                        <option value="3">3 Adults</option>
                        <option value="4">4 Adults</option>
                        <option value="5">5+ Adults</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Full Name</label>
                    <input type="text" required placeholder="John Doe" value={bookingForm.guestName} onChange={e => setBookingForm({ ...bookingForm, guestName: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary-500/10 outline-none transition-all" />
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Stay</p>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">
                        {(() => {
                          if (!bookingForm.categoryId || !bookingForm.checkIn || !bookingForm.checkOut) return 0;
                          const cat = hotelCategories.find(c => c.id === bookingForm.categoryId);
                          if (!cat) return 0;
                          let n = Math.ceil((new Date(bookingForm.checkOut) - new Date(bookingForm.checkIn)) / 86400000);
                          if (n < 1) n = 1;
                          return (cat.basePrice * n).toLocaleString();
                        })()}
                        <span className="text-sm text-slate-400 font-bold uppercase ml-1">IQD</span>
                      </p>
                    </div>
                    <button type="submit" disabled={submittingBooking || hotelCategories.length === 0} className="w-1/2 bg-primary-600 text-white rounded-2xl py-4 font-black text-sm uppercase tracking-widest hover:bg-primary-700 transition-all hover:shadow-xl shadow-primary-500/30 disabled:opacity-50">
                      {submittingBooking ? 'Wait...' : 'Confirm Book'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default PublicHotelSearch;
