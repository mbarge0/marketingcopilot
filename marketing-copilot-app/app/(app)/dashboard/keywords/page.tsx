import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import KeywordsPage from '@/components/dashboard/KeywordsPage';

export default async function KeywordsRoute() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return <KeywordsPage />;
}

