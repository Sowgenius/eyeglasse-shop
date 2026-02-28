import { Button } from '@/components/ui/button';
import * as D from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGetInvoiceQuery, useUpdateInvoiceMutation, useAddPaymentMutation } from '@/redux/api/invoices';
import { useGetCustomersQuery } from '@/redux/api/customers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Receipt, CreditCard, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { z } from 'zod';
import { formatCurrency } from '@/lib/format-currency';

const invoiceSchema = z.object({
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

const paymentSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  method: z.enum(['CASH', 'CHECK', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'INSURANCE', 'OTHER']),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;
type PaymentFormValues = z.infer<typeof paymentSchema>;

interface EditInvoiceProps {
  invoiceId: string;
  trigger?: React.ReactNode;
}

export function EditInvoice({ invoiceId, trigger }: EditInvoiceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [updateInvoice] = useUpdateInvoiceMutation();
  const [addPayment] = useAddPaymentMutation();
  const { data: invoice } = useGetInvoiceQuery(invoiceId);
  const { t } = useTranslation('common');

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    values: invoice ? {
      dueDate: invoice.dueDate ? invoice.dueDate.split('T')[0] : '',
      notes: invoice.notes || '',
      terms: invoice.terms || '',
    } : undefined,
  });

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: invoice?.balanceDue || 0,
      method: 'CASH',
      reference: '',
      notes: '',
    },
  });

  const handleUpdate = async (values: InvoiceFormValues) => {
    setIsLoading(true);
    await updateInvoice({ id: invoiceId, data: values });
    setIsLoading(false);
  };

  const handlePayment = async (values: PaymentFormValues) => {
    setIsLoading(true);
    await addPayment({ id: invoiceId, data: values });
    setIsLoading(false);
    setShowPayment(false);
    setIsOpen(false);
  };

  return (
    <>
      <D.Dialog open={isOpen} onOpenChange={setIsOpen}>
        <D.DialogTrigger asChild>
          {trigger || (
            <Button variant="ghost" size="icon">
              <Receipt className="h-4 w-4" />
            </Button>
          )}
        </D.DialogTrigger>
        <D.DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[94svh]">
          <D.DialogHeader className="mt-2">
            <D.DialogTitle className="flex gap-2">
              <Receipt className="size-5" />
              {t('invoices.invoiceNumber')}: {invoice?.invoiceNumber}
            </D.DialogTitle>
            <D.DialogDescription className="text-left">
              <Badge variant={invoice?.status === 'PAID' ? 'default' : invoice?.status === 'OVERDUE' ? 'destructive' : 'secondary'}>
                {t(`invoices.${invoice?.status?.toLowerCase()}`)}
              </Badge>
            </D.DialogDescription>
          </D.DialogHeader>

          {invoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">{t('invoices.total')}</p>
                  <p className="font-semibold">{formatCurrency(invoice.total)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('invoices.amountPaid')}</p>
                  <p className="font-semibold text-green-600">{formatCurrency(invoice.amountPaid)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('invoices.balanceDue')}</p>
                  <p className="font-semibold text-red-600">{formatCurrency(invoice.balanceDue)}</p>
                </div>
              </div>

              {!showPayment && invoice.status !== 'PAID' && (
                <>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t('invoices.dueDate')}</label>
                        <Input {...form.register('dueDate')} type="date" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t('invoices.notes')}</label>
                        <textarea
                          {...form.register('notes')}
                          className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t('invoices.terms')}</label>
                        <textarea
                          {...form.register('terms')}
                          className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={isLoading} className="flex-1">
                          {t('common.save')}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowPayment(true)}>
                          <CreditCard className="size-4 mr-2" />
                          {t('invoices.addPayment')}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </>
              )}

              {showPayment && (
                <Form {...paymentForm}>
                  <form onSubmit={paymentForm.handleSubmit(handlePayment)} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('invoices.amountPaid')}</label>
                      <Input
                        {...paymentForm.register('amount')}
                        type="number"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('invoices.paymentMethod')}</label>
                      <select
                        {...paymentForm.register('method')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="CASH">{t('invoices.cash')}</option>
                        <option value="CHECK">{t('invoices.check')}</option>
                        <option value="CREDIT_CARD">{t('invoices.creditCard')}</option>
                        <option value="DEBIT_CARD">{t('invoices.debitCard')}</option>
                        <option value="BANK_TRANSFER">{t('invoices.bankTransfer')}</option>
                        <option value="INSURANCE">{t('invoices.insurance')}</option>
                        <option value="OTHER">{t('invoices.other')}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Reference</label>
                      <Input {...paymentForm.register('reference')} placeholder="Transaction ID, check number, etc." />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isLoading} className="flex-1">
                        {t('common.save')}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowPayment(false)}>
                        {t('common.cancel')}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          )}
        </D.DialogContent>
      </D.Dialog>
    </>
  );
}
