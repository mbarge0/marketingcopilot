import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SettingsContent from '@/components/settings/SettingsContent';

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return <SettingsContent />;
}


