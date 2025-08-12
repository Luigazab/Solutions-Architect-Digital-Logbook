// src/layouts/DashboardLayout.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-200 text-gray-800">
      <Navbar />
      <main className="min-h-screen flex flex-col">
        <div className="p-6 space-y-4 flex-grow">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
