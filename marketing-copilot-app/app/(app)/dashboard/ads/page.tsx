import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdsAssetsPage from '@/components/dashboard/AdsAssetsPage';

export default async function AdsRoute() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return <AdsAssetsPage />;
}

