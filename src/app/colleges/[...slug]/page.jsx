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

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pageData = await loadCollegePage(slug);

  const college = pageData?.college;

  if (!college) {
    notFound();
  }

  return {
    title: college?.title || "Online University",
    description:
      toPlainText(college?.overview) ||
      "Explore online degree programs, fees, admissions and scholarships.",
    alternates: {
      canonical: `/colleges/${splitSlug(slug).fullSlug}`,
    },
  };
}

export default async function CollegePage({ params, searchParams }) {
  const { slug } = await params;
  const { section = "" } = (await searchParams) || {};

  const legacy = resolveLegacySlug(slug);

  if (legacy) {
    permanentRedirect(`/colleges${legacy.path}`);
  }

  const { collegeName, sub } = withSection(slug, section);

  const pageData = await loadCollegePage(sub ? [collegeName, sub] : slug);

  if (!pageData) {
    notFound();
  }

  return (
    <CollegeTemplate
      data={pageData.college}
      tabs={pageData.tabs}
      overview={pageData.overview}
      sub={pageData.sub}
      section={section}
      slug={pageData.collegeSlug}
    />
  );
}
