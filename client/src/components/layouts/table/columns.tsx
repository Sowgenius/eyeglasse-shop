import { Checkbox } from '@/components/ui/checkbox';
import { formatCurrency } from '@/lib/format-currency';
import { regexSearch } from '@/lib/regex-search';
import { Product } from '@/types/product';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { SellProduct } from './row-actions/sell-product';
import { TFunction } from 'next-i18next';

export function getProductColumns(t: TFunction): ColumnDef<Product>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('common.selectAll')}
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'actions',
      header: () => (
        <div className="whitespace-nowrap flex items-center justify-center gap-3">
          {t('common.actions')}
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center items-center gap-3">
          <DataTableRowActions row={row} />
          <SellProduct row={row} />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('products.productName')} />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <span className="max-w-[250px] truncate font-medium">
            {row.getValue('name')}
          </span>
        </div>
      ),
      filterFn: regexSearch,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'brand',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="min-w-28"
          column={column}
          title={t('products.brand')}
        />
      ),
      cell: ({ row }) => {
        return <>{row.getValue('brand')}</>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      enableSorting: false,
    },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('products.price')} />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-right">
            {formatCurrency(row.getValue('price'))}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return row.getValue<number>(id) >= Number(value);
      },
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="max-w-fit mx-auto"
          column={column}
          title={t('products.quantity')}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center max-w-fit mx-auto">
            {row.getValue('quantity')}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return row.getValue<number>(id) >= Number(value);
      },
    },
    {
      accessorKey: 'frame.material',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('products.frameMaterial')} />
      ),
      cell: (row) => {
        return <>{row.getValue()}</>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'frame.shape',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('products.frameShape')} />
      ),
      cell: (row) => {
        return <>{row.getValue()}</>;
      },
      filterFn: regexSearch,
    },
    {
      accessorKey: 'lens_type',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('products.lensType')} />
      ),
      cell: ({ row }) => {
        return <div className="min-w-24">{row.getValue('lens_type')}</div>;
      },
      filterFn: regexSearch,
    },
    {
      accessorKey: 'color',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('products.color')} />
      ),
      cell: ({ row }) => {
        return <div className="max-w-36 truncate">{row.getValue('color')}</div>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'gender',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('products.gender')} />
      ),
      cell: (row) => {
        return <>{row.getValue()}</>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'hinge_type',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          className="max-w-fit"
          column={column}
          title={t('products.hingeType')}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="whitespace-nowrap capitalize">
            {row.getValue('hinge_type')}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'temple_length',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="max-w-fit mx-auto"
          column={column}
          title={t('products.templeLength')}
        />
      ),
      cell: (row) => {
        return <div className="text-center">{row.getValue() + ' mm'}</div>;
      },
      filterFn: (row, id, value) => {
        return row.getValue<number>(id) === Number(value);
      },
    },
    {
      accessorKey: 'bridge_size',
      header: ({ column }) => (
        <DataTableColumnHeader
          className="max-w-fit mx-auto"
          column={column}
          title={t('products.bridgeSize')}
        />
      ),
      cell: ({ row }) => {
        return (
          <div className="text-center">{row.getValue('bridge_size') + ' mm'}</div>
        );
      },
      filterFn: (row, id, value) => {
        return row.getValue<number>(id) === Number(value);
      },
    },
  ];
}

export const columns: ColumnDef<Product>[] = [];
