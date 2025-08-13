// src/layouts/DashboardLayout.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-200 text-gray-800">
      <Navbar />
      <main className="p-6 space-y-4 flex-grow">
          <Outlet />
      </main>
      <Footer />
    </div>
  );
}
