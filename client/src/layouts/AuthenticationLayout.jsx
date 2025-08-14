import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthenticationLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-bold">SolArch login page</h1>
      </header>
      <main className="p-6 space-y-4 flex-grow">
        {children || <Outlet />}
      </main>
      <footer className="bg-white shadow p-4 text-center">
        <p>&copy; AWOOOO</p>
      </footer>
    </div>
  );
}