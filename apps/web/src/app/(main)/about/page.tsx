import Link from "next/link";
import { Button } from "@Poneglyph/ui/components/button";
import "../../(auth)/auth.css";
import { IconArrowRight, IconBuilding, IconUsers, IconDatabase, IconBrain } from "@tabler/icons-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background" data-accent="lime">
      {/* Hero Section */}
      <section className="border-b border-[var(--border)] py-20 text-center">
        <div className="mx-auto max-w-[1200px] px-6">
          <h1 className="font-heading font-normal text-[34px] leading-[1.1] tracking-[-0.015em] text-foreground md:text-[42px]">
            About <em className="italic" style={{ color: "color-mix(in oklch, var(--primary) 75%, var(--foreground))" }}>Poneglyph</em>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[14.5px] text-muted-foreground">
            Empowering NGOs, researchers, and journalists with AI-driven insights from survey data
            worldwide.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-heading font-normal text-[28px] leading-tight tracking-tight text-foreground">Our Mission</h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
                Poneglyph bridges the gap between raw survey data and actionable insights. We
                provide a platform where volunteers can share datasets, NGOs can access extracted
                insights, and AI agents can analyze patterns across global surveys.
              </p>
            </div>
            <div>
              <h2 className="font-heading font-normal text-[28px] leading-tight tracking-tight text-foreground">Our Vision</h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
                A world where data-driven decision making is accessible to every organization
                working for social good. We believe that quality survey data, when properly analyzed
                and shared, can transform communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-[var(--border)] bg-muted/30 py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: IconDatabase, label: "Datasets", value: "10,000+" },
              { icon: IconUsers, label: "Volunteers", value: "2,500+" },
              { icon: IconBuilding, label: "NGO Partners", value: "500+" },
              { icon: IconBrain, label: "AI Insights", value: "50,000+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                <p className="font-heading font-normal text-[30px] leading-tight text-foreground">{stat.value}</p>
                <p className="mt-1 text-[12px] text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="mb-12 text-center font-heading font-normal text-[34px] leading-[1.1] tracking-[-0.015em] text-foreground">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Volunteers Submit Data",
                description:
                  "Volunteers upload survey datasets, get ratings, and build their reputation in the community.",
              },
              {
                step: "2",
                title: "AI Extracts Insights",
                description:
                  "Our AI agents analyze datasets to extract meaningful patterns, trends, and actionable insights.",
              },
              {
                step: "3",
                title: "NGOs Access & Act",
                description:
                  "NGOs, researchers, and journalists access insights to drive impactful decision-making.",
              },
            ].map((item) => (
              <div key={item.step} className="relative rounded-[var(--radius-xl)] border border-border bg-card p-6 transition-all hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_48px_-24px_rgba(0,0,0,0.1)]">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  {item.step}
                </div>
                <h3 className="font-heading font-normal text-[22px] leading-tight tracking-tight text-foreground">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-[var(--border)] py-20 text-center">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="font-heading font-normal text-[34px] leading-[1.1] tracking-[-0.015em] text-foreground">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[14.5px] text-muted-foreground">
            Join our community of data-driven changemakers today.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/discover">
              <Button size="lg" className="h-11 px-6 text-[14px] font-semibold">
                Discover Volunteers
                <IconArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="h-11 px-6 text-[14px] font-semibold">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
