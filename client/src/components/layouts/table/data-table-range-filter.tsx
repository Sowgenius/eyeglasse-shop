import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { ContextType, ProductsContext } from '@/pages/dashboard/products';
import { useContext, useState } from 'react';

const defaultValues = {
  min_price: '',
  max_price: '',
  value: '',
};

interface DataTableRangeFilterProps {
  title: string;
}

export function DataTableRangeFilter({ title }: DataTableRangeFilterProps) {
  const [inputValues, setInputValues] = useState(defaultValues);
  const context = useContext(ProductsContext);

  if (!context) return;

  return (
    <Popover>
      <PopoverTrigger className="capitalize w-full text-start">
        {title}
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start" sideOffset={8}>
        <h4 className="capitalize text-sm font-medium pt-1.5 px-2.5">
          {title}
        </h4>

        {title === 'price' ? (
          <div className="p-2.5 grid grid-cols-2 gap-2">
            <input
              className="transition-all outline-none border rounded-md px-2 h-8 min-w-0 focus-visible:ring-1 focus-visible:ring-slate-300 text-sm"
              defaultValue={inputValues.min_price}
              value={inputValues.min_price}
              onChange={(e) => {
                setInputValues((prev) => ({
                  ...prev,
                  min_price: e.target.value,
                }));
              }}
              type="number"
              placeholder="Min price"
            />
            <input
              className="transition-all outline-none border rounded-md px-2 h-8 min-w-0 focus-visible:ring-1 focus-visible:ring-slate-300 text-sm"
              defaultValue={inputValues.max_price}
              value={inputValues.max_price}
              onChange={(e) => {
                setInputValues((prev) => ({
                  ...prev,
                  max_price: e.target.value,
                }));
              }}
              type="number"
              placeholder="Max price"
            />
          </div>
        ) : (
          <div className="grid p-2.5">
            <input
              className="transition-all outline-none border rounded-md px-2 h-8 min-w-0 focus-visible:ring-1 focus-visible:ring-slate-300 text-sm w-full"
              defaultValue={inputValues.value}
              value={inputValues.value}
              onChange={(e) => {
                setInputValues((prev) => ({
                  ...prev,
                  value: e.target.value,
                }));
              }}
              type="number"
              placeholder={title}
            />
          </div>
        )}
        <Separator />
        <div className="grid grid-cols-2 gap-2 p-1.5">
          <Button
            variant={'ghost'}
            onClick={() => setInputValues(defaultValues)}
            className="justify-center text-center h-8 font-normal"
          >
            Clear filters
          </Button>
          <Button
            variant={'ghost'}
            onClick={() => {
              handleSave(context, title, inputValues);
            }}
            className="justify-center text-center h-8 border border-dashed font-medium"
          >
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function handleSave(
  context: ContextType,
  title: string,
  inputValues: typeof defaultValues
) {
  if (title === 'price') {
    if (inputValues.min_price && inputValues.max_price) {
      context.setUrlParams({
        min_price: inputValues.min_price,
        max_price: inputValues.max_price,
      });
    } else if (inputValues.min_price) {
      context.setUrlParams({
        min_price: inputValues.min_price,
      });
    } else if (inputValues.max_price) {
      context.setUrlParams({
        max_price: inputValues.max_price,
      });
    }
  } else {
    context.setUrlParams({
      [title.split(' ').join('_')]: inputValues.value,
    });
  }
}
