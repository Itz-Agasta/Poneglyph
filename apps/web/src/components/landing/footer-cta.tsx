import Image from "next/image";
import Link from "next/link";

export function FooterCta() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Small sparrow — left, floating mid-height */}
      <div className="absolute left-[30%] top-[25%] -translate-y-1/2 z-20 pointer-events-none w-24 md:w-32">
        <Image
          src="/assets/small_sparrow.svg"
          alt=""
          width={128}
          height={96}
          className="w-full h-auto"
        />
      </div>

      {/* Big tree — right side, starts at top, extends well below section */}
      <div className="absolute -right-16 -top-10 z-10 pointer-events-none w-[52%]">
        <Image
          src="/assets/big_tree_long.avif"
          alt=""
          width={800}
          height={600}
          className="w-full h-auto object-contain object-right-top"
        />
      </div>
      {/* CTA — center */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h2
          className="text-white text-4xl md:text-6xl font-light leading-tight mb-5 max-w-2xl"
          style={{ fontFamily: "var(--font-newsreader)" }}
        >
          For every dataset journey.
        </h2>
        <p className="text-white/70 text-base md:text-lg mb-10 max-w-md leading-relaxed">
          Have questions or just want to see how Poneglyph can help?
          <br />
          Reach out anytime — we&apos;re open to everyone.
        </p>
        <Link
          href="/datasets"
          className="inline-flex items-center gap-3 px-7 py-4 bg-white text-[#1a1a1a] text-sm font-medium rounded-full hover:bg-white/90 transition-colors"
        >
          Explore datasets
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
