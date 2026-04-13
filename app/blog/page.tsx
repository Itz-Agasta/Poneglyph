import Link from "next/link";
import { ArrowRight } from "lucide-react";

const posts = [
  {
    slug: "announcing-our-seed-round",
    tag: "Company",
    title: "Announcing our $2.1M Seed Round: Building the coordination layer for humanitarian work",
    excerpt: "We are thrilled to announce that Poneglyph has raised $2.1M in seed funding to accelerate AI-powered volunteer matching for NGOs globally.",
    date: "Mar 10, 2025",
    readTime: "4 min read",
    size: "large",
  },
  {
    slug: "volunteer-matching-guide",
    tag: "Guide",
    title: "The complete guide to volunteer matching in 2025",
    excerpt: "From skill mapping to retention — everything NGOs need to know before building their first volunteer program.",
    date: "Feb 24, 2025",
    readTime: "8 min read",
    size: "small",
  },
  {
    slug: "ai-in-ngos",
    tag: "Product",
    title: "How AI is transforming resource allocation for NGOs",
    excerpt: "AI-powered matching, impact analytics, and sub-agents are changing what it means to coordinate volunteers at scale.",
    date: "Feb 10, 2025",
    readTime: "5 min read",
    size: "small",
  },
  {
    slug: "impact-measurement-101",
    tag: "Impact",
    title: "Impact measurement 101: What every NGO needs to track",
    excerpt: "Navigate the complexities of measuring real-world impact with our beginner-friendly breakdown.",
    date: "Jan 28, 2025",
    readTime: "6 min read",
    size: "medium",
  },
  {
    slug: "volunteer-retention",
    tag: "Community",
    title: "5 ways to retain volunteers for the long haul",
    excerpt: "Great volunteer retention does not happen by accident. Here are the practices top NGOs swear by.",
    date: "Jan 15, 2025",
    readTime: "4 min read",
    size: "medium",
  },
];

function BlogCard({ post }: { post: typeof posts[0] }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col gap-4 bg-white border border-grey-3 rounded-2xl overflow-hidden hover:border-grey-2 transition-colors"
    >
      <div className="w-full aspect-video bg-grey-4" />
      <div className="flex flex-col gap-3 p-5 pb-6">
        <span className="text-[10px] font-medium uppercase tracking-widest text-grey-1 bg-grey-4 px-2 py-1 rounded-full w-fit">
          {post.tag}
        </span>
        <h3 className="text-base font-medium text-black leading-snug group-hover:text-grey-1 transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-grey-1 leading-relaxed">{post.excerpt}</p>
        <div className="flex items-center gap-2 text-xs text-grey-2 mt-1">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <>
      {/* ── Hero ── */}
      <section className="py-16 border-b border-grey-3">
        <div className="container-max flex flex-col items-center gap-4 text-center">
          <p className="text-sub font-medium uppercase tracking-widest text-grey-1">blog</p>
          <h1 className="text-[clamp(36px,5vw,56px)] font-medium leading-tight tracking-tight text-black">
            Stories, guides &amp; impact updates
          </h1>
        </div>
      </section>

      {/* ── Featured post ── */}
      <section className="py-16 bg-white">
        <div className="container-max">
          <Link
            href={`/blog/${featured.slug}`}
            className="group flex flex-col md:flex-row gap-8 bg-white border border-grey-3 rounded-2xl overflow-hidden hover:border-grey-2 transition-colors"
          >
            <div className="md:w-1/2 aspect-video md:aspect-auto bg-grey-4 min-h-[240px]" />
            <div className="flex flex-col justify-center gap-4 p-8">
              <span className="text-[10px] font-medium uppercase tracking-widest text-grey-1 bg-grey-4 px-2 py-1 rounded-full w-fit">
                {featured.tag}
              </span>
              <h2 className="text-[clamp(22px,3vw,32px)] font-medium leading-snug text-black group-hover:text-grey-1 transition-colors">
                {featured.title}
              </h2>
              <p className="text-body text-grey-1">{featured.excerpt}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-grey-2">{featured.date} · {featured.readTime}</span>
                <span className="flex items-center gap-1 text-sm font-medium text-black group-hover:gap-2 transition-all">
                  Read more <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Post grid ── */}
      <section className="pb-24 bg-white">
        <div className="container-max grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rest.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
