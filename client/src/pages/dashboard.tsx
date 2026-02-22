import { Header } from '@/components/layouts/header';
import { columns } from '@/components/layouts/table/columns';
import { DataTable } from '@/components/layouts/table/data-table';
import { Toaster } from '@/components/ui/toaster';
import { useProductsQuery } from '@/redux/api/products';
import { Params } from '@/types/query-params';
import { createContext, useState } from 'react';

export type ContextType = {
  setUrlParams: (params: Params) => void;
  removeUrlParams: () => void;
  params: Params | undefined;
};

export const ProductsContext = createContext<ContextType | null>(null);

export default function Dashboard() {
  const [params, setParams] = useState<Params | undefined>(undefined);
  const { data: products, isSuccess } = useProductsQuery(params);

  function setUrlParams(params: Params) {
    setParams((prev) => ({ ...prev, ...params }));
  }

  function removeUrlParams() {
    setParams(undefined);
  }

  return (
    <>
      <Header />

      <ProductsContext.Provider
        value={{ setUrlParams, params, removeUrlParams }}
      >
        <main className="container py-9 sm:py-10">
          {isSuccess && <DataTable data={products as any} columns={columns} />}
        </main>
      </ProductsContext.Provider>

      <Toaster />
    </>
  );
}
