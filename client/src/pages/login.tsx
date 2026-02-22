import { LoginForm } from '@/components/layouts/form/login-form';
import { Logo } from '@/components/logo';
import { NextHead } from '@/components/next-head';
import { AlertDestructive } from '@/components/ui/alert';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';

export default function LoginPage() {
  const [error, setError] = useState<string | undefined>('');
  const { t } = useTranslation('common');

  return (
    <>
      <NextHead title={t('auth.login')} />

      <main className="container relative h-[100svh] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/register"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 md:right-8 md:top-8'
          )}
        >
          {t('auth.register')}
        </Link>

        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <Logo
            className={{
              wrapper: 'absolute inset-10 flex justify-center text-4xl',
              logo: 'size-9 mr-3',
            }}
          />
        </div>

        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center sm:w-[350px]">
            <div className="flex flex-col mb-6 space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t('auth.welcomeBack')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('auth.enterCredentials')}
              </p>
            </div>
            {error && <AlertDestructive>{error}</AlertDestructive>}
            <LoginForm setError={setError} />
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'fr', ['common'])),
    },
  };
};
