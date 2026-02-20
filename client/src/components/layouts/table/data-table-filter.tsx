import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Filter } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableRangeFilter } from './data-table-range-filter';
import { DataTableToolbarProps } from './data-table-toolbar';

function isNumberField(id: string) {
  return ['price', 'quantity', 'temple_length', 'bridge_size'].some(
    (val) => val === id
  );
}

export function FilterTable<TData>({ table }: DataTableToolbarProps<TData>) {
  const { t } = useTranslation('common');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed flex items-center gap-1.5"
        >
          <Filter className="size-4" />
          {t('common.filter')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start" sideOffset={6}>
        <Command>
          <CommandInput placeholder={t('common.filter')} />
          <CommandList>
            <CommandEmpty>{t('common.noResults')}</CommandEmpty>
            <CommandGroup>
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== 'undefined' &&
                    column.getCanHide() &&
                    column.getIsVisible()
                )
                .map((column) => {
                  const row = table.getColumn(column.id);
                  const facets = column?.getFacetedUniqueValues();

                  if (isNumberField(column.id)) {
                    return (
                      <CommandItem key={column.id} className="capitalize">
                        {row && (
                          <DataTableRangeFilter
                            title={column.id.split('_').join(' ')}
                          />
                        )}
                      </CommandItem>
                    );
                  }

                  return (
                    <CommandItem key={column.id} className="capitalize">
                      {row && (
                        <DataTableFacetedFilter
                          column={row}
                          title={column.id.split('_').join(' ')}
                          options={Array.from(facets.keys())}
                        />
                      )}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
