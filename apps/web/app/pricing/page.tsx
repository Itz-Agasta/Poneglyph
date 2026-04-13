import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const plans = [
  {
    name: "Volunteer",
    price: "Free",
    period: "",
    description: "For individuals who want to contribute their skills to meaningful causes.",
    cta: "Sign up free",
    ctaHref: "/contact",
    highlighted: false,
    features: [
      "Personalized opportunity matching",
      "Skill profile & portfolio",
      "Activity log & impact report",
      "Connect with up to 5 NGOs",
      "Community access",
    ],
  },
  {
    name: "NGO",
    price: "$49",
    period: "/mo",
    description: "For small and mid-size NGOs that need AI-powered volunteer coordination.",
    cta: "Start free trial",
    ctaHref: "/contact",
    highlighted: true,
    features: [
      "Up to 500 volunteers",
      "AI matching engine",
      "Real-time analytics dashboard",
      "Custom project workflows",
      "Data export & reporting",
      "Priority support",
      "Integrations (Slack, Notion, Airtable…)",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large NGOs and networks coordinating thousands of volunteers globally.",
    cta: "Talk to us",
    ctaHref: "/contact",
    highlighted: false,
    features: [
      "Unlimited volunteers",
      "Multi-organization coordination",
      "Custom AI model fine-tuning",
      "Dedicated account manager",
      "Custom SLA & contracts",
      "SSO & advanced access control",
      "White-label option",
    ],
  },
];

const faqs = [
  {
    q: "Is there a free trial for NGO plans?",
    a: "Yes — all NGO plans include a 14-day free trial with no credit card required.",
  },
  {
    q: "Can volunteers use Poneglyph for free?",
    a: "Always. The volunteer tier is completely free and will stay that way.",
  },
  {
    q: "How does volunteer matching work?",
    a: "Our AI analyzes volunteer skills, availability, and location alongside NGO project requirements to surface the best-fit matches in real time.",
  },
  {
    q: "Is our data secure?",
    a: "Yes. Poneglyph is SOC 2 Type II certified and GDPR compliant. All data is encrypted at rest and in transit.",
  },
  {
    q: "Can we export our impact data?",
    a: "Absolutely. NGO plans include full data export in CSV, JSON, and PDF report formats.",
  },
];

export default function PricingPage() {
  return (
    <>
      <Navigation />
      {/* ── Hero ── */}
      <section className="py-24 text-center">
        <div className="container-max flex flex-col items-center gap-6">
          <p className="text-sub font-medium uppercase tracking-widest text-grey-1">pricing</p>
          <h1 className="text-[clamp(40px,6vw,60px)] font-medium leading-tight tracking-tight text-black max-w-xl">
            Transparent pricing. Always free for volunteers.
          </h1>
          <p className="text-body text-grey-1 max-w-md">
            NGOs pay only for what they use. Volunteers never pay. Impact at every scale.
          </p>
        </div>
      </section>

      {/* ── Plans ── */}
      <section className="pb-24">
        <div className="container-max grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col gap-6 p-8 rounded-2xl border ${
                plan.highlighted
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-grey-3"
              }`}
            >
              <div className="flex flex-col gap-2">
                <p
                  className={`text-sub font-medium uppercase tracking-widest ${
                    plan.highlighted ? "text-grey-2" : "text-grey-1"
                  }`}
                >
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-[42px] font-semibold leading-none">{plan.price}</span>
                  {plan.period && (
                    <span className={`text-sm ${plan.highlighted ? "text-grey-2" : "text-grey-1"}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${plan.highlighted ? "text-grey-2" : "text-grey-1"}`}>
                  {plan.description}
                </p>
              </div>

              <Link
                href={plan.ctaHref}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  plan.highlighted
                    ? "bg-primary text-black hover:bg-primary/80"
                    : "bg-black text-white hover:bg-black/80"
                }`}
              >
                {plan.cta} <ArrowRight size={14} />
              </Link>

              <div className={`border-t ${plan.highlighted ? "border-white/10" : "border-grey-3"} pt-6 flex flex-col gap-3`}>
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check
                      size={14}
                      className={`shrink-0 mt-0.5 ${plan.highlighted ? "text-primary" : "text-success"}`}
                    />
                    <span className={plan.highlighted ? "text-grey-2" : "text-grey-1"}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-24 bg-grey-4">
        <div className="container-max flex flex-col gap-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sub font-medium uppercase tracking-widest text-grey-1">faqs</p>
            <h2 className="text-[clamp(28px,4vw,40px)] font-medium leading-tight tracking-tight text-black">
              Common questions
            </h2>
          </div>
          <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white border border-grey-3 rounded-2xl p-6 flex flex-col gap-3">
                <p className="text-base font-medium text-black">{faq.q}</p>
                <p className="text-sm text-grey-1 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-4">
        <div className="max-w-container mx-auto">
          <div className="relative bg-black rounded-2xl px-8 py-20 flex flex-col items-center gap-8 overflow-hidden text-center">
            <div className="absolute inset-0 dots-pattern pointer-events-none" aria-hidden />
            <p className="text-sub font-medium uppercase tracking-widest text-grey-2 relative z-10">get started today</p>
            <h2 className="text-[clamp(36px,5vw,60px)] font-medium leading-tight tracking-tight text-white relative z-10 max-w-xl">
              Match volunteers to missions. Start free.
            </h2>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-medium rounded-xl hover:bg-primary/80 transition-colors relative z-10"
            >
              Get early access <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
