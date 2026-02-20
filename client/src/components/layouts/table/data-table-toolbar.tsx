import { Button } from '@/components/ui/button';
import { ProductsContext } from '@/pages/dashboard';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { HistoryIcon } from 'lucide-react';
import { useContext } from 'react';
import { useTranslation } from 'next-i18next';
import { SalesHistory } from '../user-profile/sales-history';
import { BulkDelete } from './row-actions/bulk-delete';
import { FilterTable } from './data-table-filter';
import { DataTableViewOptions } from './data-table-view-options';
import { AddProduct } from './row-actions/add-product';

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const isSelected =
    table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

  const context = useContext(ProductsContext);
  const { t } = useTranslation('common');

  if (!context) return;

  return (
    <div className="flex justify-between items-center gap-3">
      <DataTableViewOptions table={table} />

      <div className="flex items-center gap-x-2 mr-auto">
        <FilterTable table={table} />

        {(isFiltered || context.params) && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              context.removeUrlParams();
            }}
            className="h-8 px-2 lg:px-3"
          >
            {t('toolbar.reset')}
            <Cross2Icon className="ml-2 size-4" />
          </Button>
        )}
      </div>

      {isSelected && <BulkDelete table={table} />}

      <SalesHistory>
        <Button
          variant="outline"
          size="sm"
          className="h-8 hidden sm:flex border-dashed"
        >
          <HistoryIcon className="mr-2 size-4" />
          {t('toolbar.salesHistory')}
        </Button>
      </SalesHistory>
      <AddProduct />
    </div>
  );
}

