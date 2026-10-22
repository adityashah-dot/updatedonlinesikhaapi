import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { COLLEGE_CONTENT_TAG } from "@/services/collegeApi";

/**
 * CMS -> Next.js live-content webhook.
 *
 * POST /api/revalidate
 * body: { secret: "<REVALIDATE_SECRET>", slug: "lovely-professional-university-online", sub?: "courses" }
 *
 * Drops the cached live content and re-renders every route that shows the
 * college (overview + each navigation sub-page) on /colleges and /universities.
 */
export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "REVALIDATE_SECRET is not configured" },
      { status: 500 }
    );
  }

  let body = {};

  try {
    body = await request.json();
  } catch {
    body = {};
  }

  if (body.secret !== secret) {
    return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 401 });
  }

  const slug = String(body.slug || "").trim();
  const sub = String(body.sub || "").trim();

  if (!slug) {
    return NextResponse.json({ ok: false, error: "slug is required" }, { status: 400 });
  }

  revalidateTag(COLLEGE_CONTENT_TAG);

  const paths = [
    `/colleges/${slug}`,
    `/universities/${slug}`,
  ];

  if (sub) {
    paths.push(`/colleges/${slug}/${sub}`, `/universities/${slug}/${sub}`);
  }

  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({ ok: true, revalidated: paths, at: Date.now() });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    usage: "POST { secret, slug, sub? } to refresh the live content cache",
  });
}
