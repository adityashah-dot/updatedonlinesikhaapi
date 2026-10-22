"use client";
import React, { useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import { Search, ShieldCheck, ArrowRight, Download, CheckCircle, ChevronRight, Headphones, GraduationCap, Wallet, ChevronDown, Sparkles, } from 'lucide-react';
import { HomeFaq } from '../shared/HomeFaq';
import { TopCollegesByLocation } from '../shared/TopCollegesByLocation';
import { StudentTestimonials } from '../shared/StudentTestimonials';
import { PopularCoursesMobile } from '../shared/PopularCoursesMobile';
import { CompareCollegesCarousel } from '../shared/CompareCollegesCarousel';
import { BlogsListSection } from '../shared/BlogsListSection';
const TRENDING_FILTERS = [
    'NAAC A++ Only',
    'Under ₹1 Lakh Total',
    'Zero-Cost EMI',
    '100% Online Exam',
];
const HERO_METRICS = [
    { value: '50+', label: 'Entitled Universities' },
    { value: '180+', label: 'Recognized Degrees' },
    { value: '5,00,000+', label: 'Students Guided', tone: 'text-[#115eaf]' },
    { value: '100%', label: 'Zero-Cost EMI Options', tone: 'text-emerald-700' },
];
const DEGREE_CATEGORIES = ["Master's (PG)", "Bachelor's (UG)", 'Executive Tracks'];
const DEGREE_CARDS = [
    {
        title: 'Online MBA',
        subtitle: 'Master of Business Administration',
        duration: '2 Years • 4 Sems',
        badge: 'High Placement Rate',
        badgeTone: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        rows: [
            { label: 'Specializations:', value: '19+ (Data, Finance, Marketing, HR)' },
            { label: 'Avg Career CTC:', value: '₹7.2 - 14.5 LPA', tone: 'text-[#115eaf] font-semibold' },
        ],
        price: '₹18,500',
        explore: 'Explore 28 Unis',
    },
    {
        title: 'Online MCA',
        subtitle: 'Master of Computer Applications',
        duration: '2 Years • 4 Sems',
        badge: 'AI & Cloud Ready',
        badgeTone: 'text-purple-700 bg-purple-50 border-purple-200',
        rows: [
            { label: 'Specializations:', value: 'AI, Cloud, Full-Stack, Cyber' },
            { label: 'Avg Career CTC:', value: '₹6.5 - 16.0 LPA', tone: 'text-[#115eaf] font-semibold' },
        ],
        price: '₹22,000',
        explore: 'Explore 22 Unis',
    },
    {
        title: 'Online BBA',
        subtitle: 'Bachelor of Business Administration',
        duration: '3 Years • 6 Sems',
        badge: 'Entry Degree',
        badgeTone: 'text-blue-700 bg-blue-50 border-blue-200',
        rows: [
            { label: 'Specializations:', value: 'Digital Marketing, Finance, HR' },
            { label: 'Eligibility:', value: '10+2 with 50% Any Stream' },
        ],
        price: '₹14,000',
        explore: 'Explore 19 Unis',
    },
    {
        title: 'Online BCA',
        subtitle: 'Bachelor of Computer Applications',
        duration: '3 Years • 6 Sems',
        badge: 'Tech Career Starter',
        badgeTone: 'text-indigo-700 bg-indigo-50 border-indigo-200',
        rows: [
            { label: 'Core Tracks:', value: 'Full-Stack, Python, Cloud' },
            { label: 'Practical Labs:', value: '100% Virtual Cloud Sandbox', tone: 'text-emerald-700 font-medium' },
        ],
        price: '₹15,000',
        explore: 'Explore 17 Unis',
    },
    {
        title: 'Online B.Com / M.Com',
        subtitle: 'Commerce & Corporate Finance',
        duration: 'UG & PG Available',
        badge: 'ACCA & US CMA Options',
        badgeTone: 'text-amber-800 bg-amber-50 border-amber-200',
        rows: [
            { label: 'Accounting Certs:', value: 'Integrated ACCA 9-Paper Exemption' },
            { label: 'Govt Exam Validity:', value: '100% Valid (UPSC/Banking)', tone: 'text-emerald-700 font-medium' },
        ],
        price: '₹12,000',
        explore: 'Explore 15 Unis',
    },
    {
        title: 'Online BA / MA',
        subtitle: 'Humanities & Social Sciences',
        duration: 'UG & PG Tracks',
        badge: 'Affordable Fee',
        badgeTone: 'text-slate-700 bg-slate-100 border-slate-300',
        rows: [
            { label: 'Disciplines:', value: 'Journalism, English, Public Policy' },
            { label: 'Best For:', value: 'Civil Services Aspirants' },
        ],
        price: '₹11,000',
        explore: 'Explore 14 Unis',
    },
];
const UNI_CHIPS = ['All Unis', 'NAAC A++', 'NAAC A+'];
const universityHref = (university) => {
    const slug = university?.slug || '';
    return slug ? `/universities/${slug}` : '';
};

export const HomeView = ({ onOpenApply, onOpenHelpDesk, featuredUnis = [], locationColleges = [], compareColleges = [], blogs = [], error = '' }) => {
    const router = useRouter();
    const [degreeTab, setDegreeTab] = useState("Master's (PG)");
    const [selectedDegree, setSelectedDegree] = useState('Online MBA (Master of Business)');
    const [selectedBudget, setSelectedBudget] = useState('Any Budget (₹12,000 - ₹50,000)');
    const [lead, setLead] = useState({ phone: '', email: '', degree: 'Online MBA' });
    const [leadSubmitted, setLeadSubmitted] = useState(false);
    const [uniChip, setUniChip] = useState(UNI_CHIPS[0]);
    const uniRowRef = useRef(null);
    const filteredFeaturedUnis = uniChip === 'NAAC A++'
        ? featuredUnis.filter((u) => (u.naac || '').includes('A++'))
        : uniChip === 'NAAC A+'
            ? featuredUnis.filter((u) => (u.naac || '').includes('A+') && !(u.naac || '').includes('A++'))
            : featuredUnis;
    const selectUniChip = (chip) => {
        setUniChip(chip);
        uniRowRef.current?.scrollTo({ left: 0 });
    };
    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };
    const handleExploreSubmit = (e) => {
        e.preventDefault();
        router.push('/universities');
    };
    return (<div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-5 space-y-5">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-[#e2e8f0] bg-gradient-to-br from-[#edf6ff] via-white to-[#f8fbff] p-6 md:p-8 shadow-[0_20px_60px_rgba(17,94,175,0.08)]">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-[#dbeafe]/60 via-[#e0f2fe]/30 to-[#d1fae5]/30 blur-2xl"/>
        <div className="absolute -left-14 top-10 h-40 w-40 rounded-full bg-[#60a5fa]/20 blur-3xl"/>
        <div className="absolute -right-12 bottom-0 h-48 w-48 rounded-full bg-[#2dd4bf]/10 blur-3xl"/>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e2e8f0] text-[#1f2937] text-[11px] font-semibold tracking-wide shadow-sm text-center">
            <ShieldCheck className="w-4 h-4 text-[#115eaf] shrink-0"/>
            <span className="sm:hidden">UGC-DEB • NAAC A++ Approved</span>
            <span className="hidden sm:inline">UGC-DEB • AICTE • NAAC A++ ACCREDITED UNIVERSITIES</span>
          </div>
          <h1 className="text-[26px] sm:text-3xl md:text-5xl font-extrabold font-sans tracking-tight leading-[1.25] sm:leading-tight">
            <span className="block text-[#000f22]">Explore Top UGC-DEB Approved</span>
            <span className="block bg-gradient-to-r from-[#115eaf] via-[#2563eb] to-[#0d9488] bg-clip-text text-transparent">
              Online Universities in India
            </span>
          </h1>
          <p className="text-[#475569] text-[15px] md:text-[16px] max-w-2xl mx-auto leading-relaxed">
            Find government-recognized online degrees designed for working professionals with zero-cost EMI and 100% remote proctored exams.
          </p>

          <div className="mt-6 bg-[#f8faff] rounded-2xl border border-[#d5e3ff] p-4 sm:p-5 shadow-sm text-left">
            <form className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-3.5 items-stretch" onSubmit={handleExploreSubmit}>
              {/* Select Degree Dropdown */}
              <div className="md:col-span-4 min-h-[60px] sm:min-h-[62px] relative bg-white hover:bg-[#f8faff] focus-within:bg-white rounded-xl border border-[#c4c6ce] focus-within:border-[#115eaf] focus-within:ring-2 focus-within:ring-[#115eaf]/15 transition-all px-3.5 py-2 flex flex-col justify-center shadow-xs">
                <div className="flex items-center gap-1.5 mb-1 leading-none">
                  <GraduationCap className="w-3.5 h-3.5 text-[#115eaf] shrink-0"/>
                  <label htmlFor="select-degree" className="block text-[11px] font-semibold text-[#43474d] uppercase tracking-wider cursor-pointer truncate">
                    Select Degree Program
                  </label>
                </div>
                <div className="relative flex items-center">
                  <select id="select-degree" value={selectedDegree} onChange={(e) => setSelectedDegree(e.target.value)} className="w-full bg-transparent border-0 p-0 pr-6 text-base sm:text-sm text-[#000f22] font-semibold focus:ring-0 cursor-pointer outline-none appearance-none truncate [background-image:none]" style={{ backgroundImage: 'none' }}>
                    <option value="Online MBA (Master of Business)">Online MBA (Master of Business)</option>
                    <option value="Online MCA (Computer Applications)">Online MCA (Computer Applications)</option>
                    <option value="Online BBA (Bachelor of Business)">Online BBA (Bachelor of Business)</option>
                    <option value="Online BCA (Computer Science)">Online BCA (Computer Science)</option>
                    <option value="Online M.Com / B.Com">Online M.Com / B.Com</option>
                    <option value="Online MA / BA">Online MA / BA</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#74777e] pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 shrink-0"/>
                </div>
              </div>

              {/* Budget Per Semester Dropdown */}
              <div className="md:col-span-4 min-h-[60px] sm:min-h-[62px] relative bg-white hover:bg-[#f8faff] focus-within:bg-white rounded-xl border border-[#c4c6ce] focus-within:border-[#115eaf] focus-within:ring-2 focus-within:ring-[#115eaf]/15 transition-all px-3.5 py-2 flex flex-col justify-center shadow-xs">
                <div className="flex items-center gap-1.5 mb-1 leading-none">
                  <Wallet className="w-3.5 h-3.5 text-[#115eaf] shrink-0"/>
                  <label htmlFor="select-budget" className="block text-[11px] font-semibold text-[#43474d] uppercase tracking-wider cursor-pointer truncate">
                    Budget Per Semester
                  </label>
                </div>
                <div className="relative flex items-center">
                  <select id="select-budget" value={selectedBudget} onChange={(e) => setSelectedBudget(e.target.value)} className="w-full bg-transparent border-0 p-0 pr-6 text-base sm:text-sm text-[#000f22] font-semibold focus:ring-0 cursor-pointer outline-none appearance-none truncate [background-image:none]" style={{ backgroundImage: 'none' }}>
                    <option value="Any Budget (₹12,000 - ₹50,000)">Any Budget (₹12,000 - ₹50,000)</option>
                    <option value="Under ₹15,000 / semester">Under ₹15,000 / semester</option>
                    <option value="₹15,000 - ₹25,000 / semester">₹15,000 - ₹25,000 / semester</option>
                    <option value="₹25,000 - ₹40,000 / semester">₹25,000 - ₹40,000 / semester</option>
                    <option value="Premium Tier (&gt; ₹40,000 / sem)">Premium Tier (&gt; ₹40,000 / sem)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#74777e] pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 shrink-0"/>
                </div>
              </div>

              {/* Explore Button */}
              <div className="md:col-span-4 min-h-[60px] sm:min-h-[62px]">
                <button type="submit" className="w-full h-full rounded-xl bg-[#115eaf] hover:bg-[#084a8c] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-md hover:shadow-lg cursor-pointer px-4">
                  <Search className="w-4 h-4 shrink-0"/>
                  <span>Explore 50+ Universities</span>
                </button>
              </div>
            </form>

            <div className="mt-3.5 pt-3.5 border-t border-[#d5e3ff]/70 flex flex-wrap items-center gap-2 text-[12px]">
              <span className="text-[#43474d] font-medium mr-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500"/>
                Trending Filters:
              </span>
              {TRENDING_FILTERS.map((f) => (<button key={f} type="button" onClick={() => scrollTo('universities')} className="cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-[#c4c6ce]/70 text-[#111c2d] hover:border-[#115eaf] hover:text-[#115eaf] transition-colors font-medium text-xs">
                  {f}
                </button>))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-[17px] pt-4">
            {HERO_METRICS.map((m) => (<div key={m.label} className="p-3 bg-[#f0f4f8]/60 rounded-lg border border-[#c4c6ce]/50 text-center">
                <div className={`text-xl md:text-2xl font-bold ${m.tone || 'text-[#000f22]'}`}>{m.value}</div>
                <div className="text-[12px] text-[#43474d] font-normal">{m.label}</div>
              </div>))}
          </div>
        </div>
      </section>

      {/* Popular Courses — mobile only */}
      <PopularCoursesMobile />

      {/* Degree programs */}
      <section id="degrees" className="bg-white rounded-xl border border-[#c4c6ce]/60 shadow-sm p-[17px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-[#c4c6ce]/40 gap-3">
          <div>
            <h2 className="text-[20px] sm:text-2xl font-bold text-[#000f22]">Popular Online Degree Programs</h2>
            <p className="text-[13px] text-[#43474d] font-normal mt-0.5">
              Approved under UGC Section 22 with equivalence to conventional regular degrees.
            </p>
          </div>
          <div className="inline-flex flex-nowrap max-w-full overflow-x-auto p-1 bg-[#f0f4f8] rounded-lg border border-[#c4c6ce]/50 text-[11px] font-semibold [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {DEGREE_CATEGORIES.map((cat) => (<button key={cat} type="button" onClick={() => setDegreeTab(cat)} className={`px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${degreeTab === cat ? 'bg-[#115eaf] text-white shadow-sm' : 'text-[#43474d] hover:text-[#111c2d]'}`}>
                {cat}
              </button>))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[17px] mt-[17px]">
          {DEGREE_CARDS.map((card) => (<div key={card.title} className="bg-white rounded-lg border border-[#c4c6ce] hover:border-[#115eaf] transition-all hover:shadow-md p-[17px] flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                    {card.duration}
                  </span>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${card.badgeTone}`}>
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#000f22]">{card.title}</h3>
                <p className="text-[12px] text-[#43474d] font-normal mt-1">{card.subtitle}</p>
                <div className="mt-3 py-2 border-y border-[#c4c6ce]/40 text-[12px] space-y-1">
                  {card.rows.map((r) => (<div key={r.label} className="flex justify-between text-[#43474d] gap-2">
                      <span>{r.label}</span>
                      <span className={`text-right ${r.tone || 'font-medium text-[#000f22]'}`}>{r.value}</span>
                    </div>))}
                </div>
              </div>
              <div className="mt-4 pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#43474d] block">Starts from</span>
                  <span className="text-[15px] font-bold text-[#000f22]">
                    {card.price} <span className="text-[11px] font-normal text-[#43474d]">/ sem</span>
                  </span>
                </div>
                <button type="button" onClick={() => scrollTo('universities')} className="px-3 py-1.5 min-h-[44px] md:min-h-0 rounded-md bg-[#115eaf] text-white text-[12px] font-semibold hover:bg-[#084a8c] transition-colors">
                  {card.explore}
                </button>
              </div>
            </div>))}
        </div>
      </section>

      {/* Featured universities */}
      <section id="universities" className="bg-white rounded-xl border border-[#c4c6ce]/60 shadow-sm p-[17px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-[#c4c6ce]/40 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#115eaf]"/>
              <h2 className="text-[17px] sm:text-2xl font-bold text-[#000f22] whitespace-nowrap">Explore Some Popular Universities</h2>
            </div>
          </div>
          <button type="button" onClick={() => router.push('/universities')} className="text-[12px] font-semibold text-[#115eaf] hover:underline flex items-center gap-1">
            View All 50+ Universities
            <ChevronRight className="w-4 h-4"/>
          </button>
        </div>
        {/* Mobile only — chip filters + horizontal snap carousel */}
        <div className="md:hidden mt-[17px]">
          <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {UNI_CHIPS.map((chip) => (<button key={chip} type="button" onClick={() => selectUniChip(chip)} className={`flex-none h-[26px] px-3.5 rounded-[14px] border bg-white text-[12px] cursor-pointer transition-colors ${uniChip === chip
                ? 'border-[#115eaf] text-[#115eaf] font-semibold'
                : 'border-[#c4c6ce] text-[#43474d]'}`}>
                {chip}
              </button>))}
          </div>

          <div ref={uniRowRef} className="flex gap-2 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {filteredFeaturedUnis.map((u) => (<article key={u.id} className="flex-none w-[290px] snap-start border border-[#c4c6ce] rounded-[4px] p-3 bg-white flex flex-col">
                <h3 className="text-[15px] font-bold leading-[1.35] text-[#000f22] line-clamp-2 mb-2.5">
                  {u.name}
                </h3>
                <span className="block text-[12px] text-[#74777e] mb-2.5">{u.short}</span>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  {u.naac ? (<span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {u.naac}
                  </span>) : null}
                  {u.rank ? (<span className="text-[11px] font-medium text-slate-500">{u.rank}</span>) : null}
                </div>
                <div className="space-y-1.5 text-[12px] bg-[#f0f4f8]/50 p-2.5 rounded border border-[#c4c6ce]/30 mb-3">
                  {u.rows.map((r) => (<div key={r.label} className="flex justify-between gap-2">
                      <span className="text-[#43474d]">{r.label}</span>
                      <span className={`text-right ${r.tone || 'font-medium text-[#000f22]'}`}>
                        {r.value}
                      </span>
                    </div>))}
                </div>
                <div className="mt-auto space-y-2">
                  <button type="button" onClick={() => { const href = universityHref(u); if (href) router.push(href); }} className="w-full py-2 min-h-[44px] rounded-md bg-[#115eaf] text-white text-[12px] font-semibold hover:bg-[#084a8c] transition-colors">
                    View Details &amp; Apply
                  </button>
                  <button type="button" onClick={onOpenHelpDesk} className="w-full py-2 min-h-[44px] rounded-md border border-[#74777e] text-[12px] font-medium text-[#43474d] hover:bg-slate-50 flex items-center justify-center gap-1">
                    <Download className="w-3.5 h-3.5"/>
                    Download Brochure
                  </button>
                </div>
              </article>))}
          </div>
        </div>

        {/* Desktop — original grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-[17px] mt-[17px]">
          {featuredUnis.map((u) => (<div key={u.id} className="bg-white rounded-lg border border-[#c4c6ce] hover:border-[#115eaf] transition-all hover:shadow-md p-[17px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 gap-2">
                  {u.naac ? (<span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {u.naac}
                  </span>) : null}
                  {u.rank ? (<span className="text-[11px] font-medium text-slate-500">{u.rank}</span>) : null}
                </div>
                <h3 className="text-lg font-bold text-[#000f22]">{u.name}</h3>
                <p className="text-[12px] text-[#115eaf] font-medium mt-0.5">{u.short}</p>
                <div className="mt-3 space-y-1.5 text-[12px] bg-[#f0f4f8]/50 p-2.5 rounded border border-[#c4c6ce]/30">
                  {u.rows.map((r) => (<div key={r.label} className="flex justify-between gap-2">
                      <span className="text-[#43474d]">{r.label}</span>
                      <span className={`text-right ${r.tone || 'font-medium text-[#000f22]'}`}>{r.value}</span>
                    </div>))}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <button type="button" onClick={() => { const href = universityHref(u); if (href) router.push(href); }} className="w-full py-2 min-h-[44px] md:min-h-0 rounded-md bg-[#115eaf] text-white text-[12px] font-semibold hover:bg-[#084a8c] transition-colors">
                  View Details &amp; Apply
                </button>
                <button type="button" onClick={onOpenHelpDesk} className="w-full py-2 min-h-[44px] md:min-h-0 rounded-md border border-[#74777e] text-[12px] font-medium text-[#43474d] hover:bg-slate-50 flex items-center justify-center gap-1">
                  <Download className="w-3.5 h-3.5"/>
                  Download Brochure
                </button>
              </div>
            </div>))}
        </div>

        {/* Mobile only — back to top */}
        <button type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="md:hidden fixed right-2.5 bottom-[calc(144px+env(safe-area-inset-bottom))] w-11 h-11 flex items-center justify-center border border-[#c4c6ce] rounded-full bg-white cursor-pointer text-[16px] leading-none text-[#000f22] shadow-[0_1px_4px_rgba(0,0,0,0.15)] z-40">
          &uarr;
        </button>
      </section>

      {/* Top Colleges by Location */}
        <TopCollegesByLocation onOpenBrochure={onOpenHelpDesk} colleges={locationColleges}/>

      {/* Student Testimonials & Social Proof */}
      <StudentTestimonials onOpenCounseling={onOpenHelpDesk}/>

      {/* Compare Colleges */}
        <CompareCollegesCarousel colleges={compareColleges} />

      {/* Counselling Section */}
      <section id="counselling" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#071d36] via-[#0d2a4d] to-[#143966] border border-[#1b4372]/80 text-white shadow-xl p-6 sm:p-8 md:p-10">
        {/* Subtle ambient lighting */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#115eaf]/25 blur-3xl pointer-events-none"/>
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"/>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Copy & Trust Highlights */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] font-semibold tracking-wider">
              <Headphones className="w-3.5 h-3.5 text-amber-400"/>
              FREE 1-ON-1 ACADEMIC ADVISORY
            </div>

            <div className="hidden md:block space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-white tracking-tight leading-tight">
                Confused Between 50+ Universities? Speak with an Unbiased Academic Expert
              </h2>
              <p className="text-sm sm:text-[15px] text-slate-200 font-normal leading-relaxed max-w-xl">
                Choosing the right online university impacts your career and finances for years. Our certified advisors provide objective comparisons across UGC-DEB entitlements, syllabus depth, recruiter networks, and genuine fee financing — 100% free with zero sales bias.
              </p>
            </div>

            {/* Trust Checkpoints */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs sm:text-[13px] text-slate-200">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0"/>
                <span>100% Free &amp; Unbiased Counseling</span>
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0"/>
                <span>Official UGC-DEB &amp; NAAC Data</span>
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0"/>
                <span>0% Interest Monthly EMI Guidance</span>
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0"/>
                <span>Zero Spam &amp; Complete Privacy</span>
              </span>
            </div>
          </div>

          {/* Right Column: Callback Request Card */}
          <div className="lg:col-span-5 bg-white text-[#111c2d] rounded-2xl p-5 sm:p-6 md:p-7 shadow-2xl border border-white/60">
            <div className="flex flex-wrap items-center justify-between mb-1">
              <h3 className="text-base sm:text-lg font-bold text-[#000f22] tracking-tight">
                Request Free Callback
              </h3>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                Advisors Online
              </span>
            </div>
            <p className="text-xs text-[#555960] font-normal mb-4">
              Connect with a verified academic advisor within 15 minutes.
            </p>

            {!leadSubmitted ? (<form className="space-y-3.5" onSubmit={(e) => {
                e.preventDefault();
                setLeadSubmitted(true);
            }}>
                <div>
                  <label className="block text-[11px] font-semibold text-[#43474d] uppercase tracking-wider mb-1">
                    Mobile Number (WhatsApp Enabled)
                  </label>
                  <div className="flex h-12 sm:h-11 rounded-lg border border-[#c4c6ce] focus-within:border-[#115eaf] focus-within:ring-2 focus-within:ring-[#115eaf]/20 overflow-hidden transition-all bg-white">
                    <span className="bg-[#f0f4f8] text-[#000f22] px-3 text-xs font-semibold border-r border-[#c4c6ce] flex items-center shrink-0">
                      +91
                    </span>
                    <input className="w-full border-0 px-3 text-base sm:text-sm text-[#000f22] placeholder:text-[#74777e] outline-none bg-white font-medium" placeholder="98765 43210" required type="tel" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })}/>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#43474d] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input className="w-full h-12 sm:h-11 rounded-lg border border-[#c4c6ce] px-3 text-base sm:text-sm text-[#000f22] placeholder:text-[#74777e] focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/20 outline-none bg-white font-medium transition-all" placeholder="name@example.com" required type="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })}/>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#43474d] uppercase tracking-wider mb-1">
                    Program You're Exploring
                  </label>
                  <select className="w-full h-12 sm:h-11 rounded-lg border border-[#c4c6ce] px-3 text-base sm:text-sm text-[#000f22] focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/20 outline-none bg-white font-medium transition-all cursor-pointer" value={lead.degree} onChange={(e) => setLead({ ...lead, degree: e.target.value })}>
                    <option>Online MBA (Master of Business)</option>
                    <option>Online MCA (Computer Applications)</option>
                    <option>Online BBA (Bachelor of Business)</option>
                    <option>Online BCA (Computer Applications)</option>
                    <option>Online M.Com / B.Com</option>
                    <option>Online MA / BA Programs</option>
                    <option>Executive PG Diploma</option>
                  </select>
                </div>

                <button className="w-full h-11 sm:h-12 rounded-lg bg-[#115eaf] hover:bg-[#084a8c] text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer" type="submit">
                  <span>Connect with Academic Advisor</span>
                  <ArrowRight className="w-4 h-4"/>
                </button>

                <p className="text-[10px] text-center text-[#74777e] font-normal pt-1">
                  🔒 Strictly confidential. No marketing spam guaranteed.
                </p>
              </form>) : (<div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6"/>
                </div>
                <h3 className="text-base font-bold text-[#000f22]">Callback Request Confirmed!</h3>
                <p className="text-xs text-[#555960] max-w-xs mx-auto">
                  A senior academic counselor will call you within 15 minutes regarding <strong>{lead.degree}</strong>.
                </p>
                <button type="button" onClick={() => setLeadSubmitted(false)} className="text-xs font-semibold text-[#115eaf] hover:underline pt-2 inline-block cursor-pointer">
                  Submit another inquiry
                </button>
              </div>)}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (Accordion) */}
      <HomeFaq onOpenHelpDesk={onOpenHelpDesk}/>

      {/* Blogs */}
        <BlogsListSection onOpenHelpDesk={onOpenHelpDesk} posts={blogs}/>
    </div>);
};
