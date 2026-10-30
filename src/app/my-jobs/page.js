"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MyJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetch("https://anushakhalil.pythonanywhere.com/resumes/api/jobs/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-600">Loading Jobs...</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Posted Jobs</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            ← Back to Chat
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
            <Link href="/jobs" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Post your first job
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h2>
                  <p className="text-gray-600 text-sm line-clamp-2 max-w-2xl">{job.description}</p>
                  <span className="text-xs text-gray-400 mt-2 block">
                    Posted on: {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="shrink-0">
                  <Link 
                    href={`/rank?job_id=${job.id}`} 
                    className="px-4 py-2 bg-purple-50 text-purple-700 font-semibold rounded-lg hover:bg-purple-100 transition"
                  >
                    View Candidates →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}