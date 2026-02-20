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
import { useLoginMutation } from '@/redux/api/auth';
import { LoginPayload, loginFormSchema } from '@/schema/auth-form-schema';
import { DemoCredentials } from '@/types/demo-credentials';
import { SetStateActionType } from '@/types/set-state-action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeClosed } from '../../icons';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

type LoginFormProps = React.HTMLAttributes<HTMLDivElement> & {
  setError: SetStateActionType<string | undefined>;
  demoCredentials?: DemoCredentials;
};

export function LoginForm({
  className,
  setError,
  demoCredentials,
}: LoginFormProps) {
  const [isShowing, setIsShowing] = useState(false);
  const router = useRouter();

  const [login, { data, isLoading, error }] = useLoginMutation();

  useEffect(() => {
    if (demoCredentials) {
      login(demoCredentials);
    }
  }, [login, demoCredentials]);

  useEffect(() => {
    if (error && 'message' in error) {
      setError(error.message);
    }
  }, [error, setError]);

  useEffect(() => {
    if (data) {
      setTokenCookie(data.token);
      router.reload();
    }
  }, [data, router]);

  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginFormSchema),
  });

  return (
    <div className={cn('grid gap-6', className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(login)} className="grid gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading || !!demoCredentials}
                    className="transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="transition-all"
                      type={isShowing ? 'text' : 'password'}
                      placeholder="****"
                      autoComplete="current-password"
                      disabled={isLoading || !!demoCredentials}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setIsShowing(!isShowing)}
                      className="absolute translate-y-1/2 bottom-1/2 right-3"
                    >
                      <span className="sr-only">
                        {isShowing ? 'Hide' : 'Show'} password
                      </span>
                      {isShowing ? <EyeClosed /> : <Eye />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} type="submit" className="w-full mt-3">
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
}
