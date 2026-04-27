"use client";

import Image from "next/image";
import { useState } from "react";

const FAQS = [
  {
    question: "Is the data really free to access?",
    answer:
      "Yes — every dataset on Poneglyph is permanently free for NGOs, researchers, journalists, and anyone who needs it. There are no paywalls, no hidden fees, and no usage limits. Our mission is open access, and that will never change.",
  },
  {
    question: "How is data quality ensured?",
    answer: "",
  },
  {
    question: "Who can submit datasets?",
    answer: "",
  },
];

function ChevronUp() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 15l-6-6-6 6" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="relative w-full bg-[#f5f0e8] py-32 px-6 md:px-16">
      {/* branch_thin — top-left, straddles junction with WorldReachSection above */}
      <div className="absolute -left-6 -top-20 z-10 pointer-events-none w-56 md:w-72">
        <Image
          src="/assets/branch_thin.avif"
          alt=""
          width={300}
          height={220}
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">
        {/* Left */}
        <div className="md:w-[38%] flex flex-col justify-start pt-2">
          <h2
            className="text-[#1a1a1a] text-4xl md:text-5xl font-light leading-tight mb-6"
            style={{ fontFamily: "var(--font-newsreader)" }}
          >
            Your questions,
            <br />
            <em style={{ fontStyle: "italic" }}>answered</em>
          </h2>
          <p className="text-[#1a1a1a]/60 text-base leading-relaxed mb-10 max-w-xs">
            Everything you need to know before exploring our datasets
          </p>
          <a
            href="/faq"
            className="inline-flex items-center gap-3 px-6 py-4 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg w-fit hover:bg-[#333] transition-colors"
          >
            See all FAQs
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Right — accordion */}
        <div className="md:w-[62%] flex flex-col">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-t border-[#1a1a1a]/15 last:border-b">
              <button
                className="w-full flex items-center justify-between py-7 text-left gap-6"
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <span
                  className="text-[#1a1a1a] text-lg md:text-xl font-light"
                  style={{ fontFamily: "var(--font-newsreader)" }}
                >
                  {faq.question}
                </span>
                <span className="shrink-0 text-[#1a1a1a]/50">
                  {open === i ? <ChevronUp /> : <ChevronDown />}
                </span>
              </button>
              {open === i && faq.answer && (
                <p className="text-[#1a1a1a]/65 text-sm md:text-base leading-relaxed pb-7">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
