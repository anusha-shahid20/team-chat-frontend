"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    company_name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/tasks/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      alert("Account created successfully! Please log in.");
      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/50">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-3xl">🚀</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
            <p className="text-gray-500">Start managing your team and hiring today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="e.g. Acme Corp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Create a strong password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 mt-2"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}