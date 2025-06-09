import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import PhNavbar from "../../components/PhNavbar";

export default function PharmacyDashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="relative h-screen overflow-hidden">
     
      <Sidebar isOpen={isSidebarOpen} />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="sm:ml-64 flex flex-col h-full">
        <PhNavbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
