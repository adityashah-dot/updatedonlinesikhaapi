"use client";
import React from 'react';
import { MapPin, Download } from 'lucide-react';
export const CompareCollegesSection = ({ title, description, logo, name, location, tags, onOpenBrochure, onOpenHelpDesk, sectionId = 'compare-colleges', }) => {
    return (<section id={sectionId} className="page-section card bg-white rounded-2xl border border-[#e7eeff] shadow-xs scroll-mt-[130px]">
      <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] font-sans">
        {title ?? 'Compare'}
      </h2>
      <p className="section-description text-sm text-[#43474d] leading-relaxed font-normal">
        {description}
      </p>

      {/* MAIN COMPARISON BOX — same as LPU */}
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_55px_minmax(0,1fr)] items-stretch gap-3 p-4 border border-[#e7eeff] rounded-2xl bg-white shadow-sm mt-[18px]">
        {/* SELECTED COLLEGE CARD */}
        <div className="min-h-[220px] rounded-xl border border-[#e7eeff] bg-[#f0f3ff] p-4 flex flex-col justify-between">
          <div>
            <span className="inline-flex mb-2 px-2 py-1 rounded-full bg-[#e7eeff] text-[#115eaf] text-[11px] font-bold">
              Selected
            </span>

            <div className="flex gap-4 items-center">
              <div className="w-[115px] h-[85px] shrink-0 rounded-lg border border-[#e7eeff] bg-white flex items-center justify-center overflow-hidden">
                <img src={logo} alt={`${name} Logo`} className="max-w-full max-h-full object-contain p-1.5" onError={(e) => {
            e.target.style.display = 'none';
        }}/>
              </div>
              <div>
                <h3 className="mb-1.5 text-[19px] leading-tight font-extrabold text-[#000f22] font-sans">
                  {name}
                </h3>
                <p className="mt-[7.5px] flex items-center gap-1.5 text-sm text-[#43474d]">
                  <MapPin className="w-3.5 h-3.5 text-[#115eaf] shrink-0"/>
                  {location}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.map((tag) => (<span key={tag} className="px-2 py-1 rounded-[7px] bg-white border border-[#d5e3ff] text-[11px] font-normal text-[#43474d]">
                  {tag}
                </span>))}
            </div>
          </div>

          <button onClick={() => onOpenBrochure()} className="w-full h-11 mt-4 flex items-center justify-center gap-2 rounded-lg border border-[#115eaf] bg-white text-[#115eaf] text-sm font-bold hover:bg-[#f0f3ff] transition-all">
            <Download className="w-4 h-4"/>
            Brochure
          </button>
        </div>

        {/* VS */}
        <div className="compare-vs flex items-center justify-center">
          <span className="w-11 h-11 rounded-full flex items-center justify-center bg-[#115eaf] text-white text-sm font-extrabold">
            VS
          </span>
        </div>

        {/* ADD COLLEGE CARD */}
        <div className="min-h-[220px] rounded-xl border border-dashed border-[#d5e3ff] bg-[#f9f9ff] p-4 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full border border-[#d5e3ff] bg-white flex items-center justify-center text-[#115eaf] text-2xl font-light mb-2.5">
            +
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#000f22] font-sans">Add College</h3>
            <p className="mt-[7.5px] text-[13px] leading-relaxed text-[#43474d] font-normal">
              Select another college to compare side by side.
            </p>
          </div>
          <button onClick={() => onOpenHelpDesk()} className="w-full h-11 mt-4 rounded-lg border-none bg-[#0b2540] text-white text-sm font-bold hover:bg-[#011c37] transition-all">
            Add College
          </button>
        </div>
      </div>
    </section>);
};
