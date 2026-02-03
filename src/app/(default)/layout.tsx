import Sidebar from "@/shared/Sidebar";
import TopBar from "@/shared/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen flex-col p-7 gap-5">
      <TopBar />
      <div className="flex flex-1 gap-5 overflow-hidden">
        {/* Sidebar */}
        <div className="flex-shrink-0 h-full overflow-y-auto">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 h-full overflow-y-auto p-2 md:p-4">
          {children}
        </div>
      </div>
    </main>
  );
}
