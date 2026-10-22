"use client";
import React from 'react';
import { PhoneCall } from 'lucide-react';
export const FloatingActions = ({ onOpenCounselorModal, }) => {
    return (<aside aria-label="Quick counselor assistance" className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex items-center">
      {/* Redesigned Counselor Help Floating Button */}
      <button type="button" onClick={onOpenCounselorModal} className="flex items-center justify-center gap-2 sm:gap-2.5 min-h-[44px] min-w-[44px] bg-white hover:bg-[#f8faff] text-[#000f22] p-1.5 sm:pl-2.5 sm:pr-4 sm:py-2.5 rounded-full shadow-lg shadow-slate-900/10 hover:shadow-xl border border-[#d5e3ff] hover:border-[#115eaf] transition-all duration-200 active:scale-95 group font-sans cursor-pointer" aria-label="Counselor Help — request a free callback" title="Free Academic Counselor Help">
        <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-[#115eaf] text-white flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105">
          <PhoneCall className="w-3 h-3 sm:w-4 sm:h-4 text-white"/>
        </div>
        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="block text-xs font-semibold text-[#000f22] leading-tight font-sans">
              Counselor Help
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
          </div>
          <span className="block text-[10px] text-[#555960] font-normal leading-tight mt-0.5 font-sans">
            100% Free Advice
          </span>
        </div>
      </button>
    </aside>);
};
