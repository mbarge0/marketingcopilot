import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AudiencesPage from '@/components/dashboard/AudiencesPage';

export default async function AudiencesRoute() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return <AudiencesPage />;
}

