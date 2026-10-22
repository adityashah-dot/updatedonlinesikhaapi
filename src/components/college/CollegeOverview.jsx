export default function CollegeOverview({ college }) {
  const { overview, description, highlights = [], website, contact = {} } = college;

  const about = overview || description;

  return (
    <section id="overview" className="scroll-mt-20 py-12">
      <h2 className="text-2xl font-bold text-slate-900">About the University</h2>

      <div className="mt-5 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {about && <p className="leading-relaxed text-slate-600">{about}</p>}

          {highlights.length > 0 && (
            <>
              <h3 className="mt-8 text-lg font-semibold text-slate-900">
                Key Highlights
              </h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700"
                  >
                    <span className="mt-0.5 text-emerald-500">✓</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Quick Facts</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Location</dt>
              <dd className="font-medium text-slate-900">{college.location || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Established</dt>
              <dd className="font-medium text-slate-900">{college.established || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">University Type</dt>
              <dd className="font-medium text-slate-900">{college.collegeType || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Rating</dt>
              <dd className="font-medium text-slate-900">{college.rating || "—"}</dd>
            </div>
            {contact?.phone && (
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Contact</dt>
                <dd className="font-medium text-slate-900">{contact.phone}</dd>
              </div>
            )}
          </dl>

          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 block rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
            >
              Visit Official Website
            </a>
          )}
        </aside>
      </div>
    </section>
  );
}
