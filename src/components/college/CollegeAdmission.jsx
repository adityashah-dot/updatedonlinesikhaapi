"use client";

import { useState, useEffect } from "react";
import {
  Download,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Star,
  PhoneCall,
  ShieldCheck,
  MapPin,
} from "lucide-react";

import CollegeHero from "./CollegeHero";
import CollegeTableOfContents from "./CollegeTableOfContents";
import { useSiteActions } from "@/components/shell/SiteActionsContext";
import { collegeBase, collegeSectionTitle } from "@/lib/collegeTitle";

/**
 * College Admission page — port of the reference "Admission" tab
 * (src/components/AdmissionView.tsx).
 *
 * Sections whose data is missing from the API are hidden; the layout of the
 * remaining sections is untouched.
 */
export default function CollegeAdmission({
  college = {},
  overview = {},
  universityNavigation,
}) {
  const siteActions = useSiteActions();
  const onOpenApply = siteActions.onOpenApply;
  const onOpenBrochure = siteActions.onOpenBrochure;
  const onOpenHelpDesk = siteActions.onOpenHelpDesk;

  const [activeSection, setActiveSection] = useState("admission-highlights");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [callback, setCallback] = useState({ name: "", phone: "", email: "" });
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [callbackErrors, setCallbackErrors] = useState({});

  const data = overview || {};
  const shortName = data.shortName || college.shortName || college.name || "";
  const admission = data.admission || college.admission || {};
  const eligibility = data.eligibility || null;
  const admissionSteps = admission.steps?.length ? admission.steps : [];
  const examSteps = data.examinationPattern?.steps || [];
  const reviews = data.reviews || [];
  const faqs = data.faqs || [];
  const blogs = data.blogs || [];
  const compare = data.compareSection || null;

  const [showAllEligibility, setShowAllEligibility] = useState(false);

  const scholarshipRows = [
    ...(data.scholarshipSchemes || []),
    ...(college.scholarships || []).map((scholarship, idx) => ({
      name: scholarship.name || scholarship.title || "",
      details: scholarship.eligibility || scholarship.amount || "",
      key: `cms-${idx}`,
    })),
  ];

  const hasEligibilityFee = Boolean(
    (eligibility?.items || []).some((row) => row.feeSem || row.totalFee)
  );

  const tocItems = [
    { id: "admission-highlights", label: data.admissionHighlights?.title || collegeSectionTitle(shortName, "Admission Highlights 2026") },
    { id: "admission-dates", label: data.admissionDatesMeta?.title || collegeSectionTitle(shortName, "Admission Important Dates 2026") },
    { id: "eligibility-criteria", label: data.eligibility?.title || collegeSectionTitle(shortName, "Eligibility & Selection Criteria 2026") },
    { id: "admission-process", label: data.admission?.title || collegeSectionTitle(shortName, "Admission Process 2026") },
    { id: "application-process", label: data.applicationProcessMeta?.title || collegeSectionTitle(shortName, "Application Process 2026") },
    { id: "examination-pattern", label: data.examinationPattern?.title || collegeSectionTitle(shortName, "Examination Pattern") },
    { id: "documents-required", label: data.documentsMeta?.title || collegeSectionTitle(shortName, "Documents Required for Admission") },
    { id: "scholarship-schemes", label: data.scholarshipSection?.title || collegeSectionTitle(shortName, "Scholarship 2026") },
    { id: "counseling-callback", label: "Request a Callback" },
    { id: "student-reviews", label: collegeSectionTitle(shortName, "Student Reviews") },
    { id: "blogs", label: "Blogs" },
    { id: "compare", label: "Compare" },
  ].filter((item) => {
    if (item.id === "admission-dates") return Boolean(data.admissionDates?.length);
    if (item.id === "eligibility-criteria") return Boolean(eligibility);
    if (item.id === "admission-process") return admissionSteps.length > 0;
    if (item.id === "application-process") return Boolean(data.applicationProcess?.length);
    if (item.id === "examination-pattern") return examSteps.length > 0;
    if (item.id === "documents-required") return Boolean(data.documentsRequired?.length);
    if (item.id === "scholarship-schemes") return Boolean(scholarshipRows.length);
    if (item.id === "student-reviews") return reviews.length > 0;
    if (item.id === "blogs") return blogs.length > 0;
    if (item.id === "compare") return Boolean(compare);
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

  const handleCallback = (e) => {
    e.preventDefault();
    const errors = {};

    if (!callback.name.trim()) errors.name = "Enter your name";
    if (!/^\d{10}$/.test(callback.phone.replace(/\D/g, "")))
      errors.phone = "Enter a valid 10-digit phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(callback.email))
      errors.email = "Enter a valid email address";

    setCallbackErrors(errors);

    if (Object.keys(errors).length === 0) setCallbackSubmitted(true);
  };

  const admissionStatus = (() => {
    const copy = `${data.admissionHighlights?.description || ""} ${
      (data.admissionDates || []).map((row) => `${row.event || ""} ${row.date || ""}`).join(" ")
    }`;

    if (/\bopen\b/i.test(copy)) return "Ongoing";
    if (/\bclosed\b/i.test(copy)) return "Closed";

    return "";
  })();

  const highlightStats = [
    {
      value: admissionStatus,
      label: "Admission Status",
    },
    {
      value: data.collegeMode
        ? data.collegeMode === "online"
          ? "Online"
          : data.collegeMode === "regular"
            ? "Regular"
            : data.collegeMode
        : "",
      label: "Mode of Application",
    },
    { value: data.feeRange || "", label: "Fee Range" },
    { value: data.duration || "", label: "Duration" },
  ].filter((stat) => stat.value);

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
            <span className="text-[#000f22] font-bold">Admission</span>
          </nav>
        </div>
      </div>

      <CollegeHero
        overview={data}
        college={college}
        title={collegeSectionTitle(shortName, "Admission Highlights 2026")}
        description={admission.intro}
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
            collapsedCount={7}
          />

          {/* 1. Admission Highlights */}
          <section
            id="admission-highlights"
            className="bg-white rounded-2xl border border-[#e1eaff] p-5 sm:p-6 md:p-8 shadow-[0_4px_18px_rgba(21,65,125,0.04)] scroll-mt-[110px]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-4 items-start">
              <div className="lg:col-span-7 space-y-3">
                <p className="flex items-center gap-[10px] mb-[10px] text-[11px] sm:text-[12px] font-semibold text-[#1763c5] uppercase tracking-[1.6px]">
                  <span className="w-7 h-1 rounded-full bg-[#1763e9]" />
                  Admissions Open 2026
                </p>

                <h2 className="section-title m-0 mb-[10px] text-xl sm:text-2xl font-extrabold text-[#000f22] font-sans">
                  {data.admissionHighlights?.title ||
                    collegeSectionTitle(shortName, "Admission Highlights 2026")}
                </h2>

                {data.admissionHighlights?.description ? (
                  <p className="m-0 text-sm text-[#2d3137] leading-relaxed font-normal">
                    {data.admissionHighlights.description}
                  </p>
                ) : null}

                {highlightStats.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-0 bg-[#f7f9ff] border border-[#e1eaff] rounded-[10px] p-2.5 sm:p-3">
                    {highlightStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="min-w-0 px-2 sm:px-2.5 py-1 border-r border-[#d7e1f0] last:border-r-0"
                      >
                        <span className="block mb-1 text-[10px] leading-[1.4] text-[#75849a]">
                          {stat.label}
                        </span>
                        <span className="block text-[12px] leading-[1.4] font-semibold text-[#0b1e3a]">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2.5 mt-4">
                  <button
                    type="button"
                    onClick={() => onOpenApply()}
                    className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 sm:px-5 rounded-[7px] text-[13px] font-semibold text-white bg-[#1763b5] shadow-[0_3px_8px_rgba(23,99,181,0.14)] hover:bg-[#0d519b] transition-all duration-200 cursor-pointer"
                  >
                    Apply Now
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenBrochure()}
                    className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 sm:px-5 rounded-[7px] text-[13px] font-semibold text-[#0b2342] bg-white border border-[#17375e] hover:bg-[#f5f8ff] transition-all duration-200 cursor-pointer"
                  >
                    <Download className="w-[17px] h-[17px]" />
                    Download Brochure
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Admission Important Dates */}
          {data.admissionDates?.length > 0 && (
            <section
              id="admission-dates"
              className="page-section card bg-white rounded-2xl border border-[#e7eeff] shadow-xs"
            >
              <div>
                <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] font-sans">
                  {data.admissionDatesMeta?.title ||
                    collegeSectionTitle(shortName, "Admission Important Dates 2026")}
                </h2>
                <p className="section-description text-xs sm:text-sm text-[#43474d] leading-relaxed font-normal">
                  {college.name || data.title} releases admission dates for its
                  online programmes on the official website. Dates are tentative
                  and may be updated by the university.
                </p>
              </div>

              <div className="mt-[18px] overflow-x-auto rounded-xl border border-[#e7eeff]">
                <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                  <thead>
                    <tr className="bg-[#0b2540] text-white">
                      <th className="py-3 px-4 font-bold">Event</th>
                      <th className="py-3 px-4 font-bold">Details</th>
                      <th className="py-3 px-4 font-bold">Tentative Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7eeff]">
                    {data.admissionDates.map((row, idx) => (
                      <tr key={`${row.event}-${idx}`} className="bg-white">
                        <td className="py-3.5 px-4 text-[#000f22] font-normal align-top">
                          {row.event}
                        </td>
                        <td className="py-3.5 px-4 text-[#43474d] font-normal align-top">
                          {row.detail}
                        </td>
                        <td className="py-3.5 px-4 text-[#115eaf] font-semibold align-top whitespace-nowrap">
                          {row.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* 3. Eligibility & Selection Criteria */}
          {eligibility && (
            <section
              id="eligibility-criteria"
              className="page-section card bg-white rounded-2xl border border-[#e7eeff] shadow-xs"
            >
              <div>
                <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] font-sans mt-2">
                  {data.eligibility?.title || collegeSectionTitle(shortName, "Eligibility & Selection Criteria 2026")}
                </h2>
                <span className="block w-16 h-[5px] rounded-[5px] bg-[#115eaf] mt-1" />
                {eligibility.intro ? (
                  <p className="section-description text-xs sm:text-sm text-[#43474d] leading-relaxed font-normal">
                    {eligibility.intro}
                  </p>
                ) : null}
              </div>

              {eligibility.items?.length > 0 && (
                <>
                  <div className="mt-[18px] overflow-x-auto rounded-xl border border-[#e7eeff]">
                    <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                      <thead>
                        <tr className="bg-[#0b2540] text-white">
                          <th className="py-3 px-4 font-bold">Course</th>
                          <th className="py-3 px-4 font-bold">Eligibility</th>
                          <th className="py-3 px-4 font-bold">Selection Process</th>
                          {hasEligibilityFee && (
                            <th className="py-3 px-4 font-bold text-right">
                              Tuition Fee
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e7eeff]">
                        {eligibility.items
                          .slice(0, showAllEligibility ? undefined : 4)
                          .map((row, i) => (
                            <tr
                              key={i}
                              className="bg-white hover:bg-[#f0f3ff]/60 transition-colors"
                            >
                              <td className="py-3.5 px-4 font-bold text-[#000f22]">
                                {row.course}
                                {row.duration ? (
                                  <span className="block text-[11px] font-normal text-[#74777e]">
                                    {row.duration}
                                  </span>
                                ) : null}
                              </td>
                              <td className="py-3.5 px-4 text-[#43474d] max-w-xs">
                                {row.eligibility}
                              </td>
                              <td className="py-3.5 px-4 text-[#115eaf] font-normal">
                                {row.selection}
                              </td>
                              {hasEligibilityFee && (
                                <td className="py-3.5 px-4 text-right font-bold text-[#000f22]">
                                  {row.feeSem}{" "}
                                  <span className="text-[11px] font-normal text-[#74777e]">
                                    /sem
                                  </span>
                                </td>
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {eligibility.items.length > 4 && (
                    <div className="flex justify-center mt-3">
                      <button
                        type="button"
                        onClick={() => setShowAllEligibility(!showAllEligibility)}
                        className="tap-hit flex items-center gap-1.5 text-xs font-bold text-[#115eaf] hover:underline cursor-pointer"
                      >
                        {showAllEligibility
                          ? "Show Less"
                          : `Show All ${eligibility.items.length} Programs`}
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform ${
                            showAllEligibility ? "rotate-90" : ""
                          }`}
                        />
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          )}

          {/* 3. Admission Process */}
          {admissionSteps.length > 0 && (
            <section
              id="admission-process"
              className="page-section card bg-white rounded-2xl border border-[#e7eeff] shadow-xs"
            >
              <div>
                <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] font-sans mt-2">
                  {data.admission?.title || collegeSectionTitle(shortName, "Admission Process 2026")}
                </h2>
                <span className="block w-16 h-[5px] rounded-[5px] bg-[#115eaf] mt-1" />
              </div>

              <div className="mt-[18px] flex flex-col gap-3">
                {admissionSteps.map((step, i) => (
                  <div
                    key={i}
                    className="admission-flow-step is-visible"
                    data-step-index={i}
                  >
                    <div className="admission-flow-left">
                      <div className="admission-flow-badge">
                        <span>Step {String(i + 1).padStart(2, "0")}</span>
                      </div>
                    </div>

                    <div className="admission-flow-body">
                      <h3 className="mb-1 text-[18px] font-semibold leading-[1.35] text-[#000f22] font-sans">
                        {step.title}
                      </h3>
                      <p className="m-0 text-[15px] leading-[1.55] text-[#43474d] font-normal">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. Application Process */}
          {data.applicationProcess?.length > 0 && (
            <section
              id="application-process"
              className="page-section card bg-white rounded-2xl border border-[#e7eeff] shadow-xs"
            >
              <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] font-sans">
                {data.applicationProcessMeta?.title || collegeSectionTitle(shortName, "Application Process 2026")}
              </h2>

              <div className="mt-[18px] grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.applicationProcess.map((step, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-[#e7eeff] bg-[#f9f9ff]"
                  >
                    <h3 className="text-sm font-bold text-[#000f22] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#43474d] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 5. Examination Pattern */}
          {examSteps.length > 0 && (
            <section
              id="examination-pattern"
              className="page-section card bg-white rounded-2xl border border-[#e7eeff] shadow-xs"
            >
              <div>
                <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] font-sans mt-2">
                  {data.examinationPattern?.title || collegeSectionTitle(shortName, "Examination Pattern")}
                </h2>
                {data.examinationPattern?.intro ? (
                  <p className="section-description text-xs sm:text-sm text-[#43474d] leading-relaxed font-normal">
                    {data.examinationPattern.intro}
                  </p>
                ) : null}
              </div>

              <div className="mt-[18px]">
                {examSteps.map((step, index) => (
                  <div key={step.title} className="exam-step exam-step-reveal show">
                    <div>
                      <div className="exam-badge">
                        <span>Step {String(index + 1).padStart(2, "0")}</span>
                      </div>
                    </div>
                    <div className="exam-body">
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 6. Documents Required */}
          {data.documentsRequired?.length > 0 && (
            <section id="documents-required" className="content-block scroll-mt-[100px]">
              <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] font-sans mb-[18px]">
                {data.documentsMeta?.title || collegeSectionTitle(shortName, "Documents Required for Admission")}
              </h2>

              <div className="grid lg:grid-cols-12 gap-4">
                <div className="card lg:col-span-8 bg-white border border-[#e7eeff] rounded-2xl shadow-xs p-5 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {data.documentsRequired.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-[#e7eeff] bg-[#f9f9ff] space-y-1"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="font-bold text-[#000f22] flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-[#115eaf]" />
                            {doc.name || doc}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d5e3ff] text-[#004689]">
                            Required
                          </span>
                        </div>
                        {doc.note ? (
                          <p className="text-[#74777e]">{doc.note}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 7. Scholarship Schemes */}
          {scholarshipRows.length > 0 && (
            <section
              id="scholarship-schemes"
              className="page-section card bg-white rounded-2xl border border-[#e7eeff] shadow-xs"
            >
              <h2 className="section-title text-xl sm:text-2xl font-extrabold text-[#000f22] font-sans">
                {data.scholarshipSection?.title || collegeSectionTitle(shortName, "Scholarship 2026")}
              </h2>

              <div className="overflow-x-auto rounded-xl border border-[#e7eeff] mt-[18px]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#0b2540] text-white">
                      <th className="py-3 px-4 font-bold">Scholarship / Benefit</th>
                      <th className="py-3 px-4 font-bold">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7eeff]">
                    {scholarshipRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-[#f0f3ff]/60 transition-colors"
                      >
                        <td className="py-3 px-4 font-bold text-[#000f22]">
                          {row.name}
                        </td>
                        <td className="py-3 px-4 text-[#43474d] font-normal">
                          {row.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* 8. Counselling callback */}
          <section
            id="counseling-callback"
            className="page-section card bg-[#0b2540] border border-[#314869] rounded-2xl shadow-xs"
          >
            <h2 className="section-title text-xl sm:text-2xl font-extrabold text-white font-sans">
              Have Questions About Document Eligibility or Grants?
            </h2>

            <div className="grid lg:grid-cols-12 gap-6 mt-[18px]">
              <div className="lg:col-span-5">
                <p className="text-sm text-[#b1c8eb] leading-relaxed font-normal">
                  Get a free 1-on-1 session with an unbiased academic counsellor. We
                  will verify your documents, confirm eligibility and walk you through
                  the scholarship and fee options.
                </p>

                <ul className="mt-4 space-y-2 text-xs text-[#b1c8eb]">
                  {[
                    "Document & eligibility verification",
                    "Scholarship and fee-waiver guidance",
                    "Zero-cost EMI plan comparison",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-7">
                {!callbackSubmitted ? (
                  <form
                    onSubmit={handleCallback}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                    noValidate
                  >
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b1c8eb] mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={callback.name}
                        onChange={(e) => {
                          setCallback({ ...callback, name: e.target.value });
                          if (callbackErrors.name)
                            setCallbackErrors({ ...callbackErrors, name: "" });
                        }}
                        placeholder="Full name"
                        className={`w-full px-3 py-2.5 rounded-lg border text-xs text-[#000f22] outline-none focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/30 ${
                          callbackErrors.name ? "border-red-500" : "border-[#c4c6ce]"
                        }`}
                      />
                      {callbackErrors.name ? (
                        <p className="mt-1 text-[11px] text-red-400">
                          {callbackErrors.name}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b1c8eb] mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={callback.phone}
                        onChange={(e) => {
                          setCallback({ ...callback, phone: e.target.value });
                          if (callbackErrors.phone)
                            setCallbackErrors({ ...callbackErrors, phone: "" });
                        }}
                        placeholder="98765 43210"
                        className={`w-full px-3 py-2.5 rounded-lg border text-xs text-[#000f22] outline-none focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/30 ${
                          callbackErrors.phone ? "border-red-500" : "border-[#c4c6ce]"
                        }`}
                      />
                      {callbackErrors.phone ? (
                        <p className="mt-1 text-[11px] text-red-400">
                          {callbackErrors.phone}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b1c8eb] mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={callback.email}
                        onChange={(e) => {
                          setCallback({ ...callback, email: e.target.value });
                          if (callbackErrors.email)
                            setCallbackErrors({ ...callbackErrors, email: "" });
                        }}
                        placeholder="name@example.com"
                        className={`w-full px-3 py-2.5 rounded-lg border text-xs text-[#000f22] outline-none focus:border-[#115eaf] focus:ring-2 focus:ring-[#115eaf]/30 ${
                          callbackErrors.email ? "border-red-500" : "border-[#c4c6ce]"
                        }`}
                      />
                      {callbackErrors.email ? (
                        <p className="mt-1 text-[11px] text-red-400">
                          {callbackErrors.email}
                        </p>
                      ) : null}
                    </div>

                    <div className="sm:col-span-3">
                      <button
                        type="submit"
                        className="w-full py-2.5 min-h-[44px] bg-[#115eaf] text-white text-xs font-bold rounded-xl hover:bg-[#004689] active:scale-95 transition-all"
                      >
                        Request Callback
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-6 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white">
                      Callback Request Confirmed
                    </h3>
                    <p className="text-xs text-[#b1c8eb]">
                      An academic counsellor will call you within 15 minutes.
                    </p>
                    <button
                      type="button"
                      onClick={() => setCallbackSubmitted(false)}
                      className="text-xs font-semibold text-[#70aaff] hover:underline pt-2 inline-block"
                    >
                      Submit another enquiry
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 9. Student Reviews */}
          {reviews.length > 0 && (
            <section
              id="student-reviews"
              className="page-section card bg-white rounded-2xl border border-[#e7eeff] shadow-xs"
            >
              <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] font-sans">
                {data.reviewsMeta?.title || collegeSectionTitle(shortName, "Student Reviews")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-[18px]">
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
                        &quot;{item.text}&quot;
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-[#d5e3ff]">
                      <div className="w-8 h-8 rounded-full bg-white text-[#115eaf] flex items-center justify-center font-bold text-xs shadow-sm border border-[#e7eeff] shrink-0">
                        {item.avatar || (item.studentName || "S").charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-[#000f22] truncate">
                          {item.studentName}
                        </div>
                        <div className="text-[11px] text-[#74777e] font-medium truncate">
                          {item.profession || "Online Student"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 10. Blogs */}
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

          {/* 11. Compare */}
          {compare && (
            <section
              id="compare"
              className="page-section card bg-white rounded-2xl border border-[#e7eeff] shadow-xs"
            >
              <h2 className="section-title text-xl sm:text-2xl font-bold text-[#000f22] font-sans">
                {compare.title || "Compare Colleges"}
              </h2>
              {compare.description ? (
                <p className="section-description text-xs sm:text-sm text-[#43474d] leading-relaxed font-normal">
                  {compare.description}
                </p>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_55px_minmax(0,1fr)] items-stretch gap-3 p-4 border border-[#e7eeff] rounded-2xl bg-white shadow-sm mt-[18px]">
                <div className="min-h-[220px] rounded-xl border border-[#e7eeff] bg-[#f0f3ff] p-4 flex flex-col justify-between">
                  <div>
                    <span className="inline-flex mb-2 px-2 py-1 rounded-full bg-[#e7eeff] text-[#115eaf] text-[11px] font-bold">
                      Selected
                    </span>

                    <div className="flex gap-4 items-center">
                      {compare.college?.logo ? (
                        <div className="w-[115px] h-[85px] shrink-0 rounded-lg border border-[#e7eeff] bg-white flex items-center justify-center overflow-hidden">
                          <img
                            src={compare.college.logo}
                            alt={`${compare.college.name} Logo`}
                            className="max-w-full max-h-full object-contain p-1.5"
                          />
                        </div>
                      ) : null}
                      <div>
                        <h3 className="mb-1.5 text-[19px] leading-tight font-extrabold text-[#000f22] font-sans">
                          {compare.college?.name}
                        </h3>
                        {compare.college?.location ? (
                          <p className="mt-[7.5px] flex items-center gap-1.5 text-sm text-[#43474d]">
                            <MapPin className="w-3.5 h-3.5 text-[#115eaf] shrink-0" />
                            {compare.college.location}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {compare.college?.approvals?.length ? (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {compare.college.approvals.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-[7px] bg-white border border-[#d5e3ff] text-[11px] font-normal text-[#43474d]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenBrochure()}
                    className="w-full h-11 mt-4 flex items-center justify-center gap-2 rounded-lg border border-[#115eaf] bg-white text-[#115eaf] text-sm font-bold hover:bg-[#f0f3ff] transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Brochure
                  </button>
                </div>

                <div className="flex items-center justify-center">
                  <span className="w-11 h-11 rounded-full flex items-center justify-center bg-[#115eaf] text-white text-sm font-extrabold">
                    VS
                  </span>
                </div>

                <div className="min-h-[220px] rounded-xl border border-dashed border-[#d5e3ff] bg-[#f9f9ff] p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full border border-[#d5e3ff] bg-white flex items-center justify-center text-[#115eaf] text-2xl font-light mb-2.5">
                    +
                  </div>
                  <h3 className="text-lg font-extrabold text-[#000f22] font-sans">
                    Add College
                  </h3>
                  <p className="mt-[7.5px] text-[13px] leading-relaxed text-[#43474d] font-normal">
                    Select another college to compare side by side.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenHelpDesk}
                    className="w-full h-11 mt-4 rounded-lg border-none bg-[#0b2540] text-white text-sm font-bold hover:bg-[#011c37] transition-all"
                  >
                    Add College
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* 12. FAQs */}
          {faqs.length > 0 && (
            <section
              id="admission-faqs"
              className="page-section card bg-white rounded-2xl border border-[#e7eeff] shadow-xs"
            >
              <h2 className="section-title text-xl font-bold text-[#000f22] font-sans">
                Frequently Asked Questions
              </h2>

              <div className="space-y-2.5 mt-[18px]">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="border border-[#e7eeff] rounded-xl overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 font-medium text-xs sm:text-sm text-[#000f22] hover:text-[#115eaf] bg-white transition-colors min-h-[44px]"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#115eaf] shrink-0 ml-2 transition-transform ${
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
        </div>
      </div>
    </div>
  );
}
