import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation('common');

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <main className="font-mono text-xl font-medium text-centers pt-20">
      <h1 className="text-xl font-medium">{t('dashboard.redirectMessage')}</h1>
      Go to{' '}
      <Link href="/dashboard" className="underline">
        /dashboard <span className="sr-only">page</span>
      </Link>
    </main>
  );
}
