"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch("http://127.0.0.1:8000/tasks/api/change-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Password changed successfully! Logging out...");
        // Clear local storage and force login again
        setTimeout(() => {
          localStorage.clear();
          router.push("/login");
        }, 2000);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage("❌ Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto mt-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            ← Back to Chat
          </Link>
        </div>

        <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>
          
          {message && (
            <div className={`p-3 rounded-lg text-sm font-medium ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}