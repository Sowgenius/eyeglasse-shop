import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { useDeleteProductMutation } from '@/redux/api/products';
import { SetStateActionType } from '@/types/set-state-action';
import { ReactNode } from 'react';
import { useTranslation } from 'next-i18next';

type DeleteRowProps = {
  children: ReactNode;
  rowId: string;
  setIsDropdownOpen: SetStateActionType<boolean>;
};

export function DeleteRow({
  children,
  rowId,
  setIsDropdownOpen,
}: DeleteRowProps) {
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();
  const { t } = useTranslation('common');

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('products.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('products.delete.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('products.delete.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'destructive' })}
            onClick={() => {
              deleteProduct(rowId);
              setIsDropdownOpen(false);
            }}
            disabled={isLoading}
          >
            {t('products.delete.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
