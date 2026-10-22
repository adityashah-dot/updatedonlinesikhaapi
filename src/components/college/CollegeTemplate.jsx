"use client";

import CollegeNavbar from "./CollegeNavbar";
import OverviewView from "./OverviewView";
import CollegeCourses from "./CollegeCourses";
import CollegeAdmission from "./CollegeAdmission";
import CollegeScholarships from "./CollegeScholarships";

/**
 * Normalises the `[...slug]` segments into the section that must render.
 * The first segment is always the college slug, the second (when present)
 * is the API "sub" navigation segment.
 */
function resolveSection(sub) {
  const value = String(sub || "").toLowerCase().trim();

  if (!value) return "overview";
  if (value.includes("course")) return "courses";
  if (value.includes("admission")) return "admission";
  if (value.includes("scholar")) return "scholarships";
  if (value.includes("lms")) return "lms";

  return "overview";
}

export default function CollegeTemplate({
  data,
  tabs = [],
  overview,
  sub = "",
  slug = "",
  section: sectionParam = "",
}) {
  const college = data || {};
  const section = sectionParam
    ? resolveSection(sectionParam)
    : resolveSection(sub);
  const collegeSlug = slug || college.slug || "";

  const universityNavigation = (
    <CollegeNavbar
      college={college}
      tabs={tabs}
      sections={[]}
      activeTab={college.navbarTitle}
      slug={collegeSlug}
      activeSection={section}
    />
  );

  return (
    <div className="uni-detail">
      {section === "courses" && (
        <CollegeCourses
          college={college}
          overview={overview}
          universityNavigation={universityNavigation}
        />
      )}

      {section === "admission" && (
        <CollegeAdmission
          college={college}
          overview={overview}
          universityNavigation={universityNavigation}
        />
      )}

      {section === "scholarships" && (
        <CollegeScholarships
          college={college}
          overview={overview}
          universityNavigation={universityNavigation}
        />
      )}

      {section !== "courses" &&
        section !== "admission" &&
        section !== "scholarships" && (
          <OverviewView
            collegeData={overview}
            universityNavigation={universityNavigation}
          />
        )}
    </div>
  );
}
