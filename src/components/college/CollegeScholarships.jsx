"use client";

import { useState, useEffect } from "react";
import {
  Award,
  Shield,
  Clock,
  Heart,
  UserCheck,
  CheckCircle,
  Download,
  PhoneCall,
  ArrowRight,
  Sparkles,
  Star,
} from "lucide-react";

import CollegeHero from "./CollegeHero";
import CollegeTableOfContents from "./CollegeTableOfContents";
import { useSiteActions } from "@/components/shell/SiteActionsContext";
import { collegeBase, collegeSectionTitle } from "@/lib/collegeTitle";

const PILLAR_ICON = {
  award: Award,
  shield: Shield,
  clock: Clock,
  heart: Heart,
  user: UserCheck,
};

const PILLAR_ICON_BG = {
  award: "bg-[#FFFBEB] text-[#92400E]",
  shield: "bg-[#e7eeff] text-[#115eaf]",
  clock: "bg-[#FFFBEB] text-[#92400E]",
  heart: "bg-[#f0f3ff] text-[#115eaf]",
  user: "bg-[#f0f3ff] text-[#115eaf]",
  star: "bg-[#e7eeff] text-[#115eaf]",
};

const PILLAR_TAG = {
  amber: "bg-[#ffdcc3] text-[#6e3900]",
  blue: "bg-[#d5e3ff] text-[#004689]",
  green: "bg-[#e0f2e9] text-[#129b55]",
};

/**
 * College Scholarships page — port of the reference "Scholarships" tab
 * (src/components/ScholarshipsView.tsx).
 *
 * The calculator only renders when the API provides scholarship rules.
 * Sections without data are hidden instead of being filled with placeholders.
 */
export default function CollegeScholarships({
  college = {},
  overview = {},
  universityNavigation,
}) {
  const siteActions = useSiteActions();
  const onOpenApply = siteActions.onOpenApply;
  const onOpenBrochure = siteActions.onOpenBrochure;
  const onOpenHelpDesk = siteActions.onOpenHelpDesk;

  const [activeSection, setActiveSection] = useState("scholarship-calculator");
  const [calcCourseId, setCalcCourseId] = useState("");
  const [marks, setMarks] = useState(78);

  const data = overview || {};
  const shortName = data.shortName || college.shortName || college.name || "";

  const scholarships = college.scholarships || [];
  const rules = data.scholarshipRules || [];
  const pillars = data.scholarshipPillars || [];
  const blogs = data.blogs || [];
  const courses = college.courses || [];

  const tocItems = [
    { id: "scholarship-overview", label: data.scholarshipSection?.title || "Scholarships Overview 2026" },
    { id: "scholarship-calculator", label: "Interactive Tuition Fee & Savings Calculator" },
    { id: "scholarship-schemes", label: data.scholarshipSection?.title || "Scholarship Schemes & Concessions" },
    { id: "blogs", label: "Blogs" },
    { id: "counselor-helpline", label: "Academic Counseling & Helpline" },
  ].filter((item) => {
    if (item.id === "scholarship-overview") return Boolean(data.scholarshipSection?.intro);
    if (item.id === "scholarship-calculator") return rules.length > 0;
    if (item.id === "scholarship-schemes")
      return pillars.length > 0 || scholarships.length > 0;
    if (item.id === "blogs") return blogs.length > 0;
    return true;
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      for (let i = tocItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(tocItems[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(tocItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems.length]);

  const selectedCourse =
    courses.find((c) => c.name === calcCourseId) || courses[0] || null;
  const baseFee = Number(selectedCourse?.fee || 0) || 0;

  const matchedRule = rules.reduce((best, rule) => {
    const m = String(rule.condition || "").match(/marks\s*>=\s*(\d+)/i);
    if (!m || marks < Number(m[1])) return best;
    if (!best || (rule.percent || 0) > (best.percent || 0)) return rule;
    return best;
  }, null);

  const percent = matchedRule?.percent || 0;
  const savings = Math.round((baseFee * percent) / 100);

  const schemeCards = pillars.length
    ? pillars
    : scholarships.map((scholarship, idx) => ({
        id: `sch-${idx}`,
        title: scholarship.name,
        body: scholarship.eligibility,
        tag: scholarship.type,
        footnote: scholarship.amount
          ? `Up to ${scholarship.amount}`
          : "Subject to Verification",
        icon: "award",
        tone: "amber",
      }));

  return (
    <div className="space-y-0">
      {/* Breadcrumb */}
      <div className="bg-[#f0f3ff] border-b border-[#e7eeff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <nav className="flex items-center text-xs text-[#43474d] space-x-2 font-medium">
            <span className="hover:text-[#115eaf] cursor-pointer">Home</span>
            <span className="text-[#74777e]">/</span>
            <span className="hover:text-[#115eaf] cursor-pointer">Colleges</span>
            <span className="text-[#74777e]">/</span>
            <span className="hover:text-[#115eaf] cursor-pointer">
              {college.name || data.title}
            </span>
            <span className="text-[#74777e]">/</span>
            <span className="text-[#000f22] font-bold">Scholarships</span>
          </nav>
        </div>
      </div>

      <CollegeHero
        overview={data}
        college={college}
        title="Scholarships & Fee Discounts"
        description={
          data.hero?.description ||
          "Fee waivers, merit scholarships and zero-cost EMI options for online degree programmes."
        }
      />

      {universityNavigation}

      <div className="content-block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-10">
        <div className="section-container">
          <CollegeTableOfContents
            title="Table of contents"
            items={tocItems}
            activeId={activeSection}
            onItemClick={(id) => setActiveSection(id)}
            defaultExpanded={false}
            collapsedCount={6}
          />

          {/* 0. Scholarship overview */}
          {data.scholarshipSection?.intro && (
            <section
              id="scholarship-overview"
              className="page-section text-center max-w-3xl mx-auto scroll-mt-[100px]"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                Fee Waivers &amp; Concessions 2026
              </span>
              <h1 className="section-title mt-3 text-3xl sm:text-4xl font-bold text-[#000f22] tracking-tight font-sans">
                Scholarships &amp; Fee Discounts
              </h1>
              <p className="section-description text-xs sm:text-sm text-[#43474d] leading-relaxed">
                {data.scholarshipSection.intro}
              </p>
            </section>
          )}

          {/* 1. Scholarship calculator */}
          {rules.length > 0 && (
            <section
              id="scholarship-calculator"
              className="page-section card bg-white rounded-2xl border-2 border-[#115eaf]/30 shadow-xs"
            >
              <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
                <div className="w-full lg:w-3/5 space-y-5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-[#e7eeff]">
                    <span className="w-5 h-5 rounded-md bg-[#eef4ff] text-[#115eaf] flex items-center justify-center text-xs font-bold">
                      %
                    </span>
                    <h3 className="font-bold text-base text-[#000f22] font-sans">
                      Calculate Your Net Tuition Fee &amp; Savings
                    </h3>
                  </div>

                  {courses.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold text-[#000f22] uppercase tracking-wider mb-1.5">
                        Select Programme
                      </label>
                      <select
                        value={calcCourseId}
                        onChange={(e) => setCalcCourseId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#c4c6ce] text-base sm:text-sm font-semibold text-[#000f22] focus:border-[#115eaf] outline-none"
                      >
                        {courses.map((course) => (
                          <option key={course.name} value={course.name}>
                            {course.name}
                            {course.fee ? ` (${course.fee})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <label className="font-bold text-[#000f22] uppercase tracking-wider">
                        Qualifying Aggregate Marks: {marks}%
                      </label>
                      <span className="text-[#115eaf] font-normal">
                        {matchedRule?.label || "Standard Grant"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={98}
                      value={marks}
                      onChange={(e) => setMarks(Number(e.target.value))}
                      className="w-full h-2 bg-[#e7eeff] rounded-lg appearance-none cursor-pointer accent-[#115eaf]"
                    />
                  </div>

                  {rules.filter((r) => r.condition).length > 0 && (
                    <div>
                      <span className="block text-xs font-bold text-[#000f22] uppercase tracking-wider mb-2">
                        Special Welfare Categories
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        {rules
                          .filter((r) => r.condition)
                          .map((r) => (
                            <label
                              key={r.id}
                              className="tap-chip min-h-[44px] p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all border-[#e7eeff]"
                            >
                              <input
                                type="checkbox"
                                checked={Boolean(matchedRule && matchedRule.id === r.id)}
                                readOnly
                                className="shrink-0 w-5 h-5 rounded text-[#115eaf]"
                              />
                              <span className="font-normal text-[#000f22]">{r.label}</span>
                            </label>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="card w-full lg:w-2/5 rounded-2xl bg-gradient-to-br from-[#0b2540] to-[#000f22] text-white space-y-4 shadow-md">
                  <div className="pb-3 border-b border-white/10">
                    <span className="text-[11px] font-bold text-[#b1c8eb] uppercase tracking-wider block">
                      Eligible Tuition Waiver
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                      {percent}% Waiver
                    </div>
                    <p className="text-xs text-emerald-400 mt-[7.5px]">
                      Total Fee Savings: ₹{savings.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-[#d8e3fb]">
                    <div className="flex justify-between">
                      <span className="text-[#768dad]">Standard Degree Fee:</span>
                      <span className="line-through text-[#768dad]">
                        ₹{baseFee.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net Total Tuition:</span>
                      <span className="font-bold text-white text-sm">
                        ₹{(baseFee - savings).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-white/10">
                      <span className="font-bold">Net Per Semester:</span>
                      <span className="font-extrabold text-[#70aaff]">
                        ₹{Math.round((baseFee - savings) / 4).toLocaleString("en-IN")}
/sem
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenApply()}
                    className="w-full py-3 rounded-xl bg-[#115eaf] text-white text-xs font-bold shadow hover:bg-[#004689] active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <span>Claim {percent}% Scholarship</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* 2. Scholarship schemes (pillars) */}
          {schemeCards.length > 0 && (
            <section
              id="scholarship-schemes"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-mt-[100px]"
            >
              {schemeCards.map((pillar, idx) => {
                const Icon = PILLAR_ICON[pillar.icon] || Award;

                return (
                  <div
                    key={pillar.id || idx}
                    className="card bg-white border border-[#e7eeff] rounded-2xl shadow-xs flex flex-col justify-between hover:border-[#115eaf] transition-all"
                  >
                    <div>
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                          PILLAR_ICON_BG[pillar.icon] || PILLAR_ICON_BG.award
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {pillar.tag ? (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            PILLAR_TAG[pillar.tone] || PILLAR_TAG.amber
                          }`}
                        >
                          {pillar.tag}
                        </span>
                      ) : null}

                      <h3 className="section-title font-bold text-base text-[#000f22] font-sans mt-2">
                        {pillar.title}
                      </h3>
                      {pillar.body ? (
                        <p className="text-xs text-[#43474d] leading-relaxed">
                          {pillar.body}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#e7eeff] text-xs font-bold text-[#115eaf]">
                      {pillar.footnote || "Subject to Verification"}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {/* 3. Blogs */}
          {blogs.length > 0 && (
            <section
              id="blogs"
              className="page-section card bg-white rounded-2xl border border-[#e7eeff] shadow-xs"
            >
              <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] tracking-tight font-sans">
                Blogs
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-[18px]">
                {blogs.slice(0, 3).map((post, idx) => (
                  <article
                    key={idx}
                    className="rounded-xl border border-[#e7eeff] overflow-hidden bg-white hover:border-[#115eaf] transition-all"
                  >
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-40 object-cover"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="p-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#115eaf]">
                        {post.category}
                      </span>
                      <h3 className="mt-1.5 text-sm font-medium text-[#115eaf] leading-relaxed">
                        {post.title}
                      </h3>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* 4. Counselor helpline */}
          <section
            id="counselor-helpline"
            className="content-block bg-[#0b2540] text-white scroll-mt-[130px]"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
              <div>
                <h3 className="section-title text-lg sm:text-xl font-bold font-sans tracking-tight">
                  Need Help Choosing the Right Scholarship?
                </h3>
                <p className="section-description text-xs sm:text-sm text-[#b1c8eb] font-normal">
                  Talk to an unbiased academic counsellor about fee waivers, EMI
                  options and admission eligibility — completely free.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenApply()}
                  className="px-5 py-2.5 rounded-lg bg-[#115eaf] text-white text-xs sm:text-sm font-semibold shadow hover:bg-[#004689] active:scale-95 transition-all min-h-[44px]"
                >
                  Apply Now
                </button>
                <button
                  type="button"
                  onClick={onOpenHelpDesk}
                  className="px-4 py-2.5 rounded-lg border border-[#768dad]/40 text-white text-xs sm:text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-1.5 min-h-[44px]"
                >
                  <PhoneCall className="w-4 h-4 text-[#70aaff]" />
                  <span>Call Helpline: 1800-889-4422</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
