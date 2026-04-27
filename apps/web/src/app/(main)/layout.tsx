import { SimpleNavigation } from "@/components/simple-navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SimpleNavigation />
      <div className="min-h-[calc(100vh-4rem)]">
        {children}
      </div>
    </>
  );
}