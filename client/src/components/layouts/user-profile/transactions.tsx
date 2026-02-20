import * as D from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/format-currency';
import { formatDate } from '@/lib/format-date';
import { TransactionsData } from '@/types/transactions-data';
import { ArrowRightLeftIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { useTranslation } from 'next-i18next';
import { DownloadInvoice } from '../download-invoice';

type ViewTransactionsModalProps = {
  data: TransactionsData[];
  children: ReactNode;
};

export function ViewTransactionsModal({
  data,
  children,
}: ViewTransactionsModalProps) {
  const { t } = useTranslation('common');
  
  return (
    <D.Dialog>
      <D.DialogTrigger asChild>{children}</D.DialogTrigger>
      <D.DialogContent className="md:max-w-[900px] overflow-y-auto max-h-[94svh]">
        <D.DialogHeader>
          <D.DialogTitle className="flex items-center gap-2">
            <ArrowRightLeftIcon className="max-[400px]:size-4 size-5" />
            <span className="max-[400px]:text-base">{t('profile.transactions.title')}</span>
          </D.DialogTitle>
          <D.DialogDescription className="text-start">
            {t('profile.transactions.description')}
          </D.DialogDescription>
        </D.DialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">{t('profile.transactions.invoice')}</TableHead>
              <TableHead>{t('profile.transactions.date')}</TableHead>
              <TableHead>{t('profile.transactions.buyer')}</TableHead>
              <TableHead>{t('profile.transactions.product')}</TableHead>
              <TableHead className="text-right whitespace-nowrap">
                {t('profile.transactions.totalSale')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row._id}>
                <TableCell>
                  <DownloadInvoice data={row} />
                </TableCell>

                <TableCell className="max-w-[150px] truncate">
                  {formatDate(row.sold_on)}
                </TableCell>
                <TableCell className="max-w-[180px] truncate">
                  {row.buyer_name}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {row.productId?.name}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(row.total_sale)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </D.DialogContent>
    </D.Dialog>
  );
}
