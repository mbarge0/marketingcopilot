import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ReportsPage from '@/components/dashboard/ReportsPage';

export default async function ReportsRoute() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return <ReportsPage />;
}

