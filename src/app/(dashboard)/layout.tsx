import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="lg:pl-64 min-h-screen transition-all duration-300">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Header Space for Mobile toggle room */}
          <div className="h-12 lg:hidden" />

          {children}
        </div>
      </main>
    </div>
  );
}
