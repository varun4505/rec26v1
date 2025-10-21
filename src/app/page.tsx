import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Home Page</h1>
      <p className="text-lg mb-8">This page has its own separate styling from the user profile.</p>
      <Link href="/profile" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Go to User Profile
      </Link>
    </main>
  );
}
