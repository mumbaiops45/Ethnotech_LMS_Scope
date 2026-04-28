"use client";

import { useRouter } from "next/navigation";

export default function DashboardHome() {
  const router = useRouter();

  const cards = [
    {
      title: "Student Management",
      description: "View, edit, delete students, track their progress and performance.",
      icon: "🎓",
      bgGradient: "from-emerald-500 to-teal-600",
      hoverGradient: "from-emerald-600 to-teal-700",
      route: "/components/student",
    },
    {
      title: "Admin Management",
      description: "Manage super admins, branch admins, instructors – add, edit, deactivate, delete.",
      icon: "👥",
      bgGradient: "from-blue-500 to-indigo-600",
      hoverGradient: "from-blue-600 to-indigo-700",
      route: "/components/user",
    },
  ];
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Manage your platform from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => router.push(card.route)}
            className={`
              relative overflow-hidden rounded-2xl shadow-lg cursor-pointer
              bg-gradient-to-br ${card.bgGradient}
              hover:shadow-2xl hover:scale-105 transition-all duration-300
            `}
          >
            {/* Animated background shape */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>

            <div className="relative p-8 text-white">
              <div className="text-5xl mb-4">{card.icon}</div>
              <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
              <p className="text-white/80 text-sm leading-relaxed">{card.description}</p>

              <div className="mt-6 flex justify-end">
                <span className="inline-flex items-center gap-1 text-sm font-medium group">
                  Manage
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Subtle bottom line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"></div>
          </div>
        ))}
      </div>
    </div>
  );
}