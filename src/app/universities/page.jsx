import UniversitiesClient from "./UniversitiesClient";
import { getCollegeBlogs } from "@/services/collegeApi";
import { mapBlogs } from "@/services/overviewMapper";
import { getUniversitiesPayload } from "@/services/universityApi";

export const revalidate = 300;

export async function generateMetadata({ searchParams }) {
  const params = (await searchParams) || {};
  const search = String(params.search || "").trim();

  if (!search) {
    return {
      title: "Explore Top UGC-DEB Approved Online Universities in India",
      description:
        "Compare verified universities, programs, fees, and admission details — all in one place.",
    };
  }

  return {
    title: `Universities matching "${search}"`,
    description: `Verified online universities matching "${search}" — compare fees, approvals, programmes and admission details.`,
  };
}

export default async function UniversitiesPage({ searchParams }) {
  const params = (await searchParams) || {};
  const page = Math.max(1, Number(params.page) || 1);
  const search = String(params.search || "").trim();

  const [listing, blogs] = await Promise.all([
    getUniversitiesPayload({ page, search }),
    getCollegeBlogs("", {}),
  ]);

  return (
    <UniversitiesClient
      universities={listing?.onlineUniversities || []}
      pagination={listing?.pagination || null}
      page={page}
      search={search}
      blogs={mapBlogs(blogs)}
      error={listing?.error || ""}
    />
  );
}
