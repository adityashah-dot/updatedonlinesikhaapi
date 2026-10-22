"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Search, ArrowRight, SlidersHorizontal, MapPin, Star, BadgeCheck, CreditCard, Monitor, Clock, Video, TrendingUp, Download, CheckCircle, ChevronDown, ExternalLink, HelpCircle, ShieldCheck, ChevronLeft, ChevronRight, List, LayoutGrid, X, Award, Globe, ClipboardCheck, Laptop, Hourglass, BarChart3, Smartphone, Handshake, Building2, Users, Brain, PiggyBank, Briefcase, Fuel, Trophy, Flame, ScrollText, IndianRupee, GraduationCap, } from 'lucide-react';
import { BlogsListSection } from '../shared/BlogsListSection';
const TRENDING = [
    { icon: Flame, label: 'NAAC A++ Only', id: 'naac' },
    { icon: ScrollText, label: 'UGC-DEB 100% Entitled', id: 'ugc' },
    { icon: IndianRupee, label: 'Fees under ₹1 Lakh', id: 'fees' },
    { icon: GraduationCap, label: 'Online MBA Top Picks', id: 'mba' },
    { icon: Briefcase, label: '100% Placement Support', id: 'placement' },
    { icon: CreditCard, label: 'Zero Cost EMI', id: 'emi' },
];
const DEGREE_FILTERS = [
    'Postgraduate (MBA, MCA, M.Com)',
    'Undergraduate (BBA, BCA, BA)',
    'Executive & PG Diploma',
];
const TOOLBAR_QUICK_CHIPS = ['100% Entitled', 'NAAC A++', 'EMI Available', 'UGC-DEB'];
const universityHref = (university) => {
    const slug = university?.slug || '';
    return slug ? `/universities/${slug}` : '';
};

const APPROVAL_FILTERS = [
    { label: 'UGC-DEB Approved', count: 48, checked: true },
    { label: 'NAAC A++ Grade', count: 18, checked: true },
    { label: 'NAAC A+ Grade', count: 24, checked: false },
    { label: 'AICTE Approved', count: 36, checked: true },
    { label: 'NIRF Top 50 Ranked', count: 12, checked: false },
    { label: 'WES / Global Recognized', count: 15, checked: false },
];
const FEE_RANGES = [
    'Under ₹80,000',
    '₹80,000 - ₹1,50,000',
    '₹1,50,000 - ₹2,50,000',
    'Above ₹2,50,000',
];
const EXAM_MODES = ['100% Online Proctored', 'Designated Center Based'];
const PAYMENT_MODES = ['No-Cost Monthly EMI', 'Pay-Per-Semester Plan'];
const COMPARE_MATRIX_ROWS = [
    {
        param: 'UGC-DEB Statutory Entitlement',
        getCell: (u) => u.approvals.some((a) => a.includes('UGC-DEB'))
            ? { text: 'Category-1 Approved', tone: 'text-emerald-700 font-semibold' }
            : { text: u.approvals[0], tone: 'text-emerald-700 font-semibold' },
    },
    {
        param: 'NAAC Accreditation Grade',
        getCell: (u) => ({ text: (u.naac || '').replace('NAAC ', ''), badge: true }),
    },
    {
        param: 'NIRF Ranking',
        getCell: (u) => ({ text: u.rankNote }),
    },
    {
        param: 'Total Program Fees',
        getCell: (u) => ({ text: u.feeLabel, tone: 'font-bold text-[#000f22]' }),
    },
    {
        param: 'Monthly 0-Cost EMI Option',
        getCell: (u) => ({ text: u.emi, tone: 'text-emerald-700 font-semibold' }),
    },
    {
        param: 'Examination Methodology',
        getCell: (u) => ({
            text: u.specs.find((s) => /exam/i.test(s.label))?.value || u.specs[0]?.value || '—',
        }),
    },
    {
        param: 'Campus Location',
        getCell: (u) => ({ text: u.location }),
    },
];
const DEGREES = [
    {
        level: 'Postgraduate',
        tone: 'blue',
        price: 'From ₹18,500/sem',
        title: 'Online MBA',
        duration: 'Duration: 2 Years (4 Semesters)',
        count: 'Explore 24+ Universities',
        tracks: ['Finance', 'Marketing', 'Business Analytics', 'HR Management'],
    },
    {
        level: 'Postgraduate',
        tone: 'indigo',
        price: 'From ₹22,000/sem',
        title: 'Online MCA',
        duration: 'Duration: 2 Years (4 Semesters)',
        count: 'Explore 18+ Universities',
        tracks: ['AI & Machine Learning', 'Cloud Computing', 'Full Stack', 'Cyber Security'],
    },
    {
        level: 'Undergraduate',
        tone: 'emerald',
        price: 'From ₹14,000/sem',
        title: 'Online BBA',
        duration: 'Duration: 3 Years (6 Semesters)',
        count: 'Explore 20+ Universities',
        tracks: ['Digital Marketing', 'International Business', 'Banking & Finance', 'General Mgmt'],
    },
    {
        level: 'Undergraduate',
        tone: 'emerald',
        price: 'From ₹15,000/sem',
        title: 'Online BCA',
        duration: 'Duration: 3 Years (6 Semesters)',
        count: 'Explore 16+ Universities',
        tracks: ['Data Science', 'Cyber Security', 'Cloud Architecture', 'Web Dev'],
    },
    {
        level: 'Postgraduate',
        tone: 'blue',
        price: 'From ₹12,000/sem',
        title: 'Online M.Com',
        duration: 'Duration: 2 Years (4 Semesters)',
        count: 'Explore 12+ Universities',
        tracks: ['Accounting & Finance', 'FinTech', 'International Trade', 'Taxation'],
    },
    {
        level: 'Postgraduate',
        tone: 'amber',
        price: 'From ₹11,000/sem',
        title: 'Online MA',
        duration: 'Duration: 2 Years (4 Semesters)',
        count: 'Explore 15+ Universities',
        tracks: ['English', 'Economics', 'Journalism & Mass Comm', 'Psychology'],
    },
];
const VERIFICATION = [
    {
        icon: ShieldCheck,
        tone: 'blue',
        title: 'UGC-DEB Entitlement',
        body: 'Verify whether the university is specifically listed on deb.ugc.ac.in for the specific academic year. Both Category-I institutions and universities with NAAC score ≥ 3.26 are eligible.',
    },
    {
        icon: Award,
        tone: 'amber',
        title: 'NAAC Grading Significance',
        body: 'Institutions holding NAAC A++ (CGPA > 3.51) and NAAC A+ (CGPA > 3.26) maintain the highest pedagogical standard, faculty ratio, digital LMS infrastructure, and research citations.',
    },
    {
        icon: Globe,
        tone: 'emerald',
        title: 'WES & Global Acceptance',
        body: 'Degrees evaluated by World Education Services (WES) are recognized across Canada, USA, UK, and European immigration and postgraduate admission systems identically to on-campus credentials.',
    },
];
const toneMap = {
    blue: { badge: 'bg-[#f0f3ff]', border: 'border-[#d5e3ff]', text: 'text-[#115eaf]', solid: 'bg-[#115eaf]' },
    indigo: { badge: 'bg-[#e0e7ff]', border: 'border-[#c7d2fe]', text: 'text-[#3730a3]', solid: 'bg-[#4f46e5]' },
    emerald: { badge: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', solid: 'bg-emerald-600' },
    amber: { badge: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', solid: 'bg-amber-500' },
};
const specIconByLabel = {
    'Exam Mode': Monitor,
    Examination: ClipboardCheck,
    Exams: Laptop,
    'Exam Pattern': Laptop,
    'Degree Duration': Clock,
    'Course Duration': Hourglass,
    'Live Sessions': Video,
    'Live Masterclasses': Video,
    'Highest CTC Record': TrendingUp,
    'Avg Package': BarChart3,
    'LMS Delivery': Smartphone,
    'Hiring Partners': Handshake,
    'Corporate Tie-ups': Building2,
    'Global Alumni': Globe,
    'Career Assistance': Users,
    Mentorship: Brain,
    Scholarships: PiggyBank,
    'Job Fair Access': Briefcase,
    Specialization: Fuel,
    'Alumni Status': Trophy,
};
export const UniversitiesView = ({ universities = [], pagination = null, page = 1, search = '', blogs = [], error = '', onOpenApply, onOpenHelpDesk, onOpenBrochure, }) => {
    const router = useRouter();
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [view, setView] = useState('list');
    const [compared, setCompared] = useState([]);
    const [activeTrending, setActiveTrending] = useState(null);
    const [degreeChecked, setDegreeChecked] = useState([true, true, false]);
    const [approvalChecked, setApprovalChecked] = useState(APPROVAL_FILTERS.map((a) => a.checked));
    const [feeRange, setFeeRange] = useState(1);
    const [examChecked, setExamChecked] = useState([true, false]);
    const [paymentChecked, setPaymentChecked] = useState([true, true]);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [quickChips, setQuickChips] = useState([]);
    const [searchInput, setSearchInput] = useState(search);
    // Keep the field in sync with the query string (back/forward navigation).
    useEffect(() => {
        setSearchInput(search);
    }, [search]);
    // Runs the search against the live listing API (GET /website/colleges/listing
    // with `search`) and resets the pagination to the first page.
    const runSearch = () => {
        const query = searchInput.trim();
        router.push(query ? `/universities?search=${encodeURIComponent(query)}` : '/universities');
    };
    // Keeps the active search in every pagination link.
    const pageHref = (number) => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (number > 1) params.set('page', String(number));
        const query = params.toString();
        return query ? `/universities?${query}` : '/universities';
    };
    const toggleQuickChip = (chip) => {
        setQuickChips((prev) => prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]);
    };
    const resetFilters = () => {
        setDegreeChecked([true, true, false]);
        setApprovalChecked(APPROVAL_FILTERS.map((a) => a.checked));
        setFeeRange(1);
        setExamChecked([true, false]);
        setPaymentChecked([true, true]);
    };
    const toggleCompare = (id) => {
        setCompared((prev) => {
            if (prev.includes(id))
                return prev.filter((c) => c !== id);
            if (prev.length >= 3)
                return prev;
            return [...prev, id];
        });
    };
    const compareList = (universities || []).filter((u) => compared.includes(u.id));
    const totalPages = pagination?.totalPages || 1;
    const paginationNumbers = (() => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, index) => index + 1);
        }

        const numbers = [1, 2, 3];

        if (page > 3 && page < totalPages) numbers.push(page);
        if (page > 3) numbers.push('...');

        numbers.push(totalPages);

        return numbers;
    })();
    const filterBody = (<>
      <div className="pt-4 divide-y divide-[#e7eeff]">
        {/* Degree Level */}
        <div className="pb-5">
          <h2 className="text-xs font-bold text-[#000f22] uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Degree Level</span>
            <ChevronDown className="w-4 h-4 text-[#74777e]"/>
          </h2>
          <div className="space-y-2.5">
            {DEGREE_FILTERS.map((d, i) => (<label key={d} className="flex items-center gap-2.5 cursor-pointer py-1">
                <input type="checkbox" checked={degreeChecked[i]} onChange={() => setDegreeChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))} className="w-4 h-4 rounded text-[#115eaf] border-[#c4c6ce]"/>
                <span className="text-[13px] font-normal text-[#000f22]">{d}</span>
              </label>))}
          </div>
        </div>

        {/* Approvals */}
        <div className="py-5">
          <h2 className="text-xs font-bold text-[#000f22] uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Approvals &amp; Accreditations</span>
            <ChevronDown className="w-4 h-4 text-[#74777e]"/>
          </h2>
          <div className="space-y-2.5">
            {APPROVAL_FILTERS.map((a, i) => (<label key={a.label} className="flex items-center justify-between gap-2 cursor-pointer py-1">
                <span className="flex items-center gap-2.5 min-w-0">
                  <input type="checkbox" checked={approvalChecked[i]} onChange={() => setApprovalChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))} className="w-4 h-4 rounded text-[#115eaf] border-[#c4c6ce] shrink-0"/>
                  <span className="text-[13px] font-normal text-[#000f22]">{a.label}</span>
                </span>
                <span className="text-[11px] font-semibold text-[#74777e] bg-[#f0f3ff] px-2 py-0.5 rounded-full shrink-0">
                  {a.count}
                </span>
              </label>))}
          </div>
        </div>

        {/* Fee */}
        <div className="py-5">
          <h2 className="text-xs font-bold text-[#000f22] uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Total Course Fee</span>
            <ChevronDown className="w-4 h-4 text-[#74777e]"/>
          </h2>
          <div className="space-y-2">
            {FEE_RANGES.map((f, i) => (<label key={f} className="flex items-center gap-2.5 cursor-pointer py-1">
                <input type="radio" name="fee_filter" checked={feeRange === i} onChange={() => setFeeRange(i)} className="w-4 h-4 text-[#115eaf] border-[#c4c6ce]"/>
                <span className="text-[13px] font-normal text-[#000f22]">{f}</span>
              </label>))}
          </div>
        </div>

        {/* Exam Mode */}
        <div className="py-5">
          <h2 className="text-xs font-bold text-[#000f22] uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Examination Mode</span>
            <ChevronDown className="w-4 h-4 text-[#74777e]"/>
          </h2>
          <div className="space-y-2.5">
            {EXAM_MODES.map((m, i) => (<label key={m} className="flex items-center gap-2.5 cursor-pointer py-1">
                <input type="checkbox" checked={examChecked[i]} onChange={() => setExamChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))} className="w-4 h-4 rounded text-[#115eaf] border-[#c4c6ce]"/>
                <span className="text-[13px] font-normal text-[#000f22]">{m}</span>
              </label>))}
          </div>
        </div>

        {/* Payment */}
        <div className="pt-5">
          <h2 className="text-xs font-bold text-[#000f22] uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Payment Flexibility</span>
            <ChevronDown className="w-4 h-4 text-[#74777e]"/>
          </h2>
          <div className="space-y-2.5">
            {PAYMENT_MODES.map((m, i) => (<label key={m} className="flex items-center gap-2.5 cursor-pointer py-1">
                <input type="checkbox" checked={paymentChecked[i]} onChange={() => setPaymentChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))} className="w-4 h-4 rounded text-[#115eaf] border-[#c4c6ce]"/>
                <span className="text-[13px] font-normal text-[#000f22]">{m}</span>
              </label>))}
          </div>
        </div>
      </div>

      {/* Sidebar promo */}
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#f0f3ff] to-[#e7eeff] border border-[#d5e3ff] shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#115eaf] text-white flex items-center justify-center shrink-0 shadow-xs">
            <BadgeCheck className="w-5 h-5"/>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#000f22]">Confused about approvals?</h3>
            <p className="text-xs font-normal text-[#43474d] mt-1 leading-snug">
              Talk to an unbiased UGC counsellor to verify your degree validity and fee waivers.
            </p>
            <button onClick={onOpenHelpDesk} className="mt-2.5 text-xs font-semibold text-[#115eaf] hover:underline inline-flex items-center min-h-[44px]">
              <span>Book 1-on-1 Call</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1"/>
            </button>
          </div>
        </div>
      </div>
    </>);
    return (<div className="pb-20 md:pb-8">
      {/* ================= HERO & DISCOVERY SEARCH BAR ================= */}
      <section className="uv-hero relative overflow-hidden border-b border-[#e7eeff] bg-[#f2f6fb] pt-4 pb-5 sm:pt-8 sm:pb-10 shadow-[0_18px_45px_rgba(15,23,42,0.02)]">
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-[#eaf3ff]/80 via-[#f3f8ff]/40 to-[#edfdf7]/50 blur-2xl"/>
        <div className="absolute -left-12 top-10 h-36 w-36 rounded-full bg-[#93c5fd]/10 blur-3xl"/>
        <div className="absolute -right-12 bottom-0 h-40 w-40 rounded-full bg-[#a7f3d0]/10 blur-3xl"/>

        <div className="uv-search-shell relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-7">
            <div className="mb-3 text-[11px] font-medium text-[#43474d]">
              <span className="text-[#115eaf] font-semibold">Accredited by UGC, AICTE &amp; NAAC</span>
              <span className="text-[#c4c6ce] mx-2">|</span>
              <span className="text-[#115eaf] font-semibold">Session 2026-27 Open</span>
            </div>
            <h1 className="font-sans text-2xl sm:text-[32px] lg:text-[36px] font-bold text-[#000f22] tracking-tight leading-snug">
              Explore Top UGC-DEB Approved Online Universities in India
            </h1>
            <p className="font-sans text-sm text-[#43474d] font-normal leading-relaxed mt-2.5 max-w-2xl mx-auto">
              Compare verified universities, programs, fees,
              <br className="hidden sm:block"/> and admission details — all in one place.
            </p>
          </div>

          {/* Search Console */}
          <div className="uv-search-card bg-white rounded-2xl p-4 md:p-5 border border-[#d5e3ff] shadow-lg max-w-4xl mx-auto">
            <div className="uv-search-fields grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6 relative flex items-center">
                <Search className="absolute left-3.5 text-[#115eaf] w-5 h-5"/>
                <input type="search" name="search" aria-label="Search university or degree" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    runSearch();
                  }
                }} placeholder="Search university or degree" className="uv-field w-full pl-10 pr-4 py-3 min-h-[48px] bg-[#f9f9ff] rounded-xl border border-[#c4c6ce] text-[#000f22] placeholder:text-[#74777e] text-base sm:text-sm focus:outline-none focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/20 transition-all font-normal"/>
              </div>

              <div className="md:col-span-4 relative flex items-center">
                <span className="absolute left-3.5 text-[#115eaf] pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10 12 5 2 10l10 5 10-5Z"/>
                    <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>
                  </svg>
                </span>
                <select className="uv-field w-full pl-10 pr-8 py-3 min-h-[48px] bg-[#f9f9ff] rounded-xl border border-[#c4c6ce] text-[#000f22] text-base sm:text-sm focus:outline-none focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/20 transition-all appearance-none cursor-pointer font-normal">
                  <option value="all">All Degree Categories</option>
                  <option value="management">Management (MBA, BBA, Executive)</option>
                  <option value="technology">Technology &amp; IT (MCA, BCA, M.Sc)</option>
                  <option value="commerce">Commerce &amp; Finance (M.Com, B.Com)</option>
                  <option value="arts">Arts &amp; Humanities (MA, BA, Journalism)</option>
                </select>
                <ChevronDown className="absolute right-3 text-[#74777e] pointer-events-none w-4 h-4"/>
              </div>

              <div className="md:col-span-2 mt-[2px] md:mt-0">
                <button type="button" onClick={runSearch} className="uv-find-btn w-full h-full min-h-[48px] py-3 px-4 bg-[#115eaf] hover:bg-[#004689] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all">
                  <span>Find Universities</span>
                  <ArrowRight className="w-4 h-4"/>
                </button>
              </div>
            </div>

            {/* Trending pills */}
            <div className="uv-trending flex items-center gap-2 pt-3.5 mt-3.5 md:mt-3 border-t border-[#e7eeff]">
              <span className="text-[11px] text-[#74777e] uppercase font-semibold whitespace-nowrap shrink-0">
                Trending:
              </span>
              <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto hide-scrollbar">
                {TRENDING.map((t) => {
            const Icon = t.icon;
            return (<button key={t.id} onClick={() => setActiveTrending(activeTrending === t.id ? null : t.id)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-full text-[11px] transition-colors whitespace-nowrap shrink-0 font-medium border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#115eaf] focus-visible:ring-offset-1 ${activeTrending === t.id
                    ? 'bg-[#115eaf] text-white border-[#115eaf]'
                    : 'bg-white text-[#000f22] border-[#d5e3ff] hover:bg-[#f0f3ff] hover:border-[#115eaf]'}`}>
                      <Icon className="w-3.5 h-3.5 shrink-0"/>
                      <span>{t.label}</span>
                    </button>);
        })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN: FILTERS + LISTING ================= */}
      <main className="uv-listing max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-8 bg-[#f3f6fb] rounded-t-[18px] sm:rounded-t-[28px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* LEFT SIDEBAR FILTERS */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-[#d5e3ff] p-5 shadow-xs sticky top-20 hidden lg:block">
            <div className="flex items-center justify-between pb-4 border-b border-[#e7eeff]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#115eaf]"/>
                <span className="text-sm font-bold text-[#000f22]">Filters</span>
                <span className="bg-[#f0f3ff] text-[#115eaf] text-[11px] font-bold px-2 py-0.5 rounded-full">
                  5 Active
                </span>
              </div>
              <button onClick={resetFilters} className="text-[#115eaf] text-xs hover:underline font-semibold">
                Reset
              </button>
            </div>
            {filterBody}
          </aside>

          {/* RIGHT LISTINGS */}
          <section className="lg:col-span-9 space-y-2.5 sm:space-y-5" id="university-listings-container">
            {/* Toolbar */}
            <div>
            {/* Toolbar - mobile */}
            <div className="md:hidden bg-white border border-[#dfe6ec] rounded-xl p-2">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setFiltersOpen(true)} aria-label="Open filters" className="shrink-0 h-11 px-3.5 inline-flex items-center gap-2 border border-[#dfe6ec] rounded-[10px] bg-white text-sm font-medium text-[#14171a] cursor-pointer">
                  <SlidersHorizontal className="w-4 h-4 text-[#115eaf]"/>
                  <span>Filter</span>
                  {quickChips.length > 0 && (<span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#115eaf] text-white text-[11px] flex items-center justify-center">
                      {quickChips.length}
                    </span>)}
                </button>

                <div className="relative flex-1 min-w-0">
                  <select aria-label="Sort by" className="w-full h-11 border border-[#dfe6ec] rounded-[10px] pl-3 pr-8 bg-white text-[13px] font-medium text-[#14171a] appearance-none cursor-pointer truncate focus:outline-none">
                    <option>NIRF Ranking (Top First)</option>
                    <option>Fee: Low to High</option>
                    <option>Fee: High to Low</option>
                    <option>Highest CTC</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777e] pointer-events-none"/>
                </div>

                <div className="shrink-0 flex border border-[#dfe6ec] rounded-[10px] overflow-hidden">
                  <button type="button" onClick={() => setView('list')} aria-label="List view" aria-pressed={view === 'list'} className={`w-11 h-11 flex items-center justify-center cursor-pointer ${view === 'list' ? 'bg-[#115eaf] text-white' : 'bg-white text-[#74777e]'}`}>
                    <List className="w-4 h-4"/>
                  </button>
                  <button type="button" onClick={() => setView('grid')} aria-label="Grid view" aria-pressed={view === 'grid'} className={`w-11 h-11 flex items-center justify-center cursor-pointer ${view === 'grid' ? 'bg-[#115eaf] text-white' : 'bg-white text-[#74777e]'}`}>
                    <LayoutGrid className="w-4 h-4"/>
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mt-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {TOOLBAR_QUICK_CHIPS.map((chip) => {
            const on = quickChips.includes(chip);
            return (<button key={chip} type="button" onClick={() => toggleQuickChip(chip)} aria-pressed={on} className={`tap-chip flex-none h-8 px-3.5 rounded-2xl border text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${on
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
                    : 'bg-white border-[#dfe6ec] text-[#14171a]'}`}>
                      {chip}
                    </button>);
        })}
              </div>
            </div>

            {/* Toolbar - desktop */}
            <div className="hidden md:block">
            <div className="bg-[#eff4fb] border border-[#dfe8ff] rounded-[16px] sm:rounded-[20px] p-2 shadow-[0_8px_24px_rgba(17,94,175,0.04)]">
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_auto] items-stretch gap-2">
                <div className="h-[50px] rounded-[14px] border border-[#dfe8ff] bg-[#f7f9fd] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <button onClick={() => setFiltersOpen(true)} className="lg:hidden inline-flex items-center gap-1.5 font-semibold text-[11.5px] text-[#0f172a]">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#115eaf]"/>
                    <span>Filters</span>
                  </button>
                  <span className="hidden lg:inline-flex items-center gap-1.5 font-semibold text-[11.5px] text-[#0f172a]">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#115eaf]"/>
                    Filters
                  </span>
                </div>

                <div className="h-[50px] rounded-[14px] border border-[#dfe8ff] bg-[#edf7f2] flex items-center justify-center px-1.5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                  <span className="inline-flex items-center justify-center rounded-[9px] border border-[#bfe7d5] bg-[#dff7eb] px-2 py-1 text-[11.5px] font-bold text-[#0f766e] tracking-tight leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                    100% Entitled
                  </span>
                </div>

                <div className="h-[50px] rounded-[14px] border border-[#dfe8ff] bg-[#f7f9fd] flex items-center gap-1.5 px-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden">
                  <div className="flex-1 min-w-0">
                    <select className="h-full w-full border-0 bg-transparent rounded-[10px] text-[#000f22] text-[11px] font-medium focus:outline-none focus:ring-0 cursor-pointer appearance-none px-1 leading-none">
                      <option>NIRF Ranking (Top First)</option>
                      <option>Fee: Low to High</option>
                      <option>Student Rating</option>
                      <option>Most Applied Programs</option>
                    </select>
                  </div>

                  <div className="flex items-center border border-[#c9d9ff] rounded-[9px] p-0.5 bg-[#edf4ff] shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                    <button onClick={() => setView('list')} title="List View" aria-label="Switch to List View" className={`w-11 h-11 rounded-[7px] transition-all duration-150 cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#115eaf] focus-visible:ring-offset-1 ${view === 'list'
            ? 'bg-[#115eaf] text-white shadow-sm'
            : 'text-[#74777e] bg-transparent hover:bg-white'}`}>
                      <List className="w-3.5 h-3.5"/>
                    </button>
                    <button onClick={() => setView('grid')} title="Grid View" aria-label="Switch to Grid View" className={`w-11 h-11 rounded-[7px] transition-all duration-150 cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#115eaf] focus-visible:ring-offset-1 ${view === 'grid'
            ? 'bg-[#115eaf] text-white shadow-sm'
            : 'text-[#74777e] bg-transparent hover:bg-white'}`}>
                      <LayoutGrid className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </div>
            </div>

            {/* University cards */}
            {(!universities || !universities.length) ? (<div className="bg-white rounded-2xl border border-[#d5e3ff] p-8 text-center">
              <p className="text-sm font-semibold text-[#000f22]">
                {error ? 'University list unavailable' : search ? `No universities found for "${search}"` : 'No universities found'}
              </p>
              <p className="text-[13px] text-[#43474d] font-normal mt-1">
                {error || (search ? 'Try a different university name, city or keyword.' : 'The live university list is empty right now. Please try again shortly.')}
              </p>
            </div>) : null}
            {search && (universities || []).length > 0 && (
            <p className="text-[13px] font-normal text-[#43474d]">
              {pagination?.total || universities.length} universities matching
              {" "}
              <span className="font-semibold text-[#000f22]">"{search}"</span>
            </p>
            )}
            <div className={view === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-5 transition-all duration-300'
            : 'space-y-5'}>
              {(universities || []).map((u) => (<article key={u.id} onClick={() => { const href = universityHref(u); if (href) router.push(href); }} className="bg-white rounded-2xl border border-[#d5e3ff] p-2.5 sm:p-4 md:p-5 shadow-xs hover:shadow-xl hover:border-[#115eaf] transition-all duration-300 relative flex flex-col cursor-pointer">
                  {/* ===== Mobile card ===== */}
                  {!isDesktop && (<div className="flex flex-col">
                    <label className="absolute top-1 right-1 w-11 h-11 flex items-center justify-center cursor-pointer select-none" title="Compare" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" aria-label={`Add ${u.name} to compare`} checked={compared.includes(u.id)} onChange={() => toggleCompare(u.id)} className="w-5 h-5 rounded accent-[#115eaf] cursor-pointer"/>
                    </label>

                    {/* Head: logo + name + location */}
                    <div className="flex gap-3 pr-9">
                      <div className="w-[60px] h-[60px] shrink-0 rounded-lg border border-[#e7eeff] bg-white flex items-center justify-center overflow-hidden">
                        {u.logoImage ? (<img src={u.logoImage} alt={`${u.short} logo`} className="w-full h-full object-contain p-1" onError={(e) => {
                        e.target.style.display = 'none';
                    }}/>) : (<span className="text-[13px] font-semibold text-[#115eaf]">{u.short}</span>)}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-[17px] font-semibold text-[#000f22] leading-[1.3] line-clamp-2" title={u.name}>
                          {u.name}
                        </h2>
                        <p className="text-[12px] text-[#74777e] mt-[3px]">
                          {u.location} &middot; Est. {u.established}
                        </p>
                      </div>
                    </div>

                    {/* Accreditations chips */}
                    <div className="flex gap-1.5 overflow-x-auto mt-2.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {u.naac ? (<span className="flex-none flex items-center h-6 px-2.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/60 text-[11px] font-medium whitespace-nowrap">
                        {u.naac}
                      </span>) : null}
                      {u.approvals.map((a) => (<span key={a} className="flex-none flex items-center h-6 px-2.5 rounded-full bg-[#f0f3ff] text-[#115eaf] border border-[#d5e3ff] text-[11px] font-medium whitespace-nowrap">
                          {a}
                        </span>))}
                    </div>

                    {/* Ranking */}
                    {u.rankNote ? (<p className="text-[12px] font-medium text-[#B45309] mt-2">{u.rankNote}</p>) : null}

                    {/* Fee box */}
                    <div className="bg-[#f9f9ff] border border-[#e7eeff] rounded-lg px-3 py-2.5 mt-2.5 flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <span className="block text-[12px] text-[#74777e] font-normal">Total fee</span>
                        <span className="text-xl font-semibold text-[#000f22]">
                          {u.feeLabel} <span className="text-[12px] text-[#74777e] font-normal">onwards</span>
                        </span>
                      </div>
                      {u.emi ? (<span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/60 rounded-full px-2.5 py-1">
                        EMI from {u.emi}
                      </span>) : null}
                    </div>

                    {/* Facts */}
                    <div className="grid grid-cols-3 gap-2 mt-2.5">
                      {u.specs.slice(0, 3).map((s) => (<div key={s.label} className="min-w-0">
                          <span className="block text-[11px] text-[#74777e]">{s.label}</span>
                          <span className={`text-[13px] font-semibold ${s.highlight ? 'text-emerald-700' : 'text-[#000f22]'}`}>
                            {s.value}
                          </span>
                        </div>))}
                    </div>

                    {/* Popular tracks */}
                    {u.tracks.length > 0 ? (<div className="flex gap-2 mt-2.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {u.tracks.map((t) => (<span key={t} className="flex-none border border-[#e7eeff] rounded-[14px] px-3 py-1 text-[12px] text-[#000f22] whitespace-nowrap">
                        {t}
                      </span>))}
                    </div>) : null}

                    {/* Actions */}
                    <div className="flex gap-2 mt-2.5">
                      <button type="button" onClick={(e) => {
                    e.stopPropagation();
                    onOpenBrochure();
                }} className="flex-1 h-11 rounded-lg bg-white border border-[#115eaf] text-[#115eaf] text-sm font-medium hover:bg-[#f0f3ff] transition-colors">
                        Brochure
                      </button>
                      <button type="button" onClick={(e) => {
                    e.stopPropagation();
                    const href = universityHref(u);
                    if (href) router.push(href);
                }} className="flex-1 h-11 rounded-lg bg-[#115eaf] border border-[#115eaf] text-white text-sm font-medium hover:bg-[#084a8c] transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>)}

                  {/* ===== Desktop card ===== */}
                  {isDesktop && (<div className="flex flex-col flex-1">
                  {/* Top row: identity + fee */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 pb-2.5 border-b border-[#e7eeff]">
                    <div className="flex items-start gap-3">
                      <div className="w-[72px] h-[72px] sm:w-14 sm:h-14 rounded-xl bg-[#f0f3ff] border border-[#d5e3ff] flex flex-col items-center justify-center shrink-0 shadow-xs overflow-hidden">
                        {u.logoImage ? (<img src={u.logoImage} alt={`${u.short} Logo`} className="w-16 h-16 sm:w-12 sm:h-12 object-contain rounded-lg bg-white p-0.5" onError={(e) => {
                        e.target.style.display = 'none';
                    }}/>) : (<>
                            <span className="text-lg font-bold text-[#115eaf] tracking-tight">
                              {u.short}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider font-semibold text-[#43474d] -mt-0.5">
                              Online
                            </span>
                          </>)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h2 className="text-base sm:text-lg font-bold text-[#000f22] leading-snug line-clamp-2" title={u.name}>
                            {u.name}
                          </h2>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 shrink-0 ${toneMap[u.highlight.tone].badge} ${toneMap[u.highlight.tone].text} ${toneMap[u.highlight.tone].border}`}>
                            <BadgeCheck className="w-3 h-3"/>
                            {u.highlight.text}
                          </span>
                        </div>

                        <p className="text-[13px] font-normal text-[#43474d] flex items-center gap-2 flex-wrap">
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#74777e]"/>
                            {u.location}
                          </span>
                          {u.established ? (<>
                            <span>•</span>
                            <span>{u.established}</span>
                          </>) : null}
                          {u.rankNote ? (<>
                            <span>•</span>
                            <span className="text-[#B45309] font-semibold line-clamp-1" title={u.rankNote}>{u.rankNote}</span>
                          </>) : null}
                        </p>

                        <div className={`flex flex-wrap items-center ${u.isLpu || u.id === 'cu-online' ? 'gap-1.5' : 'gap-2'} mt-2`}>
                          {u.naac ? (<span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-xs shrink-0">
                            <Star className="w-3 h-3 text-amber-600 fill-amber-500"/>
                            {u.naac}
                          </span>) : null}
                          {u.approvals.slice(0, 2).map((a) => (<span key={a} className="px-2.5 py-1 bg-[#f0f3ff] text-[#115eaf] border border-[#d5e3ff] rounded-lg text-[11px] font-semibold shrink-0">
                              {a}
                            </span>))}
                        </div>
                      </div>
                    </div>

                    {/* Fee box */}
                    <div className="text-left md:text-right bg-[#f9f9ff] md:bg-transparent p-3 md:p-0 rounded-xl shrink-0 border md:border-0 border-[#e7eeff]">
                      <span className="block text-[11px] text-[#74777e] font-semibold uppercase">
                        Total Program Fee
                      </span>
                      <div className="text-xl font-bold text-[#000f22]">
                        {u.feeLabel}{' '}
                        <span className="text-xs text-[#43474d] font-normal">onwards</span>
                      </div>
                      {u.emi ? (<div className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-1 bg-emerald-50 text-emerald-800 rounded-full text-[11px] font-semibold border border-emerald-200/60 shadow-xs">
                        <CreditCard className="w-3 h-3"/>
                        EMI starts {u.emi}
                      </div>) : null}
                    </div>
                  </div>

                  {/* Spec grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2.5 my-0 bg-[#f9f9ff] rounded-xl px-3.5 border border-[#e7eeff] text-center sm:text-left">
                    {u.specs.map((s) => {
                    const Icon = specIconByLabel[s.label] || Monitor;
                    return (<div key={s.label}>
                          <span className="text-[11px] text-[#74777e] font-semibold uppercase block">
                            {s.label}
                          </span>
                          <span className={`text-[13px] font-medium flex items-center justify-center sm:justify-start gap-1 mt-0.5 ${s.highlight ? 'text-emerald-700' : 'text-[#000f22]'}`}>
                            <Icon className={`w-3.5 h-3.5 ${s.highlight ? 'text-emerald-600' : 'text-[#115eaf]'}`}/>
                            {s.value}
                          </span>
                        </div>);
                })}
                  </div>

                  {/* Tracks + CTAs */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pt-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {u.tracks.length > 0 ? (<>
                        <span className="text-[11px] text-[#74777e] uppercase font-semibold mr-1">
                          Popular Tracks:
                        </span>
                        {u.tracks.slice(0, 4).map((t) => (<span key={t} onClick={(e) => e.stopPropagation()} className="px-3 py-1 bg-white border border-[#d5e3ff] rounded-full text-xs font-medium text-[#000f22] hover:border-[#115eaf] transition-colors cursor-pointer">
                          {t}
                        </span>))}
                        {u.tracks.length > 4 && (<span onClick={(e) => e.stopPropagation()} className="px-3 py-1 bg-[#f0f3ff] border border-[#d5e3ff] rounded-full text-xs font-semibold text-[#115eaf] cursor-pointer">
                          +{u.tracks.length - 4} more
                        </span>)}
                      </>) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto lg:shrink-0">
                      <label className="flex items-center gap-1.5 text-[13px] font-medium text-[#43474d] cursor-pointer sm:mr-2 select-none hover:text-[#000f22] py-1.5 min-h-[44px]" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={compared.includes(u.id)} onChange={() => toggleCompare(u.id)} className="w-4 h-4 rounded text-[#115eaf] border-[#c4c6ce]"/>
                        <span>Compare</span>
                      </label>
                      <button onClick={(e) => {
                    e.stopPropagation();
                    onOpenBrochure();
                }} className="px-3.5 py-1.5 rounded-xl bg-[#f0f3ff] hover:bg-[#dee8ff] text-[#000f22] text-xs font-semibold border border-[#d5e3ff] transition-colors flex items-center gap-1 min-h-[44px]">
                        <Download className="w-4 h-4"/>
                        <span>Brochure</span>
                      </button>
                      <button onClick={(e) => {
                    e.stopPropagation();
                    onOpenApply();
                }} className="px-4 py-1.5 rounded-xl bg-[#115eaf] hover:bg-[#004689] text-white text-xs font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-1 min-h-[44px]">
                        <span>Apply Now</span>
                        <ArrowRight className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  </div>
                  </div>)}
                </article>))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-6 border-t border-[#e7eeff]">
              <Link href={pageHref(Math.max(1, page - 1))} aria-label="Previous page" className={`px-2 sm:px-4 py-2 rounded-lg bg-white border border-[#d5e3ff] text-[#43474d] hover:text-[#000f22] text-xs font-medium flex items-center justify-center gap-1 transition-colors min-h-[44px] min-w-[44px] shrink-0 ${page <= 1 ? 'opacity-40 pointer-events-none' : ''}`}>
                <ChevronLeft className="w-4 h-4"/>
                <span className="hidden sm:inline">Previous</span>
              </Link>
              <div className="flex items-center gap-0.5 sm:gap-1 mx-1 sm:mx-2">
                {paginationNumbers.map((number, index) => number === '...' ? (<span key={`gap-${index}`} className="hidden sm:inline px-1 sm:px-2 text-[#74777e]">...</span>) : (<Link key={number} href={pageHref(number)} aria-current={number === page ? 'page' : undefined} className={`w-11 h-11 md:w-9 md:h-9 shrink-0 rounded-lg text-xs font-semibold flex items-center justify-center ${number === page
            ? 'bg-[#115eaf] text-white'
            : 'hover:bg-[#f0f3ff] text-[#000f22] font-medium'}`}>
                  {number}
                </Link>))}
              </div>
              <Link href={pageHref(page + 1)} aria-label="Next page" className={`px-2 sm:px-4 py-2 rounded-lg bg-white border border-[#d5e3ff] text-[#115eaf] text-xs font-medium flex items-center justify-center gap-1 hover:bg-[#f0f3ff] transition-colors min-h-[44px] min-w-[44px] shrink-0 ${page >= totalPages ? 'opacity-40 pointer-events-none' : ''}`}>
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4"/>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* ================= COMPARISON MATRIX PREVIEW ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="bg-white rounded-2xl border border-[#d5e3ff] p-5 md:p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e7eeff]">
            <div>
              <h2 className="text-lg font-bold text-[#000f22]">
                Side-by-Side Comparison: Top Online Universities
              </h2>
              <p className="text-[13px] font-normal text-[#43474d] mt-0.5">
                Analyze accreditations, total fee structures, exam patterns, and LMS delivery across
                leading contenders.
              </p>
            </div>
            <button onClick={onOpenHelpDesk} className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-xl bg-[#115eaf] text-white text-xs font-semibold hover:bg-[#004689] shadow-sm transition-all active:scale-95 shrink-0 self-start md:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#115eaf] focus-visible:ring-offset-1">
              <span>Compare Full Details</span>
              <ExternalLink className="w-3.5 h-3.5"/>
            </button>
          </div>

          {compareList.length === 0 ? (<div className="mt-4 rounded-lg border border-dashed border-[#c4c6ce] p-8 text-center">
              <p className="text-sm font-semibold text-[#000f22]">No universities selected yet</p>
              <p className="text-[13px] text-[#43474d] font-normal mt-1">
                Tick <span className="font-semibold text-[#115eaf]">Compare</span> on up to 3
                university cards above to build your side-by-side matrix.
              </p>
            </div>) : (<>
            <div className="overflow-x-auto border border-[#c4c6ce] rounded-lg mt-4">
            <table className="w-full text-left border-collapse text-[13px] min-w-[560px]">
              <thead>
                <tr className="bg-[#f0f4f8] text-[#000f22] border-b border-[#c4c6ce] font-semibold">
                  <th className="p-3">Comparison Parameter</th>
                  {compareList.map((u) => (<th key={`th-${u.id}`} className="p-3 text-[#115eaf]">
                      {u.name.split(' (')[0]}
                    </th>))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4c6ce]/60 font-normal">
                {COMPARE_MATRIX_ROWS.map((row) => (<tr key={row.param} className="hover:bg-slate-50/50">
                    <td className="p-3 font-medium text-[#111c2d]">{row.param}</td>
                    {compareList.map((u) => {
                    const cell = row.getCell(u);
                    return (<td key={`td-${u.id}`} className={`p-3 ${cell.tone || 'text-[#43474d] font-medium'}`}>
                          {cell.badge ? (<span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[11px] font-bold">
                              {cell.text}
                            </span>) : cell.tone === 'text-emerald-700 font-semibold' || cell.tone === 'text-emerald-700' ? (<span className="inline-flex items-center gap-1">
                              <CheckCircle className="w-4 h-4"/>
                              {cell.text}
                            </span>) : (cell.text)}
                        </td>);
                })}
                  </tr>))}
              </tbody>
            </table>
          </div>
          <p className="md:hidden text-[12px] text-[#74777e] font-normal pt-2 flex items-center gap-1">
            <span>Swipe the table horizontally to compare all columns →</span>
          </p>
            </>)}
          {compareList.length > 0 && (<p className="text-[12px] text-[#74777e] font-normal pt-2.5">
              Tick <span className="font-semibold text-[#115eaf]">Compare</span> on any university card above to add it to this matrix (up to 3).
            </p>)}
        </div>
      </section>

      {/* ================= DEGREES GRID ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-[#d5e3ff] p-5 md:p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] text-[#115eaf] uppercase font-bold tracking-wider">
                High-Impact Academic Degrees
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#000f22] mt-1">
                Explore Top Online Degrees &amp; Specializations
              </h2>
              <p className="text-sm font-normal text-[#43474d] mt-1.5">
                Find UGC-DEB entitled programs recognized by corporates and global licensing boards
                across industries.
              </p>
            </div>
            <button onClick={onOpenHelpDesk} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f0f3ff] hover:bg-[#115eaf] hover:text-white text-[#115eaf] text-xs font-semibold transition-colors self-start md:self-auto">
              <span>Degree Advisory</span>
              <HelpCircle className="w-3.5 h-3.5"/>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEGREES.map((d) => {
            const tone = toneMap[d.tone];
            return (<div key={d.title} className="p-5 rounded-2xl bg-[#f9f9ff] border border-[#e7eeff] hover:shadow-md hover:border-[#115eaf] transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${tone.badge} ${tone.text} ${tone.border}`}>
                        {d.level}
                      </span>
                      <span className="text-xs font-semibold text-emerald-700">{d.price}</span>
                    </div>
                    <h3 className="text-[17px] font-bold text-[#000f22]">{d.title}</h3>
                    <p className="text-xs text-[#74777e] font-normal mt-0.5">{d.duration}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                      {d.tracks.map((t) => (<span key={t} className="px-2 py-0.5 bg-white border border-[#e7eeff] rounded-md text-[11px] text-[#43474d]">
                          {t}
                        </span>))}
                    </div>
                  </div>
                  <button onClick={() => onOpenApply()} className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#115eaf] hover:text-white text-[#115eaf] text-xs font-semibold border border-[#d5e3ff] transition-colors flex items-center justify-center gap-1 shadow-xs">
                    <span>{d.count}</span>
                    <ArrowRight className="w-3 h-3"/>
                  </button>
                </div>);
        })}
          </div>
        </div>
      </section>

      {/* ================= VERIFICATION EXPLAINER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-[#d5e3ff] p-6 md:p-8 shadow-xs">
          <div className="max-w-2xl mb-8">
            <span className="text-[11px] text-[#115eaf] uppercase font-bold tracking-wider">
              Government Regulatory Framework
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#000f22] mt-1">
              How to Verify Online Degree Entitlements
            </h2>
            <p className="text-sm font-normal text-[#43474d] mt-2 leading-relaxed">
              As per the UGC (Open and Distance Learning Programmes and Online Programmes)
              Regulations, online degrees from entitled higher education institutions have full
              equivalence with conventional on-campus degrees for govt jobs, higher studies, and
              global corporate employment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VERIFICATION.map((v) => {
            const tone = toneMap[v.tone];
            const Icon = v.icon;
            return (<div key={v.title} className="p-5 rounded-xl bg-[#f9f9ff] border border-[#e7eeff]">
                  <div className={`w-10 h-10 rounded-lg ${tone.badge} ${tone.text} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5"/>
                  </div>
                  <h3 className="text-sm font-bold text-[#000f22]">{v.title}</h3>
                  <p className="text-[13px] font-normal text-[#43474d] mt-1.5 leading-relaxed">
                    {v.body}
                  </p>
                </div>);
        })}
          </div>
        </div>
      </section>

      {/* ================= BLOGS ================= */}
        <BlogsListSection onOpenHelpDesk={onOpenHelpDesk} className="max-w-7xl mx-auto my-8 bg-white rounded-2xl border border-[#d5e3ff] p-6 md:p-8 shadow-xs" posts={blogs}/>

      {/* ================= MOBILE FULL-SCREEN FILTER OVERLAY ================= */}
      {filtersOpen && (<div className="fixed inset-0 z-[60] bg-white flex flex-col lg:hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#e7eeff] shrink-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#115eaf]"/>
              <span className="text-sm font-bold text-[#000f22]">Filters</span>
              <span className="bg-[#f0f3ff] text-[#115eaf] text-[11px] font-bold px-2 py-0.5 rounded-full">
                5 Active
              </span>
            </div>
            <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#43474d] hover:text-[#000f22]">
              <X className="w-5 h-5"/>
            </button>
          </div>

          {/* Scrollable filter content */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-2">
            {filterBody}
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-[#e7eeff] p-4 flex items-center gap-3 bg-white">
            <button onClick={resetFilters} className="px-4 py-3 rounded-xl border border-[#d5e3ff] text-[#115eaf] text-sm font-semibold hover:bg-[#f0f3ff] transition-colors min-h-[44px]">
              Reset
            </button>
            <button onClick={() => setFiltersOpen(false)} className="flex-1 py-3 rounded-xl bg-[#115eaf] hover:bg-[#004689] text-white text-sm font-semibold transition-all shadow-sm active:scale-95 min-h-[44px]">
              Show Results
            </button>
          </div>
        </div>)}

      {/* hide-scrollbar utility */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>);
};
