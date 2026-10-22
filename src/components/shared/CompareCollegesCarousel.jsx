"use client";
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, X, ChevronRight } from 'lucide-react';
const inr = (v) => '\u20B9' + v.toLocaleString('en-IN');
export const CompareCollegesCarousel = ({ colleges = [] }) => {
    const COLLEGES = Object.fromEntries((colleges || []).map((college) => [college.key, college]));
    const initialPairs = [];
    for (let index = 0; index + 1 < (colleges || []).length; index += 2) {
        initialPairs.push([colleges[index].key, colleges[index + 1].key]);
    }
    const [pairs, setPairs] = useState(initialPairs);
    const [cur, setCur] = useState(0);
    const [compareOpen, setCompareOpen] = useState(false);
    const [pickOpen, setPickOpen] = useState(false);
    const [selected, setSelected] = useState([]);
    const [error, setError] = useState('');
    const [reduceMotion, setReduceMotion] = useState(false);
    const trackRef = useRef(null);
    const curRef = useRef(0);
    const pausedRef = useRef(false);
    const pairsRef = useRef(pairs);
    pairsRef.current = pairs;
    const anyOpen = compareOpen || pickOpen;
    const go = (i) => {
        const el = trackRef.current;
        if (el)
            el.scrollTo({ left: el.clientWidth * i, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    useEffect(() => {
        setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }, []);
    useEffect(() => {
        if (anyOpen || reduceMotion)
            return;
        const t = window.setInterval(() => {
            if (pausedRef.current || !pairsRef.current.length)
                return;
            const next = (curRef.current + 1) % pairsRef.current.length;
            curRef.current = next;
            setCur(next);
            go(next);
        }, 3200);
        return () => window.clearInterval(t);
    }, [anyOpen, reduceMotion, pairs.length]);
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') {
                setCompareOpen(false);
                setPickOpen(false);
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);
    const onScroll = () => {
        const el = trackRef.current;
        if (!el)
            return;
        const i = Math.round(el.scrollLeft / el.clientWidth);
        if (i !== curRef.current) {
            curRef.current = i;
            setCur(i);
        }
    };
    const openCompare = () => setCompareOpen(true);
    const openPick = () => {
        setSelected([]);
        setError('');
        setPickOpen(true);
    };
    const toggleSelected = (key) => {
        setSelected((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : prev.length >= 2 ? prev : [...prev, key]);
        setError('');
    };
    const addPair = () => {
        if (selected.length !== 2) {
            setError('Select exactly two colleges.');
            return;
        }
        const idx = pairs.length;
        setPairs((prev) => [...prev, selected]);
        curRef.current = idx;
        setCur(idx);
        setPickOpen(false);
        setSelected([]);
        requestAnimationFrame(() => requestAnimationFrame(() => go(idx)));
    };
    const renderColumn = (key) => {
        const c = COLLEGES[key];
        const hasLogo = Boolean(c.logo);
        return (<div className="min-w-0 rounded-xl border border-[#e7eeff] bg-[#f0f3ff] p-3">
        <div className="h-[70px] mb-3 rounded-lg border border-[#e7eeff] bg-white flex items-center justify-center overflow-hidden">
          {hasLogo && (<img src={c.logo} alt={`${c.name} logo`} className="max-w-[88%] max-h-[56px] object-contain" onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback)
                        fallback.classList.remove('hidden');
                }}/>)}
          <span className={`text-[17px] font-semibold tracking-wide ${hasLogo ? 'hidden' : ''}`} style={{ color: c.accent }}>
            {c.short}
          </span>
        </div>
        <div className="text-[14px] font-extrabold leading-[1.3] text-[#000f22] mb-2">{c.name}</div>
        <div className="flex items-center gap-1 text-[12px] text-[#43474d]">
          <MapPin className="w-3.5 h-3.5 text-[#115eaf] shrink-0"/>
          <span className="truncate">{c.loc}</span>
        </div>
      </div>);
    };
    const [aKey, bKey] = pairs[Math.min(cur, pairs.length - 1)] || [];
    const a = COLLEGES[aKey] || { name: '', short: '', logo: '', accent: '#12417a', loc: '', fee: 0, rank: '', mode: '', approvals: '', place: '' };
    const b = COLLEGES[bKey] || { name: '', short: '', logo: '', accent: '#12417a', loc: '', fee: 0, rank: '', mode: '', approvals: '', place: '' };
    const cheaper = a.fee < b.fee ? 0 : b.fee < a.fee ? 1 : -1;
    const rows = [
        { label: 'Total Fees', x: inr(a.fee), y: inr(b.fee), win: cheaper },
        { label: 'Ranking', x: a.rank || '—', y: b.rank || '—', win: -1 },
        { label: 'Mode', x: a.mode || '—', y: b.mode || '—', win: -1 },
        { label: 'Approvals', x: a.approvals || '—', y: b.approvals || '—', win: -1 },
        { label: 'Location', x: a.loc || '—', y: b.loc || '—', win: -1 },
        { label: 'Placement', x: a.place || '—', y: b.place || '—', win: -1 },
    ];
    return (<section id="compare-colleges-carousel" className="bg-white rounded-xl border border-[#c4c6ce]/60 shadow-sm p-[17px]">
      <p className="text-[13px] font-semibold text-[#115eaf]">Compare best with best</p>
        <h2 className="text-[20px] sm:text-2xl font-bold text-[#000f22] mt-0.5">
          Side-by-Side Comparison: Top Online Universities
        </h2>

        <div className="max-w-[520px] mx-auto mt-[17px] bg-white rounded-2xl border border-[#e7eeff] shadow-sm p-4">
          {pairs.length ? (<div ref={trackRef} onScroll={onScroll} onPointerEnter={() => (pausedRef.current = true)} onPointerLeave={() => (pausedRef.current = false)} onTouchStart={() => (pausedRef.current = true)} onTouchEnd={() => (pausedRef.current = false)} onFocus={() => (pausedRef.current = true)} onBlur={() => (pausedRef.current = false)} tabIndex={0} aria-label="College comparison pairs" className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden focus:outline-none">
          {pairs.map((pair, i) => (<div key={`${pair[0]}-${pair[1]}-${i}`} className="flex-none w-full snap-center px-0.5">
              <div className="relative grid grid-cols-2 gap-3.5">
                {renderColumn(pair[0])}
                {renderColumn(pair[1])}
                <span className="absolute left-1/2 top-[46px] -translate-x-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full bg-[#115eaf] text-white text-[12px] font-semibold flex items-center justify-center ring-[3px] ring-white">
                  Vs
                </span>
              </div>
            </div>))}
        </div>) : (<div className="rounded-xl border border-dashed border-[#c4c6ce] p-8 text-center">
          <p className="text-sm font-semibold text-[#000f22]">No universities to compare yet</p>
          <p className="text-[13px] text-[#43474d] font-normal mt-1">
            The university list is empty right now. Please try again shortly.
          </p>
        </div>)}

        <button type="button" onClick={openCompare} className="flex items-center justify-center gap-1 mx-auto mt-[18px] h-9 px-5 rounded-md bg-[#115eaf] text-white text-sm font-medium hover:bg-[#084a8c] transition-colors cursor-pointer">
          Compare
          <ChevronRight className="w-4 h-4"/>
        </button>
      </div>

      <div className="flex gap-1.5 justify-center mt-5">
        {pairs.map((_, i) => (<button key={i} type="button" aria-label={`Pair ${i + 1}`} onClick={() => {
                curRef.current = i;
                setCur(i);
                go(i);
            }} className="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer">
            <span className={`block w-[7px] h-[7px] rounded-full transition-colors ${i === cur ? 'bg-[#115eaf]' : 'bg-[#c4c6ce]'}`}/>
          </button>))}
      </div>

      <button type="button" onClick={openPick} className="block mx-auto mt-6 px-5 py-2 rounded-md border border-[#115eaf] bg-white text-[#115eaf] text-sm font-medium hover:bg-[#f0f3ff] transition-colors cursor-pointer">
        Compare More
      </button>

      {compareOpen && (<div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-[#0f3a5c]/50" onClick={(e) => {
                if (e.target === e.currentTarget)
                    setCompareOpen(false);
            }}>
          <div role="dialog" aria-modal="true" aria-label="Side-by-side comparison" className="bg-white w-full sm:max-w-[460px] max-h-[88vh] overflow-auto rounded-t-2xl sm:rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#000f22]">Side-by-side comparison</h3>
              <button type="button" aria-label="Close" onClick={() => setCompareOpen(false)} className="text-[#74777e] hover:text-[#000f22] cursor-pointer">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <table className="w-full border-collapse text-[12.5px]">
              <thead>
                <tr>
                  <td className="w-[28%]"/>
                  <td className="py-2.5 px-1.5 font-semibold text-[13px] text-[#000f22]">{a.name}</td>
                  <td className="py-2.5 px-1.5 font-semibold text-[13px] text-[#000f22]">{b.name}</td>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (<tr key={r.label}>
                    <th className="py-2.5 pr-1.5 text-left align-top font-medium text-[#43474d] border-b border-[#e7eeff]">
                      {r.label}
                    </th>
                    <td className={`py-2.5 px-1.5 align-top border-b border-[#e7eeff] ${r.win === 0 ? 'text-emerald-700 font-semibold' : 'text-[#000f22]'}`}>
                      {r.x}
                    </td>
                    <td className={`py-2.5 px-1.5 align-top border-b border-[#e7eeff] ${r.win === 1 ? 'text-emerald-700 font-semibold' : 'text-[#000f22]'}`}>
                      {r.y}
                    </td>
                  </tr>))}
              </tbody>
            </table>
            <p className="text-[11px] text-[#74777e] mt-2.5">
              Green marks the lower fee. Fee figures are indicative and subject to university revision.
            </p>
          </div>
        </div>)}

      {pickOpen && (<div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-[#0f3a5c]/50" onClick={(e) => {
                if (e.target === e.currentTarget)
                    setPickOpen(false);
            }}>
          <div role="dialog" aria-modal="true" aria-label="Pick two colleges" className="bg-white w-full sm:max-w-[460px] max-h-[88vh] overflow-auto rounded-t-2xl sm:rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#000f22]">Pick two colleges</h3>
              <button type="button" aria-label="Close" onClick={() => setPickOpen(false)} className="text-[#74777e] hover:text-[#000f22] cursor-pointer">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="grid gap-2">
              {Object.entries(COLLEGES).map(([key, c]) => {
                const on = selected.includes(key);
                return (<label key={key} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md border text-[13px] cursor-pointer transition-colors ${on ? 'border-[#115eaf] bg-[#f0f3ff]' : 'border-[#c4c6ce]'}`}>
                    <input type="checkbox" checked={on} onChange={() => toggleSelected(key)} className="accent-[#115eaf]"/>
                    <span className="min-w-0">
                      <span className="block font-medium text-[#000f22]">{c.name}</span>
                      <span className="block text-[11px] text-[#43474d]">{c.loc}</span>
                    </span>
                  </label>);
            })}
            </div>

            <p className="text-[12px] text-red-600 min-h-[18px] mt-2">{error}</p>
            <button type="button" onClick={addPair} className="w-full h-[38px] rounded-md bg-[#115eaf] text-white text-sm font-medium hover:bg-[#084a8c] transition-colors cursor-pointer">
              Add comparison
            </button>
          </div>
        </div>)}
    </section>);
};
