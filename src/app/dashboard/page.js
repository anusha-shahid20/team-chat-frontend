"use client";

import { useState } from "react";
import Link from "next/link";
import MessageList from "../MessageList";

export default function DashboardPage() {
  const [showSidebar, setShowSidebar] = useState(true);

  const messages = [
    { id: 1, sender: "Anusha", content: "Hello from Dashboard!" },
    { id: 2, sender: "Ahmed", content: "How is everyone?" },
    { id: 3, sender: "Sara", content: "Doing great!" },
  ];

  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showSidebar ? "Hide Sidebar" : "Show Sidebar"}
        </button>
      </div>

      <div className="flex gap-6">
        {showSidebar && (
          <aside className="w-64 bg-gray-100 p-4 rounded">
            <h2 className="font-bold mb-3">Sidebar</h2>
            <ul className="space-y-2">
              <li>💬 Chat</li>
              <li>📝 Notes</li>
              <li>👥 Team</li>
              <li>⚙️ Settings</li>
            </ul>
          </aside>
        )}

        <div className="flex-1">
          <MessageList messages={messages} />
        </div>
      </div>

      <div className="mt-8">
        <Link href="/login" className="text-blue-500 underline">
          ← Back to Login
        </Link>
      </div>
    </main>
  );
}