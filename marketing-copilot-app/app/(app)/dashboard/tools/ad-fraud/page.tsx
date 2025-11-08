import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdFraudPage from '@/components/dashboard/tools/AdFraudPage';

export default async function AdFraudRoute() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return <AdFraudPage />;
}

