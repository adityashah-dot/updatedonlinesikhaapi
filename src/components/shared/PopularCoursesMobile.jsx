"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { BarChart3, Monitor, Briefcase, BookOpen, Clock, ChevronDown, GraduationCap, } from 'lucide-react';
/* Site tints: brand #115eaf / #e7eeff, emerald, amber, purple */
const POPULAR_COURSES = [
    { name: 'Online B.Com', years: '3 Years', icon: 'com', tile: 'bg-amber-50 text-amber-600 border-amber-100' },
    { name: 'Online MCA', years: '2 Years', icon: 'tech', tile: 'bg-[#e7eeff] text-[#115eaf] border-[#d5e3ff]' },
    { name: 'Online BBA', years: '3 Years', icon: 'mgmt', tile: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { name: 'Online BA.JMC', years: '3 Years', icon: 'arts', tile: 'bg-purple-50 text-purple-600 border-purple-100' },
    { name: 'Online MBA', years: '2 Years', icon: 'mgmt', tile: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { name: 'Online M.Sc', years: '2 Years', icon: 'tech', tile: 'bg-[#e7eeff] text-[#115eaf] border-[#d5e3ff]' },
    { name: 'Online Global MBA', years: '2 Years', icon: 'mgmt', tile: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { name: 'Online BA', years: '3 Years', icon: 'arts', tile: 'bg-purple-50 text-purple-600 border-purple-100' },
    { name: 'Online BCA', years: '3 Years', icon: 'tech', tile: 'bg-[#e7eeff] text-[#115eaf] border-[#d5e3ff]' },
];
const MORE_COURSES = [
    { name: 'Online M.Com', years: '2 Years', icon: 'com', tile: 'bg-amber-50 text-amber-600 border-amber-100' },
    { name: 'Executive MBA', years: '2 Years', icon: 'mgmt', tile: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { name: 'Online PGDM', years: '2 Years', icon: 'mgmt', tile: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { name: 'Online MA', years: '2 Years', icon: 'arts', tile: 'bg-purple-50 text-purple-600 border-purple-100' },
    { name: 'Online BBA + MBA', years: '5 Years', icon: 'mgmt', tile: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
];
const CourseIconBox = ({ type, tile }) => {
    const Icon = type === 'com' ? BarChart3 : type === 'tech' ? Monitor : type === 'mgmt' ? Briefcase : BookOpen;
    return (<span className={`w-11 h-11 shrink-0 grid place-items-center rounded-xl border ${tile} transition-transform group-active:scale-95`}>
      <Icon className="w-6 h-6" strokeWidth={1.8}/>
    </span>);
};
export const PopularCoursesMobile = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const goCourses = () => router.push('/universities');
    const renderCard = (c, idx, hidden) => (<li key={`${c.name}-${idx}`} className={hidden && !open ? 'hidden' : ''}>
      <button type="button" onClick={goCourses} className="group w-full h-full flex flex-col items-center gap-2.5 p-3 bg-white rounded-[14px] border border-[#e3e8f2] shadow-[0_2px_8px_rgba(0,15,34,0.05)] transition-all duration-300 active:scale-[0.96] active:border-[#115eaf] focus-visible:outline-3 focus-visible:outline-[#115eaf] focus-visible:outline-offset-2 cursor-pointer">
        <CourseIconBox type={c.icon} tile={c.tile}/>
        <h3 className="m-0 min-h-[2.7em] flex items-center justify-center text-center text-xs leading-[1.35] font-semibold text-[#000f22] break-words">
          {c.name}
        </h3>
        <span className="mt-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#e7eeff] border border-[#d5e3ff] text-[#115eaf] text-[11px] font-semibold whitespace-nowrap">
          <Clock className="w-3 h-3 shrink-0" strokeWidth={1.8}/>
          {c.years}
        </span>
      </button>
    </li>);
    return (<section className="md:hidden bg-white rounded-xl border border-[#c4c6ce]/60 shadow-sm p-[17px]">
      <h2 className="m-0 text-[21px] leading-[1.3] font-bold text-[#000f22]">
        Explore some Popular Courses
      </h2>
      <p className="mt-1 mb-4 text-xs text-[#43474d]">Choose a program that fits your goal</p>

      <ul className="m-0 p-0 list-none grid grid-cols-3 gap-2.5">
        {POPULAR_COURSES.map((c, i) => renderCard(c, i, false))}
        {MORE_COURSES.map((c, i) => renderCard(c, i, true))}
      </ul>

      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex items-center justify-center gap-1.5 w-full max-w-[280px] min-h-[46px] mt-5 mx-auto px-4 rounded-xl border-[1.5px] border-[#115eaf] bg-white text-[#115eaf] text-sm font-semibold cursor-pointer transition-colors active:bg-[#e7eeff] focus-visible:outline-3 focus-visible:outline-[#115eaf] focus-visible:outline-offset-2">
        <span>{open ? 'Show less' : 'View all courses'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} strokeWidth={1.8}/>
      </button>

      <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-[#74777e]">
        <GraduationCap className="w-3.5 h-3.5 text-[#115eaf]"/>
        <span>UGC-DEB entitled degrees from NAAC accredited universities</span>
      </div>
    </section>);
};
