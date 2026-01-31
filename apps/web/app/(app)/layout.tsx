import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DesktopSidebar />
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
