import Image from "next/image";
import Link from "next/link";

function DatabaseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v4c0 1.657 4.03 3 9 3s9-1.343 9-3V5" />
      <path d="M3 9v4c0 1.657 4.03 3 9 3s9-1.343 9-3V9" />
      <path d="M3 13v4c0 1.657 4.03 3 9 3s9-1.343 9-3v-4" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: <DatabaseIcon />,
    title: "Open data access",
    description:
      "Instantly browse thousands of verified survey datasets from NGOs and volunteers worldwide. No paywalls, no gatekeeping.",
  },
  {
    icon: <SparkleIcon />,
    title: "AI-powered insights",
    description:
      "Our agents surface patterns, flag anomalies, and generate plain-language reports — so you spend time on decisions, not data wrangling.",
  },
];

export function FeatureSplitSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden py-20 px-4">
      {/* Long branch — left edge */}
      <img
        src="/assets/branch_long.svg"
        alt=""
        className="absolute left-0 top-0 h-full w-auto object-contain object-left pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* Branch — top right */}
      <img
        src="/assets/branches2.avif"
        alt=""
        className="absolute top-0 right-0 w-72 md:w-96 object-contain object-right-top pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* Sparrow — bottom right */}
      <img
        src="/assets/sparrow.svg"
        alt=""
        className="absolute -right-10 -bottom-2 w-[374px] md:w-[416px] pointer-events-none"
        style={{ zIndex: 10 }}
      />

      {/* Modal card */}
      <div
        className="relative mx-auto w-full max-w-7xl rounded-3xl overflow-hidden flex flex-col md:flex-row"
        style={{ zIndex: 5, minHeight: 560 }}
      >
        {/* Left — photo */}
        <div className="relative w-full md:w-[45%] min-h-[320px] md:min-h-0">
          <Image
            src="/images/pic_1_pone.png"
            alt="Dataset collaboration"
            fill
            className="object-cover"
          />
        </div>

        {/* Right — content panel */}
        <div className="w-full md:w-[55%] bg-[#5a6478]/80 backdrop-blur-sm p-8 md:p-10 flex flex-col justify-between gap-8">
          {/* Heading */}
          <div>
            <h2
              className="text-white text-3xl md:text-4xl font-light leading-tight mb-4"
              style={{ fontFamily: "var(--font-newsreader)" }}
            >
              No more searching, waiting, or guessing.
            </h2>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              Poneglyph handles the heavy lifting — from raw field data to AI-powered insights — so
              you can focus on impact.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title}>
                <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-white mb-3">
                  {f.icon}
                </div>
                <h3 className="text-white font-medium text-sm mb-2">{f.title}</h3>
                <p className="text-white/60 text-xs leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div>
            <Link
              href="/datasets"
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 transition-colors"
            >
              Explore datasets
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
        </div>
      </div>
    </section>
  );
}
