import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Team Chat</h1>
        <p className="text-gray-600 mb-6">Welcome to Team Chat app</p>
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Get Started →
        </Link>
      </div>
    </main>
  );
}