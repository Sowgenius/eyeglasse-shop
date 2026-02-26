import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { getProductColumns } from '@/components/layouts/table/columns';
import { DataTable } from '@/components/layouts/table/data-table';
import { Toaster } from '@/components/ui/toaster';
import { useProductsQuery } from '@/redux/api/products';
import { Params } from '@/types/query-params';
import { createContext, useState } from 'react';
import { useTranslation } from 'next-i18next';

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
      <ProductsContext.Provider
        value={{ setUrlParams, params, removeUrlParams }}
      >
        {isSuccess && <DataTable data={products as any} columns={columns} />}
      </ProductsContext.Provider>

      <Toaster />
    </DashboardLayout>
  );
}
