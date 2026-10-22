"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, ShieldCheck, TrendingUp, Award, ThumbsUp, GraduationCap, Briefcase, Play, Pause, ExternalLink, CheckCircle2, Sparkles, } from 'lucide-react';
const TESTIMONIALS_DATA = [
    {
        id: 'pooja-sharma-mba',
        name: 'Pooja Sharma',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        courseName: 'Online MBA in Business Analytics',
        university: 'LPU Online',
        batch: "Batch '24",
        currentRole: 'Senior Business Analyst',
        company: 'Deloitte India',
        previousRole: 'Operations Executive',
        previousCompany: 'Wipro',
        rating: 5,
        highlightMetric: '+85% Salary Hike',
        quote: 'Balancing a demanding 9-to-6 schedule with classroom learning was practically impossible. LPU Online’s weekend live sessions and real-world case studies allowed me to upskill without pausing my income. Within 6 months of graduation, I transitioned into Deloitte with an 85% salary hike.',
        fullStory: 'Pooja joined LPU Online while working full-time in operations. By choosing Business Analytics with Tableau and Python modules, she built a verified project portfolio reviewed by industry mentors. With university placement prep, she cracked three Big-4 interviews and accepted Deloitte’s offer.',
        category: 'management',
        verifiedUgc: true,
        helpfulCount: 342,
    },
    {
        id: 'rahul-verma-mca',
        name: 'Rahul Verma',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        courseName: 'Online MCA in AI & Cloud Systems',
        university: 'Chandigarh University Online',
        batch: "Batch '23",
        currentRole: 'Cloud Solutions Engineer',
        company: 'Infosys Finacle',
        previousRole: 'Junior Web Developer',
        previousCompany: 'TechSol Solutions',
        rating: 5,
        highlightMetric: 'Promoted to Tech Lead',
        quote: 'Having a BCA left me stalled in basic maintenance roles. CU Online’s practical AWS cloud architecture and AI modules gave my resume the statutory Master’s credential recruiters demanded. 100% home-proctored exams made evaluation stress-free.',
        fullStory: 'Rahul completed his MCA over 2 years while handling client deliverables. The UGC-DEB recognition was fully honored by his HR division, unlocking internal promotions and a 2.4x increment package.',
        category: 'tech',
        verifiedUgc: true,
        helpfulCount: 289,
    },
    {
        id: 'ananya-deshmukh-bba',
        name: 'Ananya Deshmukh',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        courseName: 'Online BBA in Digital Marketing',
        university: 'Amity University Online',
        batch: "Batch '24",
        currentRole: 'Growth Marketing Associate',
        company: 'Nykaa E-Commerce',
        rating: 5,
        highlightMetric: 'Zero-Cost EMI Financed',
        quote: 'The virtual campus drives were outstanding. I attended mentor mock interviews and was placed at Nykaa before our 6th semester finals. The zero-cost monthly EMI payment scheme relieved my family of any commercial bank loan burden.',
        fullStory: 'Ananya opted for Amity Online due to QS Asia #1 distance ranking. She specialized in Performance Marketing, managed paid ad budgets in simulated labs, and received 2 corporate placement offers via virtual hiring summits.',
        category: 'management',
        verifiedUgc: true,
        helpfulCount: 198,
    },
    {
        id: 'karthik-nambiar-bca',
        name: 'Karthik Nambiar',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        courseName: 'Online BCA in Data Science',
        university: 'Manipal University Jaipur',
        batch: "Batch '23",
        currentRole: 'Data Engineering Associate',
        company: 'Cognizant',
        rating: 5,
        highlightMetric: '10,000+ Coursera Access',
        quote: 'Manipal Online provided free access to Google Cloud certifications and Coursera specializations alongside the university syllabus. Submitting assignments online and interacting with faculty through discussion boards kept me consistently motivated.',
        fullStory: 'Karthik leveraged Manipal’s enterprise Coursera partnership to complete 4 industry credentials in Apache Spark and Big Data before graduation. His degree has already received positive WES credential verification for higher education abroad.',
        category: 'tech',
        verifiedUgc: true,
        helpfulCount: 215,
    },
    {
        id: 'sneha-mukherjee-mcom',
        name: 'Sneha Mukherjee',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        courseName: 'Online M.Com in International Finance',
        university: 'Jain University Online',
        batch: "Batch '24",
        currentRole: 'Audit & Tax Analyst',
        company: 'Ernst & Young (EY)',
        previousRole: 'Accounts Trainee',
        previousCompany: 'Local CA Firm',
        rating: 5,
        highlightMetric: 'ACCA Paper Exemptions',
        quote: 'I wanted to clear global certifications while earning an accredited Master’s degree. Jain Online’s curriculum mapped directly with ACCA papers, granting direct exam exemptions. The weekend live doubt clearing was invaluable.',
        fullStory: 'Sneha completed her M.Com without having to relocate to a metro city. The UGC entitlement was fully verified for corporate compliance, allowing her to clear EY campus screening within weeks.',
        category: 'commerce',
        verifiedUgc: true,
        helpfulCount: 174,
    },
];
export const StudentTestimonials = ({ onOpenCounseling }) => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [likedMap, setLikedMap] = useState({});
    const [selectedStory, setSelectedStory] = useState(null);
    const sliderRef = useRef(null);
    const filteredTestimonials = TESTIMONIALS_DATA.filter((t) => {
        if (activeCategory === 'all')
            return true;
        return t.category === activeCategory;
    });
    // Reset active index when category changes
    useEffect(() => {
        setActiveIndex(0);
        if (sliderRef.current) {
            sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }, [activeCategory]);
    // Autoplay functionality
    useEffect(() => {
        if (!isPlaying)
            return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % filteredTestimonials.length);
        }, 4500);
        return () => clearInterval(interval);
    }, [isPlaying, filteredTestimonials.length]);
    // Scroll carousel to active index
    const scrollToIndex = (index) => {
        setActiveIndex(index);
        if (sliderRef.current) {
            const card = sliderRef.current.children[index];
            if (card) {
                sliderRef.current.scrollTo({
                    left: card.offsetLeft - sliderRef.current.offsetLeft,
                    behavior: 'smooth',
                });
            }
        }
    };
    const handlePrev = () => {
        const nextIdx = activeIndex === 0 ? filteredTestimonials.length - 1 : activeIndex - 1;
        scrollToIndex(nextIdx);
    };
    const handleNext = () => {
        const nextIdx = (activeIndex + 1) % filteredTestimonials.length;
        scrollToIndex(nextIdx);
    };
    const toggleLike = (id) => {
        setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    };
    return (<section id="testimonials" className="space-y-6 pt-2">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#000f22] dark:text-slate-100 tracking-tight">
            What Our Students are Saying About us
          </h2>
          <p className="text-xs sm:text-sm text-[#43474d] dark:text-slate-400 mt-1 max-w-2xl font-normal leading-relaxed">
            See how working professionals and fresh graduates across India earned UGC-entitled degrees, achieved promotions, and transitioned into top MNCs without leaving their jobs.
          </p>
        </div>

        {/* Controls: Category Filter + Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full md:justify-end">
          {/* Segmented Category Buttons */}
          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 max-w-full overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button type="button" onClick={() => setActiveCategory('all')} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[44px] ${activeCategory === 'all'
            ? 'bg-white dark:bg-[#121c2e] text-[#115eaf] dark:text-blue-400 shadow-xs font-semibold'
            : 'text-[#43474d] dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
              All Programs
            </button>
            <button type="button" onClick={() => setActiveCategory('management')} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[44px] ${activeCategory === 'management'
            ? 'bg-white dark:bg-[#121c2e] text-[#115eaf] dark:text-blue-400 shadow-xs font-semibold'
            : 'text-[#43474d] dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
              Management (MBA/BBA)
            </button>
            <button type="button" onClick={() => setActiveCategory('tech')} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[44px] ${activeCategory === 'tech'
            ? 'bg-white dark:bg-[#121c2e] text-[#115eaf] dark:text-blue-400 shadow-xs font-semibold'
            : 'text-[#43474d] dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
              Technology (MCA/BCA)
            </button>
            <button type="button" onClick={() => setActiveCategory('commerce')} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 min-h-[44px] ${activeCategory === 'commerce'
            ? 'bg-white dark:bg-[#121c2e] text-[#115eaf] dark:text-blue-400 shadow-xs font-semibold'
            : 'text-[#43474d] dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
              Commerce (M.Com)
            </button>
          </div>

          {/* Autoplay & Arrows */}
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => setIsPlaying(!isPlaying)} className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121c2e] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs" title={isPlaying ? 'Pause slideshow' : 'Auto-play reviews'} aria-label={isPlaying ? 'Pause slideshow' : 'Auto-play reviews'}>
              {isPlaying ? <Pause className="w-3.5 h-3.5"/> : <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"/>}
            </button>

            <button type="button" onClick={handlePrev} className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121c2e] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs" aria-label="Previous testimonial">
              <ChevronLeft className="w-4 h-4"/>
            </button>

            <button type="button" onClick={handleNext} className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#121c2e] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs" aria-label="Next testimonial">
              <ChevronRight className="w-4 h-4"/>
            </button>
          </div>
        </div>
      </div>

      {/* Trust Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-slate-50 dark:bg-[#121c2e]/70 border border-slate-200 dark:border-[#24344d] rounded-xl text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0"/>
          <span className="text-slate-700 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white font-semibold">100% Equal</strong> to Regular On-Campus Degrees
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0"/>
          <span className="text-slate-700 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white font-semibold">58% Average</strong> Salary Growth Post-Degree
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500 shrink-0"/>
          <span className="text-slate-700 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white font-semibold">UPSC &amp; Govt</strong> Exam Eligible Validations
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0"/>
          <span className="text-slate-700 dark:text-slate-300">
            <strong className="text-slate-900 dark:text-white font-semibold">500+ Partner</strong> Recruiters Participating
          </span>
        </div>
      </div>

      {/* Sliding Cards Carousel Track */}
      <div ref={sliderRef} className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {filteredTestimonials.map((item, idx) => {
            const isLiked = !!likedMap[item.id];
            const currentHelpful = item.helpfulCount + (isLiked ? 1 : 0);
            return (<div key={item.id} className={`shrink-0 w-[300px] sm:w-[350px] md:w-[370px] snap-start rounded-2xl bg-white dark:bg-[#121c2e] border border-slate-200/90 dark:border-[#24344d] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 group relative ${activeIndex === idx ? 'ring-2 ring-[#115eaf]/25 dark:ring-blue-500/30' : ''}`}>
              {/* Top Row: User Avatar & Course Info */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0 rounded-full overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 shadow-md bg-slate-100 dark:bg-slate-800">
                      <img src={item.avatarUrl} alt={item.name} className="w-13 h-13 object-cover aspect-square rounded-full border-2 border-white dark:border-slate-800" loading="lazy"/>
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#000f22] dark:text-slate-100 tracking-tight leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#115eaf] dark:text-blue-400 font-medium">
                        {item.currentRole}
                      </p>
                      <p className="text-[11px] text-[#74777e] dark:text-slate-400">
                        {item.company}
                      </p>
                    </div>
                  </div>

                  {/* Rating & Highlight Pill */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(Math.max(0, Math.min(5, Math.round(Number(item.rating) || 0))))].map((_, i) => (<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400"/>))}
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                      {item.highlightMetric}
                    </span>
                  </div>
                </div>

                {/* Course & University Metadata - Clean Unboxed Typography */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#555960] dark:text-slate-400 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.courseName}
                  </span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                  <span>{item.university}</span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-slate-500">{item.batch}</span>
                </div>

                {/* Quote Block */}
                <div className="relative">
                  <Quote className="w-6 h-6 text-slate-200 dark:text-slate-700 absolute -top-1 -left-1 -z-0 opacity-70"/>
                  <p className="relative z-1 text-sm sm:text-[14px] font-semibold text-[#2d3139] dark:text-slate-300 leading-relaxed line-clamp-4">
                    "{item.quote}"
                  </p>
                </div>
              </div>

              {/* Bottom Row: Actions & Social Proof */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <button type="button" onClick={() => setSelectedStory(item)} className="inline-flex items-center gap-1 font-semibold text-[#115eaf] dark:text-blue-400 hover:text-[#084a8c] dark:hover:text-blue-300 transition-colors cursor-pointer group-hover:underline">
                  <span>Read Full Journey</span>
                  <ExternalLink className="w-3 h-3"/>
                </button>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => toggleLike(item.id)} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${isLiked
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-[#115eaf] dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700 text-[#555960] dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`} title="Mark review as helpful">
                    <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`}/>
                    <span>{currentHelpful}</span>
                  </button>
                </div>
              </div>
            </div>);
        })}
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {filteredTestimonials.map((_, idx) => (<button key={idx} type="button" onClick={() => scrollToIndex(idx)} className="w-6 h-6 flex items-center justify-center rounded-full cursor-pointer" aria-label={`Jump to review ${idx + 1}`}>
            <span className={`block h-2 rounded-full transition-all ${activeIndex === idx
                ? 'w-7 bg-[#115eaf] dark:bg-blue-400'
                : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'}`}/>
          </button>))}
      </div>

      {/* Bottom Counselor Connect CTA Strip */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-slate-50 dark:from-slate-900/80 dark:via-[#13233c] dark:to-slate-900/80 border border-blue-100 dark:border-[#223552] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#115eaf] text-white flex items-center justify-center shrink-0 shadow-sm">
            <GraduationCap className="w-5 h-5"/>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#000f22] dark:text-slate-100">
              Want to speak with someone who completed this degree?
            </h4>
            <p className="text-xs text-[#555960] dark:text-slate-400">
              Connect with an unbiased university admissions mentor for curriculum breakdowns and EMI estimates.
            </p>
          </div>
        </div>

        {onOpenCounseling && (<button type="button" onClick={onOpenCounseling} className="w-full sm:w-auto px-4 py-2 bg-[#115eaf] hover:bg-[#084a8c] text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95">
            <span>Talk to an Academic Advisor</span>
            <Sparkles className="w-3.5 h-3.5"/>
          </button>)}
      </div>

      {/* Full Story Modal */}
      {selectedStory && (<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedStory(null)}>
          <div className="w-full max-w-[760px] bg-white dark:bg-[#121c2e] rounded-2xl border border-slate-200 dark:border-[#24344d] shadow-2xl overflow-hidden p-4 sm:p-5 space-y-3" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0 rounded-full overflow-hidden border-2 border-[#115eaf] bg-slate-100 shadow-sm">
                  <img src={selectedStory.avatarUrl} alt={selectedStory.name} className="w-12 h-12 sm:w-14 sm:h-14 object-cover aspect-square rounded-full"/>
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-[1.7rem] font-bold text-[#000f22] dark:text-white leading-[1.1] tracking-[-0.02em]">
                    {selectedStory.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#115eaf] dark:text-blue-400 font-semibold leading-snug">
                    {selectedStory.currentRole} · {selectedStory.company}
                  </p>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-snug">
                    {selectedStory.university} ({selectedStory.batch})
                  </p>
                </div>
              </div>

              <button type="button" onClick={() => setSelectedStory(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" aria-label="Close dialog">
                ✕
              </button>
            </div>

            {/* Key Outcomes Box */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[9px] uppercase font-semibold tracking-[0.12em]">
                  Primary Outcome
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[1.25rem] sm:text-[1.4rem] leading-none tracking-[-0.03em]">
                  {selectedStory.highlightMetric}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-slate-500 dark:text-slate-400 block text-[9px] uppercase font-semibold tracking-[0.12em]">
                  Statutory Status
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500"/>
                  UGC-DEB Entitled Degree
                </span>
              </div>
            </div>

            {/* Detailed Story Narrative */}
            <div className="space-y-2.5">
              <h4 className="text-[0.7rem] sm:text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-[0.12em]">
                Full Journey &amp; Preparation Experience
              </h4>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {selectedStory.fullStory}
              </p>
              <blockquote className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-[#115eaf] text-sm sm:text-base text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "{selectedStory.quote}"
              </blockquote>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
              <button type="button" onClick={() => setSelectedStory(null)} className="px-3 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                Close
              </button>
              {onOpenCounseling && (<button type="button" onClick={() => {
                    setSelectedStory(null);
                    onOpenCounseling();
                }} className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#115eaf] text-white hover:bg-[#084a8c] transition-colors cursor-pointer shadow-xs">
                  Explore Similar Programs
                </button>)}
            </div>
          </div>
        </div>)}
    </section>);
};
