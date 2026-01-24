import Sidebar from "@/shared/Sidebar";
import TopBar from "@/shared/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen flex-col p-7  gap-5">
      <TopBar />
      <div className="flex flex-row flex-1 gap-5 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-2 md:p-4 ">{children}</div>
      </div>
    </main>
  );
}
