'use client';

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
} from 'recharts';
import { useMemo } from 'react';

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
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#000000" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#666666" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#666666" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis 
            dataKey="date" 
            className="text-xs fill-gray-500 dark:fill-gray-400"
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            className="text-xs fill-gray-500 dark:fill-gray-400"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #000',
              borderRadius: '4px',
            }}
            formatter={(value: number) => [value.toLocaleString() + ' CFA', '']}
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#000000" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorTotal)" 
            name={t('reports.totalSales')}
          />
          <Area 
            type="monotone" 
            dataKey="paid" 
            stroke="#666666" 
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
