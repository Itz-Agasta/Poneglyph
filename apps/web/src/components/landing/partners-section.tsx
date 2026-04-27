const PARTNERS = [
  {
    name: "World Bank",
    logo: (
      <svg viewBox="0 0 180 56" className="h-10 w-auto" aria-label="World Bank">
        <circle cx="22" cy="28" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
        <ellipse
          cx="22"
          cy="28"
          rx="10"
          ry="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line x1="2" y1="28" x2="42" y2="28" stroke="currentColor" strokeWidth="1.5" />
        <text
          x="52"
          y="22"
          fontFamily="serif"
          fontSize="13"
          fontWeight="700"
          fill="currentColor"
          letterSpacing="1"
        >
          WORLD BANK
        </text>
        <text x="52" y="39" fontFamily="serif" fontSize="10" fill="currentColor" letterSpacing="2">
          OPEN DATA
        </text>
      </svg>
    ),
  },
  {
    name: "UNDP",
    logo: (
      <svg viewBox="0 0 160 56" className="h-10 w-auto" aria-label="UNDP">
        <rect
          x="2"
          y="8"
          width="40"
          height="40"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text
          x="7"
          y="33"
          fontFamily="sans-serif"
          fontSize="14"
          fontWeight="800"
          fill="currentColor"
        >
          UN
        </text>
        <line x1="48" y1="8" x2="48" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <text
          x="58"
          y="26"
          fontFamily="serif"
          fontSize="13"
          fontWeight="700"
          fill="currentColor"
          letterSpacing="0.5"
        >
          UNDP
        </text>
        <text x="58" y="41" fontFamily="serif" fontSize="8.5" fill="currentColor" letterSpacing="1">
          UNITED NATIONS
        </text>
      </svg>
    ),
  },
  {
    name: "Our World in Data",
    logo: (
      <svg viewBox="0 0 200 56" className="h-10 w-auto" aria-label="Our World in Data">
        <circle cx="22" cy="28" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M4 28 Q13 18 22 28 Q31 38 40 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M10 16 Q22 12 34 16" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M10 40 Q22 44 34 40" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <text x="50" y="24" fontFamily="serif" fontSize="13" fontWeight="700" fill="currentColor">
          OUR WORLD
        </text>
        <text x="50" y="41" fontFamily="serif" fontSize="13" fontWeight="700" fill="currentColor">
          IN DATA
        </text>
      </svg>
    ),
  },
];

export function PartnersSection() {
  return (
    // Transparent — shares the fixed background with every other section
    <section className="relative w-full h-screen">
      {/* Small cloud enters from bottom-right */}
      <img
        src="/assets/cloud_small.avif"
        alt=""
        className="absolute bottom-[-4%] right-[-10%] w-[40%] object-contain pointer-events-none"
        style={{ zIndex: 2 }}
      />

      {/* Partner logos sit near the bottom of this viewport */}
      <div
        className="absolute bottom-[14%] left-0 right-0 flex flex-col items-center gap-10"
        style={{ zIndex: 5 }}
      >
        <p
          className="text-[#2d3a4a]/70 text-base tracking-wide"
          style={{ fontFamily: "var(--font-newsreader)" }}
        >
          In collaboration with
        </p>

        <div className="flex flex-wrap items-center justify-center gap-14 text-[#1a2535]">
          {PARTNERS.map((p) => (
            <div key={p.name} className="opacity-80 hover:opacity-100 transition-opacity">
              {p.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
