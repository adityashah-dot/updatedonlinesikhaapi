const SECTION_FIELDS = ["key", "title", "id", "name", "slug", "sectionType"];

function stripHtml(value) {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function readImage(value) {
  if (typeof value === "string") return value;

  if (value && typeof value === "object") {
    if (Array.isArray(value)) {
      return readImage(value[0]);
    }
    return value.url || value.src || value.path || "";
  }

  return "";
}

function sectionText(section) {
  return SECTION_FIELDS.map((field) => section?.[field] || "")
    .join(" ")
    .toLowerCase();
}

function findSection(sections, pattern) {
  return (sections || []).find((section) => pattern.test(sectionText(section)));
}

function mapCourses(payload, sections, coursesFromApi) {
  if (Array.isArray(coursesFromApi) && coursesFromApi.length) {
    return coursesFromApi;
  }

  if (Array.isArray(payload.courses) && payload.courses.length) {
    return payload.courses.map((course) => ({
      name: course?.name || course?.courseName || course?.title || course?.degree || "Course",
      duration: course?.duration || course?.courseDuration || "",
      fee: course?.fee ?? course?.totalFee ?? course?.avgFees ?? null,
      seats: course?.seats ?? course?.seatCount ?? null,
    }));
  }

  const section = findSection(sections, /course|program/);
  if (!section) return [];

  const items = (section.blocks || []).flatMap((block) =>
    Array.isArray(block?.content?.courses) ? block.content.courses : []
  );

  return items.map((course) => ({
    name: course?.name || course?.courseName || course?.title || "Course",
    duration: course?.duration || "",
    fee: course?.feeRaw ?? course?.fee ?? null,
    seats: course?.seats ?? null,
  }));
}

function mapScholarships(payload, sections) {
  if (Array.isArray(payload.scholarships) && payload.scholarships.length) {
    return payload.scholarships.map((item) => ({
      name: item?.name || item?.title || "Scholarship",
      amount: item?.amount ?? item?.value ?? null,
      type: item?.type || item?.tag || "",
      eligibility: item?.eligibility || item?.details || "",
    }));
  }

  const section = findSection(sections, /scholarship/);
  if (!section) return [];

  const items = (section.blocks || []).flatMap((block) =>
    Array.isArray(block?.content?.items) ? block.content.items : []
  );

  return items.map((item) => ({
    name: item?.name || item?.title || "Scholarship",
    amount: item?.amount ?? item?.value ?? null,
    type: item?.type || item?.tag || "",
    eligibility: item?.eligibility || item?.details || "",
  }));
}

function mapAdmission(payload, sections) {
  const section = findSection(sections, /admission/);
  const flowBlock = (section?.blocks || []).find((block) => block?.type === "admission_flow");
  const steps = (flowBlock?.content?.steps || []).map((step) => ({
    title: step?.title || "",
    description: stripHtml(step?.description || ""),
  }));

  const source = payload.admission || {};
  const admissionOpen = source.open ?? source.admissionOpen ?? payload.admissionOpen;
  const applicationFee = source.applicationFee ?? payload.applicationFee;
  const totalFee = source.totalFee ?? payload.totalFee;

  const hasAdmission =
    steps.length > 0 ||
    admissionOpen !== undefined ||
    applicationFee !== undefined ||
    totalFee !== undefined;

  if (!hasAdmission) return null;

  return {
    open: admissionOpen,
    applicationFee,
    totalFee,
    intro: source.intro || "",
    steps,
  };
}

function mapFaq(payload) {
  const faq = payload.faq;

  if (Array.isArray(faq)) return faq;

  if (faq && Array.isArray(faq.items)) {
    return faq.items.map((item) => ({
      question: item?.question || "",
      answer: item?.answer || "",
    }));
  }

  if (Array.isArray(payload.faqs)) {
    return payload.faqs.map((item) => ({
      question: item?.question || "",
      answer: item?.answer || "",
    }));
  }

  return [];
}

function mapToc(payload) {
  if (!Array.isArray(payload.toc)) return [];

  return payload.toc.map((item) => ({
    id: item?.sectionId || item?.id || "",
    title: item?.label || item?.title || "",
    order: item?.order,
  }));
}

/**
 * Maps the production college payload into the model consumed by the college
 * template. Only fields present in the API response are populated.
 */
export function mapCollegePayload(payload, options = {}) {
  const rawPayload = payload?.data?.data || payload?.data || payload;

  if (!rawPayload) return null;

  const rawCollegeId = rawPayload.college_id;
  const college =
    rawCollegeId && typeof rawCollegeId === "object" ? rawCollegeId : {};

  const collegeId =
    college?._id ||
    college?.id ||
    (typeof rawCollegeId === "string" ? rawCollegeId : "");

  const hero = rawPayload.hero || {};
  const sections = Array.isArray(rawPayload.sections) ? rawPayload.sections : [];

  const overviewSection = findSection(sections, /overview|about|highlights/);
  const overview =
    college.overview ||
    rawPayload.overview ||
    hero.description ||
    overviewSection?.intro ||
    "";

  return {
    slug: rawPayload.slug || options.slug || college.slug || "",
    title: rawPayload.title || hero.title || college.name || "",
    subtitle: hero.subtitle || college.collegeShortName || "",
    highlightContent: rawPayload.highlightContent || "",
    navbarTitle: rawPayload.navbarTitle || "",
    hero: {
      title: hero.title || rawPayload.title || "",
      subtitle: hero.subtitle || "",
      description: hero.description || "",
      backgroundImage: readImage(hero.backgroundImage),
      logoImage: readImage(hero.logoImage),
      buttons: Array.isArray(hero.buttons) ? hero.buttons : [],
    },
    college: {
      id: collegeId,
      name: college.name || rawPayload.title || "",
      shortName: college.collegeShortName || "",
      slug: college.slug || rawPayload.slug || options.slug || "",
      location: college.location || "",
      collegeType: college.collegeType || "",
      collegeMode: college.collegeMode || "",
      established: college.established || "",
      rating: college.rating || rawPayload.rating || "",
      nirfRanking: college.nirfRanking || "",
      students: college.students ?? null,
      minFee: college.minFee ?? null,
      maxFee: college.maxFee ?? null,
      approvals: Array.isArray(college.approvals) ? college.approvals : [],
      placementStats: college.placementStats || null,
      reviews: Array.isArray(college.reviews) ? college.reviews : [],
      website: college.website || "",
      contact: college.contact || {},
      logo: readImage(college.logo),
      collegeImage: readImage(college.collegeImage),
    },
    overview,
    courses: mapCourses(rawPayload, sections, options.courses),
    scholarships: mapScholarships(rawPayload, sections),
    admission: mapAdmission(rawPayload, sections),
    sections,
    toc: mapToc(rawPayload),
    faq: mapFaq(rawPayload),
    latestNews: rawPayload.latestNews || null,
    testimonials: Array.isArray(rawPayload.testimonials) ? rawPayload.testimonials : [],
    authors: Array.isArray(rawPayload.authors) ? rawPayload.authors : [],
    createdBy: rawPayload.createdBy || null,
    updatedBy: rawPayload.updatedBy || rawPayload.editedBy || null,
    updatedAt: rawPayload.updatedAt || "",
  };
}
