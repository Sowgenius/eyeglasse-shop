import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetDashboardStatsQuery } from '@/redux/api/reports';
import { useTranslation } from 'next-i18next';
import {
  UsersIcon,
  PackageIcon,
  ReceiptIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  ClockIcon,
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

export default function DashboardOverview() {
  const { t } = useTranslation('common');
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  const statCards = [
    {
      title: t('dashboard.todayRevenue'),
      value: stats?.todayRevenue ? `€${stats.todayRevenue.toFixed(2)}` : '€0.00',
      icon: TrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: t('dashboard.totalCustomers'),
      value: stats?.totalCustomers || 0,
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('dashboard.totalProducts'),
      value: stats?.totalProducts || 0,
      icon: PackageIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: t('dashboard.totalInvoices'),
      value: stats?.totalInvoices || 0,
      icon: ReceiptIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: t('dashboard.pendingInvoices'),
      value: stats?.pendingInvoices || 0,
      icon: ClockIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: t('dashboard.overdueInvoices'),
      value: stats?.overdueInvoices || 0,
      icon: AlertTriangleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('dashboard.welcome')}</h1>
          <p className="text-muted-foreground">{t('navigation.dashboard')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-8 animate-pulse bg-slate-100 rounded" />
                ) : (
                  <div className="text-2xl font-bold">{card.value}</div>
                )}
              </CardContent>
            </Card>
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
            </CardContent>
          </Card>
        )}
      </div>

      <Toaster />
    </DashboardLayout>
  );
}
