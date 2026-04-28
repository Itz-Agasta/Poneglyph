import { Navigation } from "@/components/landing/navigation";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
