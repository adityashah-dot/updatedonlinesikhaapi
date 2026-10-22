const SECTION_FIELDS = ["key", "title", "id", "name", "slug", "sectionType"];

function readImage(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    if (Array.isArray(value)) return readImage(value[0]);
    return value.url || value.src || value.path || "";
  }
  return "";
}

function stripHtml(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function textBeforeTable(html) {
  if (typeof html !== "string") return "";
  const idx = html.indexOf("<table");
  return stripHtml(idx === -1 ? html : html.slice(0, idx));
}

function parseHtmlTables(html) {
  if (typeof html !== "string") return [];

  const tables = [];
  const tableRe = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch;

  while ((tableMatch = tableRe.exec(html)) !== null) {
    const rows = [];
    const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;

    while ((rowMatch = rowRe.exec(tableMatch[1])) !== null) {
      const cells = [];
      const cellRe = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;
      let cellMatch;

      while ((cellMatch = cellRe.exec(rowMatch[1])) !== null) {
        cells.push(stripHtml(cellMatch[2]));
      }

      if (cells.length) rows.push(cells);
    }

    if (rows.length) tables.push(rows);
  }

  return tables;
}

function pickTable(tables, keywords, columnCount) {
  for (const rows of tables) {
    const header = (rows[0] || []).join(" ").toLowerCase();
    const matchesHeader = keywords.some((keyword) => header.includes(keyword));

    if (matchesHeader && (!columnCount || (rows[0] || []).length === columnCount)) {
      return rows;
    }
  }

  return null;
}

function sectionText(section) {
  return SECTION_FIELDS.map((field) => section?.[field] || "")
    .join(" ")
    .toLowerCase();
}

function findSection(sections, pattern) {
  return (sections || []).find((section) => pattern.test(sectionText(section)));
}

/**
 * Finds the first section that carries one of the given block types.
 * Block types are stable; section titles are not, so this is preferred over
 * matching on the title whenever possible.
 */
function findSectionByBlock(sections, types) {
  const list = Array.isArray(types) ? types : [types];

  return (sections || []).find((section) =>
    (section?.blocks || []).some((block) => list.includes(block?.type))
  );
}

/**
 * Finds the section that carries the given block types AND whose title matches
 * `pattern`. Used where several sections share the same block type.
 */
function findSectionByBlockAndTitle(sections, types, pattern) {
  const list = Array.isArray(types) ? types : [types];

  const match = (sections || []).find(
    (section) =>
      pattern.test(sectionText(section)) &&
      (section?.blocks || []).some((block) => list.includes(block?.type))
  );

  if (match) return match;

  return (sections || []).find((section) =>
    (section?.blocks || []).some((block) => list.includes(block?.type))
  );
}

function blocksOf(section) {
  return section?.blocks || [];
}

/** Finds a section by its title only (no fallback to the first richtext). */
function findSectionByTitle(sections, pattern) {
  return (sections || []).find((section) => pattern.test(section?.title || ""));
}

function blockOfType(section, type) {
  return blocksOf(section).find((block) => block?.type === type);
}

function blocksOfType(section, type) {
  return blocksOf(section).filter((block) => block?.type === type);
}

function blocksOfAnyType(section, types) {
  return blocksOf(section).filter((block) => types.includes(block?.type));
}

/**
 * Safely reads an array of items from a block's content. Different API
 * builders use different keys, so every known key is tried in order.
 */
function mapRows(blocks, key) {
  for (const block of blocks || []) {
    const content = block?.content || {};
    const value = content[key] || content.items || content.rows || content.list;

    if (Array.isArray(value)) return value;
  }

  return [];
}

function richtextOf(section) {
  return blockOfType(section, "richtext")?.content || "";
}

function titleOf(section, fallback) {
  return section?.title || fallback;
}

/** "Online MBA" / "MBA (Online)" -> "mba" (used to match CMS fee rows). */
function normalizeProgramKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/online/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9.]/g, "");
}

const UG_PATTERN = /\b(bachelor|bca|bba|bsc|b\.?com|b\.?a)\b/i;
const PG_PATTERN = /\b(master|mba|mca|msc|m\.?sc|m\.?com|m\.?a)\b/i;

/**
 * Reads every fee table of a section (UG / PG / certificate tables can live in
 * the same CMS section) and normalises the columns by their header label.
 */
function mapFeeTables(tables) {
  const rows = [];

  (tables || []).forEach((table) => {
    if (!Array.isArray(table) || table.length < 2) return;

    const header = table[0].map((cell) => String(cell || "").toLowerCase());
    const durationIdx = header.findIndex((h) => h.includes("duration"));
    const perSemIdx = header.findIndex(
      (h) => h.includes("per semester") || h.includes("per sem")
    );
    const totalIdx = header.findIndex((h) => h.includes("total"));

    table.slice(1).forEach((row) => {
      const program = row[0] || "";

      if (!program) return;

      rows.push({
        program,
        duration: durationIdx >= 0 ? row[durationIdx] || "" : "",
        perSemFee: perSemIdx >= 0 ? row[perSemIdx] || "" : "",
        totalFee: totalIdx >= 0 ? row[totalIdx] || "" : "",
      });
    });
  });

  return rows;
}

/** Extracts the <li> entries of a CMS richtext block (learning facilities). */
function listItemsOf(html) {
  if (typeof html !== "string") return [];

  const items = [];
  const listRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match;

  while ((match = listRe.exec(html)) !== null) {
    const text = stripHtml(match[1]);

    if (text) items.push(text);
  }

  return items;
}

function mapCourses(courses, feeRows = []) {
  const feeIndex = new Map(
    feeRows.map((row) => [normalizeProgramKey(row.program), row])
  );

  return (courses || []).map((degree) => {
    const fee = degree.avgFee ?? degree.fee ?? degree.avgFees;
    const years = degree.avgDuration ?? degree.duration;
    const semestersCount = degree.avgDuration
      ? Number(degree.avgDuration) * 2
      : 0;
    const name = degree.degreeName || degree.name || "Programme";
    const level = String(degree.courses?.[0]?.level || "").toLowerCase();
    const feeRow = feeIndex.get(normalizeProgramKey(name));

    let category = "";

    if (level === "ug" || level === "undergraduate") category = "ug";
    else if (level === "pg" || level === "postgraduate") category = "pg";
    else if (level === "diploma" || level === "certificate") category = "diploma";

    if (!category) {
      if (UG_PATTERN.test(name)) category = "ug";
      else if (PG_PATTERN.test(name)) category = "pg";
      else category = "diploma";
    }

    return {
      degree: name,
      code: degree.slug ? String(degree.slug).split("/").pop() : "",
      courseId: degree.slug ? String(degree.slug).split("/").pop() : "",
      category,
      name,
      mode: degree.mode || degree.courses?.[0]?.mode || "",
      specialisations: (Array.isArray(degree.courses) ? degree.courses : [])
        .map((course) => course?.specialization || "")
        .filter(Boolean),
      specializations: degree.noOfSpecializations
        ? `${degree.noOfSpecializations} specializations available`
        : "",
      duration: years ? `${String(years).replace(/[^0-9.]/g, "")} years` : "",
      semestersCount,
      perSemFee: feeRow?.perSemFee || "",
      avgFees:
        fee != null && fee !== ""
          ? `₹ ${Number(fee).toLocaleString("en-IN")}`
          : feeRow?.totalFee || "",
      totalFee: fee != null && fee !== "" ? Number(fee) : null,
    };
  });
}

function mapReviews(testimonials) {
  return (testimonials || [])
    .map((item, index) => {
      const rawRating = Number(item.rating);
      const ratingValue = Number.isFinite(rawRating)
        ? Math.min(5, Math.max(0, rawRating))
        : 5;

      return {
        studentName: stripHtml(item.studentName || item.name || "Student"),
        avatar: stripHtml(item.avatar || item.studentName || item.name || "S")
          .slice(0, 2)
          .toUpperCase(),
        course: stripHtml(item.course || item.program || ""),
        batch: stripHtml(item.batch || ""),
        text: stripHtml(item.text || item.review || ""),
        // Whole stars for the star row (the API can return 4.5 / 4.9 …).
        rating: Math.round(ratingValue),
        // Exact score for the numeric label.
        ratingValue,
        ratingLabel: Number.isInteger(ratingValue)
          ? ratingValue.toFixed(1)
          : ratingValue.toFixed(1),
        tag: stripHtml(item.tag || "Verified Learner"),
        profession: stripHtml(item.profession || ""),
        company: stripHtml(item.company || ""),
        location: stripHtml(item.location || ""),
        index,
      };
    })
    .filter((review) => review.studentName || review.text);
}

export function mapBlogs(blogs) {
  return (blogs || []).map((post) => ({
    image: readImage(post.mainimage?.image || post.mainimage || post.image),
    title: post.title || "",
    excerpt: post.excerpt || post.description || "",
    category: post.category || "Blog",
    date: post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-IN") : "",
    slug: post.urlSlug || post.slug || "",
  }));
}

const TOC_TARGETS = [
  { id: "latest-news", match: /latest news|news|update/ },
  { id: "highlights", match: /highlight/ },
  { id: "courses-fees", match: /course|fee/ },
  { id: "popular-programmes", match: /popular programme|popular program/ },
  { id: "eligibility-criteria", match: /eligib|selection/ },
  { id: "admission-process", match: /admission/ },
  { id: "rankings", match: /ranking|accredit/ },
  { id: "examination-pattern", match: /examin|evaluation/ },
  { id: "placements", match: /placement/ },
  { id: "campus", match: /campus|gallery/ },
  { id: "sample-degree", match: /sample degree|certificate/ },
  { id: "reviews-section", match: /review|testimonial/ },
  { id: "compare-colleges", match: /compare/ },
  { id: "blogs", match: /blog/ },
];

/**
 * Maps an eligibility matrix table. The first three columns are always
 * course / eligibility / selection; duration and fee columns are read from
 * the header and stay empty when the CMS does not publish them.
 */
/** Splits "Label: description" CMS list items into title + body. */
function splitListItem(item) {
  const text = String(item || "").trim();
  const index = text.indexOf(":");

  if (index === -1) {
    return { title: text, description: "" };
  }

  return {
    title: text.slice(0, index).trim(),
    description: text.slice(index + 1).trim(),
  };
}

function mapEligibilityRows(rows) {
  if (!rows || !rows.length) return [];

  const header = (rows[0] || []).map((cell) => String(cell || "").toLowerCase());
  const durationIdx = header.findIndex((cell) => /duration/.test(cell));
  const feeIdx = header.findIndex(
    (cell) => /fee|semester|cost|price/.test(cell) && !/total/.test(cell)
  );
  const totalIdx = header.findIndex((cell) => /total/.test(cell));

  return rows.slice(1).map((row) => {
    const cells = Array.isArray(row) ? row : [];

    return {
      course: cells[0] || "",
      eligibility: cells[1] || "",
      selection: cells[2] || "",
      duration: durationIdx >= 0 ? cells[durationIdx] || "" : "",
      feeSem: feeIdx >= 0 ? cells[feeIdx] || "" : "",
      totalFee: totalIdx >= 0 ? cells[totalIdx] || "" : "",
    };
  });
}

function mapToc(payloadToc) {
  if (!Array.isArray(payloadToc) || !payloadToc.length) return [];

  const used = new Set();
  const toc = [];

  payloadToc.forEach((item) => {
    const label = item.label || item.title || "";
    const target = TOC_TARGETS.find(
      (candidate) => !used.has(candidate.id) && candidate.match.test(label.toLowerCase())
    );

    if (!target) return;

    used.add(target.id);
    toc.push({ id: target.id, label, order: item.order ?? toc.length });
  });

  return toc.sort((a, b) => a.order - b.order);
}

function feeRangeOf(college) {
  const min = college.minFee ?? college.minimumFee;
  const max = college.maxFee ?? college.maximumFee;

  if (min != null && max != null && min !== max) {
    return `₹${Math.round(min / 1000)}K – ₹${(max / 100000).toFixed(2)}L`;
  }
  if (min != null) return `₹${Number(min).toLocaleString("en-IN")}`;
  return "";
}

/**
 * Maps the production college payload (plus the auxiliary API responses) into
 * the reusable overview template model.
 */
export function mapOverviewData(payload, extras = {}) {
  const rawPayload = payload?.data?.data || payload?.data || payload;

  if (!rawPayload) return null;

  const rawCollegeId = rawPayload.college_id;
  const college = rawCollegeId && typeof rawCollegeId === "object" ? rawCollegeId : {};

  const collegeId =
    college?._id || college?.id || (typeof rawCollegeId === "string" ? rawCollegeId : "");

  const hero = rawPayload.hero || {};
  const sections = Array.isArray(rawPayload.sections) ? rawPayload.sections : [];

  const highlightsSection = findSectionByBlockAndTitle(sections, ["richtext"], /highlight/i);
  const coursesSection = findSectionByBlockAndTitle(sections, ["richtext", "courses_list"], /course|fee/i);
  const programmesSection = findSectionByBlockAndTitle(sections, ["courses_list", "course_specialization_list"], /popular|all programme|all course/i);
  const eligibilitySection = findSectionByBlockAndTitle(sections, ["richtext"], /eligib|selection/i);
  const admissionProcessSection = findSectionByBlockAndTitle(sections, ["admission_flow"], /admission process/i);
  const applicationProcessSection = findSectionByBlockAndTitle(sections, ["richtext"], /application process/i);
  const documentsSection = findSectionByBlockAndTitle(sections, ["richtext"], /document/i);
  const admissionDatesSection = findSectionByTitle(sections, /important date|admission date/i);
  const rankingsSection = findSectionByBlockAndTitle(sections, ["richtext", "banner"], /ranking|accredit/i);
  const examinationSection = findSectionByBlockAndTitle(sections, ["admission_flow"], /examin|evaluation/i);
  const placementsSection = findSectionByBlockAndTitle(sections, ["placement_stats", "resource_grid"], /placement/i);
  const campusSection = findSectionByBlockAndTitle(sections, ["gallery"], /campus|gallery/i);
  const sampleDegreeSection = findSectionByBlock(sections, ["certificate_grid"]);
  const reviewsSection = findSectionByBlock(sections, ["testimonials"]);
  const compareSection = findSectionByBlock(sections, ["compare"]);
  const blogsSection = findSectionByBlock(sections, ["blogs"]);
  const scholarshipSection = findSectionByTitle(sections, /scholar/i);
  const collegeAndLmsSection = findSectionByTitle(sections, /learning facilit|learning platform|lms/i);

  const highlightsTables = parseHtmlTables(richtextOf(highlightsSection));
  const highlightsRows = pickTable(highlightsTables, ["particular", "details"]) || [];
  const eligibilityTables = parseHtmlTables(richtextOf(eligibilitySection));
  const eligibilityRows = pickTable(eligibilityTables, ["eligibility", "selection"]) || [];
  const rankingsTables = parseHtmlTables(richtextOf(rankingsSection));
  const rankingsRows = pickTable(rankingsTables, ["authority", "recognition"]) || [];
  const campusTables = parseHtmlTables(richtextOf(campusSection));
  const campusRows = pickTable(campusTables, ["mode of transport", "details"]) || [];

  const feeStructureSection = findSectionByTitle(sections, /fee structure/i);
  const feeStructureTables = parseHtmlTables(richtextOf(feeStructureSection));
  const feeStructureRows = mapFeeTables(feeStructureTables);

  const courses = mapCourses(extras.courses, feeStructureRows);
  const programmes = mapCourses(
    extras.programmes?.length ? extras.programmes : extras.courses,
    feeStructureRows
  );

  const placementStats = college.placementStats || {};
  const placementBlock = blockOfType(placementsSection, "placement_stats");
  const placementContent = placementBlock?.content || {};

  const certificateBlock = blockOfType(sampleDegreeSection, "certificate_grid");
  const certificate = (certificateBlock?.content?.certificates || [])[0] || {};

  const news = rawPayload.latestNews || {};

  const approvals = Array.isArray(college.approvals) ? college.approvals : [];
  const naac = approvals.find((approval) => /NAAC/i.test(approval)) || "";

  const result = {
    slug: rawPayload.slug || college.slug || "",
    title: rawPayload.title || hero.title || college.name || "",
    shortName: college.collegeShortName || hero.subtitle || "",
    name: college.name || rawPayload.title || "",
    location: college.location || "",
    collegeType: college.collegeType || "",
    collegeMode: college.collegeMode || "",
    established: college.established || "",
    rating: college.rating || "",
    nirfRanking: college.nirfRanking || "",
    naac,
    approvals,
    students: college.students ?? null,
    feeRange: feeRangeOf(college),
    duration: extras.duration || "",

    hero: {
      logoImage: readImage(hero.logoImage || college.logo),
      backgroundImage: readImage(hero.backgroundImage || college.collegeImage),
      description: stripHtml(hero.description || ""),
      heroSub: stripHtml(hero.heroSub || hero.subtitle || ""),
      buttons: Array.isArray(hero.buttons) ? hero.buttons : [],
    },

    latestNews: news.title
      ? {
          title: news.title || "",
          description: stripHtml(news.description || ""),
          date: rawPayload.updatedAt ? new Date(rawPayload.updatedAt).toLocaleDateString("en-IN") : "",
          author: rawPayload.createdBy?.username || "",
        }
      : null,

    highlights: highlightsSection
      ? {
          title: titleOf(highlightsSection, ""),
          intro: textBeforeTable(richtextOf(highlightsSection)),
          categories: ["All"],
          items: highlightsRows.slice(1).map((row) => ({
            label: row[0] || "",
            value: row[1] || "",
            category: "Info",
          })),
        }
      : null,

    coursesFees: coursesSection
      ? {
          title: titleOf(coursesSection, ""),
          intro: textBeforeTable(richtextOf(coursesSection)),
          table: courses,
          roiCalculator: "ROI Calculator",
          viewFeeStructure: "View Fee Structure",
          searchPlaceholder: "Search college...",
          showing: courses.length ? `Showing 1-${courses.length} out of ${courses.length} Degrees` : "",
        }
      : null,

    feeStructure: feeStructureSection
      ? {
          title: titleOf(feeStructureSection, ""),
          description: textBeforeTable(richtextOf(feeStructureSection)),
          rows: feeStructureRows,
        }
      : null,

    popularProgrammes: programmes,

    eligibility:
      eligibilitySection && (eligibilityRows.length > 1 || textBeforeTable(richtextOf(eligibilitySection)))
        ? {
            title: titleOf(eligibilitySection, ""),
            intro: textBeforeTable(richtextOf(eligibilitySection)),
            table: eligibilityRows.slice(1),
            items: mapEligibilityRows(eligibilityRows),
          }
        : null,

    admission:
      admissionProcessSection &&
      ((blockOfType(admissionProcessSection, "admission_flow")?.content?.steps || []).length ||
        textBeforeTable(richtextOf(admissionProcessSection)))
        ? {
            title: titleOf(admissionProcessSection, ""),
            description: textBeforeTable(richtextOf(admissionProcessSection)),
            intro: textBeforeTable(richtextOf(admissionProcessSection)),
            steps: (blockOfType(admissionProcessSection, "admission_flow")?.content?.steps || []).map((step) => ({
              title: step.title || "",
              description: stripHtml(step.description || ""),
            })),
          }
        : null,

    rankings:
      rankingsSection && (rankingsRows.length > 1 || textBeforeTable(richtextOf(rankingsSection)))
        ? {
            title: titleOf(rankingsSection, ""),
            intro: textBeforeTable(richtextOf(rankingsSection)),
            table: rankingsRows.slice(1).map((row) => ({
              authority: row[0] || "",
              status: row[1] || "",
            })),
          }
        : null,

    examinationPattern:
      examinationSection &&
      ((blockOfType(examinationSection, "admission_flow")?.content?.steps || []).length ||
        textBeforeTable(richtextOf(examinationSection)))
        ? {
            title: titleOf(examinationSection, ""),
            description: textBeforeTable(richtextOf(examinationSection)),
            intro: textBeforeTable(richtextOf(examinationSection)),
            steps: (blockOfType(examinationSection, "admission_flow")?.content?.steps || []).map((step) => ({
              title: step.title || "",
              description: stripHtml(step.description || ""),
              points: [],
            })),
          }
        : null,

    placements: placementsSection
      ? {
      title: titleOf(placementsSection, ""),
      intro: textBeforeTable(richtextOf(placementsSection)),
      stats: {
        placementRate: placementContent.placementRate || (placementStats.placementPercentage ? `${placementStats.placementPercentage}%` : ""),
        highestPackage: placementContent.highestPackage || (placementStats.highestPackage ? `₹${placementStats.highestPackage} LPA` : ""),
        hiringPartners: placementContent.hiringPartners || "",
        internshipsCount: placementStats.internshipsCount ?? "—",
      },
      recruiters: (extras.recruiters || []).map((item) => ({
        name: item.displayName || item.title || item.altText || "Recruiter",
        src: readImage(item.url || item.logo),
      })),
    }
      : null,

    campus: campusSection
      ? {
          title: titleOf(campusSection, ""),
          description: textBeforeTable(richtextOf(campusSection)),
          travelTable: campusRows.slice(1).map((row) => ({
            mode: row[0] || "",
            detail: row[1] || "",
          })),
          gallery: (extras.gallery || []).map((item) => item.altText || ""),
          galleryImages: (extras.gallery || []).map((item) => ({
            imageUrl: readImage(item.imageUrl || item.url),
            altText: item.altText || "",
          })),
        }
      : null,

    sampleDegree:
      sampleDegreeSection && (certificate.imageUrl || certificateBlock?.content?.description)
        ? {
            title: certificate.title || titleOf(sampleDegreeSection, ""),
            description: stripHtml(certificateBlock?.content?.description || ""),
            imageUrl: readImage(certificate.imageUrl || certificate.image),
            altText: certificate.altText || `${rawPayload.title} Degree Certificate`,
          }
        : null,

    reviews: mapReviews(
      extras.reviews?.length
        ? extras.reviews
        : mapRows(blocksOfType(reviewsSection, "testimonials"), "testimonials").length
          ? mapRows(blocksOfType(reviewsSection, "testimonials"), "testimonials")
          : rawPayload.testimonials
    ),
    reviewsMeta: {
      title: titleOf(reviewsSection, ""),
      subtitle: "",
    },

    /* Section titles exposed for the page headings / TOC labels */
    admissionHighlights: (() => {
      const section = findSectionByBlockAndTitle(
        sections,
        ["richtext"],
        /admission highlight|admission overview/i
      );

      if (!section) return { title: "", description: "", items: [] };

      const tables = parseHtmlTables(richtextOf(section));
      const rows = pickTable(tables, ["particular", "detail"]) || [];

      return {
        title: titleOf(section, ""),
        description: textBeforeTable(richtextOf(section)),
        intro: textBeforeTable(richtextOf(section)),
        items: rows.slice(1).map((row) => ({
          label: row[0] || "",
          value: row[1] || "",
        })),
      };
    })(),
    applicationProcessMeta: { title: titleOf(applicationProcessSection, "") },
    documentsMeta: { title: titleOf(documentsSection, "") },
    scholarshipSection: {
      title: titleOf(scholarshipSection, ""),
      intro: textBeforeTable(richtextOf(scholarshipSection)),
    },
    learningPlatformTitle: "",
    admissionDatesMeta: { title: titleOf(admissionDatesSection, "") },

    faqs: (rawPayload.faq?.items || rawPayload.faqs || []).map((item) => ({
      question: item.question || "",
      answer: stripHtml(item.answer || ""),
    })),
    faqsMeta: { title: rawPayload.faq?.heading || "" },

    compareSection: compareSection
      ? {
      title: titleOf(compareSection, ""),
      description: textBeforeTable(richtextOf(compareSection)),
      college: {
        name: rawPayload.title || college.name || "",
        location: college.location || "",
        logo: readImage(college.logo || hero.logoImage),
        approvals,
      },
    }
      : null,

    blogs: mapBlogs(extras.blogs?.length ? extras.blogs : rawPayload.blogs),
    blogsMeta: {
      title: titleOf(blogsSection, ""),
      label: "Blogs",
      description: textBeforeTable(richtextOf(blogsSection)),
    },

    toc: mapToc(rawPayload.toc),

    /* ---- Optional blocks: present only when the API ships them ---- */

    admissionDates: (() => {
      const structured = mapRows(
        blocksOfAnyType(admissionDatesSection, ["important_dates", "admission_dates", "dates"]),
        "items"
      ).map((item) => ({
        event: item.event || item.title || item.label || "",
        detail: item.detail || item.description || "",
        date: item.date || item.value || "",
        status: item.status || "",
      }));

      if (structured.length) return structured;

      // CMS admission-date sections are plain richtext tables.
      const tables = parseHtmlTables(richtextOf(admissionDatesSection));
      const rows = pickTable(tables, ["event", "date", "detail"]) || [];
      const header = (rows[0] || []).map((cell) => String(cell || "").toLowerCase());
      const statusIdx = header.findIndex((cell) => /status/.test(cell));
      const detailIdx = header.findIndex((cell) => /detail/.test(cell));

      return rows.slice(1).map((row) => ({
        event: row[0] || "",
        detail: detailIdx >= 0 ? row[detailIdx] || "" : "",
        date: row.length > 2 ? row[2] || "" : row[1] || "",
        status: statusIdx >= 0 ? row[statusIdx] || "" : "",
      }));
    })(),
    admissionDatesTable: (() => {
      const tables = parseHtmlTables(richtextOf(admissionDatesSection));
      const rows = pickTable(tables, ["event", "date", "detail"]) || [];
      return rows.slice(1).map((row) => ({ event: row[0] || "", date: row[1] || "" }));
    })(),

    applicationProcess: (() => {
      const structured = mapRows(
        blocksOfAnyType(applicationProcessSection, ["application_process", "application_steps"]),
        "steps"
      ).map((step) => ({
        title: step.title || step.label || "",
        description: stripHtml(step.description || step.detail || step.text || ""),
      }));

      if (structured.length) return structured;

      return listItemsOf(richtextOf(applicationProcessSection)).map((item) => {
        const parts = splitListItem(item);

        return { title: parts.title, description: parts.description };
      });
    })(),
    applicationProcessDescription: textBeforeTable(richtextOf(applicationProcessSection)),

    documentsRequired: (() => {
      const structured = mapRows(
        blocksOfAnyType(documentsSection, ["documents", "documents_required"]),
        "items"
      ).map((doc) => ({
        name: doc.name || doc.title || doc.label || "",
        note: doc.note || doc.description || "",
      }));

      if (structured.length) return structured;

      return listItemsOf(richtextOf(documentsSection)).map((item) => ({
        name: item,
        note: "",
      }));
    })(),

    learningPlatform: (() => {
      const structured = mapRows(
        blocksOfAnyType(collegeAndLmsSection, ["learning_platform", "lms_features"]),
        "items"
      ).map((item) => ({
        icon: item.icon || "video",
        title: item.title || item.label || "",
        desc: stripHtml(item.desc || item.description || item.detail || ""),
        meta: item.meta || "",
      }));

      if (structured.length) return structured;

      // CMS learning sections are plain richtext lists.
      return listItemsOf(richtextOf(collegeAndLmsSection)).map((item) => ({
        icon: "video",
        title: item,
        desc: "",
        meta: "",
      }));
    })(),

    scholarshipRules: mapRows(
      blocksOfAnyType(scholarshipSection, ["scholarship_calculator", "scholarship_rules"]),
      "rules"
    ).map((rule) => ({
      id: rule.id || rule.title || "",
      label: rule.label || rule.title || "",
      percent: Number(rule.percent || rule.value || 0),
      tag: rule.tag || "",
      condition: rule.condition || "",
    })),

    scholarshipSchemes: listItemsOf(richtextOf(scholarshipSection)).map((item) => {
      const parts = splitListItem(item);

      return {
        name: parts.title || item,
        details: parts.description || item,
      };
    }),

    scholarshipPillars: mapRows(
      blocksOfAnyType(scholarshipSection, ["scholarship_pillars", "scholarship_schemes"]),
      "pillars"
    ).map((pillar) => ({
      id: pillar.id || pillar.title || "",
      title: pillar.title || pillar.name || "",
      body: stripHtml(pillar.body || pillar.description || ""),
      icon: pillar.icon || "award",
      tag: pillar.tag || "",
      tone: pillar.tone || "amber",
      footnote: pillar.footnote || "",
    })),
  };

  // Keep only the table-of-contents entries that point at a rendered section
  const renderedSections = new Set();

  if (result.latestNews) renderedSections.add("latest-news");
  if (result.highlights) renderedSections.add("highlights");
  if (result.coursesFees) renderedSections.add("courses-fees");
  if (result.popularProgrammes.length) renderedSections.add("popular-programmes");
  if (result.eligibility) renderedSections.add("eligibility-criteria");
  if (result.admission) renderedSections.add("admission-process");
  if (result.rankings) renderedSections.add("rankings");
  if (result.examinationPattern) renderedSections.add("examination-pattern");
  if (result.placements) renderedSections.add("placements");
  if (result.campus) renderedSections.add("campus");
  if (result.sampleDegree) renderedSections.add("sample-degree");
  if (result.reviews.length || result.faqs.length) renderedSections.add("reviews-section");
  if (result.compareSection) renderedSections.add("compare-colleges");
  if (result.blogs.length) renderedSections.add("blogs");

  result.toc = result.toc.filter((item) => renderedSections.has(item.id));

  if (
    renderedSections.has("latest-news") &&
    !result.toc.some((item) => item.id === "latest-news")
  ) {
    result.toc.unshift({
      id: "latest-news",
      label: result.latestNews.title || "Latest News & Updates",
      order: -1,
    });
  }

  return result;
}
