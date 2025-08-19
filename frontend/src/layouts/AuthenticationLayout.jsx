import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AuthenticationLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-300 text-gray-800">
      <Navbar></Navbar>
      <main className="flex-grow flex items-center justify-center">
        {children || <Outlet />}
      </main>
      <Footer></Footer>
    </div>
  );
}