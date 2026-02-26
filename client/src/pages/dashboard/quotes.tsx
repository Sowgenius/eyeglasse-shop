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
import { useGetQuotesQuery, useDeleteQuoteMutation, useConvertQuoteToInvoiceMutation } from '@/redux/api/quotes';
import { useTranslation } from 'next-i18next';
import { PlusIcon, SearchIcon, FileTextIcon, TrashIcon, ReceiptIcon } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useRouter } from 'next/router';

const statusColors: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-800',
  SENT: 'bg-blue-100 text-blue-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  EXPIRED: 'bg-yellow-100 text-yellow-800',
};

export default function DashboardQuotes() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale === 'en' ? enUS : fr;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useGetQuotesQuery({ page, limit: 10, search });
  const [deleteQuote] = useDeleteQuoteMutation();
  const [convertToInvoice] = useConvertQuoteToInvoiceMutation();

  const handleDelete = async (id: string) => {
    if (confirm(t('quotes.deleteQuote') + '?')) {
      await deleteQuote(id);
    }
  };

  const handleConvert = async (id: string) => {
    const result = await convertToInvoice(id);
    if ('data' in result) {
      router.push('/dashboard/invoices');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('quotes.title')}</h1>
          </div>
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            {t('quotes.addQuote')}
          </Button>
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
                    <TableHead>{t('quotes.quoteNumber')}</TableHead>
                    <TableHead>{t('customers.title')}</TableHead>
                    <TableHead>{t('quotes.status')}</TableHead>
                    <TableHead>{t('quotes.total')}</TableHead>
                    <TableHead>{t('quotes.validUntil')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.quoteNumber}</TableCell>
                      <TableCell>{quote.customer.firstName} {quote.customer.lastName}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[quote.status]}>
                          {t(`quotes.${quote.status.toLowerCase()}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(quote.total)}</TableCell>
                      <TableCell>
                        {quote.validUntil ? format(new Date(quote.validUntil), 'dd/MM/yyyy', { locale }) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <FileTextIcon className="h-4 w-4" />
                          </Button>
                          {quote.status === 'ACCEPTED' && (
                            <Button variant="ghost" size="icon" onClick={() => handleConvert(quote.id)}>
                              <ReceiptIcon className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(quote.id)}>
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
