import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { getProductColumns } from '@/components/layouts/table/columns';
import { DataTable } from '@/components/layouts/table/data-table';
import { Toaster } from '@/components/ui/toaster';
import { useProductsQuery } from '@/redux/api/products';
import { Params } from '@/types/query-params';
import { createContext, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { AddProduct } from '@/components/layouts/table/row-actions/add-product';

export type ContextType = {
  setUrlParams: (params: Params) => void;
  removeUrlParams: () => void;
  params: Params | undefined;
};

export const ProductsContext = createContext<ContextType | null>(null);

export default function DashboardProducts() {
  const { t } = useTranslation('common');
  const [params, setParams] = useState<Params | undefined>(undefined);
  const { data: products, isSuccess } = useProductsQuery(params);

  function setUrlParams(params: Params) {
    setParams((prev) => ({ ...prev, ...params }));
  }

  function removeUrlParams() {
    setParams(undefined);
  }

  const columns = getProductColumns(t);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('products.title')}</h1>
          </div>
          <AddProduct />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('common.search')}
                  className="pl-10"
                  value={params?.search || ''}
                  onChange={(e) => setUrlParams({ search: e.target.value })}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ProductsContext.Provider
              value={{ setUrlParams, params, removeUrlParams }}
            >
              {isSuccess && <DataTable data={products as any} columns={columns} />}
            </ProductsContext.Provider>
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </DashboardLayout>
  );
}
