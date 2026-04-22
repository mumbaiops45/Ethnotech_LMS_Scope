"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Leads", path: "/dashboard/leads" },
    { name: "Courses", path: "/dashboard/courses" },
    { name: "Students", path: "/dashboard/students" },
  ];

  return (
    <div className="flex h-screen">
      
      {/* 🔹 Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-5">
        <h2 className="text-2xl font-bold mb-8">Ethnotech</h2>

        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-3 py-2 rounded transition ${
                pathname === item.path
                  ? "bg-blue-600"
                  : "hover:bg-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* 🔹 Main Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        
        {/* 🔸 Top Navbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="font-semibold text-lg capitalize">
            {pathname.replace("/dashboard/", "") || "dashboard"}
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Admin</span>
            
            <button className="bg-red-500 text-white px-3 py-1 rounded">
              Logout
            </button>
          </div>
        </header>

        {/* 🔸 Page Content */}
        <main className="p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}