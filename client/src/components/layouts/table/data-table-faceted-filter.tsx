import { CheckIcon } from '@radix-ui/react-icons';
import { Column } from '@tanstack/react-table';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useTranslation } from 'next-i18next';

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: string[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const { t } = useTranslation('common');
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger className="capitalize w-full text-start">
        {title}
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start" sideOffset={8}>
        <Command>
          <CommandInput
            className="placeholder:capitalize"
            placeholder={title}
          />
          <CommandList>
            <CommandEmpty>{t('common.noResults')}</CommandEmpty>
            <CommandGroup>
              {options.map((value) => {
                const isSelected = selectedValues.has(value);
                return (
                  <CommandItem
                    key={value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(value);
                      } else {
                        selectedValues.add(value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    <span>{value}</span>
                    {facets?.get(value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
