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
import { Button, buttonVariants } from '@/components/ui/button';
import { useBulkDeleteMutation } from '@/redux/api/products';
import { Row, Table } from '@tanstack/react-table';
import { Trash2Icon } from 'lucide-react';
import { useTranslation } from 'next-i18next';

type BulkDeleteProps<TData> = {
  table: Table<TData>;
};

function getSelectedRowsId(rows: Row<any>[]): string[] {
  return rows.map((row) => row.original._id);
}

export function BulkDelete<TData>({ table }: BulkDeleteProps<TData>) {
  const [bulkDelete, { isLoading }] = useBulkDeleteMutation();
  const { t } = useTranslation('common');

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedRowsId = getSelectedRowsId(selectedRows);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="h-8 px-2 lg:px-3"
          disabled={isLoading}
        >
          <Trash2Icon className="sm:mr-2 size-4" />
          <span className="max-sm:sr-only">{t('products.delete.deleteSelected')}</span>
        </Button>
      </AlertDialogTrigger>

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
              bulkDelete(selectedRowsId);
              table.toggleAllRowsSelected(false);
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
