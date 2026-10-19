"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchNotes = async () => {
      // 1. Get the token from local storage
      const token = localStorage.getItem("access_token");
      
      // 2. If no token, send them to login
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // 3. Fetch notes with proper URL and Auth header
        const res = await fetch("http://127.0.0.1:8000/tasks/api/notes/", {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
        });

        // 4. Handle unauthorized error
        if (res.status === 401) {
          throw new Error("You are not authorized. Please log in again.");
        }
        
        if (!res.ok) {
          throw new Error(`Failed to fetch notes. Status: ${res.status}`);
        }

        const data = await res.json();
        setNotes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotes();
  }, [router]);

  if (loading) return <div className="p-8 text-center text-gray-600">Loading notes...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold">Error: {error}</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">📝 Shared Notes</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            ← Back to Chat
          </Link>
        </div>

        <div className="grid gap-4">
          {notes.length === 0 ? (
            <p className="text-gray-500">No notes found.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{note.title}</h2>
                <p className="text-gray-600 mb-4">{note.content}</p>
                <p className="text-xs text-gray-400">Created: {new Date(note.created_at).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}