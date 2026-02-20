import * as D from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/format-currency';
import { useSalesHistoryQuery } from '@/redux/api/sales';
import { HistoryIcon } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from '../../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

const categorizeByOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

export function SalesHistory({ children }: { children: ReactNode }) {
  const [categorizeBy, setCategorizeBy] = useState('monthly');
  const { data } = useSalesHistoryQuery(categorizeBy.toLowerCase());
  const { t } = useTranslation('common');

  const translateCategory = (cat: string) => {
    const key = cat.toLowerCase() as 'daily' | 'weekly' | 'monthly' | 'yearly';
    return t(`salesHistory.${key}`);
  };

  return (
    <D.Dialog>
      <D.DialogTrigger asChild>{children}</D.DialogTrigger>
      <D.DialogContent className="md:max-w-[900px] overflow-y-auto max-h-[94svh]">
        <D.DialogHeader className="mb-8 mt-2 flex flex-row justify-between items-center">
          <D.DialogTitle className="flex items-center gap-2">
            <HistoryIcon className="size-4 min-[400px]:size-5" />

            <span className="max-sm:text-base text-start">{t('salesHistory.title')}</span>

            <Badge className="capitalize max-[400px]:hidden">
              {translateCategory(categorizeBy)}
            </Badge>
          </D.DialogTitle>

          <div className="w-24 sm:w-36">
            <Select onValueChange={setCategorizeBy} defaultValue={categorizeBy}>
              <SelectTrigger className="h-8 sm:h-9">
                <SelectValue placeholder={t('salesHistory.categorizeBy')} />
              </SelectTrigger>
              <SelectContent>
                {categorizeByOptions.map((label) => (
                  <SelectItem key={label} value={label.toLowerCase()}>
                    {t(`salesHistory.${label.toLowerCase()}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </D.DialogHeader>

        {!data || data.length < 2 ? (
          <p className="text-center sm:text-lg -mt-5">
            {t('salesHistory.notEnoughData')}
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis
                dataKey="_id"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={formatCurrency} />
              <Bar
                dataKey="total_sales"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </D.DialogContent>
    </D.Dialog>
  );
}
