import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  ShoppingCartIcon,
  DollarSignIcon,
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { formatCurrency } from '@/lib/format-currency';
import { GetStaticProps } from 'next';
import { RevenueChart } from '@/components/dashboard/charts';

export default function DashboardOverview() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale === 'en' ? enUS : fr;
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: salesReport, isLoading: salesLoading } = useGetSalesReportQuery({});
  const { data: chartData, isLoading: chartLoading } = useGetSalesChartQuery({ categorize_by: 'daily' });

  const statCards = [
    {
      title: t('dashboard.todayRevenue'),
      value: stats?.todayRevenue ? formatCurrency(stats.todayRevenue) : formatCurrency(0),
      icon: TrendingUpIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
      href: '/dashboard/invoices',
    },
    {
      title: t('dashboard.totalCustomers'),
      value: stats?.totalCustomers || 0,
      icon: UsersIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      borderColor: 'border-purple-200 dark:border-purple-800',
      href: '/dashboard/customers',
    },
    {
      title: t('dashboard.totalProducts'),
      value: stats?.totalProducts || 0,
      icon: PackageIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
      borderColor: 'border-orange-200 dark:border-orange-800',
      href: '/dashboard/products',
    },
    {
      title: t('dashboard.totalInvoices'),
      value: stats?.totalInvoices || 0,
      icon: ReceiptIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      borderColor: 'border-green-200 dark:border-green-800',
      href: '/dashboard/invoices',
    },
  ];

  const alertCards = [
    {
      title: t('dashboard.pendingInvoices'),
      value: stats?.pendingInvoices || 0,
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      href: '/dashboard/invoices',
    },
    {
      title: t('dashboard.overdueInvoices'),
      value: stats?.overdueInvoices || 0,
      icon: AlertTriangleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
      borderColor: 'border-red-200 dark:border-red-800',
      href: '/dashboard/invoices',
    },
  ];

  const quickActions = [
    {
      title: t('products.addProduct'),
      icon: PlusIcon,
      href: '/dashboard/products',
      color: 'hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30',
    },
    {
      title: t('quotes.addQuote'),
      icon: FileTextIcon,
      href: '/dashboard/quotes',
      color: 'hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950/30',
    },
    {
      title: t('customers.addCustomer'),
      icon: UsersIcon,
      href: '/dashboard/customers',
      color: 'hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950/30',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t('dashboard.welcome')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('navigation.dashboard')}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, index) => (
            <Link key={index} href={card.href || '#'}>
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border-slate-200 dark:border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{card.value}</div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Alerts */}
        <div className="grid gap-4 md:grid-cols-2">
          {alertCards.map((alert, index) => (
            <Link key={index} href={alert.href || '#'}>
              <Card className={`border-2 ${alert.borderColor} hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {alert.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${alert.bgColor}`}>
                    <alert.icon className={`h-4 w-4 ${alert.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{alert.value}</div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Low Stock Alert */}
        {stats && stats.lowStockProducts > 0 && (
          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-400 flex items-center gap-2">
                <AlertTriangleIcon className="h-4 w-4" />
                {t('dashboard.lowStock')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 dark:text-yellow-300">
                {stats.lowStockProducts} {t('products.lowStockAlert').toLowerCase()}
              </p>
              <Link href="/dashboard/products" className="text-sm text-yellow-600 hover:underline mt-2 inline-block dark:text-yellow-400">
                {t('common.show')} {t('navigation.products')} <ArrowRightIcon className="inline h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Charts and Recent Invoices */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5 text-blue-600" />
                {t('reports.totalSales')}
              </CardTitle>
              <CardDescription>
                {t('reports.filterByDate')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <RevenueChart data={chartData?.data || []} />
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                {t('dashboard.quickActions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Button variant="outline" className={`w-full justify-start gap-2 ${action.color} transition-colors`}>
                    <action.icon className="h-4 w-4" />
                    {action.title}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Invoices */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                {t('reports.recentInvoices')}
              </CardTitle>
              <CardDescription>{t('invoices.title')}</CardDescription>
            </div>
            <Link href="/dashboard/invoices">
              <Button variant="ghost" size="sm" className="gap-1">
                {t('common.show')} <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {salesLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : salesReport?.invoices?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ReceiptIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{t('common.noResults')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {salesReport?.invoices?.slice(0, 5).map((invoice: any) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border-slate-200 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <ReceiptIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.customer?.firstName} {invoice.customer?.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900 dark:text-white">{formatCurrency(invoice.total)}</p>
                      <Badge
                        variant={
                          invoice.status === 'PAID'
                            ? 'default'
                            : invoice.status === 'OVERDUE'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="text-xs"
                      >
                        {t(`invoices.${invoice.status.toLowerCase()}`)}
                      </Badge>
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'fr', ['common'])),
    },
  };
};
