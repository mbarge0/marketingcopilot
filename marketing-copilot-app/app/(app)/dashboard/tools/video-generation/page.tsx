import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import VideoGenerationPage from '@/components/dashboard/tools/VideoGenerationPage';

export default async function VideoGenerationRoute() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return <VideoGenerationPage />;
}

