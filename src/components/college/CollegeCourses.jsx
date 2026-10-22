"use client";

import CoursesAndFeesView from "./CoursesAndFeesView";
import { buildCoursesViewData } from "@/services/coursesViewMapper";

/**
 * College Courses page.
 *
 * The page itself is the reusable `CoursesAndFeesView` template; this wrapper
 * only hands it the live college/overview model coming from the CMS API.
 */
export default function CollegeCourses({
  college = {},
  overview = {},
  universityNavigation,
}) {
  const coursesData = buildCoursesViewData({ college, overview });

  return (
    <CoursesAndFeesView
      college={college}
      overview={overview}
      coursesData={coursesData}
      universityNavigation={universityNavigation}
    />
  );
}
