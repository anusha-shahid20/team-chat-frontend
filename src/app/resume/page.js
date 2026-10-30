"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResumePage() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch("https://anushakhalil.pythonanywhere.com/resumes/api/upload/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Resume Analyzer</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline font-medium">
            ← Back to Chat
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload your Resume (PDF or DOCX)
              </label>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Paste Job Description (Optional - for matching)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="e.g. We are looking for a developer with experience in Python, Django, and React..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition h-24"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Analyzing Resume..." : "Upload & Analyze"}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 font-medium">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-8 border-t border-gray-100 pt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                ✅ Analysis Complete
              </h2>
              
              {/* Base Score Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex flex-col items-center justify-center w-28 h-28 bg-blue-600 text-white rounded-full shadow-lg shrink-0 border-4 border-white">
                  <span className="text-4xl font-extrabold">{result.score}</span>
                  <span className="text-xs font-medium opacity-80">/ 100</span>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">Resume Score</h3>
                  <p className="text-gray-600 text-sm">
                    Based on detected technical skills, type of experience, and content length.
                  </p>
                </div>
              </div>

              {/* JD Match Section */}
              {result.match_data && (
                <div className="mb-8 p-6 bg-purple-50 rounded-2xl border border-purple-200">
                  <h3 className="text-xl font-bold text-purple-800 mb-2">Job Description Match</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl font-extrabold text-purple-600">{result.match_data.match_percentage}%</span>
                    <p className="text-gray-600 text-sm">of the job requirements matched.</p>
                  </div>
                  
                  {result.match_data.missing_skills.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-red-600 mb-2">Missing Skills from JD:</p>
                      <div className="flex flex-wrap gap-2">
                        {result.match_data.missing_skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Skills Section */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Detected Skills:</h3>
                {result.skills_found && result.skills_found.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.skills_found.map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-700 font-semibold rounded-lg text-sm shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-500 font-medium">No skills detected in this resume.</p>
                )}
              </div>

              {/* Text Preview Section */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 max-h-64 overflow-y-auto">
                <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Extracted Text Preview</p>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{result.text_preview}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}