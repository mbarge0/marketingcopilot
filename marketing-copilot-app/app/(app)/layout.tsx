import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MetaMenu from '@/components/ui/meta-menu/MetaMenu';
import LeftNavigation from '@/components/dashboard/LeftNavigation';
import AILayoutWrapper from '@/components/ai/AILayoutWrapper';
import ConditionalNavigation from '@/components/shared/ConditionalNavigation';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MetaMenu />
      <div className="ml-16 flex flex-1">
        <ConditionalNavigation />
        <AILayoutWrapper>
          {children}
        </AILayoutWrapper>
      </div>
    </div>
  );
}

