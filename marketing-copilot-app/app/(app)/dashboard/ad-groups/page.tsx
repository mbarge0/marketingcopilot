import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdGroupsPage from '@/components/dashboard/AdGroupsPage';

export default async function AdGroupsRoute() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return <AdGroupsPage />;
}

