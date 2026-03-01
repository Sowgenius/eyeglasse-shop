import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDashboardStatsQuery, useGetSalesReportQuery, useGetSalesChartQuery } from '@/redux/api/reports';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import {
  UsersIcon,
  PackageIcon,
  ReceiptIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  ClockIcon,
  ArrowRightIcon,
  PlusIcon,
  FileTextIcon,
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { GetStaticProps } from 'next';
import { RevenueChart } from '@/components/dashboard/charts';
import { useState } from 'react';

export default function DashboardOverview() {
  const { t } = useTranslation('common');
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: salesReport, isLoading: salesLoading } = useGetSalesReportQuery({});
  const { data: chartData, isLoading: chartLoading } = useGetSalesChartQuery({ categorize_by: 'daily' });

  const statCards = [
    { title: t('dashboard.todayRevenue'), value: stats?.todayRevenue || 0, icon: TrendingUpIcon, href: '/dashboard/invoices' },
    { title: t('dashboard.totalCustomers'), value: stats?.totalCustomers || 0, icon: UsersIcon, href: '/dashboard/customers' },
    { title: t('dashboard.totalProducts'), value: stats?.totalProducts || 0, icon: PackageIcon, href: '/dashboard/products' },
    { title: t('dashboard.totalInvoices'), value: stats?.totalInvoices || 0, icon: ReceiptIcon, href: '/dashboard/invoices' },
  ];

  const alertCards = [
    { title: t('dashboard.pendingInvoices'), value: stats?.pendingInvoices || 0, icon: ClockIcon, href: '/dashboard/invoices' },
    { title: t('dashboard.overdueInvoices'), value: stats?.overdueInvoices || 0, icon: AlertTriangleIcon, href: '/dashboard/invoices' },
  ];

  const quickActions = [
    { title: t('products.addProduct'), icon: PlusIcon, href: '/dashboard/products' },
    { title: t('quotes.addQuote'), icon: FileTextIcon, href: '/dashboard/quotes' },
    { title: t('customers.addCustomer'), icon: UsersIcon, href: '/dashboard/customers' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">{t('dashboard.welcome')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('navigation.dashboard')}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => (
            <Link key={index} href={card.href}>
              <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</CardTitle>
                  <card.icon className="h-4 w-4 text-black dark:text-white" />
                </CardHeader>
                <CardContent>
                  {statsLoading ? <Skeleton className="h-8 w-24" /> : (
                    <div className="text-xl lg:text-2xl font-bold text-black dark:text-white">
                      {card.title.includes('Revenue') ? formatCurrency(card.value) : card.value}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {alertCards.map((alert, index) => (
            <Link key={index} href={alert.href}>
              <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{alert.title}</CardTitle>
                  <alert.icon className="h-4 w-4 text-black dark:text-white" />
                </CardHeader>
                <CardContent>
                  {statsLoading ? <Skeleton className="h-8 w-16" /> : (
                    <div className="text-2xl font-bold text-black dark:text-white">{alert.value}</div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Low Stock */}
        {stats && stats.lowStockProducts > 0 && (
          <Card className="border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangleIcon className="h-4 w-4" />
                {t('dashboard.lowStock')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{stats.lowStockProducts} {t('products.lowStockAlert').toLowerCase()}</p>
              <Link href="/dashboard/products" className="text-sm underline mt-2 inline-block">
                {t('common.show')} {t('navigation.products')}
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Chart & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-2 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-black dark:text-white">{t('reports.totalSales')}</CardTitle>
            </CardHeader>
            <CardContent>
              {chartLoading ? <Skeleton className="h-[250px] w-full" /> : <RevenueChart data={chartData?.data || []} />}
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-black dark:text-white">{t('dashboard.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Button variant="outline" className="w-full justify-start gap-2 border-gray-300 dark:border-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
                    <action.icon className="h-4 w-4" />
                    {action.title}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices */}
        <Card className="border-2 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-black dark:text-white">{t('reports.recentInvoices')}</CardTitle>
            <Link href="/dashboard/invoices">
              <Button variant="ghost" size="sm" className="gap-1">
                {t('common.show')} <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {salesLoading ? (
              <div className="space-y-3">{[...Array(5)].map((_, i) => (<Skeleton key={i} className="h-12 w-full" />))}</div>
            ) : salesReport?.invoices?.length === 0 ? (
              <p className="text-center text-gray-500 py-8">{t('common.noResults')}</p>
            ) : (
              <div className="space-y-3">
                {salesReport?.invoices?.slice(0, 5).map((invoice: any) => (
                  <Link key={invoice.id} href={`/dashboard/invoices/${invoice.id}`}>
                    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                          <ReceiptIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-black dark:text-white">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-gray-500">{invoice.customer?.firstName} {invoice.customer?.lastName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-black dark:text-white">{formatCurrency(invoice.total)}</p>
                        <Badge variant={invoice.status === 'PAID' ? 'default' : invoice.status === 'OVERDUE' ? 'destructive' : 'secondary'} className="text-xs">
                          {t(`invoices.${invoice.status.toLowerCase()}`)}
                        </Badge>
                      </div>
                    </div>
                  </Link>
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

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: { ...(await serverSideTranslations(locale || 'fr', ['common'])) },
});
