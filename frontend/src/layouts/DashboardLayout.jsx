import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="p-6 space-y-4 flex-grow bg-slate-200 text-gray-800">
          <Outlet />
      </main>
      <Footer  />
    </div>
  );
}
