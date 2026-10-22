const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

const API_TOKEN = process.env.API_TOKEN;

const TONES = ["blue", "indigo", "emerald", "amber"];

function buildHeaders() {
  const headers = { Accept: "application/json" };

  if (API_TOKEN) {
    headers.Authorization = `Bearer ${API_TOKEN}`;
  }

  return headers;
}

function readImage(value) {
  if (typeof value === "string") return value;

  if (value && typeof value === "object") {
    if (Array.isArray(value)) return readImage(value[0]);
    return value.url || value.src || value.path || "";
  }

  return "";
}

function formatFee(value) {
  if (value === null || value === undefined || value === "") return "";
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function readApprovals(record) {
  const accreditations = record.accreditations || [];

  if (Array.isArray(accreditations)) {
    return accreditations
      .map((item) => (typeof item === "string" ? item : item?.name))
      .filter(Boolean)
      .flatMap((name) => String(name).split(",").map((part) => part.trim()))
      .filter(Boolean);
  }

  return [];
}

/**
 * Maps one live listing record onto the model the listing UI expects.
 *
 * API fields (GET /website/colleges/listing):
 *   collegeName, collegeShortName, collegeLocation, collegeLogo, collegeImage,
 *   established, coursesCount, minFee, maxFee, accreditations, collegeMode,
 *   highestPackage, placementHighest, slug, _id
 */
export function mapUniversity(record, index) {
  const name = record.collegeName || record.name || record.title || "University";
  const short =
    record.collegeShortName || record.short || record.shortName || name.slice(0, 3).toUpperCase();

  const approvals = readApprovals(record);
  const minFee = record.minFee ?? null;
  const maxFee = record.maxFee ?? null;

  const feeLabel =
    minFee != null && maxFee != null && minFee !== maxFee
      ? `${formatFee(minFee)} - ${formatFee(maxFee)}`
      : formatFee(minFee ?? maxFee);

  const specs = [];

  if (record.collegeMode) {
    specs.push({
      label: "Course Mode",
      value: record.collegeMode === "online" ? "100% Online" : "Regular / Online",
    });
  }
  const coursesCount =
    record.coursesCount ?? (record.counts ? parseInt(record.counts, 10) : null);
  if (coursesCount != null && !Number.isNaN(coursesCount)) {
    specs.push({ label: "Programs", value: `${coursesCount} Courses` });
  }
  if (record.highestPackage) {
    specs.push({ label: "Highest CTC Record", value: formatFee(record.highestPackage), highlight: true });
  }
  if (record.placementHighest) {
    specs.push({ label: "Avg Package", value: formatFee(record.placementHighest) });
  }
  if (record.established) {
    specs.push({ label: "Established", value: String(record.established) });
  }

  // The accent chip is reserved for the NAAC grade; every accreditation is
  // listed separately in `approvals`.
  const naac = approvals.find((approval) => /NAAC/i.test(approval)) || "";

  const slug = record.slug || "";

  return {
    id: slug || record._id || record.id || `university-${index}`,
    slug,
    name,
    short,
    logoImage: readImage(record.collegeLogo || record.logo || record.collegeImage),
    campusImage: readImage(record.collegeImage || record.collegeLogo),
    location: record.collegeLocation || record.location || "",
    established: record.established || "",
    rankNote: record.nirfRanking ? `NIRF Rank #${record.nirfRanking}` : "",
    naac,
    approvals,
    accreditations: approvals,
    feeLabel,
    minFee,
    maxFee,
    highestPackage: record.highestPackage || 0,
    placementHighest: record.placementHighest || 0,
    collegeMode: record.collegeMode || "",
    coursesCount: coursesCount ?? null,
    // The listing endpoint does not expose an EMI figure.
    emi: "",
    specs,
    // The listing endpoint does not expose the programme list.
    tracks: [],
    highlight: {
      text: record.collegeMode === "online" ? "Online Mode" : "Verified 2026",
      tone: TONES[index % TONES.length],
    },
    isLpu: slug === "lovely-professional-university-online",
  };
}

/** "Kolkata, West Bengal" -> { city: "Kolkata", state: "West Bengal" } */
function splitLocation(location) {
  const parts = String(location || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (!parts.length) return { city: "", state: "" };

  return {
    city: parts[parts.length - 1],
    state: parts.length > 1 ? parts[parts.length - 2] : "",
  };
}

const ACCENT_BY_TONE = {
  blue: "#12417a",
  indigo: "#4c1d95",
  emerald: "#0b6b5c",
  amber: "#b45309",
};

const GRADIENT_BY_TONE = {
  blue: "from-blue-600 to-indigo-800",
  indigo: "from-indigo-600 to-violet-800",
  emerald: "from-emerald-600 to-teal-800",
  amber: "from-amber-600 to-amber-800",
};

/**
 * Homepage "featured universities" cards.
 * Every value comes from the live listing record.
 */
export function mapFeaturedUniversities(universities) {
  return (universities || []).map((university) => {
    const rows = [];

    if (university.feeLabel) {
      rows.push({ label: "Total Course Fee:", value: university.feeLabel });
    }

    if (university.coursesCount) {
      rows.push({ label: "Programmes:", value: `${university.coursesCount} Courses` });
    }

    if (university.collegeMode) {
      rows.push({
        label: "Course Mode:",
        value: university.collegeMode === "online" ? "100% Online" : "Regular / Online",
      });
    }

    if (university.established) {
      rows.push({ label: "Established:", value: String(university.established) });
    }

    if (university.highestPackage) {
      rows.push({
        label: "Highest Package:",
        value: formatFee(university.highestPackage),
        tone: "text-[#115eaf] font-semibold",
      });
    }

    return {
      id: university.id,
      slug: university.slug,
      name: university.name,
      short: university.short,
      logoImage: university.logoImage,
      naac: university.naac,
      rank: university.rankNote,
      rows,
    };
  });
}

/**
 * Homepage "top colleges by location" cards.
 * Fields the listing endpoint does not provide stay empty so the card can
 * hide them instead of inventing values.
 */
export function mapLocationColleges(universities) {
  return (universities || []).map((university) => {
    const { city, state } = splitLocation(university.location);
    const tone = university.highlight?.tone || "blue";

    return {
      id: university.id,
      slug: university.slug,
      name: university.name,
      city,
      state,
      locationCategory: city,
      nirf: university.rankNote,
      courses: university.coursesCount ? `${university.coursesCount} courses` : "",
      rating: "",
      totalFees: university.feeLabel,
      logoLetter: university.short.slice(0, 2).toUpperCase(),
      logoColor: GRADIENT_BY_TONE[tone] || GRADIENT_BY_TONE.blue,
    };
  });
}

/**
 * Homepage compare carousel colleges.
 */
export function mapCompareColleges(universities) {
  return (universities || []).map((university) => {
    const tone = university.highlight?.tone || "blue";

    return {
      key: university.slug || university.id,
      slug: university.slug,
      name: university.name,
      short: university.short,
      logo: university.logoImage,
      accent: ACCENT_BY_TONE[tone] || ACCENT_BY_TONE.blue,
      loc: university.location,
      fee: university.minFee || 0,
      rank: university.rankNote,
      mode: university.collegeMode === "online" ? "100% Online" : university.collegeMode,
      approvals: university.approvals.join(", "),
      place: university.highestPackage ? formatFee(university.highestPackage) : "",
    };
  });
}

function extractUniversities(result) {
  if (!result) return [];
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.universities)) return result.universities;
  if (Array.isArray(result.onlineUniversities)) return result.onlineUniversities;
  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result.suggestedColleges)) return result.suggestedColleges;
  if (result.data) return extractUniversities(result.data);
  return [];
}

/**
 * University (college) listing.
 * GET {API_URL}/website/colleges/listing
 *
 * The API paginates 1-based (`page=1` is the first slice), both with and
 * without a search filter, so the UI page number is passed through as is.
 */
export async function getUniversitiesPayload({ search = "", page = 1 } = {}) {
  const params = new URLSearchParams({
    isCollgesNamesRequired: "true",
    isCollgesLocationsRequired: "true",
  });

  if (search) {
    params.set("search", search);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  try {
    const response = await fetch(`${API_URL}/website/colleges/listing?${params.toString()}`, {
      headers: buildHeaders(),
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch universities: ${response.status}`);
    }

    const result = await response.json();
    const records = extractUniversities(result);

    if (!records.length) {
      return {
        hero: { logoImage: "" },
        onlineUniversities: [],
        pagination: result?.pagination || null,
        error: "The live university listing returned no records.",
      };
    }

    const onlineUniversities = records.map(mapUniversity);

    return {
      hero: {
        logoImage: onlineUniversities.find((item) => item.logoImage)?.logoImage || "",
      },
      onlineUniversities,
      pagination: result.pagination || null,
    };
  } catch (error) {
    console.error("getUniversitiesPayload failed:", error.message);

    return {
      hero: { logoImage: "" },
      onlineUniversities: [],
      pagination: null,
      error: "The live university listing could not be loaded. Please try again shortly.",
    };
  }
}

export async function getUniversityBySlug(slug) {
  try {
    const response = await fetch(
      `${API_URL}/website/colleges/${encodeURIComponent(slug)}`,
      {
        headers: buildHeaders(),
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch university: ${response.status}`);
    }

    const result = await response.json();

    return result?.data?.data || result?.data || result;
  } catch (error) {
    console.error(`getUniversityBySlug failed for ${slug}:`, error.message);
    return null;
  }
}
