"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// We wrap the component in Suspense because useSearchParams requires it in Next.js
function RankContent() {
  const [files, setFiles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [loading, setLoading] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [error, setError] = useState(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // Fetch saved jobs and auto-select the job if passed in URL
  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetch("https://anushakhalil.pythonanywhere.com/resumes/api/jobs/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setJobs(data);

          // Check if URL has ?job_id=... and auto-select it
          const urlJobId = searchParams.get("job_id");
          if (urlJobId && data.some(job => job.id === parseInt(urlJobId))) {
            setSelectedJobId(urlJobId);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchJobs();
  }, [searchParams]);

  const handleRank = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select files");

    setLoading(true);
    setError(null);
    setRankings([]);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    
    // Get the description of the selected job
    const selectedJob = jobs.find(j => j.id === parseInt(selectedJobId));
    if (selectedJob) {
      formData.append("job_description", selectedJob.description);
    }

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch("https://anushakhalil.pythonanywhere.com/resumes/api/rank/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Error ranking files");
      
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
          <div className="flex gap-4">
            <Link href="/my-jobs" className="text-blue-500 hover:underline">
              ← Back to My Jobs
            </Link>
            <Link href="/dashboard" className="text-gray-500 hover:underline">
              Dashboard
            </Link>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <form onSubmit={handleRank} className="space-y-4">
            
            {/* Job Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select a Job (Optional)
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- None (Just Score Resumes) --</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload Multiple Resumes (Hold Ctrl to select multiple)
              </label>
              <input
                type="file"
                multiple
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
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {loading ? "Processing..." : "Rank Resumes"}
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

// Main page component wrapped in Suspense
export default function RankPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <RankContent />
    </Suspense>
  );
}