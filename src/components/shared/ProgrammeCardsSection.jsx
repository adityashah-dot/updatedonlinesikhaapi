"use client";
import React from 'react';
import { ArrowRight, Download } from 'lucide-react';
const MAX_SPECS = 5;
export const ProgrammeCardsSection = ({ sectionId, title, description, programmes, onOpenBrochure, onOpenApply, }) => {
    return (<section id={sectionId} className="page-section card bg-white rounded-2xl border border-[#e7eeff] shadow-xs scroll-mt-[130px]">
      <h2 className="section-title text-lg sm:text-xl font-bold text-[#000f22] font-sans">
        {title}
      </h2>
      <span className="block w-12 h-[4px] rounded-[4px] bg-[#115eaf] mt-1"/>
      <p className="section-description text-[13px] text-[#43474d] leading-relaxed font-normal">
        {description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-3">
        {programmes.map((p) => {
            const visibleSpecs = p.specialisations.slice(0, MAX_SPECS);
            const extraCount = p.specialisations.length - MAX_SPECS;
            return (<article key={p.id} className="flex flex-col min-w-0 px-3 pb-2.5 border border-[#e7eeff] border-l-[3px] border-l-[#115eaf] rounded-[10px] bg-white shadow-xs hover:shadow-sm hover:border-l-[#004689] transition-all">
              {/* Title */}
              <div className="pt-2.5 pb-1.5 border-b border-[#e7eeff]">
                <h3 className="text-[14px] leading-snug font-semibold text-[#000f22]">
                  {p.title}
                </h3>
                <p className="mt-0.5 text-[10px] font-normal text-[#74777e] leading-tight">
                  {p.subtitle}
                </p>
              </div>

              {/* Facts */}
              <div className="grid grid-cols-3 py-2 border-b border-[#e7eeff]">
                <div className="min-w-0 pr-1.5">
                  <span className="block text-[11px] leading-tight font-medium text-[#000f22] truncate">
                    {p.duration}
                  </span>
                  <span className="block text-[9px] leading-tight font-normal text-[#74777e]">
                    Duration
                  </span>
                </div>
                <div className="min-w-0 px-1.5 border-l border-[#e7eeff]">
                  <span className="block text-[11px] leading-tight font-medium text-[#115eaf] truncate">
                    {p.fee}
                  </span>
                  <span className="block text-[9px] leading-tight font-normal text-[#74777e]">
                    Total Fee
                  </span>
                </div>
                <div className="min-w-0 pl-1.5 border-l border-[#e7eeff]">
                  <span className="block text-[11px] leading-tight font-medium text-[#000f22] truncate">
                    {p.mode}
                  </span>
                  <span className="block text-[9px] leading-tight font-normal text-[#74777e]">
                    Mode
                  </span>
                </div>
              </div>

              {/* Specialisations */}
              <div className="py-2 flex-1">
                <h4 className="m-0 mb-1.5 text-[10px] font-medium text-[#74777e] uppercase tracking-wide">
                  Specialisations
                </h4>
                <div className="flex flex-wrap gap-1">
                  {visibleSpecs.map((s, index) => (<span key={`${p.id}-${s}-${index}`} className="px-1.5 py-0.5 border border-[#d5e3ff] rounded-[5px] bg-[#f0f3ff] text-[#43474d] text-[10px] leading-tight font-normal">
                      {s}
                    </span>))}
                  {extraCount > 0 && (<span key={`${p.id}-extra`} className="px-1.5 py-0.5 border border-[#d5e3ff] rounded-[5px] bg-white text-[#115eaf] text-[10px] leading-tight font-semibold">
                      +{extraCount}
                    </span>)}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#e7eeff]">
                {onOpenBrochure && (<button type="button" onClick={(e) => {
                        e.stopPropagation();
                        onOpenBrochure();
                    }} className="min-h-[44px] px-1.5 rounded-md text-[10px] font-semibold bg-white text-[#115eaf] border border-[#115eaf] hover:bg-[#f0f3ff] transition-colors flex items-center justify-center gap-1">
                    <Download className="w-3 h-3"/>
                    Brochure
                  </button>)}
                {onOpenApply && (<button type="button" onClick={(e) => {
                        e.stopPropagation();
                        onOpenApply();
                    }} className="min-h-[44px] px-1.5 rounded-md text-[10px] font-semibold bg-[#115eaf] text-white hover:bg-[#004689] transition-colors flex items-center justify-center gap-1 active:scale-95">
                    Apply Now
                    <ArrowRight className="w-2.5 h-2.5"/>
                  </button>)}
              </div>
            </article>);
        })}
      </div>
    </section>);
};
