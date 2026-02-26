import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetSalesReportQuery, useGetProductPerformanceQuery } from '@/redux/api/reports';
import { useTranslation } from 'next-i18next';
import { TrendingUpIcon, DollarSignIcon, FileTextIcon, PackageIcon } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useRouter } from 'next/router';

export default function DashboardReports() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale === 'en' ? enUS : fr;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const { data: salesReport, isLoading: salesLoading } = useGetSalesReportQuery({ startDate, endDate });
  const { data: productReport, isLoading: productsLoading } = useGetProductPerformanceQuery({ startDate, endDate });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const stats = [
    {
      title: t('reports.totalSales'),
      value: formatCurrency(salesReport?.summary?.totalSales || 0),
      icon: DollarSignIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: t('reports.totalPaid'),
      value: formatCurrency(salesReport?.summary?.totalPaid || 0),
      icon: TrendingUpIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('reports.totalInvoices'),
      value: salesReport?.summary?.totalInvoices || 0,
      icon: FileTextIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: t('reports.productsSold'),
      value: productReport?.length || 0,
      icon: PackageIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('navigation.reports')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('reports.filterByDate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-auto"
                placeholder={t('reports.startDate')}
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-auto"
                placeholder={t('reports.endDate')}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {salesLoading || productsLoading ? (
                  <div className="h-8 animate-pulse bg-slate-100 rounded" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('reports.recentInvoices')}</CardTitle>
          </CardHeader>
          <CardContent>
            {salesLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 animate-pulse bg-slate-100 rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {salesReport?.invoices?.slice(0, 10).map((invoice: any) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.customer?.firstName} {invoice.customer?.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(invoice.total)}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(invoice.createdAt), 'dd/MM/yyyy', { locale })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </DashboardLayout>
  );
}
