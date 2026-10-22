import { DEGREEFYD_LPU_API } from "./apiData";

export const MOCK_COLLEGE_SLUG = "lovely-professional-university-online";

/**
 * Offline payload built from the supplied LPU Online reference data, shaped
 * like the production /website/colleges/{slug} response so the template
 * mapping can be exercised when the API is not reachable.
 */
export function buildMockCollegePayload(slug) {
  const api = DEGREEFYD_LPU_API;

  return {
    hero: {
      title: api.hero.title,
      subtitle: api.hero.subtitle,
      description: api.hero.description,
      backgroundImage: api.hero.backgroundImage,
      logoImage: api.hero.logoImage,
      brochureUrl: api.hero.brochureUrl,
      buttons: [],
    },
    title: api.title,
    navbarTitle: "Overview",
    slug: slug || MOCK_COLLEGE_SLUG,
    college_id: {
      _id: api.college_id,
      name: api.title,
      collegeShortName: api.subtitle,
      slug: slug || MOCK_COLLEGE_SLUG,
      location: api.location,
      collegeType: "Online University",
      established: api.established,
      rating: api.rating,
      nirfRanking: api.nirfRanking,
      approvals: api.approvals,
      logo: { url: api.hero.logoImage },
      collegeImage: { url: api.hero.backgroundImage },
      overview: api.hero.description,
      contact: {
        city: "Phagwara",
        state: "Punjab",
        phone: "+91 1800-889-4422",
        email: "helpdesk@onlinesiksha.com",
      },
    },
    courses: api.coursesFees.table.map((row) => ({
      name: row.degree,
      duration: row.duration,
      fee: row.avgFees,
      seats: null,
    })),
    scholarships: api.scholarships.items.map((item) => ({
      name: item.title,
      amount: null,
      type: item.tag,
      eligibility: item.details,
    })),
    admission: {
      open: true,
      applicationFee: 1000,
      totalFee: 140000,
      intro: api.admissionProcess.intro,
      steps: api.admissionProcess.steps,
    },
    sections: [
      { id: "overview", key: "overview", title: "Overview", blocks: [] },
      { id: "courses", key: "courses", title: "Courses", blocks: [] },
      { id: "admission", key: "admission", title: "Admission", blocks: [] },
      { id: "scholarships", key: "scholarships", title: "Scholarships", blocks: [] },
    ],
    toc: [
      { id: "overview", title: "Overview" },
      { id: "courses", title: "Courses" },
      { id: "admission", title: "Admission" },
      { id: "scholarships", title: "Scholarships" },
    ],
    faq: api.faqs,
    latestNews: api.latestNews,
    authors: [{ name: api.latestNews?.author || "DegreeFYD Editorial" }],
    updatedAt: "2026-09-14",
  };
}
