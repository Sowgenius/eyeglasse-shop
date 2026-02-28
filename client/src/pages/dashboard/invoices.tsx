import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { useGetInvoicesQuery, useDeleteInvoiceMutation, useAddPaymentMutation } from '@/redux/api/invoices';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { PlusIcon, SearchIcon, FileTextIcon, TrashIcon, CreditCardIcon } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { formatCurrency } from '@/lib/format-currency';
import { AddInvoice } from '@/components/layouts/table/row-actions/add-invoice';
import { EditInvoice } from '@/components/layouts/table/row-actions/edit-invoice';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PARTIAL: 'bg-blue-100 text-blue-800',
  PAID: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-slate-100 text-slate-800',
};

export default function DashboardInvoices() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale === 'en' ? enUS : fr;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useGetInvoicesQuery({ page, limit: 10, search });
  const [deleteInvoice] = useDeleteInvoiceMutation();

  const handleDelete = async (id: string) => {
    if (confirm(t('invoices.deleteInvoice') + '?')) {
      await deleteInvoice(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('invoices.title')}</h1>
          </div>
          <AddInvoice />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('common.search')}
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 animate-pulse bg-slate-100 rounded" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('invoices.invoiceNumber')}</TableHead>
                    <TableHead>{t('customers.title')}</TableHead>
                    <TableHead>{t('invoices.status')}</TableHead>
                    <TableHead>{t('invoices.total')}</TableHead>
                    <TableHead>{t('invoices.amountPaid')}</TableHead>
                    <TableHead>{t('invoices.balanceDue')}</TableHead>
                    <TableHead>{t('invoices.dueDate')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.customer.firstName} {invoice.customer.lastName}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[invoice.status]}>
                          {t(`invoices.${invoice.status.toLowerCase()}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(invoice.total)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(invoice.amountPaid)}</TableCell>
                      <TableCell className={invoice.balanceDue > 0 ? 'text-red-600' : ''}>
                        {formatCurrency(invoice.balanceDue)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(invoice.dueDate), 'dd/MM/yyyy', { locale })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <EditInvoice invoiceId={invoice.id} />
                          {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && (
                            <EditInvoice invoiceId={invoice.id} trigger={
                              <Button variant="ghost" size="icon">
                                <CreditCardIcon className="h-4 w-4" />
                              </Button>
                            } />
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(invoice.id)}>
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {data && data.pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  {t('common.previous')}
                </Button>
                <span className="flex items-center px-4">
                  {page} / {data.pagination.totalPages}
                </span>
                <Button variant="outline" disabled={page >= data.pagination.totalPages} onClick={() => setPage(page + 1)}>
                  {t('common.next')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </DashboardLayout>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'fr', ['common'])),
    },
  };
};
