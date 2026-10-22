"use client";

import { useEffect } from "react";
import CollegeNavbar from "./CollegeNavbar";
import OverviewView from "./OverviewView";
import CollegeCourses from "./CollegeCourses";
import CollegeAdmission from "./CollegeAdmission";
import CollegeScholarships from "./CollegeScholarships";
import { useSiteActions } from "@/components/shell/SiteActionsContext";

/**
 * College template.
 *
 * The section is resolved by the loader from the API payload (`shortTitle` /
 * `navbarTitle`), never guessed from the URL text:
 *
 *   overview      → OverviewView
 *   courses       → CollegeCourses
 *   admission     → CollegeAdmission
 *   scholarships  → CollegeScholarships
 *   page          → any other CMS page the API publishes (placements,
 *                   hostel & campus, infrastructure, …) rendered with the
 *                   generic section template and its own API content.
 */
export default function CollegeTemplate({
  data,
  nav,
  tabs = [],
  overview,
  section = "overview",
  slug = "",
}) {
  const college = data || {};
  const siteActions = useSiteActions();
  const setActiveCollege = siteActions.setActiveCollege;

  // The modals (Apply / Brochure / LMS / Help desk) must show the university
  // of the page the visitor is on — never a hardcoded one.
  const activeCollege = {
    id: college.college?.id || "",
    name: college.college?.name || college.title || "",
    shortName: college.college?.shortName || college.subtitle || "",
    slug: slug || college.college?.slug || college.slug || "",
  };

  useEffect(() => {
    if (!setActiveCollege) return;

    setActiveCollege(activeCollege);

    return () => setActiveCollege(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCollege.id, activeCollege.slug, setActiveCollege]);

  const universityNavigation = (
    <CollegeNavbar
      nav={nav}
      tabs={tabs}
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
