/**
 * Builds the data model consumed by the reusable Courses & Fees template
 * (components/college/CoursesAndFeesView.jsx).
 *
 * Everything here comes from the live CMS/API model produced by
 * `overviewMapper` — no college specific content is hardcoded.
 */

const CATEGORY_LABELS = {
  ug: { title: "Undergraduate (UG) Programs", badge: "UG Degrees" },
  pg: { title: "Postgraduate (PG) Programs", badge: "PG Degrees" },
  diploma: { title: "Diploma Programs", badge: "Diploma" },
};

function textOf(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

/** "2 years" -> 2, "3 Years / 6 Semesters" -> 3 */
function yearsFrom(duration) {
  const match = String(duration || "").match(/([\d.]+)/);
  return match ? Number(match[1]) : 0;
}

/** Fee range of the mapped courses, used for the hero metrics. */
function feeRangeOf(courses) {
  const fees = courses
    .map((course) => course.totalFee)
    .filter((fee) => typeof fee === "number" && fee > 0);

  if (!fees.length) return "";

  const min = Math.min(...fees);
  const max = Math.max(...fees);

  if (min === max) return `₹${min.toLocaleString("en-IN")}`;

  return `₹${min.toLocaleString("en-IN")} - ₹${max.toLocaleString("en-IN")}`;
}

/** Semester count range of the mapped courses ("2-3 Years / 4-6 Semesters"). */
function durationRangeOf(courses) {
  const years = courses.map((course) => yearsFrom(course.duration)).filter(Boolean);
  const semesters = courses.map((course) => course.semestersCount).filter(Boolean);

  if (!years.length) return "";

  const minYears = Math.min(...years);
  const maxYears = Math.max(...years);

  const yearsLabel =
    minYears === maxYears ? `${minYears} Year` : `${minYears}-${maxYears} Years`;

  if (!semesters.length) return yearsLabel;

  const minSemesters = Math.min(...semesters);
  const maxSemesters = Math.max(...semesters);

  return `${yearsLabel} / ${
    minSemesters === maxSemesters
      ? `${minSemesters} Semester`
      : `${minSemesters}-${maxSemesters} Semesters`
  }`;
}

function metricsOf(college, overview, courses) {
  const feeRange = feeRangeOf(courses);
  const duration = durationRangeOf(courses);

  return [
    {
      icon: "rating",
      value: overview?.naac || "",
      label: "Accreditation",
    },
    {
      icon: "online",
      value:
        overview?.collegeMode === "online"
          ? "100% Online"
          : overview?.collegeMode || "",
      label: "Study mode",
    },
    {
      icon: "fee",
      value: feeRange,
      label: "Course fee range",
    },
    {
      icon: "courses",
      value: courses.length ? `${courses.length} Programs` : "",
      label: duration,
    },
  ].filter((metric) => metric.value);
}

function admissionInfoOf(overview) {
  const dates = overview?.admissionDates || [];
  const highlights = overview?.admissionHighlights || {};

  const deadline = dates.find((row) =>
    /last date|deadline|close/i.test(row.event || "")
  );

  const isOpen = /\bopen\b/i.test(
    `${highlights.title || ""} ${highlights.intro || ""}`
  );

  return {
    status: isOpen ? "Admissions Open" : "",
    deadline: deadline?.date || "",
    grant: "",
    emi: "",
    description: highlights.intro || "",
  };
}

function tocOf(overview, courses, sections) {
  const shortName = overview?.shortName || overview?.title || "";

  const platform = String(
    overview?.learningPlatformTitle || overview?.learningPlatform?.title || ""
  )
    .replace(/^How You Study: The /, "")
    .trim();

  const items = [];

  if (sections.feeStructure) {
    items.push({
      id: "fee-structure",
      label: overview?.feeStructure?.title || "Fee Structure (Semester & Total)",
    });
  }

  if (courses.length) {
    items.push({
      id: "all-courses",
      label: shortName ? `${shortName} All Courses` : "All Courses",
    });
  }

  if ((overview?.admissionDates || []).length) {
    items.push({
      id: "admission-dates",
      label: overview?.admissionDatesMeta?.title || "Admission Dates",
    });
  }

  if ((overview?.learningPlatform || []).length) {
    items.push({
      id: "learning-platform",
      label: platform
        ? `How You Study (${platform})`
        : shortName
          ? `How You Study (${shortName} Learning Platform)`
          : "How You Study",
    });
  }

  if ((overview?.reviews || []).length) {
    items.push({
      id: "student-reviews",
      label: shortName
        ? `${shortName} Online Student Reviews & Ratings`
        : "Student Reviews & Ratings",
    });
  }

  if ((overview?.faqs || []).length) {
    items.push({ id: "faqs", label: "FAQs" });
  }

  if ((overview?.blogs || []).length) {
    items.push({ id: "blogs", label: "Blogs" });
  }

  items.push({ id: "counselor-helpline", label: "Academic Counseling & Helpline" });

  return items;
}

function coursesOf(overview) {
  const rows = overview?.coursesFees?.table || [];

  return rows.map((row, index) => ({
    id: row.courseId || `course-${index}`,
    code: row.code || row.courseId || "",
    name: row.degree || row.name || "",
    category: row.category || "ug",
    shortDescription: row.specializations || "",
    duration: row.duration || "",
    semestersCount: row.semestersCount || 0,
    perSemFee: row.perSemFee || "",
    totalFee: row.totalFee ?? null,
    avgFees: row.avgFees || "",
    specializations: row.specializations || "",
  }));
}

function reviewsOf(overview) {
  return (overview?.reviews || []).map((review) => ({
    name: review.studentName || "",
    course: review.course || review.profession || "",
    review: review.text || "",
    rating: review.rating ?? 5,
    ratingLabel: review.ratingLabel || "",
    avatar: review.avatar || "",
  }));
}

function blogsOf(overview) {
  return (overview?.blogs || []).map((post) => ({
    category: post.category || "",
    title: post.title || "",
    description: post.excerpt || "",
    image: post.image || "",
  }));
}

/**
 * @param {object} params
 * @param {object} params.college  mapped college model (title, shortName, logo, ...)
 * @param {object} params.overview mapped overview model (live CMS content)
 */
export function buildCoursesViewData({ college = {}, overview = {} } = {}) {
  const courses = coursesOf(overview);
  const feeRows = overview?.coursesFees?.table || [];

  const sections = {
    feeStructure: Boolean(overview?.coursesFees && feeRows.length),
    admissionDates: Boolean((overview?.admissionDates || []).length),
    learningPlatform: Boolean((overview?.learningPlatform || []).length),
  };

  return {
    metrics: metricsOf(college, overview, courses),
    admissionInfo: admissionInfoOf(overview),
    toc: tocOf(overview, courses, sections),

    courses,
    courseCategories: Object.keys(CATEGORY_LABELS)
      .filter((key) => courses.some((course) => course.category === key))
      .map((key) => ({
        key,
        ...CATEGORY_LABELS[key],
        count: courses.filter((course) => course.category === key).length,
      })),

    coursesFees: {
      title: overview?.coursesFees?.title || "",
      description: textOf(overview?.coursesFees?.intro),
      feeNote: textOf(overview?.feeStructure?.description),
      brochureLabel: overview?.coursesFees?.viewFeeStructure || "",
      durationLabel: durationRangeOf(courses),
    },

    admissionDates: (overview?.admissionDates || []).map((row) => ({
      title: row.event || "",
      description: row.detail || "",
      date: row.date || "",
    })),

    learningPlatform: {
      title: overview?.learningPlatformTitle || "",
      description: "",
      items: (overview?.learningPlatform || []).map((item) => ({
        icon: item.icon || "video",
        title: item.title || "",
        description: item.desc || "",
        meta: item.meta || "",
      })),
    },

    reviews: reviewsOf(overview),
    faqs: (overview?.faqs || []).map((faq) => ({
      question: faq.question || "",
      answer: faq.answer || "",
    })),
    blogs: blogsOf(overview),

    counselor: {
      title: "",
      description: "",
      phone: "",
    },
  };
}

export { CATEGORY_LABELS };
