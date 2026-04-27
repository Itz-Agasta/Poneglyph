import Image from "next/image";

const PROPS = [
  {
    img: "/assets/bird2.avif",
    imgAlt: "Two geese flying",
    imgWidth: 320,
    imgHeight: 220,
    title: "Community-driven datasets",
    description:
      "Thousands of survey datasets submitted by verified volunteers and NGOs — curated, clean, and ready to explore.",
  },
  {
    img: "/assets/butterfly.avif",
    imgAlt: "Butterfly",
    imgWidth: 260,
    imgHeight: 220,
    title: "Always current",
    description:
      "Datasets are continuously validated and enriched by our AI pipeline, so the data you access is never stale.",
  },
  {
    img: "/assets/swan.avif",
    imgAlt: "Swan",
    imgWidth: 300,
    imgHeight: 220,
    title: "Free, forever",
    description:
      "Every dataset, every insight — permanently free for NGOs, researchers, journalists, and anyone who needs it.",
  },
];

export function ValuePropsSection() {
  return (
    <section className="w-full py-24 px-4 bg-gradient-to-b from-[#f0ebe3] via-[#f0ebe3] via-50% to-[#a8c1d8]">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2
          className="text-center text-4xl md:text-6xl text-[#1a2535] tracking-tight mb-20"
          style={{ fontFamily: "var(--font-newsreader)", fontWeight: 300 }}
        >
          <em className="text-[#3d52a0] not-italic" style={{ fontStyle: "italic" }}>
            Open
          </em>{" "}
          data, built for impact
        </h2>

        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {PROPS.map((p) => (
            <div key={p.title} className="flex flex-col items-center text-center">
              {/* Illustration */}
              <div className="h-52 flex items-end justify-center mb-8">
                <Image
                  src={p.img}
                  alt={p.imgAlt}
                  width={p.imgWidth}
                  height={p.imgHeight}
                  className="object-contain max-h-52 w-auto"
                />
              </div>

              {/* Text */}
              <h3
                className="text-[#1a2535] text-lg font-semibold mb-3"
                style={{ fontFamily: "var(--font-newsreader)" }}
              >
                {p.title}
              </h3>
              <p className="text-[#1a2535]/55 text-sm leading-relaxed max-w-[260px]">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
