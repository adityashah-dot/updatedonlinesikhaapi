import Link from "next/link";

export default function UniversityNotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-[64px] font-bold leading-none text-[#115eaf]">404</p>
      <h1 className="text-2xl font-bold text-[#0b1b3a]">University not found</h1>
      <p className="max-w-md text-[15px] text-[#43474d]">
        We could not find that university page. It may have been moved or removed.
      </p>
      <div className="flex gap-3">
        <Link
          href="/universities"
          className="rounded-md bg-[#115eaf] px-4 py-2 text-sm font-semibold text-white hover:bg-[#084a8c]"
        >
          Browse universities
        </Link>
        <Link
          href="/"
          className="rounded-md border border-[#c4c6ce] px-4 py-2 text-sm font-semibold text-[#0b1b3a] hover:bg-[#f0f4f8]"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
