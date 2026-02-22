import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { setTokenCookie } from '@/lib/set-cookie';
import { cn } from '@/lib/utils';
import { useRegisterMutation } from '@/redux/api/auth';
import { RegisterPayload, registerFormSchema } from '@/schema/auth-form-schema';
import { SetStateActionType } from '@/types/set-state-action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { Eye, EyeClosed } from '../../icons';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

const passwordFields = ['password', 'confirm_password'] as const;

type RegisterFormProps = React.HTMLAttributes<HTMLDivElement> & {
  setError: SetStateActionType<string | undefined>;
  setSuccess: SetStateActionType<string | undefined>;
};

export function RegisterForm({
  className,
  setError,
  setSuccess,
  ...props
}: RegisterFormProps) {
  const [register, { isLoading, data, error }] = useRegisterMutation();
  const { t } = useTranslation('common');

  const router = useRouter();

  const form = useForm<RegisterPayload>({
    resolver: zodResolver(registerFormSchema),
  });

  useEffect(() => {
    if (data) {
      // Check if user has a token (immediate activation) or needs approval
      if (data.token) {
        setTokenCookie(data.token);
        router.reload();
      } else {
        // Registration successful but pending approval
        setSuccess(t('auth.accountPending'));
        form.reset();
      }
    }
  }, [data, router, setSuccess, form, t]);

  useEffect(() => {
    if (error && 'message' in error) {
      setError(error.message);
    }
  }, [error, setError]);

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(register)} className="grid gap-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.name')}</FormLabel>
                <FormControl>
                  <Input
                    className="transition-all"
                    placeholder={t('auth.name')}
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.email')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    className="transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {passwordFields.map((name, i) => (
            <PasswordField
              form={form as any}
              name={name}
              i={i}
              isLoading={isLoading}
              key={name}
            />
          ))}

          <Button disabled={isLoading} type="submit" className="w-full mt-3">
            {t('auth.registerButton')}
          </Button>
        </form>
      </Form>
    </div>
  );
}

function PasswordField({
  form,
  name,
  i,
  isLoading,
}: {
  form: UseFormReturn<any, any, undefined>;
  name: 'password' | 'confirm_password';
  i: number;
  isLoading: boolean;
}) {
  const [isShowing, setIsShowing] = useState(false);
  const { t } = useTranslation('common');

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {i > 0 ? t('auth.confirmPassword') : t('auth.password')}
          </FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                className="transition-all"
                type={isShowing ? 'text' : 'password'}
                placeholder="****"
                autoComplete={i > 0 ? 'new-password' : 'new-password'}
                disabled={isLoading}
                {...field}
              />
            </FormControl>
            <button
              type="button"
              onClick={() => setIsShowing(!isShowing)}
              className="absolute translate-y-1/2 bottom-1/2 right-3"
            >
              <span className="sr-only">
                {isShowing ? t('common.hide') : t('common.show')} {t('auth.password').toLowerCase()}
              </span>
              {isShowing ? <EyeClosed /> : <Eye />}
            </button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
