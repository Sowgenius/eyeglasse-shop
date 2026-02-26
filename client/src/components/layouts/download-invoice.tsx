import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/format-currency';
import { formatDate } from '@/lib/format-date';
import { randomFourDigits } from '@/lib/random-four-digits';
import { TransactionsData } from '@/types/transactions-data';
import { PDFExport } from '@progress/kendo-react-pdf';
import { DownloadIcon } from '@radix-ui/react-icons';
import { useRef } from 'react';
import { ToastAction } from '../ui/toast';
import { useTranslation } from 'next-i18next';

type DownloadInvoiceProps = {
  isToast?: boolean;
  data: Omit<TransactionsData, '_id'>;
};

export function DownloadInvoice({
  isToast = false,
  data,
}: DownloadInvoiceProps) {
  const { t } = useTranslation('common');
  const ref = useRef<PDFExport>(null);
  const invoiceNumber = randomFourDigits();

  const handleClick = () => {
    if (ref.current) ref.current.save();
  };

  return (
    <>
      {isToast ? (
        <ToastAction altText={t('invoices.title')} onClick={handleClick}>
          <DownloadIcon className="size-4" />
          <span className="sr-only">{t('invoices.title')}</span>
          {t('invoices.title')}
        </ToastAction>
      ) : (
        <Button
          size={'sm'}
          variant={'outline'}
          className="block mx-auto border-dashed"
          onClick={handleClick}
        >
          <span className="sr-only">{t('sales.downloadInvoice')}</span>
          <DownloadIcon />
        </Button>
      )}

      <div className="sr-only" aria-hidden={true}>
        <PDFExport
          ref={ref}
          paperSize="A4"
          margin="1cm"
          fileName={`invoice-${invoiceNumber}.pdf`}
        >
          <div className="w-[500px] mx-auto border rounded-md font-sans">
            <header className="flex justify-between items-center p-6">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">{t('invoices.title')}</h3>
                <p className="text-gray-400 font-medium">{`#${invoiceNumber}`}</p>
              </div>

              <div className="text-sm text-right">
                <span className="font-semibold">{t('sales.soldTo')}</span>
                <div className="text-gray-500 font-medium  dark:text-gray-400">
                  {data.buyer_name}
                </div>
              </div>
            </header>

            <div className="px-2">
              <Table className="w-full text-sm">
                <TableBody className="[&_tr:last-child]:border-y">
                  <TableRow>
                    <TableCell className="w-1/2 py-4">
                      {data.productId?.name}
                    </TableCell>
                    <TableCell className="w-1/4 text-center py-4">
                      {data.quantity_sold}
                    </TableCell>
                    <TableCell className="w-1/4 text-right py-4">
                      {formatCurrency(data.productId?.price)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <footer className="p-6 flex justify-between items-center">
              <div>
                {t('invoices.total')}:
                <span className="ml-1.5 font-semibold">
                  {formatCurrency(data.total_sale)}
                </span>
              </div>

              <p className="text-sm text-gray-700">
                {t('invoices.issueDate')} {formatDate(data.sold_on)}
              </p>
            </footer>
          </div>
        </PDFExport>
      </div>
    </>
  );
}
