"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const token = localStorage.getItem("access_token");
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${API_URL}/tasks/api/projects/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8 text-red-500">Error: {error}</p>;

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li key={project.id} className="p-4 bg-gray-100 rounded">
              <strong>{project.name}</strong> — {project.status}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8">
        <Link href="/dashboard" className="text-blue-500 underline">
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  );
}