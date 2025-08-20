import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="block md:flex justify-center items-center bg-slate-200 flex-grow">
        <div className="p-6 space-y-4 flex-grow text-gray-800">
            <Outlet />
        </div>
      </main>
      <Footer  />
    </div>
  );
}
