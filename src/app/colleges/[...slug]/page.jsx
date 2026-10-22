import { notFound, permanentRedirect } from "next/navigation";
import CollegeTemplate from "@/components/college/CollegeTemplate";
import {
  loadCollegePage,
  resolveLegacySlug,
  splitSlug,
  toPlainText,
  withSection,
} from "@/services/collegePageLoader";

export const revalidate = 3600;

const BASE_PATH = "/colleges";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pageData = await loadCollegePage(slug, { basePath: BASE_PATH });

  const college = pageData?.college;

  if (!college || pageData?.unavailable) {
    notFound();
  }

  return {
    title: college?.title || "Online University",
    description:
      toPlainText(college?.overview) ||
      "Explore online degree programs, fees, admissions and scholarships.",
    alternates: {
      canonical: `${BASE_PATH}/${splitSlug(slug).fullSlug}`,
    },
  };
}

export default async function CollegePage({ params, searchParams }) {
  const { slug } = await params;
  const { section = "" } = (await searchParams) || {};

  const legacy = resolveLegacySlug(slug);

  if (legacy) {
    permanentRedirect(`${BASE_PATH}${legacy.path}`);
  }

  const { collegeName, sub } = withSection(slug, section);

  const pageData = await loadCollegePage(sub ? [collegeName, sub] : slug, {
    basePath: BASE_PATH,
  });

  // The college does not exist, or the API does not publish this page.
  if (!pageData || pageData.unavailable) {
    notFound();
  }

  return (
    <CollegeTemplate
      data={pageData.college}
      nav={pageData.nav}
      overview={pageData.overview}
      section={pageData.section}
      sub={pageData.sub}
      slug={pageData.collegeSlug}
    />
  );
}
