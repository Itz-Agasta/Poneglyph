import Image from "next/image";
import Link from "next/link";

const POSTS = [
  {
    type: "illustration",
    tag: "News",
    title: "Poneglyph launches with 500+ open datasets for researchers worldwide",
    excerpt: "",
    href: "/blog/launch",
  },
  {
    type: "photo",
    img: "/images/pic_2_pone.png",
    tag: "Data & Research",
    title: "How AI agents are transforming field survey data into actionable insights",
    excerpt:
      "Machine learning models can now process raw NGO survey data in under 48 hours, surfacing patterns that would take analysts weeks to find. Here's how...",
    href: "/blog/ai-insights",
    featured: false,
  },
  {
    type: "photo",
    img: "/images/pic_3_pone.png",
    tag: "For NGOs",
    title: "Making the Case for Open Data in Humanitarian Response",
    excerpt:
      "Open datasets don't just accelerate research — they save lives. With timely access to verified data, the...",
    href: "/blog/open-data-humanitarian",
    featured: true,
  },
];

function IllustrationCard({ post }: { post: (typeof POSTS)[number] }) {
  return (
    <Link href={post.href} className="group flex flex-col">
      <div className="relative rounded-2xl overflow-hidden h-64 bg-gradient-to-b from-[#6b82c4] to-[#9baad4] mb-4 flex items-end p-6">
        {/* Subtle dot pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden>
          {Array.from({ length: 12 }, (_, row) =>
            Array.from({ length: 18 }, (_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={col * 28 + 14}
                cy={row * 20 + 10}
                r="1.5"
                fill="white"
              />
            )),
          )}
        </svg>
        {/* Cloud shapes */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f2c84b]/60 to-transparent rounded-b-2xl" />
        <p
          className="relative z-10 text-white text-2xl font-light leading-snug"
          style={{ fontFamily: "var(--font-newsreader)" }}
        >
          {post.title}
        </p>
      </div>
      <span className="inline-block self-start px-4 py-1.5 rounded-full bg-[#e8e2d8] text-[#1a1a1a] text-xs font-medium mb-3">
        {post.tag}
      </span>
      <p
        className="text-[#1a1a1a] text-sm font-light leading-snug"
        style={{ fontFamily: "var(--font-newsreader)" }}
      >
        {post.title}
      </p>
    </Link>
  );
}

function PhotoCard({ post }: { post: (typeof POSTS)[number] }) {
  return (
    <Link href={post.href} className="group flex flex-col">
      <div className="relative rounded-2xl overflow-hidden h-64 mb-4">
        <Image
          src={post.img!}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {post.featured && (
          <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-md flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3 13L13 3M13 3H6M13 3v7"
                stroke="#1a1a1a"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
      <span className="inline-block self-start px-4 py-1.5 rounded-full bg-[#e8e2d8] text-[#1a1a1a] text-xs font-medium mb-3">
        {post.tag}
      </span>
      <p
        className={`text-sm font-medium leading-snug mb-2 ${post.featured ? "text-[#3d52a0]" : "text-[#1a1a1a]"}`}
        style={{ fontFamily: "var(--font-newsreader)" }}
      >
        {post.title}
      </p>
      {post.excerpt && <p className="text-[#1a1a1a]/55 text-xs leading-relaxed">{post.excerpt}</p>}
    </Link>
  );
}

export function BlogPreviewSection() {
  return (
    <section className="w-full bg-[#f5f0e8] pt-8 pb-24 px-6 md:px-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex items-start justify-between mb-16">
        <div>
          <h2
            className="text-[#1a1a1a] text-4xl md:text-5xl font-light mb-3"
            style={{ fontFamily: "var(--font-newsreader)" }}
          >
            What&apos;s <em style={{ fontStyle: "italic" }}>new</em> on our blog
          </h2>
          <p className="text-[#1a1a1a]/55 text-base">
            Data stories, research insights, and platform updates.
          </p>
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-3 px-6 py-4 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg shrink-0 hover:bg-[#333] transition-colors mt-2"
        >
          See our blog
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

      {/* Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {POSTS.map((post, i) =>
          post.type === "illustration" ? (
            <IllustrationCard key={i} post={post} />
          ) : (
            <PhotoCard key={i} post={post} />
          ),
        )}
      </div>
    </section>
  );
}
