import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CopyOptimizerPage from '@/components/dashboard/tools/CopyOptimizerPage';

export default async function CopyOptimizerRoute() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return <CopyOptimizerPage />;
}

