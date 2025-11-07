import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Marketing Co-Pilot
        </h1>
        <p className="text-xl text-gray-600">
          Manage your Google Ads campaigns 10x faster with AI-powered insights and automation
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="/auth/signup"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Connect Google Ads Account
          </a>
          <a
            href="/auth/login"
            className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            Log In
          </a>
        </div>
        <div className="pt-8">
          <a
            href="/dashboard?demo=true"
            className="text-blue-600 hover:underline"
          >
            Try Demo Mode First
          </a>
          <p className="mt-2 text-sm text-gray-500">
            (Explore with sample data)
          </p>
        </div>
      </div>
    </div>
  );
}
