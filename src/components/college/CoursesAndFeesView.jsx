"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ArrowRight,
  Award,
  Calculator,
  Calendar,
  CheckCircle,
  ChevronDown,
  CreditCard,
  Download,
  Gift,
  Laptop,
  Layers,
  PhoneCall,
  Search,
  Video,
  BookOpen,
  Smartphone,
  Users,
  Star,
} from "lucide-react";

import CollegeTableOfContents from "./CollegeTableOfContents";
import { useSiteActions } from "@/components/shell/SiteActionsContext";

const PLATFORM_ICON = {
  video: Video,
  book: BookOpen,
  smartphone: Smartphone,
  users: Users,
};

const METRIC_ICON = {
  rating: Award,
  online: Laptop,
  fee: CreditCard,
  courses: Layers,
};

const SORT_OPTIONS = [
  { value: "popularity", label: "Sort: Popularity" },
  { value: "fee-asc", label: "Fee: Low to High" },
  { value: "fee-desc", label: "Fee: High to Low" },
  { value: "duration", label: "Duration" },
];

const DEFAULT_FEE_NOTE = "Fees include exam charges, LMS access & digital material";

function numericFee(value) {
  if (typeof value === "number") return value;

  const digits = String(value || "").replace(/[^\d.]/g, "");

  return digits ? Number(digits) : 0;
}

function durationYears(value) {
  const match = String(value || "").match(/([\d.]+)/);
  return match ? Number(match[1]) : 0;
}

/**
 * Reusable "Courses & Fees" template.
 *
 * Every value comes from the props (`college` + `coursesData`), which are
 * built from the live CMS/API model in `services/coursesViewMapper.js`.
 * Nothing in this component is college specific.
 */
export default function CoursesAndFeesView({
  college = {},
  coursesData = {},
  overview = {},
  universityNavigation,
  onSelectCourse,
  onOpenApply,
  onOpenBrochure,
  onOpenEmi,
  onOpenHelpDesk,
}) {
  const siteActions = useSiteActions();

  const apply = onOpenApply || siteActions.onOpenApply;
  const brochure = onOpenBrochure || siteActions.onOpenBrochure;
  const helpDesk = onOpenHelpDesk || siteActions.onOpenHelpDesk;
  const emi = onOpenEmi || siteActions.onOpenEmi;

  const [activeSection, setActiveSection] = useState("fee-structure");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  const courses = coursesData.courses || [];
  const categories = coursesData.courseCategories || [];
  const tocItems = coursesData.toc || [];
  const metrics = coursesData.metrics || [];
  const admissionInfo = coursesData.admissionInfo || {};
  const universityName =
    overview.shortName || college.college?.shortName || college.name || "";

  const visibleCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = courses.filter((course) => {
      const matchesCategory = category === "all" || course.category === category;

      const matchesSearch =
        !query ||
        String(course.name || "").toLowerCase().includes(query) ||
        String(course.code || "").toLowerCase().includes(query) ||
        String(course.shortDescription || "").toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((first, second) => {
      if (sortBy === "fee-asc") {
        return numericFee(first.totalFee) - numericFee(second.totalFee);
      }

      if (sortBy === "fee-desc") {
        return numericFee(second.totalFee) - numericFee(first.totalFee);
      }

      if (sortBy === "duration") {
        return durationYears(first.duration) - durationYears(second.duration);
      }

      return 0;
    });
  }, [courses, category, searchQuery, sortBy]);

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

  const feeRows = courses;
  const reviews = coursesData.reviews || [];
  const faqs = coursesData.faqs || [];
  const blogs = coursesData.blogs || [];
  const learningRows = coursesData.learningPlatform?.items || [];
  const admissionDates = coursesData.admissionDates || [];

  const renderFeeTable = (rows, label, badge, subtitle) => (
    <div className="bg-white rounded-xl border border-[#e7eeff] overflow-hidden flex flex-col justify-between">
      <div>
        <div className="px-5 py-3.5 bg-[#f0f3ff] border-b border-[#e7eeff] flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-xs sm:text-sm text-[#000f22]">
              {label}
            </h3>
            {subtitle ? (
              <p className="mt-[7.5px] text-xs text-[#43474d] font-normal">
                Standard Duration: {subtitle}
              </p>
            ) : null}
          </div>
          <span className="px-2 py-0.5 text-xs font-normal rounded-md bg-[#d3e4ff] text-[#011c37]">
            {badge}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#e7eeff] text-[#43474d] text-xs font-semibold bg-[#f9f9ff]">
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Per Sem Fee</th>
                <th className="py-3 px-4">Total Fee</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={`${row.code || row.name}-${idx}`}
                  className="border-b border-[#e7eeff] last:border-b-0"
                >
                  <td className="py-3.5 px-4 text-[#000f22] font-normal align-top">
                    {row.name}
                    {row.specializations ? (
                      <span className="block text-[10px] text-[#74777e] font-normal leading-tight">
                        {row.specializations}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-3.5 px-4 text-[#43474d] font-normal align-top whitespace-nowrap">
                    {row.duration}
                  </td>
                  <td className="py-3.5 px-4 text-[#43474d] font-normal align-top whitespace-nowrap">
                    {row.perSemFee || "—"}
                  </td>
                  <td className="py-3.5 px-4 text-[#115eaf] font-semibold align-top whitespace-nowrap">
                    {row.avgFees || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-3.5 py-1.5 bg-[#f9f9ff] border-t border-[#e7eeff] flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-[#43474d] font-normal">
          {coursesData.coursesFees?.feeNote || DEFAULT_FEE_NOTE}
        </span>
        <span className="px-2 py-0.5 rounded-[7px] bg-white border border-[#d5e3ff] text-[11px] font-normal text-[#43474d]">
          Pay per semester
        </span>
      </div>
    </div>
  );

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
              {college.name || college.title || overview.title}
            </span>
            <span className="text-[#74777e]">/</span>
            <span className="text-[#000f22] font-bold">Courses &amp; Fees</span>
          </nav>
        </div>
      </div>

      <section className="content-block relative bg-gradient-to-b from-[#f0f3ff] via-[#f9f9ff] to-[#f9f9ff] overflow-hidden border-b border-[#e7eeff]/60">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#d5e3ff] blur-3xl" />
          <div className="absolute -left-20 top-40 w-80 h-80 rounded-full bg-[#d8e3fb] blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col space-y-4">
              <div>
                <h1 className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold text-[#000f22] tracking-tight font-sans leading-tight">
                  {coursesData.coursesFees?.title || overview.title}
                </h1>
                {coursesData.coursesFees?.description ? (
                  <p className="section-description text-xs sm:text-sm text-[#43474d] max-w-3xl leading-relaxed font-normal">
                    {coursesData.coursesFees.description}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => apply?.()}
                  className="px-5 py-2.5 rounded-xl bg-[#115eaf] text-white text-xs sm:text-sm font-semibold shadow hover:bg-[#004689] active:scale-95 transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Apply Online</span>
                </button>

                <button
                  type="button"
                  onClick={() => brochure?.()}
                  className="px-4 py-2.5 rounded-xl bg-white text-[#000f22] border border-[#0b2540] text-xs sm:text-sm font-semibold hover:bg-[#f0f3ff] active:scale-95 transition-all shadow-xs flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#115eaf]" />
                  <span>Download Complete Fee Brochure</span>
                </button>

                <button
                  type="button"
                  onClick={() => helpDesk?.()}
                  className="tap-chip px-3.5 py-2.5 rounded-xl text-[#115eaf] hover:bg-[#dee8ff] text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Talk to an Academic Counselor</span>
                </button>
              </div>

              {metrics.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {metrics.map((metric) => {
                    const Icon = METRIC_ICON[metric.icon] || Award;

                    return (
                      <div
                        key={metric.label}
                        className="p-4 rounded-xl bg-white border border-[#e7eeff] flex flex-col justify-between"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#d5e3ff] text-[#115eaf] flex items-center justify-center mb-1.5">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#000f22] font-sans">
                            {metric.value}
                          </div>
                          <div className="text-[11px] text-[#43474d] mt-0.5 font-normal">
                            {metric.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div className="lg:col-span-4">
              {admissionInfo.status || admissionInfo.deadline ? (
                <div className="rounded-xl p-4 sm:p-5 bg-white border border-[#115eaf]/25 shadow-md relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#d5e3ff]/50 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between pb-3 border-b border-[#e7eeff]">
                    <div className="flex items-center gap-2">
                      {admissionInfo.status ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      ) : null}
                      <span className="text-xs sm:text-sm font-normal text-[#000f22]">
                        {admissionInfo.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 py-3.5 text-xs">
                    {admissionInfo.deadline ? (
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#f0f3ff] flex items-center justify-center shrink-0 text-[#115eaf]">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[11px] text-[#43474d] block font-normal">
                            Registration Deadline
                          </span>
                          <span className="text-xs sm:text-sm font-normal text-[#000f22]">
                            {admissionInfo.deadline}
                          </span>
                        </div>
                      </div>
                    ) : null}

                    {admissionInfo.grant ? (
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#FFFBEB] flex items-center justify-center shrink-0 text-[#92400E]">
                          <Award className="w-3.5 h-3.5 text-[#D97706]" />
                        </div>
                        <div>
                          <span className="text-[11px] text-[#43474d] block font-normal">
                            Tuition Fee Grant
                          </span>
                          <span className="text-xs sm:text-sm font-normal text-[#B45309]">
                            {admissionInfo.grant}
                          </span>
                        </div>
                      </div>
                    ) : null}

                    {admissionInfo.emi ? (
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#f0f3ff] flex items-center justify-center shrink-0 text-[#115eaf]">
                          <CreditCard className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-[11px] text-[#43474d] block font-normal">
                            Monthly Payment Option
                          </span>
                          <span className="text-xs sm:text-sm font-normal text-[#000f22]">
                            {admissionInfo.emi}
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="pt-2 border-t border-[#e7eeff] flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => apply?.()}
                      className="w-full py-2.5 rounded-lg bg-[#0b2540] text-white text-xs sm:text-sm font-semibold hover:bg-[#000f22] active:scale-95 transition-all flex items-center justify-center gap-2 shadow"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-center text-[10px] text-[#74777e] font-normal">
                      Direct merit-based admission with online document verification
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

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

          {/* 1. Fee Structure */}
          {feeRows.length > 0 && (
            <section
              id="fee-structure"
              className="content-block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-[100px]"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-3 gap-3">
                <div>
                  <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] tracking-tight font-sans">
                    {coursesData.coursesFees?.title}
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#43474d] font-normal">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Includes Exam Fees, LMS Access &amp; Digital Material</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {categories.map((entry) =>
                  renderFeeTable(
                    courses.filter((course) => course.category === entry.key),
                    entry.title,
                    entry.badge,
                    coursesData.coursesFees?.durationLabel
                  )
                )}
              </div>
            </section>
          )}

          {/* EMI banner */}
          <section className="content-block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#e7eeff] via-[#f0f3ff] to-[#d5e3ff] border border-[#115eaf]/30">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-[11px] bg-[#115eaf] text-white flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm font-bold text-[#000f22] font-sans">
                    Flexible Fee Payment and Zero-Cost EMI
                  </strong>
                  <p className="mt-0.5 text-[11px] text-[#43474d] font-normal">
                    Pay semester-wise and check your monthly plan before you
                    apply.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => emi?.()}
                className="px-5 py-3 rounded-xl bg-[#115eaf] text-white text-xs font-semibold hover:bg-[#004689] transition-colors flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                Calculate EMI
              </button>
            </div>
          </section>

          {/* 2. All Courses */}
          {visibleCourses.length > 0 && (
            <section
              id="all-courses"
              className="content-block bg-[#f0f3ff]/50 border-y border-[#e7eeff] scroll-mt-[100px]"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] tracking-tight font-sans">
                  {universityName
                    ? `${universityName} All Courses`
                    : "All Courses"}
                </h2>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 mt-[18px]">
                  <button
                    type="button"
                    onClick={() => setCategory("all")}
                    aria-pressed={category === "all"}
                    className={`tap-chip h-8 px-3.5 rounded-2xl border text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                      category === "all"
                        ? "bg-[#115eaf] border-[#115eaf] text-white"
                        : "bg-white border-[#dfe6ec] text-[#43474d]"
                    }`}
                  >
                    All Courses ({courses.length})
                  </button>

                  {categories.map((entry) => (
                    <button
                      key={entry.key}
                      type="button"
                      onClick={() => setCategory(entry.key)}
                      aria-pressed={category === entry.key}
                      className={`tap-chip h-8 px-3.5 rounded-2xl border text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                        category === entry.key
                          ? "bg-[#115eaf] border-[#115eaf] text-white"
                          : "bg-white border-[#dfe6ec] text-[#43474d]"
                      }`}
                    >
                      {entry.badge} ({entry.count})
                    </button>
                  ))}

                  <div className="ml-auto flex items-center gap-2">
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      aria-label="Sort programmes"
                      className="h-8 px-2.5 rounded-2xl border border-[#dfe6ec] bg-white text-xs font-medium text-[#43474d] focus:outline-none focus:border-[#115eaf] cursor-pointer"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="relative mt-[18px]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search programmes"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e7eeff] bg-[#f9f9ff] text-sm text-[#000f22] font-normal placeholder:text-[#74777e] focus:outline-none focus:border-[#115eaf] focus:bg-white transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74777e]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mt-[18px]">
                  {visibleCourses.map((course, idx) => (
                    <div
                      key={`${course.code || course.name}-${idx}`}
                      className="bg-white rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 border border-[#e7eeff] shadow-xs hover:border-[#115eaf]/60 hover:shadow-xs"
                    >
                      <div>
                        <h3 className="font-semibold text-xs sm:text-sm text-[#000f22]">
                          {course.name}
                        </h3>
                        {course.shortDescription ? (
                          <p className="mt-[7.5px] text-xs text-[#43474d] font-normal">
                            {course.shortDescription}
                          </p>
                        ) : null}
                        <div className="mt-3 flex items-center gap-3 text-xs text-[#43474d]">
                          {course.duration ? <span>{course.duration}</span> : null}
                          {course.avgFees ? (
                            <span className="text-[#115eaf] font-semibold">
                              {course.avgFees}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => apply?.()}
                        className="mt-4 w-full py-2 min-h-[44px] rounded-lg bg-[#115eaf] text-white text-xs font-bold hover:bg-[#004689] active:scale-95 transition-all"
                      >
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 3. Admission Dates */}
          {admissionDates.length > 0 && (
            <section
              id="admission-dates"
              className="content-block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-[100px]"
            >
              <div className="mb-[18px]">
                <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] tracking-tight font-sans">
                  {overview.admissionDatesMeta?.title || "Admission Dates & Deadlines"}
                </h2>
              </div>

              <ul className="border-t border-[#e7eeff]">
                {admissionDates.map((item, idx) => (
                  <li
                    key={`${item.title}-${idx}`}
                    className="grid grid-cols-[auto_1fr_auto] gap-x-4 gap-y-1 py-4 border-b border-[#e7eeff]"
                  >
                    <span className="text-[10px] font-normal text-[#c4c6ce] tabular-nums">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-[#000f22]">
                        {item.title}
                      </h3>
                      {item.description ? (
                        <p className="text-xs text-[#43474d] mt-[7.5px] leading-relaxed font-normal">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                    <span className="text-xs font-medium text-[#115eaf] whitespace-nowrap self-center">
                      {item.date}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 4. Learning Platform */}
          {learningRows.length > 0 && (
            <section
              id="learning-platform"
              className="content-block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-[100px]"
            >
              <div className="mb-[18px]">
                <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] tracking-tight font-sans">
                  {coursesData.learningPlatform?.title ||
                    (universityName
                      ? `How You Study (${universityName} Learning Platform)`
                      : "How You Study")}
                </h2>
              </div>

              <ul className="border-t border-[#e7eeff]">
                {learningRows.map((item, idx) => {
                  const Icon = PLATFORM_ICON[item.icon] || Video;

                  return (
                    <li
                      key={idx}
                      className="group grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] gap-x-4 sm:gap-x-6 gap-y-2 py-5 sm:py-6 border-b border-[#e7eeff]"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-9 h-9 rounded-full bg-[#eef4ff] text-[#115eaf] flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#115eaf] group-hover:text-white">
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className="text-[10px] font-normal text-[#c4c6ce] tabular-nums sm:hidden mt-2.5">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-[#000f22]">
                          {item.title}
                        </h3>
                        {item.description ? (
                          <p className="text-xs text-[#43474d] mt-[7.5px] leading-relaxed font-normal max-w-2xl">
                            {item.description}
                          </p>
                        ) : null}
                      </div>

                      {item.meta ? (
                        <div className="col-start-2 sm:col-start-3 sm:row-start-1 sm:self-center flex items-center gap-2 text-xs font-medium text-[#115eaf] whitespace-nowrap">
                          <span>{item.meta}</span>
                          <span className="text-[#115eaf]">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          </span>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* 5. Student Reviews */}
          {reviews.length > 0 && (
            <section
              id="student-reviews"
              className="content-block bg-white border-y border-[#e7eeff] scroll-mt-[100px]"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-left mb-[18px]">
                  <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] tracking-tight font-sans">
                    {overview.reviewsMeta?.title ||
                      (universityName
                        ? `${universityName} Online Student Reviews & Ratings`
                        : "Student Reviews")}
                  </h2>
                  <p className="section-description text-xs text-[#74777e] mt-1">
                    Authentic feedback from working executives, entrepreneurs, and
                    graduates
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {reviews.slice(0, 6).map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#f9f9ff] p-4 rounded-xl border border-[#e7eeff] flex flex-col justify-between hover:border-[#115eaf] transition-all hover:shadow-sm"
                    >
                      <div>
                        <div className="flex items-center text-amber-500 mb-2 gap-0.5">
                          {[...Array(Math.max(0, Math.min(5, Math.round(Number(item.rating) || 0))))].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs text-[#43474d] italic leading-relaxed font-normal line-clamp-3">
                          &quot;{item.review}&quot;
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-[#d5e3ff]">
                        <div className="w-8 h-8 rounded-full bg-white text-[#115eaf] flex items-center justify-center font-bold text-xs shadow-sm border border-[#e7eeff] shrink-0">
                          {item.avatar || (item.name || "S").charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-[#000f22] truncate">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-[#74777e] font-medium truncate">
                            {item.course || "Online Student"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 6. FAQs */}
          {faqs.length > 0 && (
            <section
              id="faqs"
              className="content-block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-[100px]"
            >
              <div className="text-left mb-[18px]">
                <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] tracking-tight font-sans">
                  FAQs
                </h2>
              </div>

              <div className="space-y-2.5">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-[#e7eeff] shadow-xs overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 font-medium text-xs sm:text-sm text-[#000f22] hover:text-[#115eaf] transition-colors min-h-[44px]"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#115eaf] shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-3 text-xs text-[#43474d] bg-[#f9f9ff] border-t border-[#e7eeff] leading-relaxed">
                          <p className="pt-3 font-normal">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 7. Blogs */}
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
                      {post.description ? (
                        <p className="mt-2 text-xs text-[#43474d] leading-relaxed line-clamp-3">
                          {post.description}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* 8. Counselor helpline */}
          <section
            id="counselor-helpline"
            className="content-block bg-[#0b2540] text-white scroll-mt-[130px]"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
              <div>
                <h3 className="section-title text-lg sm:text-xl font-bold font-sans tracking-tight">
                  {coursesData.counselor?.title ||
                    "Have Questions About Courses, Eligibility, or Fees?"}
                </h3>
                <p className="section-description text-xs sm:text-sm text-[#b1c8eb] font-normal">
                  {coursesData.counselor?.description ||
                    "Speak directly with an Online Siksha university advisor. We review your documents, help generate your DEB ID, and guide your admission at zero cost."}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => apply?.()}
                  className="px-5 py-2.5 rounded-lg bg-[#115eaf] text-white text-xs sm:text-sm font-semibold shadow hover:bg-[#004689] active:scale-95 transition-all min-h-[44px]"
                >
                  Book Free Counseling Call
                </button>
                <button
                  type="button"
                  onClick={() => helpDesk?.()}
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
