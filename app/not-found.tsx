import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-black px-6 py-8 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,131,19,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_38%)]" />
      <div className="not-found-grid pointer-events-none absolute inset-0 opacity-[0.18]" />

      <section className="relative mx-auto flex w-full max-w-[1040px] flex-col items-center justify-center text-center">
        <Link href="/" className="mb-10 block">
          <Image
            src="/logo.png"
            alt="A7 Property Solutions"
            width={150}
            height={86}
            priority
            className="h-auto w-[128px]"
          />
        </Link>

        <div className="not-found-float mb-7 flex size-16 items-center justify-center rounded-full border border-[#c98313]/40 bg-[#181818] text-[#c98313] shadow-[0_0_40px_rgba(201,131,19,0.22)]">
          <SearchX className="size-8" strokeWidth={1.8} />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-[#c98313]">
          Page Not Found
        </p>
        <h1 className="not-found-glow text-[96px] font-bold leading-none text-white sm:text-[132px]">
          404
        </h1>
        <h2 className="mt-4 max-w-[680px] text-3xl font-semibold leading-tight text-white sm:text-5xl">
          This route is not on the blueprint.
        </h2>
        <p className="mt-5 max-w-[620px] text-base leading-7 text-[#9f9f9f]">
          The page may have been moved, deleted, or the address may be typed
          incorrectly. Head back to the dashboard and keep building from there.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#c98313] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#b6750f]"
          >
            <Home className="size-4" />
            Back Home
          </Link>
          <Link
            href="/services"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#555555] px-7 text-sm font-semibold text-white transition-colors hover:border-[#c98313] hover:text-[#c98313]"
          >
            <ArrowLeft className="size-4" />
            Go To Services
          </Link>
        </div>

        <div className="not-found-line mt-14 h-px w-full max-w-[620px] overflow-hidden bg-[#2a2a2a]" />
      </section>
    </main>
  );
}
