"use client";
import React, { useState } from 'react';
import { Download, Bookmark, MapPin, ChevronRight, Check, Sparkles, ChevronDown, RotateCcw, Building2 } from 'lucide-react';
import { INDIAN_STATES_CITIES, INDIAN_STATES } from '@/data/indianLocations';
const LOCATION_TABS = [
    'All India',
    'Delhi/NCR',
    'Hyderabad',
    'Bangalore',
    'Pune',
    'Chennai',
    'Mumbai (All)',
];
// Curated list of popular education hubs for the dropdown
const POPULAR_HUBS = [
    { value: 'All India', label: 'All India (All Locations)' },
    { value: 'Delhi/NCR', label: 'Delhi / NCR (New Delhi, Gurgaon, Noida, Faridabad)' },
    { value: 'Bangalore', label: 'Bengaluru / Bangalore' },
    { value: 'Mumbai', label: 'Mumbai / Navi Mumbai' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Kolkata', label: 'Kolkata' },
    { value: 'Ahmedabad', label: 'Ahmedabad / Gandhinagar' },
    { value: 'Jaipur', label: 'Jaipur' },
    { value: 'Chandigarh', label: 'Chandigarh / Mohali / Punjab' },
    { value: 'Lucknow', label: 'Lucknow / Uttar Pradesh' },
    { value: 'Kochi', label: 'Kochi / Kerala' },
];
export const TopCollegesByLocation = ({ onOpenBrochure, colleges = [] }) => {
    const [selectedLocation, setSelectedLocation] = useState('All India');
    const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
    const [preferredLocation, setPreferredLocation] = useState('Delhi/NCR');
    const [savedNotification, setSavedNotification] = useState(null);
    const [activePage, setActivePage] = useState(0);
    const toggleBookmark = (id) => {
        setBookmarkedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            }
            else {
                next.add(id);
            }
            return next;
        });
    };
    const handleLocationChange = (loc) => {
        setSelectedLocation(loc);
        setActivePage(0);
    };
    const handleSavePreference = (loc) => {
        setPreferredLocation(loc);
        setSelectedLocation(loc);
        setActivePage(0);
        setSavedNotification(`Location preference saved: ${loc}`);
        setTimeout(() => {
            setSavedNotification(null);
        }, 2800);
    };
    // Filter colleges based on selected location
    const filteredColleges = (colleges || []).filter((c) => {
        if (selectedLocation === 'All India')
            return true;
        const locLower = selectedLocation.toLowerCase().trim();
        const cityLower = c.city.toLowerCase();
        const stateLower = c.state.toLowerCase();
        const catLower = c.locationCategory.toLowerCase();
        // Check exact or partial matches
        if (catLower === locLower)
            return true;
        if (catLower.includes(locLower) || locLower.includes(catLower))
            return true;
        if (cityLower === locLower || cityLower.includes(locLower) || locLower.includes(cityLower))
            return true;
        if (stateLower === locLower || stateLower.includes(locLower) || locLower.includes(stateLower))
            return true;
        // Handle aliases like Bangalore / Bengaluru
        if ((locLower.includes('bangalore') || locLower.includes('bengaluru')) &&
            (cityLower.includes('bangalore') || cityLower.includes('bengaluru') || catLower.includes('bangalore'))) {
            return true;
        }
        // Handle Mumbai / Navi Mumbai / Mumbai (All)
        if (locLower.includes('mumbai') && (cityLower.includes('mumbai') || catLower.includes('mumbai'))) {
            return true;
        }
        // Handle Delhi NCR regions
        if (locLower.includes('delhi') || locLower.includes('ncr')) {
            return catLower.includes('delhi') || stateLower.includes('delhi') ||
                ['gurugram', 'gurgaon', 'noida', 'faridabad', 'sonepat', 'kurukshetra', 'ambala', 'new delhi'].includes(cityLower);
        }
        // Handle Punjab / Chandigarh / Mohali
        if (locLower.includes('punjab') || locLower.includes('chandigarh')) {
            return stateLower.includes('punjab') || catLower.includes('chandigarh') || ['mojali', 'mohali', 'phagwara', 'jalandhar'].includes(cityLower);
        }
        // Check state in INDIAN_STATES_CITIES
        const stateCities = INDIAN_STATES_CITIES[selectedLocation];
        if (stateCities && stateCities.some(city => cityLower.includes(city.toLowerCase()) || city.toLowerCase().includes(cityLower))) {
            return true;
        }
        return false;
    });
    // Determine which tab pill is active
    const isCustomLocationActive = !LOCATION_TABS.includes(selectedLocation) && selectedLocation !== 'All India';
    // Mobile list paging (compact rows instead of tall cards)
    const pageSize = 5;
    const pageCount = Math.max(1, Math.ceil(filteredColleges.length / pageSize));
    const safePage = Math.min(activePage, pageCount - 1);
    const pagedColleges = filteredColleges.slice(safePage * pageSize, safePage * pageSize + pageSize);
    const emptyState = (<div className="bg-[#f8faff] rounded-2xl border border-dashed border-[#c4c6ce] p-8 text-center space-y-3">
      <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-[#115eaf] flex items-center justify-center">
        <Building2 className="w-6 h-6"/>
      </div>
      <h3 className="text-base font-bold text-[#000f22]">
        No listed colleges found for &quot;{selectedLocation}&quot;
      </h3>
      <p className="text-xs sm:text-sm text-[#74777e] max-w-md mx-auto">
        We are constantly expanding our verified campus network. You can view all colleges across India or talk with our academic counselors for distance/online options in your city.
      </p>
      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={() => handleLocationChange('All India')} className="px-4 py-2 bg-[#115eaf] hover:bg-[#0c4a8a] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs">
          View All India Colleges
        </button>
        <button type="button" onClick={() => onOpenBrochure?.()} className="px-4 py-2 bg-white border border-[#c4c6ce] hover:border-[#115eaf] text-[#000f22] rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer">
          Speak with Academic Advisor
        </button>
      </div>
    </div>);
    return (<section className="bg-white rounded-2xl border border-[#c4c6ce]/60 shadow-sm p-4 sm:p-6 space-y-4 font-sans">
      {/* Header & 'Select Location' Filter Dropdown Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 pb-1">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shrink-0 shadow-2xs">
              📍
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Top Colleges by location
              </h2>
              <p className="text-xs text-[#74777e] mt-0.5">
                Compare accredited universities and colleges across Indian cities
              </p>
            </div>
          </div>

          {/* Location preference (mobile) — full width under the intro line */}
          <div className="md:hidden mt-3 rounded-2xl border border-blue-200/70 bg-gradient-to-br from-white to-[#f0f4f8] p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-[#115eaf] min-w-0">
                  <Sparkles className="w-3.5 h-3.5 shrink-0"/>
                  <span className="text-[11px] font-bold uppercase tracking-wider truncate">
                    Location preference
                  </span>
                </div>
                <button type="button" onClick={() => handleSavePreference(preferredLocation)} className="shrink-0 h-10 px-4 rounded-full bg-[#115eaf] hover:bg-[#084a8c] text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-1">
                  <span>Save</span>
                  <ChevronRight className="w-3.5 h-3.5"/>
                </button>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {LOCATION_TABS.slice(0, 6).map((loc) => {
            const isSel = preferredLocation === loc;
            return (<button key={loc} type="button" onClick={() => setPreferredLocation(loc)} className={`h-8 shrink-0 px-3 rounded-full text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${isSel
                    ? 'bg-[#115eaf] text-white font-semibold'
                    : 'bg-white border border-slate-200 text-slate-700'}`}>
                      {loc}
                    </button>);
        })}
              </div>
            </div>
          </div>

        {/* 'Select Location' Filter Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#115eaf]">
              <MapPin className="w-4 h-4"/>
            </div>
            <select id="select-location-filter" aria-label="Select Location filter" value={selectedLocation} onChange={(e) => handleLocationChange(e.target.value)} className="w-full pl-9 pr-9 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-[#000f22] bg-white border border-[#c4c6ce] hover:border-[#115eaf] focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/20 rounded-xl transition-all cursor-pointer appearance-none shadow-2xs [background-image:none]" style={{ backgroundImage: 'none' }}>
              <optgroup label="All Locations">
                <option value="All India">📍 All India (All Cities)</option>
              </optgroup>

              <optgroup label="Popular Educational Hubs">
                {POPULAR_HUBS.filter(h => h.value !== 'All India').map(hub => (<option key={hub.value} value={hub.value}>
                    {hub.label}
                  </option>))}
              </optgroup>

              <optgroup label="Filter by State">
                {INDIAN_STATES.filter(s => s !== 'Other State / UT').map(state => (<option key={state} value={state}>
                    State: {state}
                  </option>))}
              </optgroup>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#74777e]">
              <ChevronDown className="w-4 h-4"/>
            </div>
          </div>

          {selectedLocation !== 'All India' && (<button type="button" onClick={() => handleLocationChange('All India')} title="Reset location filter to All India" className="p-2 sm:p-2.5 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1 shadow-2xs">
              <RotateCcw className="w-3.5 h-3.5"/>
              <span className="hidden md:inline text-[11px] font-medium">Reset</span>
            </button>)}
        </div>
      </div>

      {/* Location Filter Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {LOCATION_TABS.map((tab) => {
            const isActive = selectedLocation === tab;
            return (<button key={tab} type="button" onClick={() => handleLocationChange(tab)} className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${isActive
                    ? 'border-2 border-[#115eaf] text-[#115eaf] font-bold bg-blue-50/60 shadow-2xs scale-[1.02]'
                    : 'border border-[#d1d5db] text-[#4b5563] bg-white hover:border-[#115eaf] hover:text-[#115eaf]'}`}>
              {tab}
            </button>);
        })}

        {/* Custom Location Active Pill (if selected via dropdown and not in default pills) */}
        {isCustomLocationActive && (<div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-[#115eaf] text-white shadow-2xs whitespace-nowrap shrink-0">
            <span>📍 {selectedLocation}</span>
            <button type="button" onClick={() => handleLocationChange('All India')} className="ml-1 text-white/80 hover:text-white cursor-pointer" aria-label="Clear location filter">
              ×
            </button>
          </div>)}

        <div className="max-lg:ml-0 text-xs text-[#74777e] font-medium whitespace-nowrap shrink-0 pl-2">
          {filteredColleges.length} {filteredColleges.length === 1 ? 'College' : 'Colleges'} Found
        </div>
      </div>

      {/* Notification Toast if Saved */}
      {savedNotification && (<div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600"/>
          <span>{savedNotification}</span>
        </div>)}

      {/* ================= MOBILE: compact college list ================= */}
      <div className="md:hidden">
        {filteredColleges.length > 0 ? (<div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden divide-y divide-slate-100">
            {pagedColleges.map((college) => (<div key={college.id} className="flex items-center gap-3 p-3">
                <div className="w-11 h-11 shrink-0 rounded-xl border border-blue-100 bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] flex items-center justify-center">
                  <span className="text-[11px] font-extrabold text-[#115eaf] tracking-wider">
                    {college.logoLetter}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1" title={college.name}>
                    {college.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 min-w-0">
                      <MapPin className="w-3 h-3 text-[#115eaf] shrink-0"/>
                      <span className="truncate">{college.city}{college.state ? `, ${college.state}` : ''}</span>
                    </span>
                    <span className="inline-flex shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                      {college.nirf}
                    </span>
                    <span className="shrink-0 inline-flex items-center gap-0.5 text-amber-500 font-medium">
                      ★ <span className="text-slate-700 font-semibold">{college.rating}</span>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  <span className="text-[13px] font-bold text-slate-900 leading-none">
                    {college.totalFees}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => toggleBookmark(college.id)} aria-label="Bookmark college" className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${bookmarkedIds.has(college.id)
                    ? 'border-amber-400 bg-amber-50 text-amber-600'
                    : 'border-slate-200 text-slate-500 hover:text-amber-600 bg-white'}`}>
                      <Bookmark className={`w-4 h-4 ${bookmarkedIds.has(college.id) ? 'fill-amber-500 text-amber-500' : ''}`}/>
                    </button>
                    <button type="button" onClick={() => onOpenBrochure?.()} aria-label="Download brochure" className="w-9 h-9 rounded-lg bg-[#115eaf] hover:bg-[#084a8c] text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs">
                      <Download className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              </div>))}
          </div>) : (emptyState)}

        {/* Mobile paging dots */}
        {pageCount > 1 && (<div className="flex items-center justify-center gap-2 pt-3">
            {Array.from({ length: pageCount }).map((_, i) => (<button key={i} type="button" onClick={() => setActivePage(i)} className="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer" aria-label={`Page ${i + 1}`}>
                <span className={`block h-1.5 rounded-full transition-all ${safePage === i ? 'w-8 bg-[#115eaf]' : 'w-6 bg-slate-300'}`}/>
              </button>))}
          </div>)}
      </div>

      {/* ================= DESKTOP: original card grid ================= */}
      <div className="hidden md:block relative">
        {filteredColleges.length > 0 ? (<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: College Item */}
            {filteredColleges.slice(0, 1).map((college) => (<div key={college.id} className="snap-start md:snap-auto bg-white rounded-2xl border border-slate-200/90 hover:border-[#115eaf]/60 transition-all duration-200 p-3 sm:p-4 md:p-5 flex flex-col justify-between shadow-2xs hover:shadow-md group">
                <div>
                  <div className="flex items-start justify-between gap-2.5 mb-2">
                    <h3 className="text-sm sm:text-[15px] md:text-base font-bold text-slate-900 group-hover:text-[#115eaf] leading-snug transition-colors line-clamp-2">
                      {college.name}
                    </h3>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl border border-blue-100 p-1 flex items-center justify-center shrink-0 bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] shadow-2xs">
                      <span className="text-[11px] sm:text-[12px] font-extrabold text-[#115eaf] tracking-wider">
                        {college.logoLetter}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-xs mb-2.5 sm:mb-3">
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#115eaf] shrink-0"/>
                      <span className="truncate">{college.city}{college.state ? `, ${college.state}` : ''}</span>
                    </span>
                    {college.nirf ? (<span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 shrink-0">
                      {college.nirf}
                    </span>) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2.5 sm:pt-3 pb-2.5 sm:pb-4 border-t border-slate-100 text-xs">
                    <div>
                      <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">COURSES</span>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 font-semibold text-slate-800">
                        <span className="text-[#115eaf] font-semibold">{college.courses}</span>
                        {college.rating ? (<>
                          <span className="text-slate-200">|</span>
                          <span className="inline-flex items-center gap-0.5 text-amber-500 font-medium">
                            ★ <span className="text-slate-800 font-semibold">{college.rating}</span>
                          </span>
                        </>) : null}
                      </div>
                    </div>
                    <div>
                      <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">TOTAL FEES</span>
                      <div className="mt-1 font-bold text-slate-900 text-sm tracking-tight">{college.totalFees}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1.5 sm:pt-2">
                  <button type="button" onClick={() => toggleBookmark(college.id)} aria-label="Bookmark college" className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${bookmarkedIds.has(college.id)
                    ? 'border-amber-400 bg-amber-50 text-amber-600 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-500 hover:text-amber-600 hover:bg-slate-50 bg-white'}`}>
                    <Bookmark className={`w-4 h-4 ${bookmarkedIds.has(college.id) ? 'fill-amber-500 text-amber-500' : ''}`}/>
                  </button>
                  <button type="button" onClick={() => onOpenBrochure?.()} className="flex-1 py-2 sm:py-2.5 px-3 bg-[#115eaf] hover:bg-[#084a8c] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md active:scale-[0.99] transition-all cursor-pointer max-md:min-h-[44px]">
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4"/>
                    <span className="truncate">Download Brochure</span>
                  </button>
                </div>
              </div>))}

            {/* Card 2: Interactive Location Preference Card with Frosted Glass Styling */}
            <div className="snap-start md:snap-auto relative bg-gradient-to-br from-white/95 via-[#f8faff]/95 to-[#f0f4f8]/90 backdrop-blur-md rounded-2xl border border-blue-200/70 p-3 sm:p-4 md:p-5 flex flex-col justify-between shadow-2xs overflow-hidden">
              {/* Subtle glass reflection highlight */}
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#115eaf]/5 rounded-full blur-xl pointer-events-none"/>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5 text-[#115eaf]">
                  <Sparkles className="w-3.5 h-3.5 text-[#115eaf]"/>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#115eaf]">Recommendation</span>
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 mb-2 sm:mb-3 leading-snug">
                  What is your location preference?
                </h3>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {LOCATION_TABS.slice(0, 6).map((loc) => {
                const isSel = preferredLocation === loc;
                return (<button key={loc} type="button" onClick={() => setPreferredLocation(loc)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${isSel
                        ? 'bg-[#115eaf] text-white font-semibold shadow-xs'
                        : 'bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-700 hover:border-[#115eaf] hover:text-[#115eaf]'}`}>
                        {loc}
                      </button>);
            })}
                </div>
              </div>

              <div className="flex justify-end pt-1.5 sm:pt-2">
                <button type="button" onClick={() => handleSavePreference(preferredLocation)} className="px-4 sm:px-5 py-2 rounded-full sm:py-2.5 bg-[#115eaf] hover:bg-[#084a8c] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 max-md:min-h-[40px]">
                  <span>Save to profile</span>
                  <ChevronRight className="w-3.5 h-3.5"/>
                </button>
              </div>
            </div>

            {/* Cards 3+: Remaining Colleges in row */}
            {filteredColleges.slice(1, 5).map((college) => (<div key={college.id} className="snap-start md:snap-auto bg-white rounded-2xl border border-slate-200/90 hover:border-[#115eaf]/60 transition-all duration-200 p-3 sm:p-4 md:p-5 flex flex-col justify-between shadow-2xs hover:shadow-md group">
                <div>
                  <div className="flex items-start justify-between gap-2.5 mb-2">
                    <h3 className="text-sm sm:text-[15px] md:text-base font-bold text-slate-900 group-hover:text-[#115eaf] leading-snug transition-colors line-clamp-2">
                      {college.name}
                    </h3>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl border border-blue-100 p-1 flex items-center justify-center shrink-0 bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] shadow-2xs">
                      <span className="text-[11px] sm:text-[12px] font-extrabold text-[#115eaf] tracking-wider">
                        {college.logoLetter}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-xs mb-2.5 sm:mb-3">
                    <span className="flex items-center gap-1.5 text-slate-600 font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#115eaf] shrink-0"/>
                      <span className="truncate">{college.city}{college.state ? `, ${college.state}` : ''}</span>
                    </span>
                    {college.nirf ? (<span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70 shrink-0">
                      {college.nirf}
                    </span>) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-2.5 sm:pt-3 pb-2.5 sm:pb-4 border-t border-slate-100 text-xs">
                    <div>
                      <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">COURSES</span>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 font-semibold text-slate-800">
                        <span className="text-[#115eaf] font-semibold">{college.courses}</span>
                        {college.rating ? (<>
                          <span className="text-slate-200">|</span>
                          <span className="inline-flex items-center gap-0.5 text-amber-500 font-medium">
                            ★ <span className="text-slate-800 font-semibold">{college.rating}</span>
                          </span>
                        </>) : null}
                      </div>
                    </div>
                    <div>
                      <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">TOTAL FEES</span>
                      <div className="mt-1 font-bold text-slate-900 text-sm tracking-tight">{college.totalFees}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1.5 sm:pt-2">
                  <button type="button" onClick={() => toggleBookmark(college.id)} aria-label="Bookmark college" className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${bookmarkedIds.has(college.id)
                    ? 'border-amber-400 bg-amber-50 text-amber-600 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-500 hover:text-amber-600 hover:bg-slate-50 bg-white'}`}>
                    <Bookmark className={`w-4 h-4 ${bookmarkedIds.has(college.id) ? 'fill-amber-500 text-amber-500' : ''}`}/>
                  </button>
                  <button type="button" onClick={() => onOpenBrochure?.()} className="flex-1 py-2 sm:py-2.5 px-3 bg-[#115eaf] hover:bg-[#084a8c] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md active:scale-[0.99] transition-all cursor-pointer max-md:min-h-[44px]">
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4"/>
                    <span className="truncate">Download Brochure</span>
                  </button>
                </div>
              </div>))}
          </div>) : (emptyState)}

        {/* Carousel Next Arrow (Floating on right edge, like in design) */}
        {filteredColleges.length > 2 && (<button type="button" onClick={() => {
                const nextIdx = (LOCATION_TABS.indexOf(selectedLocation) + 1) % LOCATION_TABS.length;
                handleLocationChange(LOCATION_TABS[nextIdx]);
            }} className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-lg items-center justify-center text-slate-700 hover:text-black hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer" aria-label="Next location" title="Next location colleges">
            <ChevronRight className="w-5 h-5"/>
          </button>)}
      </div>

      {/* Slider Indicator at bottom (desktop) */}
      <div className="hidden md:flex items-center justify-center gap-2 pt-2">
        <button type="button" onClick={() => setActivePage(0)} className={`h-1.5 rounded-full transition-all cursor-pointer ${activePage === 0 ? 'w-8 bg-[#115eaf]' : 'w-6 bg-slate-300'}`} aria-label="Page 1"/>
        <button type="button" onClick={() => setActivePage(1)} className={`h-1.5 rounded-full transition-all cursor-pointer ${activePage === 1 ? 'w-8 bg-[#115eaf]' : 'w-6 bg-slate-300'}`} aria-label="Page 2"/>
      </div>
    </section>);
};
