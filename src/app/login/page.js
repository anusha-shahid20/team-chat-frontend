import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="text-gray-600 mb-4">Login page — coming soon</p>
        <Link href="/dashboard" className="text-blue-500 underline">
          Go to Dashboard →
        </Link>
      </div>
    </main>
  );
}