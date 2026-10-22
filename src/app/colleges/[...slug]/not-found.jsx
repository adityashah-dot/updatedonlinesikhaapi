import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        We could not find that college
      </h1>
      <p className="mt-4 text-slate-600">
        The college page you are looking for may have been moved, renamed, or is no
        longer listed. Browse our universities to find a similar match.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/universities"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Browse Universities
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
