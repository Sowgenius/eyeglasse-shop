import * as D from '@/components/ui/dialog';
import { useDeleteAccountMutation } from '@/redux/api/auth';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { FormEvent, ReactNode, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Eye, EyeClosed } from '../../icons';
import { AlertDestructive } from '../../ui/alert';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

export function DeleteAccountModal({ children }: { children: ReactNode }) {
  const [deleteAccount, { isLoading, data, error }] =
    useDeleteAccountMutation();

  const [isPasswordShowing, setIsPasswordShowing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { t } = useTranslation('common');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteAccount({ password: inputValue });
  };

  if (data) {
    Cookies.remove('token');
    router.reload();
  }

  return (
    <D.Dialog open={isOpen} onOpenChange={setIsOpen}>
      <D.DialogTrigger asChild>{children}</D.DialogTrigger>

      <D.DialogContent>
        <D.DialogHeader>
          <D.DialogTitle>{t('profile.deleteAccount.title')}</D.DialogTitle>
          <D.DialogDescription>
            {t('profile.deleteAccount.description')}
          </D.DialogDescription>
        </D.DialogHeader>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="password">{t('profile.deleteAccount.passwordLabel')}</Label>
          <div className="relative mb-3 mt-1">
            <Input
              className="transition-all"
              id="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              type={isPasswordShowing ? 'text' : 'password'}
              placeholder={t('profile.deleteAccount.passwordPlaceholder')}
              disabled={isLoading}
              required
            />

            <button
              type="button"
              onClick={() => setIsPasswordShowing(!isPasswordShowing)}
              disabled={isLoading}
              className="absolute translate-y-1/2 bottom-1/2 right-3"
            >
              <span className="sr-only">
                {isPasswordShowing ? t('profile.deleteAccount.hidePassword') : t('profile.deleteAccount.showPassword')}
              </span>

              {isPasswordShowing ? (
                <EyeClosed />
              ) : (
                <Eye
                  aria-hidden={true}
                  className="stroke-gray-500 hover:stroke-gray-600"
                />
              )}
            </button>
          </div>

          {error && 'data' in error && (
            <AlertDestructive message={(error as any).data.message} />
          )}
          <D.DialogFooter className="mt-3">
            <Button
              variant={'secondary'}
              type="button"
              disabled={isLoading}
              onClick={() => setIsOpen(false)}
            >
              {t('profile.deleteAccount.cancel')}
            </Button>
            <Button type="submit" variant={'destructive'} disabled={isLoading}>
              {t('profile.deleteAccount.confirm')}
            </Button>
          </D.DialogFooter>
        </form>
      </D.DialogContent>
    </D.Dialog>
  );
}
