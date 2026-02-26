import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDashboardStatsQuery, useGetSalesReportQuery } from '@/redux/api/reports';
import { useTranslation } from 'next-i18next';
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
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useRouter } from 'next/router';

export default function DashboardOverview() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale === 'en' ? enUS : fr;
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: salesReport, isLoading: salesLoading } = useGetSalesReportQuery({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const statCards = [
    {
      title: t('dashboard.todayRevenue'),
      value: stats?.todayRevenue ? formatCurrency(stats.todayRevenue) : formatCurrency(0),
      icon: TrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/dashboard/invoices',
    },
    {
      title: t('dashboard.totalCustomers'),
      value: stats?.totalCustomers || 0,
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/dashboard/customers',
    },
    {
      title: t('dashboard.totalProducts'),
      value: stats?.totalProducts || 0,
      icon: PackageIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/dashboard/products',
    },
    {
      title: t('dashboard.totalInvoices'),
      value: stats?.totalInvoices || 0,
      icon: ReceiptIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/dashboard/invoices',
    },
  ];

  const alertCards = [
    {
      title: t('dashboard.pendingInvoices'),
      value: stats?.pendingInvoices || 0,
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      href: '/dashboard/invoices',
    },
    {
      title: t('dashboard.overdueInvoices'),
      value: stats?.overdueInvoices || 0,
      icon: AlertTriangleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      href: '/dashboard/invoices',
    },
  ];

  const quickActions = [
    {
      title: t('products.addProduct'),
      icon: PlusIcon,
      href: '/dashboard/products',
    },
    {
      title: t('quotes.addQuote'),
      icon: FileTextIcon,
      href: '/dashboard/quotes',
    },
    {
      title: t('customers.addCustomer'),
      icon: UsersIcon,
      href: '/dashboard/customers',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.welcome')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('navigation.dashboard')}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, index) => (
            <Link key={index} href={card.href || '#'}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
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
                    <div className="text-2xl font-bold">{card.value}</div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {alertCards.map((alert, index) => (
            <Link key={index} href={alert.href || '#'}>
              <Card className={`border-2 ${alert.borderColor} hover:shadow-md transition-shadow cursor-pointer`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
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
                    <div className="text-2xl font-bold">{alert.value}</div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {stats && stats.lowStockProducts > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800 flex items-center gap-2">
                <AlertTriangleIcon className="h-4 w-4" />
                {t('dashboard.lowStock')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700">
                {stats.lowStockProducts} {t('products.lowStockAlert').toLowerCase()}
              </p>
              <Link href="/dashboard/products" className="text-sm text-yellow-600 hover:underline mt-2 inline-block">
                {t('common.show')} {t('navigation.products')} <ArrowRightIcon className="inline h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>{t('reports.recentInvoices')}</CardTitle>
              <CardDescription>{t('invoices.title')}</CardDescription>
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
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <ReceiptIcon className="h-4 w-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.customer?.firstName} {invoice.customer?.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(invoice.total)}</p>
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
              <Link
                href="/dashboard/invoices"
                className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('common.show')} {t('navigation.invoices')}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <action.icon className="h-4 w-4" />
                    {action.title}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Toaster />
    </DashboardLayout>
  );
}
