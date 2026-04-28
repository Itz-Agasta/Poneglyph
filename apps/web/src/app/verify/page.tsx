"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./verify.module.css";
import { authClient } from "../../lib/auth-client";

export default function VerifyPage() {
  const sealRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
    if (!sealRef.current) return;

    const seal = sealRef.current;

    // Clean up existing specks if it re-runs in dev mode
    const existingSpecks = seal.querySelectorAll(`.${styles.speck}`);
    existingSpecks.forEach((s) => s.remove());

    const colors = [
      "var(--primary)",
      "color-mix(in oklch, var(--primary) 60%, white)",
      "var(--foreground)",
    ];

    for (let i = 0; i < 14; i++) {
      const s = document.createElement("span");
      s.className = styles.speck;
      const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const dist = 60 + Math.random() * 40;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      const w = 4 + Math.random() * 4;
      const h = 2 + Math.random() * 2;

      s.style.width = w + "px";
      s.style.height = h + "px";
      s.style.left = "50%";
      s.style.top = "50%";
      s.style.background = colors[i % colors.length];
      s.style.setProperty("--end", `translate(${x}px, ${y}px)`);
      s.style.animationDelay = 400 + Math.random() * 200 + "ms";

      seal.appendChild(s);
    }
  }, []);

  const now = new Date();
  const timestamp = mounted
    ? now.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className={styles.verifyWrapper}>
      <main className={styles.stage}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>P</div>
          <div className={styles.brandName}>Poneglyph</div>
        </div>

        <div className={styles.card}>
          <div className={styles.seal} ref={sealRef}>
            <div className={styles.sealRing}></div>
            <div className={`${styles.sealRing} ${styles.sealRingInner}`}></div>
            <div className={styles.sealDisc}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m5 12 5 5L20 7" />
              </svg>
            </div>
          </div>

          <h1>
            Email <em>verified</em>
          </h1>
          <p className={styles.lede}>
            Your email
            <span className={styles.emailChip}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m5 12 5 5L20 7" />
              </svg>
              {isPending ? (
                <span style={{ opacity: 0.5 }}>Loading...</span>
              ) : (
                <a href={`mailto:${session?.user?.email || "you@example.com"}`}>
                  {session?.user?.email || "you@example.com"}
                </a>
              )}
            </span>
            is confirmed. The archive is open — you can sign in and start charting.
          </p>

          <div className={styles.meta}>
            <div className={styles.metaCell}>
              <div className={styles.metaLabel}>Status</div>
              <div className={styles.metaValue}>
                <span className={styles.dot}></span> Verified
              </div>
            </div>
            <div className={styles.metaCell}>
              <div className={styles.metaLabel}>Verified at</div>
              <div className={styles.metaValue}>{timestamp}</div>
            </div>
          </div>

          <div className={styles.actions}>
            <Link className={styles.btn} href="/sign-in">
              Continue to sign in
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <button className={styles.btnGhost} type="button" onClick={() => window.close()}>
              Close this tab
            </button>
          </div>
        </div>

        <p className={styles.footnote}>
          Wasn't you? <Link href="/contact">Secure your account</Link>.
        </p>
      </main>
    </div>
  );
}
