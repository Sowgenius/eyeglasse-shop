import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTransactionsQuery } from '@/redux/api/sales';
import { useTranslation } from 'next-i18next';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useRouter } from 'next/router';
import {
  ReceiptIcon,
  CreditCardIcon,
  ArrowLeftRightIcon,
} from 'lucide-react';
import { formatCurrency } from '@/lib/format-currency';

export default function TransactionsPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale === 'en' ? enUS : fr;
  const { data: transactions, isLoading } = useTransactionsQuery();

  const formatDate = (date: string | Date) => {
    return format(new Date(date), 'PPP', { locale });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('navigation.transactions')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('transactions.title')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('transactions.all')}</CardTitle>
            <CardDescription>{t('transactions.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : transactions?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ArrowLeftRightIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{t('common.noResults')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions?.map((tx: any) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${tx.type === 'INVOICE' ? 'bg-blue-100' : 'bg-green-100'}`}>
                        {tx.type === 'INVOICE' ? (
                          <ReceiptIcon className="h-5 w-5 text-blue-600" />
                        ) : (
                          <CreditCardIcon className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{tx.invoiceNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {tx.customer?.firstName} {tx.customer?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(tx.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(tx.amount)}</p>
                      <Badge
                        variant={tx.type === 'INVOICE' ? 'secondary' : 'default'}
                        className="text-xs"
                      >
                        {tx.type === 'INVOICE' ? t('transactions.invoice') : t('transactions.payment')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
