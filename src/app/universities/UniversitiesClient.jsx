"use client";

import { useSiteActions } from "@/components/shell/SiteActionsContext";
import { UniversitiesView } from "@/components/universities/UniversitiesView";

export default function UniversitiesClient({
  universities = [],
  pagination = null,
  page = 1,
  blogs = [],
  error = "",
}) {
  const siteActions = useSiteActions();

  return (
    <UniversitiesView
      universities={universities}
      pagination={pagination}
      page={page}
      blogs={blogs}
      error={error}
      onOpenApply={() => siteActions.onOpenApply()}
      onOpenHelpDesk={() => siteActions.onOpenHelpDesk()}
      onOpenBrochure={() => siteActions.onOpenBrochure()}
    />
  );
}
