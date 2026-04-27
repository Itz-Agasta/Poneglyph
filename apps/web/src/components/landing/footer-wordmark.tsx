import Image from "next/image";
import Link from "next/link";

const NAV = [
  {
    label: "Platform",
    links: ["Datasets", "AI Insights", "Submit Data", "API"],
  },
  { label: "Company", links: ["About", "Blog", "Careers", "Partners"] },
  { label: "Legal", links: ["Privacy", "Terms", "Cookies"] },
];

export function FooterWordmark() {
  return (
    <footer className="relative w-full overflow-hidden bg-transparent">
      {/* big_tree_long — extends from above, canopy fills upper portion */}
      <div className="absolute z-50 -right-10 -top-[30vh] pointer-events-none w-[60%]">
        <Image
          src="/assets/big_tree.avif"
          alt=""
          width={900}
          height={1200}
          className="w-full h-full object-contain"
        />
      </div>
      {/* Wordmark section */}
      <div className="relative min-h-[70vh] flex items-end pb-0 overflow-hidden">
        {/* Flower bed — bottom, full width */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none flex items-end">
          <Image
            src="/assets/flower_bed_with_rocks.avif"
            alt=""
            width={1400}
            height={320}
            className="w-full h-auto object-cover object-bottom"
          />
        </div>

        {/* Yellow flowers — right side of bed */}
        <div className="absolute bottom-0 right-[5%] z-20 pointer-events-none w-48 md:w-64">
          <Image
            src="/assets/yellow_flowers.avif"
            alt=""
            width={280}
            height={200}
            className="w-full h-auto object-contain object-bottom"
          />
        </div>

        {/* Giant wordmark */}
        <div className="relative z-10 w-full overflow-hidden">
          <p
            className="text-white font-light leading-none tracking-tight select-none text-center"
            style={{
              fontFamily: "var(--font-newsreader)",
              fontSize: "clamp(80px, 11vw, 200px)",
              opacity: 0.95,
            }}
          >
            poneglyph
          </p>
        </div>
      </div>

      {/* Footer links bar */}
      <div className="relative z-40 bg-[#1a1a1a] px-8 md:px-16 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-0 justify-between">
          {/* Logo + tagline */}
          <div className="md:w-[28%]">
            <span
              className="text-white text-2xl font-light block mb-3"
              style={{ fontFamily: "var(--font-newsreader)" }}
            >
              poneglyph
            </span>
            <p className="text-white/40 text-xs leading-relaxed max-w-[200px]">
              Open survey data for NGOs, researchers, journalists, and everyone who needs it.
            </p>
          </div>

          {/* Nav columns */}
          <div className="flex gap-16 md:gap-24">
            {NAV.map((col) => (
              <div key={col.label}>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-4">{col.label}</p>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <Link
                        href="#"
                        className="text-white/70 text-sm hover:text-white transition-colors"
                      >
                        {l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Poneglyph. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">Built for the world&apos;s data explorers.</p>
        </div>
      </div>
    </footer>
  );
}
