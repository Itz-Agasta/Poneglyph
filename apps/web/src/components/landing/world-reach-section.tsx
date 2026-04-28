import Image from "next/image";

// World map dots as [x%, y%] in a 500×260 SVG viewBox — approximate world landmasses
const WORLD_DOTS: [number, number][] = [
  // North America — upper
  ...(
    [
      "5,18",
      "8,18",
      "11,18",
      "14,18",
      "17,18",
      "20,18",
      "23,18",
      "26,18",
      "29,18",
      "32,18",
      "35,18",
      "5,22",
      "8,22",
      "11,22",
      "14,22",
      "17,22",
      "20,22",
      "23,22",
      "26,22",
      "29,22",
      "32,22",
      "35,22",
      "38,22",
      "5,26",
      "8,26",
      "11,26",
      "14,26",
      "17,26",
      "20,26",
      "23,26",
      "26,26",
      "29,26",
      "32,26",
      "35,26",
      "38,26",
      "41,26",
      "8,30",
      "11,30",
      "14,30",
      "17,30",
      "20,30",
      "23,30",
      "26,30",
      "29,30",
      "32,30",
      "35,30",
      "38,30",
      "41,30",
      "11,34",
      "14,34",
      "17,34",
      "20,34",
      "23,34",
      "26,34",
      "29,34",
      "32,34",
      "35,34",
      "38,34",
      "14,38",
      "17,38",
      "20,38",
      "23,38",
      "26,38",
      "29,38",
      "32,38",
      "35,38",
      "17,42",
      "20,42",
      "23,42",
      "26,42",
      "29,42",
    ] as string[]
  ).map((s) => s.split(",").map(Number) as [number, number]),
  // South America
  ...(
    [
      "20,50",
      "23,50",
      "26,50",
      "20,54",
      "23,54",
      "26,54",
      "29,54",
      "20,58",
      "23,58",
      "26,58",
      "29,58",
      "23,62",
      "26,62",
      "29,62",
      "23,66",
      "26,66",
      "23,70",
      "26,70",
    ] as string[]
  ).map((s) => s.split(",").map(Number) as [number, number]),
  // Europe
  ...(
    [
      "47,14",
      "50,14",
      "53,14",
      "56,14",
      "47,18",
      "50,18",
      "53,18",
      "56,18",
      "59,18",
      "47,22",
      "50,22",
      "53,22",
      "56,22",
      "59,22",
      "50,26",
      "53,26",
      "56,26",
    ] as string[]
  ).map((s) => s.split(",").map(Number) as [number, number]),
  // Africa
  ...(
    [
      "47,30",
      "50,30",
      "53,30",
      "56,30",
      "47,34",
      "50,34",
      "53,34",
      "56,34",
      "59,34",
      "47,38",
      "50,38",
      "53,38",
      "56,38",
      "59,38",
      "47,42",
      "50,42",
      "53,42",
      "56,42",
      "59,42",
      "47,46",
      "50,46",
      "53,46",
      "56,46",
      "50,50",
      "53,50",
      "56,50",
      "50,54",
      "53,54",
    ] as string[]
  ).map((s) => s.split(",").map(Number) as [number, number]),
  // Asia
  ...(
    [
      "59,10",
      "62,10",
      "65,10",
      "68,10",
      "71,10",
      "74,10",
      "77,10",
      "80,10",
      "83,10",
      "59,14",
      "62,14",
      "65,14",
      "68,14",
      "71,14",
      "74,14",
      "77,14",
      "80,14",
      "83,14",
      "86,14",
      "59,18",
      "62,18",
      "65,18",
      "68,18",
      "71,18",
      "74,18",
      "77,18",
      "80,18",
      "83,18",
      "86,18",
      "62,22",
      "65,22",
      "68,22",
      "71,22",
      "74,22",
      "77,22",
      "80,22",
      "83,22",
      "65,26",
      "68,26",
      "71,26",
      "74,26",
      "77,26",
      "80,26",
      "68,30",
      "71,30",
      "74,30",
      "77,30",
      "68,34",
      "71,34",
      "74,34",
    ] as string[]
  ).map((s) => s.split(",").map(Number) as [number, number]),
  // Australia
  ...(
    [
      "77,58",
      "80,58",
      "83,58",
      "74,62",
      "77,62",
      "80,62",
      "83,62",
      "86,62",
      "74,66",
      "77,66",
      "80,66",
      "83,66",
      "77,70",
      "80,70",
      "83,70",
    ] as string[]
  ).map((s) => s.split(",").map(Number) as [number, number]),
];

export function WorldReachSection() {
  return (
    <section className="relative w-full min-h-[140vh] overflow-hidden">
      {/* Gradient overlay: anchors to ValueProps' end color, fades to same-hue transparent — prevents dark fixed-bg bleed */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#a8c1d8] to-[#a8c1d8]/0 z-10 pointer-events-none" />

      {/* Left tree — half cropped off screen */}
      <div className="absolute -left-45 top-0 z-20 pointer-events-none h-[35%]">
        <Image
          src="/assets/branches3.avif"
          alt=""
          width={340}
          height={520}
          className="h-full w-auto object-contain object-left-top"
        />
      </div>

      {/* Right tree — half cropped off screen */}
      <div className="absolute -right-35 top-0 z-20 pointer-events-none h-[55%]">
        <Image
          src="/assets/branches4.avif"
          alt=""
          width={340}
          height={520}
          className="h-full w-auto object-contain object-right-top"
        />
      </div>

      {/* Two birds — top center, clustered together */}
      <div className="absolute top-0 left-[40%] -translate-x-1/2 z-30 pointer-events-none flex items-end gap-1">
        <Image
          src="/assets/white_bird.avif"
          alt=""
          width={110}
          height={72}
          className="object-contain"
        />
      </div>
      <div className="absolute top-20 right-[45%] -translate-x-1/2 z-30 pointer-events-none flex items-end gap-1">
        <Image
          src="/assets/white_bird_2.avif"
          alt=""
          width={110}
          height={72}
          className="object-contain"
        />
      </div>
      {/* Dotted world map — center right */}
      <div className="absolute right-[4%] top-1/2 -translate-y-[40%] z-10 pointer-events-none opacity-50">
        <svg viewBox="0 0 500 260" width="520" height="270" aria-hidden>
          {WORLD_DOTS.map(([x, y], i) => (
            <circle key={i} cx={(x / 100) * 500} cy={(y / 100) * 260} r="1.6" fill="white" />
          ))}
        </svg>
      </div>

      {/* Bottom-left text */}
      <div className="absolute bottom-100 left-20 z-30">
        <h2
          className="text-white text-4xl md:text-5xl font-light leading-snug"
          style={{ fontFamily: "var(--font-newsreader)" }}
        >
          Open data,
          <br />
          across 90+ countries
        </h2>
      </div>

      {/* Stats table — bottom of section */}
      <div className="absolute bottom-40 left-8 right-8 z-30">
        <div className="border-t border-white/30 grid grid-cols-4">
          {[
            { value: "500+", label: "Datasets submitted" },
            { value: "10k+", label: "Data points indexed" },
            { value: "2 days", label: "Average AI turnaround" },
            { value: "90+", label: "Countries covered" },
          ].map((stat, i) => (
            <div key={i} className={`px-10 py-10 ${i < 3 ? "border-r border-white/30" : ""}`}>
              <div
                className="text-white text-5xl md:text-6xl font-light mb-3"
                style={{ fontFamily: "var(--font-newsreader)" }}
              >
                {stat.value}
              </div>
              <div className="text-white/70 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/30" />
      </div>
    </section>
  );
}
