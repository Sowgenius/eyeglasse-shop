import { Button } from '@/components/ui/button';
import * as D from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCreateQuoteMutation } from '@/redux/api/quotes';
import { useGetCustomersQuery } from '@/redux/api/customers';
import { useProductsQuery } from '@/redux/api/products';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Plus, Trash, HelpCircle, Package, Percent } from 'lucide-react';
import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { z } from 'zod';
import { formatCurrency } from '@/lib/format-currency';

const quoteItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.coerce.number().int().positive('Quantity must be at least 1'),
  unitPrice: z.coerce.number().positive('Price must be positive'),
  discount: z.coerce.number().min(0).default(0),
  discountType: z.enum(['fixed', 'percentage']).default('percentage'),
  productId: z.string().optional(),
});

const quoteSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  items: z.array(quoteItemSchema).min(1, 'At least one item is required'),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  validUntil: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

export function AddQuote() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createQuote] = useCreateQuoteMutation();
  const { data: customersData } = useGetCustomersQuery({ limit: 100 });
  const { data: productsData } = useProductsQuery(undefined);
  const { t } = useTranslation('common');

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      customerId: '',
      items: [{ description: '', quantity: 1, unitPrice: 0, discount: 0, discountType: 'percentage', productId: '' }],
      taxRate: 0,
      validUntil: '',
      notes: '',
      terms: '',
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const items = form.watch('items');
  const taxRate = form.watch('taxRate') || 0;

  const calculateItemSubtotal = (item: typeof items[0]) => {
    const itemSubtotal = item.quantity * item.unitPrice;
    const discountAmount = item.discountType === 'percentage'
      ? itemSubtotal * (item.discount / 100)
      : item.discount;
    return itemSubtotal - discountAmount;
  };

  const subtotal = items.reduce((sum, item) => {
    return sum + calculateItemSubtotal(item);
  }, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const handleProductSelect = (index: number, productId: string, products: any[]) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      update(index, {
        ...items[index],
        productId,
        description: product.name,
        unitPrice: Number(product.price),
      });
    }
  };

  const handleSubmit = async (values: QuoteFormValues) => {
    setIsLoading(true);
    try {
      await createQuote(values).unwrap();
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error('Quote creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <D.Dialog open={isOpen} onOpenChange={setIsOpen}>
        <D.DialogTrigger asChild>
          <Button size={'sm'} className="flex gap-2 items-center h-8">
            <Plus className="size-4" />
            {t('quotes.addQuote')}
          </Button>
        </D.DialogTrigger>
        <D.DialogContent className="sm:max-w-[900px] overflow-y-auto max-h-[94svh]">
          <D.DialogHeader className="mt-2">
            <D.DialogTitle className="flex gap-2">
              <FileText className="size-5" />
              {t('quotes.addQuote')}
            </D.DialogTitle>
            <D.DialogDescription className="text-left">
              {t('quotes.createQuote')}
            </D.DialogDescription>
          </D.DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Customer Selection */}
              <div className="space-y-2">
                <Label htmlFor="customerId">
                  {t('customers.title')} <span className="text-red-500">*</span>
                </Label>
                <select
                  id="customerId"
                  {...form.register('customerId')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">{t('customers.selectCustomer')}</option>
                  {customersData?.data?.map((customer: any) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName}
                    </option>
                  ))}
                </select>
                {form.formState.errors.customerId && (
                  <p className="text-sm text-red-500">{form.formState.errors.customerId.message}</p>
                )}
              </div>

              {/* Quote Items */}
              <div className="space-y-3">
                <Label>
                  {t('quotes.items')} <span className="text-red-500">*</span>
                </Label>
                
                {/* Header Row - Desktop */}
                <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
                  <div className="col-span-4">{t('invoices.product')}</div>
                  <div className="col-span-2">{t('invoices.quantity')}</div>
                  <div className="col-span-2">{t('invoices.unitPrice')}</div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-1">
                      {t('invoices.discount')}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <HelpCircle className="h-3 w-3" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('invoices.discountTooltip')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="col-span-1">{t('invoices.total')}</div>
                  <div className="col-span-1"></div>
                </div>

                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-2 p-3 border rounded-md bg-slate-50/50">
                      {/* Product Selection */}
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground flex items-center gap-1">
                          <Package className="size-3" />
                          {t('products.selectProduct')} (Optional)
                        </label>
                        <select
                          {...form.register(`items.${index}.productId`)}
                          onChange={(e) => handleProductSelect(index, e.target.value, productsData || [])}
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="">{t('products.selectProduct')}</option>
                          {productsData?.map((product: any) => (
                            <option key={product.id} value={product.id}>
                              {product.name} - {formatCurrency(product.price)} (SKU: {product.sku})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Line Items Grid */}
                      <div className="grid grid-cols-12 gap-2 items-start">
                        <div className="col-span-4">
                          <Input
                            {...form.register(`items.${index}.description`)}
                            placeholder={t('invoices.description')}
                          />
                          {form.formState.errors.items?.[index]?.description && (
                            <p className="text-xs text-red-500 mt-1">{form.formState.errors.items[index]?.description?.message}</p>
                          )}
                        </div>
                        <div className="col-span-2">
                          <Input
                            {...form.register(`items.${index}.quantity`)}
                            type="number"
                            min="1"
                            placeholder={t('invoices.quantity')}
                          />
                          {form.formState.errors.items?.[index]?.quantity && (
                            <p className="text-xs text-red-500 mt-1">{form.formState.errors.items[index]?.quantity?.message}</p>
                          )}
                        </div>
                        <div className="col-span-2">
                          <Input
                            {...form.register(`items.${index}.unitPrice`)}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder={t('invoices.price')}
                          />
                          {form.formState.errors.items?.[index]?.unitPrice && (
                            <p className="text-xs text-red-500 mt-1">{form.formState.errors.items[index]?.unitPrice?.message}</p>
                          )}
                        </div>
                        <div className="col-span-2">
                          <div className="flex gap-1">
                            <div className="relative flex-1">
                              <Input
                                {...form.register(`items.${index}.discount`)}
                                type="number"
                                min="0"
                                placeholder="0"
                              />
                            </div>
                            <Controller
                              control={form.control}
                              name={`items.${index}.discountType`}
                              render={({ field }) => (
                                <select
                                  {...field}
                                  className="flex h-10 w-14 rounded-md border border-input bg-background px-1 py-2 text-sm font-medium"
                                >
                                  <option value="percentage">%</option>
                                  <option value="fixed">$</option>
                                </select>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-span-1 flex items-center justify-end text-sm font-medium pt-2">
                          {formatCurrency(calculateItemSubtotal(items[index]))}
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                          >
                            <Trash className="size-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {form.formState.errors.items?.root && (
                  <p className="text-sm text-red-500">{form.formState.errors.items.root.message}</p>
                )}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ description: '', quantity: 1, unitPrice: 0, discount: 0, discountType: 'percentage', productId: '' })}
                >
                  <Plus className="size-4 mr-2" />
                  {t('quotes.addItem')}
                </Button>
              </div>

              {/* Tax and Valid Until */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">
                    <div className="flex items-center gap-1">
                      <Percent className="size-4" />
                      {t('invoices.taxRate')}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <HelpCircle className="h-3 w-3" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t('invoices.taxRateTooltip')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </Label>
                  <div className="relative">
                    <Input
                      id="taxRate"
                      {...form.register('taxRate')}
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-2 text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil">{t('quotes.validUntil')}</Label>
                  <Input
                    id="validUntil"
                    {...form.register('validUntil')}
                    type="date"
                  />
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('invoices.subtotal')}:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Percent className="size-3" />
                    {t('invoices.tax')} ({taxRate}%):
                  </span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>{t('invoices.total')}:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">{t('invoices.notes')}</Label>
                <textarea
                  id="notes"
                  {...form.register('notes')}
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Additional notes for this quote..."
                />
              </div>

              {/* Terms */}
              <div className="space-y-2">
                <Label htmlFor="terms">{t('quotes.terms')}</Label>
                <textarea
                  id="terms"
                  {...form.register('terms')}
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Quote validity, payment terms, etc."
                />
              </div>

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full"
              >
                {isLoading ? t('common.saving') : t('quotes.createQuote')}
              </Button>
            </form>
          </Form>
        </D.DialogContent>
      </D.Dialog>
    </>
  );
}
