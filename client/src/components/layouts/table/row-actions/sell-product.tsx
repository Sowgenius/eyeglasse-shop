import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import * as D from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useSellProductMutation } from '@/redux/api/sales';
import { Product } from '@/types/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { Row } from '@tanstack/react-table';
import { format } from 'date-fns';
import { BadgeDollarSign, Calendar as CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { z } from 'zod';
import { DownloadInvoice } from '../../download-invoice';

export function SellProduct({ row }: { row: Row<Product> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sellProduct, { isLoading, error }] = useSellProductMutation();
  const { t } = useTranslation('common');

  const { toast } = useToast();

  const productId = row.original._id;
  const quantity = row.original.quantity;

  const sellingFormSchema = z.object({
    buyer_name: z.string(),
    sold_on: z.date(),
    quantity_sold: z.coerce.number().max(quantity, `Only ${quantity} left`),
  });

  const form = useForm<z.infer<typeof sellingFormSchema>>({
    resolver: zodResolver(sellingFormSchema),
  });

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    }
  }, [error, toast]);

  return (
    <D.Dialog open={isOpen} onOpenChange={setIsOpen}>
      <D.DialogTrigger>
        <Button
          variant={'default'}
          className="py-1 h-auto text-sm rounded flex gap-1.5"
        >
          <BadgeDollarSign className="size-4" />
          {t('products.actions.sell')}
        </Button>
      </D.DialogTrigger>
      <D.DialogContent className="sm:max-w-[425px]">
        <D.DialogHeader>
<D.DialogTitle className="flex gap-2">
            <BadgeDollarSign className="size-5" />
            {t('products.sellProduct')}
          </D.DialogTitle>
          <D.DialogDescription className="text-start">
            {t('products.sellingProduct')}
          </D.DialogDescription>
        </D.DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              sellProduct({ body: values, productId });

              toast({
                description: t('common.success'),
                action: (
                  <DownloadInvoice
                    data={{
                      ...values,
                      total_sale: row.original.price * values.quantity_sold,
                      productId: {
                        name: row.original.name,
                        price: row.original.price,
                      },
                    }}
                    isToast={true}
                  />
                ),
              });

              form.reset();
              setIsOpen(false);
            })}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="buyer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sales.buyerName')}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="transition-all"
                      placeholder={t('sales.buyerName')}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity_sold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sales.quantitySold')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="transition-all"
                      placeholder={t('sales.quantitySold')}
                      disabled={isLoading}
                      min={1}
                      max={quantity}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sold_on"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('sales.soldOn')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal flex items-center w-full',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>{t('sales.pickDate')}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </Form>
      </D.DialogContent>
    </D.Dialog>
  );
}
