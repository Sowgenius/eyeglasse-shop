import { Button } from '@/components/ui/button';
import * as D from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateInvoiceMutation } from '@/redux/api/invoices';
import { useGetCustomersQuery } from '@/redux/api/customers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Receipt, Plus, Trash, Search } from 'lucide-react';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { z } from 'zod';
import { formatCurrency } from '@/lib/format-currency';

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.coerce.number().int().positive('Quantity must be positive'),
  unitPrice: z.coerce.number().positive('Price must be positive'),
  discount: z.coerce.number().min(0).default(0),
  productId: z.string().optional(),
});

const invoiceSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export function AddInvoice() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createInvoice] = useCreateInvoiceMutation();
  const { data: customersData } = useGetCustomersQuery({ limit: 100 });
  const { t } = useTranslation('common');

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerId: '',
      items: [{ description: '', quantity: 1, unitPrice: 0, discount: 0 }],
      taxRate: 0,
      dueDate: '',
      notes: '',
      terms: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const items = form.watch('items');
  const taxRate = form.watch('taxRate') || 0;

  const subtotal = items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice - item.discount);
  }, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const handleSubmit = async (values: InvoiceFormValues) => {
    setIsLoading(true);
    await createInvoice({
      ...values,
      dueDate: values.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
    setIsOpen(false);
    setIsLoading(false);
    form.reset();
  };

  return (
    <>
      <D.Dialog open={isOpen} onOpenChange={setIsOpen}>
        <D.DialogTrigger asChild>
          <Button size={'sm'} className="flex gap-2 items-center h-8">
            <Plus className="size-4" />
            {t('invoices.addInvoice')}
          </Button>
        </D.DialogTrigger>
        <D.DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[94svh]">
          <D.DialogHeader className="mt-2">
            <D.DialogTitle className="flex gap-2">
              <Receipt className="size-5" />
              {t('invoices.addInvoice')}
            </D.DialogTitle>
            <D.DialogDescription className="text-left">
              {t('invoices.createInvoice')}
            </D.DialogDescription>
          </D.DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('customers.title')}</label>
                <select
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

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('invoices.items')}</label>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Input
                          {...form.register(`items.${index}.description`)}
                          placeholder={t('invoices.description')}
                        />
                      </div>
                      <div className="w-20">
                        <Input
                          {...form.register(`items.${index}.quantity`)}
                          type="number"
                          placeholder={t('invoices.quantity')}
                        />
                      </div>
                      <div className="w-28">
                        <Input
                          {...form.register(`items.${index}.unitPrice`)}
                          type="number"
                          placeholder={t('invoices.price')}
                        />
                      </div>
                      <div className="w-20">
                        <Input
                          {...form.register(`items.${index}.discount`)}
                          type="number"
                          placeholder={t('invoices.discount')}
                        />
                      </div>
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
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ description: '', quantity: 1, unitPrice: 0, discount: 0 })}
                >
                  <Plus className="size-4 mr-2" />
                  {t('invoices.addItem')}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('invoices.taxRate')}</label>
                  <Input
                    {...form.register('taxRate')}
                    type="number"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('invoices.dueDate')}</label>
                  <Input
                    {...form.register('dueDate')}
                    type="date"
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('invoices.subtotal')}:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('invoices.tax')} ({taxRate}%):</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>{t('invoices.total')}:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('invoices.notes')}</label>
                <textarea
                  {...form.register('notes')}
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder={t('invoices.notes')}
                />
              </div>

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full"
              >
                {isLoading ? t('common.saving') : t('invoices.createInvoice')}
              </Button>
            </form>
          </Form>
        </D.DialogContent>
      </D.Dialog>
    </>
  );
}
