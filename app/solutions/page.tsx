import Link from "next/link";
import { ArrowRight, Heart, Globe, Building2 } from "lucide-react";

const solutions = [
  {
    icon: Heart,
    audience: "Volunteers",
    title: "Find missions that match your skills and schedule",
    description: "Create your profile once. Our AI continuously surfaces NGO opportunities that fit your expertise, availability, and location — so your time goes exactly where it matters most.",
    cta: "Join free",
    href: "/pricing",
  },
  {
    icon: Building2,
    audience: "Small NGOs",
    title: "Staff your programs without the spreadsheet chaos",
    description: "Stop manually tracking who's available and for what. Poneglyph's matching engine builds your volunteer roster for you — so you can focus on your mission, not logistics.",
    cta: "Start trial",
    href: "/pricing",
  },
  {
    icon: Globe,
    audience: "Large NGOs",
    title: "Coordinate thousands of volunteers across regions",
    description: "Multi-program coordination, cross-organization data sharing, and AI-powered impact analytics — Poneglyph gives large humanitarian networks the infrastructure they need.",
    cta: "Talk to us",
    href: "/contact",
  },
];

const useCases = [
  {
    title: "Disaster response staffing",
    description: "Quickly surface and deploy volunteers with the right skills when emergencies strike — in hours, not days.",
  },
  {
    title: "Ongoing program resourcing",
    description: "Keep recurring programs staffed by automatically re-matching volunteers as availability changes.",
  },
  {
    title: "Cross-NGO collaboration",
    description: "Share volunteer pools with partner organizations to cover joint programs without duplication.",
  },
  {
    title: "Impact reporting",
    description: "Automatically aggregate volunteer hours, regional reach, and program outcomes into board-ready reports.",
  },
  {
    title: "Skill gap analysis",
    description: "Identify which skills your programs are chronically short of — and proactively recruit for them.",
  },
  {
    title: "Volunteer retention",
    description: "Track engagement patterns and flag volunteers at risk of dropping off before they do.",
  },
];

export default function SolutionsPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 dots-pattern pointer-events-none" aria-hidden />
        <div className="container-max flex flex-col items-center gap-6 text-center relative z-10">
          <p className="text-sub font-medium uppercase tracking-widest text-grey-1">solutions</p>
          <h1 className="text-[clamp(40px,6vw,64px)] font-medium leading-tight tracking-tight text-black max-w-2xl">
            Built for every side of the resource allocation problem
          </h1>
          <p className="text-body text-grey-1 max-w-md">
            Whether you are a volunteer looking for purpose or an NGO scaling impact — Poneglyph is built for you.
          </p>
        </div>
      </section>

      {/* ── Solution Cards ── */}
      <section className="py-24 bg-white">
        <div className="container-max grid grid-cols-1 md:grid-cols-3 gap-6">
          {solutions.map((s) => (
            <div key={s.audience} className="flex flex-col gap-6 p-8 bg-grey-4 border border-grey-3 rounded-2xl">
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 bg-white border border-grey-3 rounded-xl flex items-center justify-center">
                  <s.icon size={20} className="text-black" />
                </div>
                <p className="text-sub font-medium uppercase tracking-widest text-grey-1">{s.audience}</p>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <h2 className="text-xl font-medium text-black leading-snug">{s.title}</h2>
                <p className="text-sm text-grey-1 leading-relaxed flex-1">{s.description}</p>
              </div>
              <Link
                href={s.href}
                className="flex items-center gap-2 text-sm font-medium text-black hover:text-grey-1 transition-colors"
              >
                {s.cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="py-24 bg-grey-4">
        <div className="container-max flex flex-col gap-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sub font-medium uppercase tracking-widest text-grey-1">use cases</p>
            <h2 className="text-[clamp(28px,4vw,40px)] font-medium leading-tight tracking-tight text-black">
              What NGOs use Poneglyph for
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((uc) => (
              <div key={uc.title} className="flex flex-col gap-3 p-6 bg-white border border-grey-3 rounded-2xl">
                <h3 className="text-base font-medium text-black">{uc.title}</h3>
                <p className="text-sm text-grey-1 leading-relaxed">{uc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-container mx-auto">
          <div className="relative bg-black rounded-2xl px-8 py-20 flex flex-col items-center gap-8 overflow-hidden text-center">
            <div className="absolute inset-0 dots-pattern pointer-events-none" aria-hidden />
            <p className="text-sub font-medium uppercase tracking-widest text-grey-2 relative z-10">ready to start?</p>
            <h2 className="text-[clamp(36px,5vw,60px)] font-medium leading-tight tracking-tight text-white relative z-10 max-w-xl">
              Find the right plan for your organization
            </h2>
            <div className="flex items-center gap-3 relative z-10">
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-medium rounded-xl hover:bg-primary/80 transition-colors"
              >
                View pricing <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
