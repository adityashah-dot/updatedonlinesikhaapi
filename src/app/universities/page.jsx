import UniversitiesClient from "./UniversitiesClient";
import { getCollegeBlogs } from "@/services/collegeApi";
import { mapBlogs } from "@/services/overviewMapper";
import { getUniversitiesPayload } from "@/services/universityApi";

export const revalidate = 300;

export const metadata = {
  title: "Explore Top UGC-DEB Approved Online Universities in India",
  description:
    "Compare verified universities, programs, fees, and admission details — all in one place.",
};

export default async function UniversitiesPage({ searchParams }) {
  const params = (await searchParams) || {};
  const page = Math.max(1, Number(params.page) || 1);

  const [listing, blogs] = await Promise.all([
    getUniversitiesPayload({ page }),
    getCollegeBlogs("", {}),
  ]);

  return (
    <UniversitiesClient
      universities={listing?.onlineUniversities || []}
      pagination={listing?.pagination || null}
      page={page}
      blogs={mapBlogs(blogs)}
      error={listing?.error || ""}
    />
  );
}
