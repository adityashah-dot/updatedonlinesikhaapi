"use client";

import Link from "next/link";

/** Reference design: sticky pill tab bar (LPU master). */
const SECTION_TABS = [
  { id: "overview", label: "Overview", icon: "grid_view" },
  { id: "courses", label: "Courses", icon: "menu_book" },
  { id: "admission", label: "Admission", icon: "how_to_reg" },
  { id: "scholarships", label: "Scholarships", icon: "workspace_premium" },
];

const LMS_TAB = { id: "lms", label: "LMS Portal", icon: "devices" };

function hrefFor(slug, id) {
  return id === "overview" ? `/colleges/${slug}` : `/colleges/${slug}/${id}`;
}

export default function CollegeNavbar({ college, tabs = [], sections = [], activeTab, slug, activeSection }) {
  const collegeSlug =
    slug || college?.slug || college?.college?.slug || college?.name || "";

  const collegeName = college?.name || college?.title || college?.shortName || "College";

  // The API navbar list wins when it carries real destinations; the four
  // canonical section tabs are always present so the reference flow is kept.
  // API entries that duplicate a canonical tab are dropped.
  const CANONICAL_LABELS = ["overview", "courses", "admission", "scholarships", "lms"];

  const apiTabs = (tabs || [])
    .filter((tab) => tab?.href && !/^\/colleges\/[^/]+$/.test(tab.href))
    .filter((tab) => !CANONICAL_LABELS.includes(String(tab.name || tab.navbarTitle || "").toLowerCase().trim()))
    .map((tab) => ({
      id: tab.href,
      label: tab.name || tab.navbarTitle || "",
      icon: "open_in_new",
      href: tab.href,
    }));

  const extraTabs = apiTabs.length
    ? apiTabs
    : (sections || []).map((section) => ({
        id: section.id,
        label: section.label,
        icon: "article",
        href: `#${section.id}`,
      }));

  return (
    <div className="sticky top-[68px] z-30 bg-white border-b border-[#e7eeff] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTION_TABS.map((tab) => {
            const isActive = activeSection === tab.id;
            const href = hrefFor(collegeSlug, tab.id);

            return (
              <Link
                key={tab.id}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#115eaf] text-white font-semibold shadow-xs"
                    : "text-[#43474d] hover:bg-[#f0f3ff] hover:text-[#115eaf]"
                }`}
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[18px] leading-none">
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </Link>
            );
          })}

          {extraTabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-medium transition-colors text-[#43474d] hover:bg-[#f0f3ff] hover:text-[#115eaf]"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px] leading-none">
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </Link>
          ))}

          <Link
            href={hrefFor(collegeSlug, "lms")}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-medium transition-colors text-[#43474d] hover:bg-[#f0f3ff] hover:text-[#115eaf]"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px] leading-none">
              {LMS_TAB.icon}
            </span>
            <span>{LMS_TAB.label}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
