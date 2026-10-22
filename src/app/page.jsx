import HomePageClient from "@/components/home/HomePageClient";
import { getCollegeBlogs } from "@/services/collegeApi";
import { mapBlogs } from "@/services/overviewMapper";
import {
  getUniversitiesPayload,
  mapCompareColleges,
  mapFeaturedUniversities,
  mapLocationColleges,
} from "@/services/universityApi";

export const revalidate = 300;

export default async function Page() {
  const [listing, blogs] = await Promise.all([
    getUniversitiesPayload(),
    getCollegeBlogs("", {}),
  ]);

  const universities = listing?.onlineUniversities || [];

  return (
    <HomePageClient
      featuredUnis={mapFeaturedUniversities(universities)}
      locationColleges={mapLocationColleges(universities)}
      compareColleges={mapCompareColleges(universities)}
      blogs={mapBlogs(blogs)}
      error={listing?.error || ""}
    />
  );
}
