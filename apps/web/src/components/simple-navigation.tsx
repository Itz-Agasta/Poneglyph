"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Account } from "@/components/account";

function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M3 5h12M3 9h12M3 13h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M4 4l10 10M14 4L4 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PoneglyphLogo() {
  return (
    <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors duration-300 bg-foreground text-background">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="5" height="5" rx="0.5" fill="currentColor" />
        <rect x="8" y="1" width="5" height="5" rx="0.5" fill="currentColor" />
        <rect x="1" y="8" width="5" height="5" rx="0.5" fill="currentColor" />
        <rect x="8" y="8" width="5" height="5" rx="0.5" fill="currentColor" />
      </svg>
    </div>
  );
}

const navLinks = [
  { label: "Discover", href: "/discover" },
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Datasets", href: "/datasets" },
  { label: "Contact", href: "/contact" },
];

export function SimpleNavigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const isAuthenticated = !!session?.user;

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-sm shrink-0 transition-colors duration-300 text-foreground"
        >
          <PoneglyphLogo />
          Poneglyph
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-300 text-muted-foreground hover:text-foreground hover:bg-accent`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Account />
        </div>

        <button
          className="md:hidden p-2 rounded-xl transition-colors hover:bg-accent text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <IconX /> : <IconMenu />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t py-3 px-4 flex flex-col gap-1 border-border bg-background">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2.5 text-sm font-medium rounded-xl transition-colors text-foreground hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 mt-2 pt-3 border-t border-border">
            {isAuthenticated ? (
              <>
                <Link
                  href="/datasets/upload"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-medium rounded-xl border border-input text-foreground"
                >
                  Upload
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-medium rounded-xl border border-input text-foreground"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileOpen(false);
                  }}
                  className="flex-1 text-center px-4 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/datasets/upload"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-medium rounded-xl border border-input text-foreground"
                >
                  Upload
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-4 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
