"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MessageList from "../MessageList";

export default function DashboardPage() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("username");

    if (!token) {
      router.push("/login");
      return;
    }

    setUsername(user || "User");
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    router.push("/login");
  }

  const messages = [
    { id: 1, sender: "Anusha", content: "Hello from Dashboard!" },
    { id: 2, sender: "Ahmed", content: "How is everyone?" },
    { id: 3, sender: "Sara", content: "Doing great!" },
  ];

  return (
    <main className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header — fixed height */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-xl">💬</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Team Chat</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            Hi, <strong>{username}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content area — takes remaining height */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — fixed, scrolls independently */}
        {showSidebar && (
          <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto flex-shrink-0">
            <h2 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">
              Menu
            </h2>
            <ul className="space-y-1">
              <li className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium cursor-pointer">
                💬 Chat
              </li>
              <li className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                📝 Notes
              </li>
              <li className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                👥 Team
              </li>
              <li className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                ⚙️ Settings
              </li>
            </ul>
          </aside>
        )}

        {/* Content area — scrolls independently */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 min-h-[2000px]">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                {showSidebar ? "Hide Sidebar" : "Show Sidebar"}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <MessageList messages={messages} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}