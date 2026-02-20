import Link from 'next/link';
import { RegisterForm } from '@/components/layouts/form/register-form';
import { Logo } from '@/components/logo';
import { NextHead } from '@/components/next-head';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDestructive } from '@/components/ui/alert';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';

export default function Register() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const { t } = useTranslation('common');

  return (
    <>
      <NextHead title={t('auth.register')} />

      <main className="container relative h-[100svh] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 md:right-8 md:top-8'
          )}
        >
          {t('auth.login')}
        </Link>

        <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <Logo
            className={{
              wrapper: 'absolute inset-10 flex justify-center text-4xl',
              logo: 'size-9 mr-3',
            }}
          />
        </div>

        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t('auth.createAccount')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('auth.enterDetails')}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {t('auth.accountPending')}
              </p>
            </div>

            {error && <AlertDestructive message={error} />}
            
            {success && (
              <Alert className="border-green-500/50 text-green-700 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">{t('common.success')}</AlertTitle>
                <AlertDescription className="text-green-700">
                  {success}
                </AlertDescription>
              </Alert>
            )}
            
            <RegisterForm setError={setError} setSuccess={setSuccess} />
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
