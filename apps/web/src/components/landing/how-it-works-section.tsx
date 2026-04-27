import Image from "next/image";

const CARDS = [
  {
    number: "01",
    title: "Submit your dataset",
    description:
      "Upload survey data collected in the field. Our system validates, cleans, and indexes it for global discovery.",
    stat1: { value: "500+", label: "datasets submitted" },
    stat2: { value: "90+", label: "countries covered" },
    img: "/images/pic_1_pone.png",
  },
  {
    number: "02",
    title: "AI extracts insights",
    description:
      "Dedicated AI agents analyze your data, surface patterns, flag anomalies, and generate readable reports.",
    stat1: { value: "10+", label: "AI analysis models" },
    stat2: { value: "24hr", label: "average turnaround" },
    img: "/images/pic_2_pone.png",
  },
  {
    number: "03",
    title: "Access & collaborate",
    description:
      "NGOs, researchers, and journalists discover verified datasets — always free, always open.",
    stat1: { value: "98%", label: "data accuracy rate" },
    stat2: { value: "Free", label: "forever, for all" },
    img: "/images/pic_3_pone.png",
  },
];

function FeatureCard({ card }: { card: (typeof CARDS)[number] }) {
  return (
    <div className="relative rounded-2xl overflow-hidden h-[520px] flex flex-col justify-between">
      {/* Photo */}
      <Image src={card.img} alt={card.title} fill className="object-cover" />

      {/* Gradient overlay — dark at top and bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/75 pointer-events-none" />

      {/* Top row: title left, number center-right */}
      <div className="relative z-10 flex flex-col items-start justify-between p-6 gap-4">
        <span className="w-full text-white text-center text-sm font-newsreader tracking-widest shrink-0 mt-1">
          {card.number}
        </span>
        <h3
          className="w-full text-center text-white text-2xl md:text-3xl font-light leading-tight"
          style={{ fontFamily: "var(--font-newsreader)" }}
        >
          {card.title}
        </h3>
      </div>

      {/* Description + stats — bottom */}
      <div className="relative z-10 p-6 space-y-5">
        <p className="text-white/75 text-sm leading-relaxed">{card.description}</p>
        <div className="flex gap-8">
          <div>
            <div className="text-white font-semibold text-xl">{card.stat1.value}</div>
            <div className="text-white/50 text-xs mt-0.5">{card.stat1.label}</div>
          </div>
          <div>
            <div className="text-white font-semibold text-xl">{card.stat2.value}</div>
            <div className="text-white/50 text-xs mt-0.5">{card.stat2.label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="w-full py-24 px-4 bg-gradient-to-b from-transparent to-[#e8eef5]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-6xl font-light text-[#1a2535] tracking-tight"
            style={{ fontFamily: "var(--font-newsreader)" }}
          >
            How Poneglyph{" "}
            <em className="not-italic font-normal text-[#5C72B8]" style={{ fontStyle: "italic" }}>
              works
            </em>
          </h2>
          <p className="mt-4 text-[#1a2535]/60 text-base md:text-lg max-w-xl mx-auto">
            From raw field data to actionable insights — open to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CARDS.map((card) => (
            <FeatureCard key={card.number} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
