/**
 * Shared UI types — ported from the reference project's src/types/index.ts.
 * Kept as JSDoc typedefs so the JS files stay valid JavaScript.
 */

/**
 * @typedef {"home" | "universities" | "degrees" | "compare" | "scholarships" | "lms"} TabType
 */

/**
 * @typedef {"ug" | "pg" | "diploma"} CourseLevel
 */

/**
 * @typedef {object} Course
 * @property {string} id
 * @property {string} name
 * @property {string} duration
 * @property {string} feePerSemester
 * @property {string} totalFee
 * @property {string} eligibility
 */

export const TAB_TYPES = [
  "home",
  "universities",
  "degrees",
  "compare",
  "scholarships",
  "lms",
];
