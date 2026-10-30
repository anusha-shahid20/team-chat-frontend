"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchNotes = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/tasks/api/notes/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [router]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    
    try {
      const res = await fetch("http://127.0.0.1:8000/tasks/api/notes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        fetchNotes(); // Refresh the list
      } else {
        alert("Failed to create note");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading notes...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">📝 Shared Notes</h1>
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            ← Back to Chat
          </Link>
        </div>

        {/* Create Note Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <form onSubmit={handleCreateNote} className="space-y-4">
            <input
              type="text"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <textarea
              placeholder="Note Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-24 outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Note
            </button>
          </form>
        </div>

        {/* Notes List */}
        <div className="grid gap-4">
          {notes.length === 0 ? (
            <p className="text-gray-500 text-center">No notes found.</p>
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