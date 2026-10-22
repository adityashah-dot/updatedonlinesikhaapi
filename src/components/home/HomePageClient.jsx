"use client";

import { useSiteActions } from "@/components/shell/SiteActionsContext";
import { HomeView } from "@/components/home/HomeView";

/**
 * Client wrapper for the homepage.
 *
 * The live university listing and the live blog block are fetched on the
 * server (the API requires the server-side token) and handed down here.
 */
export default function HomePageClient({
  featuredUnis = [],
  locationColleges = [],
  compareColleges = [],
  blogs = [],
  error = "",
}) {
  const siteActions = useSiteActions();

  return (
    <HomeView
      featuredUnis={featuredUnis}
      locationColleges={locationColleges}
      compareColleges={compareColleges}
      blogs={blogs}
      error={error}
      onOpenApply={siteActions.onOpenApply}
      onOpenHelpDesk={siteActions.onOpenHelpDesk}
    />
  );
}
