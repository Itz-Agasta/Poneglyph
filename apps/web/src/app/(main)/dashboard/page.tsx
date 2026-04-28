"use client";

import "./dashboard.css";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArticleCard, type Article } from "./components/article-card";
import { Button } from "@Poneglyph/ui/components/button";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMail,
  IconPhone,
  IconArrowRight,
  IconChartBar,
  IconWorld,
  IconDatabase,
} from "@tabler/icons-react";

const ARTICLE_CATEGORIES: Record<string, string> = {
  "1": "Health",
  "2": "Education",
  "3": "Climate",
  "4": "Economics",
  "5": "Health",
  "6": "Society",
  "7": "Employment",
  "8": "Technology",
  "9": "Food & Agriculture",
};

const ARTICLE_DATES: Record<string, string> = {
  "1": "Apr 14, 2026",
  "2": "Apr 10, 2026",
  "3": "Apr 8, 2026",
  "4": "Apr 5, 2026",
  "5": "Apr 2, 2026",
  "6": "Mar 28, 2026",
  "7": "Mar 22, 2026",
  "8": "Mar 18, 2026",
  "9": "Mar 11, 2026",
};

const sampleArticles: Article[] = [
  {
    id: "1",
    heading: "Global Health Trends 2024",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=500&fit=crop",
    content:
      "Analysis of health survey data across 50 countries showing emerging health patterns and disease prevalence across age groups.",
    datasetIds: ["DS-001", "DS-002"],
  },
  {
    id: "2",
    heading: "Education Access Report",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da1a496d?w=800&h=500&fit=crop",
    content:
      "Insights on educational opportunities in developing regions based on collected survey data spanning 30 nations.",
    datasetIds: ["DS-003"],
  },
  {
    id: "3",
    heading: "Climate Impact Survey",
    imageUrl: "https://images.unsplash.com/photo-1569163139599-0f4517e36b51?w=800&h=500&fit=crop",
    content:
      "Data-driven analysis of climate change effects on local communities and agriculture across equatorial regions.",
    datasetIds: ["DS-004", "DS-005", "DS-006"],
  },
  {
    id: "4",
    heading: "Poverty Alleviation Progress",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=500&fit=crop",
    content: "Tracking poverty indicators over the past decade using aggregated survey datasets.",
    datasetIds: ["DS-007"],
  },
  {
    id: "5",
    heading: "Water Sanitation Study",
    imageUrl: "https://images.unsplash.com/photo-1541976590-713941481591?w=800&h=500&fit=crop",
    content: "Survey results on water and sanitation access in rural areas of developing nations.",
    datasetIds: ["DS-008", "DS-009"],
  },
  {
    id: "6",
    heading: "Gender Equality Index",
    imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop",
    content:
      "Comprehensive gender equality metrics derived from multiple survey sources worldwide.",
    datasetIds: ["DS-010"],
  },
  {
    id: "7",
    heading: "Youth Employment Survey",
    imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=500&fit=crop",
    content: "Analysis of youth unemployment rates and employment trends across major economies.",
    datasetIds: ["DS-011"],
  },
  {
    id: "8",
    heading: "Digital Inclusion Report",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=500&fit=crop",
    content: "Measuring digital literacy and internet access in underserved communities globally.",
    datasetIds: ["DS-012", "DS-013"],
  },
  {
    id: "9",
    heading: "Food Security Analysis",
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=500&fit=crop",
    content: "Comprehensive study on food accessibility and nutrition across different regions.",
    datasetIds: ["DS-014"],
  },
];

const ALL_TOPICS = ["All", ...Array.from(new Set(Object.values(ARTICLE_CATEGORIES)))];
const CAROUSEL_VISIBLE = 3;
const ITEMS_PER_PAGE = 3;
const CARD_W = 680;
const CARD_GAP = 20;

export default function Dashboard() {
  const [peekIndex, setPeekIndex] = useState(0);
  const [carouselStart, setCarouselStart] = useState(0);
  const [carouselFading, setCarouselFading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTopic, setSelectedTopic] = useState("All");

  // ── Peek carousel ──────────────────────────────────────
  const peekMax = sampleArticles.length - 1;
  const peekTranslate = `calc(50vw - ${CARD_W / 2}px - ${peekIndex * (CARD_W + CARD_GAP)}px)`;

  // ── Section carousel ───────────────────────────────────
  const canPrev = carouselStart > 0;
  const canNext = carouselStart < sampleArticles.length - CAROUSEL_VISIBLE;
  const carouselArticles = sampleArticles.slice(carouselStart, carouselStart + CAROUSEL_VISIBLE);

  const shiftCarousel = (dir: "prev" | "next") => {
    if (carouselFading) return;
    if (dir === "prev" && !canPrev) return;
    if (dir === "next" && !canNext) return;
    setCarouselFading(true);
    setTimeout(() => {
      setCarouselStart((s) => s + (dir === "next" ? 1 : -1));
      setCarouselFading(false);
    }, 200);
  };

  // ── Grid ───────────────────────────────────────────────
  const filteredArticles = useMemo(() => {
    if (selectedTopic === "All") return sampleArticles;
    return sampleArticles.filter((a) => ARTICLE_CATEGORIES[a.id] === selectedTopic);
  }, [selectedTopic]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background font-sans tracking-normal">
      {/* ── HERO: centered heading + peek carousel ─────── */}
      <section className="dash-hero border-b border-border pb-0 pt-16">
        <div className="mx-auto max-w-[1200px] px-6 text-center">
          <p className="dash-overline justify-center">Trending Statistics</p>
          <h1 className="dash-title mx-auto max-w-3xl text-center">
            Get facts and insights on <em>topics that matter</em>
          </h1>
          <p className="mx-auto mb-14 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            AI-powered insights from survey datasets worldwide — built for NGOs, researchers, and
            journalists.
          </p>
        </div>

        {/* Peek carousel */}
        <div className="peek-stage">
          {/* Track */}
          <div className="peek-track" style={{ transform: `translateX(${peekTranslate})` }}>
            {sampleArticles.map((article) => (
              <Link key={article.id} href={`/dashboard/${article.id}`} className="peek-card">
                <div className="peek-card-image">
                  <img src={article.imageUrl} alt={article.heading} />
                </div>
                <div className="peek-card-content">
                  <p className="peek-meta">
                    <span>{ARTICLE_DATES[article.id]}</span>
                    <span className="peek-meta-sep">|</span>
                    <span>{ARTICLE_CATEGORIES[article.id]}</span>
                  </p>
                  <p className="peek-title">{article.heading}</p>
                  <p className="peek-desc">{article.content}</p>
                  <span className="peek-read-more">
                    <IconArrowRight className="size-4" />
                    Read more
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Nav arrows — sit over partial side cards */}
          <button
            className="peek-nav peek-nav-prev"
            disabled={peekIndex === 0}
            onClick={() => setPeekIndex((i) => Math.max(0, i - 1))}
            aria-label="Previous"
          >
            <IconChevronLeft className="size-5" />
          </button>
          <button
            className="peek-nav peek-nav-next"
            disabled={peekIndex === peekMax}
            onClick={() => setPeekIndex((i) => Math.min(peekMax, i + 1))}
            aria-label="Next"
          >
            <IconChevronRight className="size-5" />
          </button>

          {/* Dots */}
          <div className="peek-dots">
            {sampleArticles.map((_, i) => (
              <button
                key={i}
                className="peek-dot"
                data-active={i === peekIndex ? "true" : "false"}
                onClick={() => setPeekIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────── */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-3 divide-x divide-border py-8">
            {(
              [
                { icon: IconChartBar, value: "340+", label: "Published reports" },
                { icon: IconDatabase, value: "1,200+", label: "Survey datasets" },
                { icon: IconWorld, value: "80", label: "Countries covered" },
              ] as const
            ).map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 px-6 text-center">
                <Icon className="mb-1 size-4 text-muted-foreground" />
                <span className="dash-stat-value">{value}</span>
                <span className="dash-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURED CAROUSEL ────────────────────────────── */}
      <section className="border-b border-border py-14">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="dash-section-label">Featured</p>
              <h2 className="dash-section-title">
                Latest <em>reports</em>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => shiftCarousel("prev")}
                disabled={!canPrev}
                className="flex size-8 items-center justify-center rounded-full border border-border bg-background shadow-sm transition hover:bg-muted disabled:pointer-events-none disabled:opacity-25"
              >
                <IconChevronLeft className="size-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => shiftCarousel("next")}
                disabled={!canNext}
                className="flex size-8 items-center justify-center rounded-full border border-border bg-background shadow-sm transition hover:bg-muted disabled:pointer-events-none disabled:opacity-25"
              >
                <IconChevronRight className="size-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div
            className={`grid grid-cols-3 gap-5 transition-opacity duration-200 ${
              carouselFading ? "opacity-0" : "opacity-100"
            }`}
          >
            {carouselArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                category={ARTICLE_CATEGORIES[article.id]}
                isPreview={article.datasetIds.length === 1}
                variant="carousel"
              />
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-1.5">
            {Array.from({ length: sampleArticles.length - CAROUSEL_VISIBLE + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselStart(i)}
                className={`size-1.5 rounded-full transition-colors ${
                  i === carouselStart ? "bg-foreground" : "bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── TOPIC FILTER ─────────────────────────────────── */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex items-center gap-3 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
              <span>Topics</span>
              <IconChevronRight className="size-3" />
            </div>
            <div className="flex shrink-0 gap-1.5">
              {ALL_TOPICS.map((topic) => (
                <Button
                  key={topic}
                  variant={selectedTopic === topic ? "default" : "outline"}
                  size="xs"
                  onClick={() => handleTopicChange(topic)}
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ARTICLE GRID ─────────────────────────────────── */}
      <section className="py-14">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-8">
            <p className="dash-section-label">Browse</p>
            <h2 className="dash-section-title">
              All <em>reports</em>
            </h2>
          </div>

          {paginatedArticles.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  category={ARTICLE_CATEGORIES[article.id]}
                  isPreview={article.datasetIds.length === 1}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-body-sm text-muted-foreground">No reports in this topic.</p>
              <Button
                variant="link"
                size="sm"
                onClick={() => handleTopicChange("All")}
                className="mt-2"
              >
                View all
              </Button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <button
                onClick={() => currentPage > 1 && setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="flex size-8 items-center justify-center rounded-sm border border-border text-muted-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-30"
              >
                <IconChevronLeft className="size-4" />
              </button>
              <span className="min-w-12 text-center text-body-sm font-medium tabular-nums text-foreground">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => currentPage < totalPages && setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className="flex size-8 items-center justify-center rounded-sm border border-border text-muted-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-30"
              >
                <IconChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────── */}
      <section className="border-t border-border bg-muted py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-14 text-center">
            <p className="dash-section-label mx-auto w-fit">Contact</p>
            <h2 className="dash-contact-heading mt-2">
              Get in touch with us. <em>We are happy to help.</em>
            </h2>
          </div>

          <div className="grid gap-16 md:grid-cols-2">
            <div>
              <p className="mb-2 text-body-sm font-medium text-foreground">
                Do you still have questions?
              </p>
              <p className="max-w-sm text-body-sm leading-relaxed text-muted-foreground">
                Feel free to contact us anytime using our{" "}
                <a
                  href="#"
                  className="text-foreground underline underline-offset-2 transition-opacity hover:opacity-75"
                >
                  contact form
                </a>{" "}
                or visit our{" "}
                <a
                  href="#"
                  className="text-foreground underline underline-offset-2 transition-opacity hover:opacity-75"
                >
                  FAQ page
                </a>
                .
              </p>
            </div>

            <div>
              <p className="mb-4 text-body-sm font-medium text-foreground">
                Your contact to the Insights Newsroom
              </p>
              <div className="flex items-start gap-4">
                <img
                  src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face"
                  alt="Dr. Amara Osei"
                  className="size-14 shrink-0 rounded-full object-cover"
                />
                <div>
                  <p className="text-body-sm font-medium text-foreground">Dr. Amara Osei</p>
                  <p className="mb-3 text-body-sm text-muted-foreground">Lead Data Journalist</p>
                  <a
                    href="mailto:a.osei@poneglyph.org"
                    className="mb-1 flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <IconMail className="size-3.5 shrink-0" />
                    a.osei@poneglyph.org
                  </a>
                  <a
                    href="tel:+15552848810"
                    className="flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <IconPhone className="size-3.5 shrink-0" />
                    +1 (555) 284-8810
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-border bg-background py-8">
        <div className="mx-auto max-w-[1200px] px-6">
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              "Home",
              "About Poneglyph",
              "Career",
              "Contact",
              "Help & FAQ",
              "Report Bug",
              "Privacy",
              "Terms",
            ].map((link) => (
              <a
                key={link}
                href="#"
                className="text-body-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
