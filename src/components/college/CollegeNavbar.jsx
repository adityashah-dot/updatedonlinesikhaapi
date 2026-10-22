"use client";

import Link from "next/link";
import { useSiteActions } from "@/components/shell/SiteActionsContext";

/** Reference design: sticky pill tab bar (LPU master). */
const LMS_TAB = { id: "lms", label: "LMS Portal", icon: "devices" };

/**
 * College navigation — driven by the API.
 *
 * `nav.tabs` holds exactly the pages the CMS publishes for this college
 * (`GET /website/colleges/navbar-list/{collegeId}`), with hrefs that stay
 * inside the current route tree (`/colleges/...` or `/universities/...`).
 * A tab the API does not publish is not rendered, so there is no link to a
 * page that does not exist.
 */
export default function CollegeNavbar({ nav, tabs = [], activeSection }) {
  const siteActions = useSiteActions();
  const onOpenLms = siteActions.onOpenLms;

  const navTabs = Array.isArray(nav?.tabs) && nav.tabs.length ? nav.tabs : tabs;

  return (
    <div className="sticky top-[68px] z-30 bg-white border-b border-[#e7eeff] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navTabs.map((tab) => {
            const isActive = activeSection === tab.section;

            return (
              <Link
                key={tab.id}
                href={tab.href}
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
                <span>{tab.label || tab.title}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => onOpenLms?.()}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 min-h-[44px] rounded-lg text-xs sm:text-sm font-medium transition-colors text-[#43474d] hover:bg-[#f0f3ff] hover:text-[#115eaf]"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[18px] leading-none">
              {LMS_TAB.icon}
            </span>
            <span>{LMS_TAB.label}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
