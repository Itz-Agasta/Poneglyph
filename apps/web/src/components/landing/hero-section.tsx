"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const BIRDS: { src: string; className: string; zIndex: number }[] = [
  {
    src: "/assets/bird1.avif",
    className: "absolute top-[20%] right-[25%] w-18 md:w-34",
    zIndex: 10,
  },
  {
    src: "/assets/bird3.avif",
    className: "absolute top-[35%] right-[10%] w-22 md:w-42",
    zIndex: 20,
  },
  {
    src: "/assets/bird2.avif",
    className: "top-[60%] right-[20%] w-22 md:w-42",
    zIndex: 30,
  },
  {
    src: "/assets/bird3.avif",
    className: "top-[75%] right-[40%] w-24 md:w-46",
    zIndex: 20,
  },
  {
    src: "/assets/bird2.avif",
    className: "top-[90%] left-[20%] w-26 md:w-52",
    zIndex: 30,
  },
];

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const cloudRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      gsap.set(cloudRef.current, {
        y: "50%",
        scale: 1.5,
        transformOrigin: "bottom center",
      });
      gsap.fromTo(
        cloudRef.current,
        { x: "-130%" },
        { x: "-30%", duration: 2.5, ease: "power1.out", delay: 0.5 },
      );
    },
    { scope: containerRef },
  );

  return (
    // No overflow-hidden — birds and cloud bleed into the next section intentionally
    <section ref={containerRef} className="relative w-full h-screen">
      {/* Hero text */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center pt-14">
        <h1
          className="text-5xl md:text-7xl lg:text-[5.5rem] text-white text-center leading-[1.1] tracking-tight"
          style={{ fontFamily: "var(--font-newsreader)" }}
        >
          Navigating survey data
          <br />
          is <em>hard.</em>
        </h1>

        <p
          className="mt-6 text-lg md:text-xl text-white/90 text-center leading-relaxed"
          style={{ fontFamily: "var(--font-newsreader)" }}
        >
          Imagine an AI surfacing insights for you —
          <br />
          <em>instantly, for free.</em>
        </p>

        <Link
          href="/datasets"
          className="mt-10 px-7 py-3.5 bg-white text-black rounded-full font-medium text-base flex items-center gap-3 hover:bg-white/90 transition-colors shadow-sm"
        >
          Explore datasets
          <ArrowRight />
        </Link>
      </div>

      {/* Bird layer — no bottom constraint so birds beyond 100% overflow naturally */}
      <div className="absolute inset-0 pointer-events-none">
        {BIRDS.map((bird, i) => (
          <Image
            key={i}
            src={bird.src}
            alt=""
            width={220}
            height={220}
            className={`absolute object-contain ${bird.className}`}
            style={{ zIndex: bird.zIndex }}
          />
        ))}
      </div>

      {/* Big cloud slides in from left, sits half below hero boundary */}
      <img
        ref={cloudRef}
        src="/assets/cloud_big.avif"
        alt=""
        className="absolute bottom-0 left-0 w-full object-cover pointer-events-none"
        style={{
          zIndex: 1,
          transform: "translateX(-130%) translateY(50%) scale(1.5)",
          transformOrigin: "bottom center",
        }}
      />
    </section>
  );
}
