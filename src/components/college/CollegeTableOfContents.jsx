"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

/**
 * Table of contents card — exact port of the reference project component
 * (src/components/TableOfContents.tsx).
 */
export default function CollegeTableOfContents({
  title = "Table of contents",
  items = [],
  activeId,
  onItemClick,
  className = "",
  defaultExpanded = false,
  collapsedCount = 6,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleScrollTo = (e, id) => {
    e.preventDefault();

    if (onItemClick) onItemClick(id);

    let element = document.getElementById(id);

    if (!element) {
      if (id === "admission-highlights")
        element =
          document.getElementById("admission-overview") ||
          document.getElementById("highlights");
      if (id === "admission-dates")
        element = document.getElementById("important-dates");
      if (id === "scholarship-schemes")
        element =
          document.getElementById("scholarships-schemes") ||
          document.getElementById("scholarships");
      if (id === "compare") element = document.getElementById("compare-colleges");
    }

    if (element) {
      const yOffset = -105;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      try {
        window.history.pushState(null, "", `#${id}`);
      } catch {
        /* restricted environment */
      }
    }
  };

  const visibleItems = isExpanded ? items : items.slice(0, collapsedCount);
  const showToggle = items.length > collapsedCount;

  return (
    <section
      aria-label="Table of contents"
      className={`bg-white rounded-2xl border border-[#e7eeff] p-5 sm:p-6 shadow-xs ${className}`}
    >
      <h2 className="text-xl sm:text-[22px] font-bold text-[#000f22] font-sans tracking-tight mb-4">
        {title}
      </h2>

      <ul className="space-y-3">
        {visibleItems.map((item) => {
          const isActive = activeId === item.id;

          return (
            <li key={item.id} className="flex items-center gap-2.5">
              <svg
                className="w-2.5 h-2.5 fill-[#1e293b] shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleScrollTo(e, item.id)}
                className={`text-sm sm:text-[14.5px] leading-relaxed transition-colors cursor-pointer ${
                  isActive
                    ? "text-[#115eaf] font-medium underline"
                    : "text-[#115eaf] hover:text-[#004689] hover:underline font-normal"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>

      {showToggle && (
        <div className="border-t border-[#e2e8f0] mt-5 pt-3.5">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="tap-hit min-h-[44px] flex items-center text-xs sm:text-sm font-medium text-[#115eaf] hover:underline gap-1.5 focus:outline-none cursor-pointer"
          >
            <span>{isExpanded ? "View less" : "View more"}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-[#115eaf]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#115eaf]" />
            )}
          </button>
        </div>
      )}
    </section>
  );
}
