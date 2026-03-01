'use client';

import { useGetSalesReportQuery } from '@/redux/api/reports';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useMemo } from 'react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

interface RevenueChartProps {
  data?: Array<{
    date: string;
    total: number;
    paid: number;
  }>;
}

export function RevenueChart({ data = [] }: RevenueChartProps) {
  const { t } = useTranslation('common');
  const router = useRouter();

  const chartData = useMemo(() => {
    const locale = router.locale === 'en' ? 'en-US' : 'fr-FR';
    return data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString(locale, { 
        month: 'short', 
        day: 'numeric' 
      })
    }));
  }, [data, router.locale]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
          <XAxis 
            dataKey="date" 
            className="text-xs fill-slate-500 dark:fill-slate-400"
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            className="text-xs fill-slate-500 dark:fill-slate-400"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={(value: number) => [value.toLocaleString() + ' CFA', '']}
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#3B82F6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorTotal)" 
            name={t('reports.totalSales')}
          />
          <Area 
            type="monotone" 
            dataKey="paid" 
            stroke="#10B981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPaid)" 
            name={t('reports.totalPaid')}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface SalesBarChartProps {
  data?: Array<{
    name: string;
    value: number;
  }>;
}

export function SalesBarChart({ data = [] }: SalesBarChartProps) {
  const { t } = useTranslation('common');

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" vertical={false} />
          <XAxis 
            dataKey="name" 
            className="text-xs fill-slate-500 dark:fill-slate-400"
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            className="text-xs fill-slate-500 dark:fill-slate-400"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={(value: number) => [value.toLocaleString() + ' CFA', t('reports.totalSales')]}
          />
          <Bar 
            dataKey="value" 
            fill="#3B82F6" 
            radius={[4, 4, 0, 0]}
            name={t('reports.totalSales')}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CategoryPieChartProps {
  data?: Array<{
    name: string;
    value: number;
  }>;
}

export function CategoryPieChart({ data = [] }: CategoryPieChartProps) {
  const { t } = useTranslation('common');

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={(value: number) => [value.toLocaleString() + ' CFA', '']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
