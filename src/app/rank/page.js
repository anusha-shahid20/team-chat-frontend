"use client";

import { useState } from "react";
import Link from "next/link";

export default function RankPage() {
  const [files, setFiles] = useState([]);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [error, setError] = useState(null);

  const handleRank = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select files");

    setLoading(true);
    setError(null);
    setRankings([]);

    const formData = new FormData();
    
    // Append all selected files to the form data
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    
    // Append Job Description if provided
    if (jd) {
      formData.append("job_description", jd);
    }

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch("http://127.0.0.1:8000/resumes/api/rank/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Error ranking files");
      }
      
      setRankings(data.ranking);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Resume Leaderboard</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            ← Back to Chat
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <form onSubmit={handleRank} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Multiple Resumes (Hold Ctrl to select multiple files)
              </label>
              <input
                type="file"
                multiple // This allows multiple file selection
                accept=".pdf,.docx"
                onChange={(e) => setFiles(e.target.files)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {files.length > 0 && (
                <p className="text-sm text-green-600 mt-2 font-medium">
                  Selected {files.length} files.
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Description (Optional)
              </label>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg h-20 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Paste job requirements here to match against..."
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {loading ? "Processing & Analyzing..." : "Rank Resumes"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
              {error}
            </div>
          )}
        </div>

        {rankings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm border-b border-gray-200">
                  <th className="p-4">Rank</th>
                  <th className="p-4">Filename</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">JD Match %</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((r, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-700">#{r.rank}</td>
                    <td className="p-4 text-gray-800">{r.filename}</td>
                    <td className="p-4 font-bold text-blue-600">{r.score}</td>
                    <td className="p-4 font-bold text-purple-600">{r.match_percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}