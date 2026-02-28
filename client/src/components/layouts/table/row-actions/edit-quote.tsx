import { Button } from '@/components/ui/button';
import * as D from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGetQuoteQuery, useUpdateQuoteMutation, useConvertQuoteToInvoiceMutation } from '@/redux/api/quotes';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Send, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { z } from 'zod';

const quoteSchema = z.object({
  validUntil: z.string().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  status: z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED']).optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

interface EditQuoteProps {
  quoteId: string;
  trigger?: React.ReactNode;
}

export function EditQuote({ quoteId, trigger }: EditQuoteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updateQuote] = useUpdateQuoteMutation();
  const [convertQuoteToInvoice] = useConvertQuoteToInvoiceMutation();
  const { data: quote } = useGetQuoteQuery(quoteId);
  const { t } = useTranslation('common');

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    values: quote ? {
      validUntil: quote.validUntil ? quote.validUntil.split('T')[0] : '',
      notes: quote.notes || '',
      terms: quote.terms || '',
    } : undefined,
  });

  const handleUpdate = async (values: QuoteFormValues) => {
    setIsLoading(true);
    await updateQuote({ id: quoteId, data: values });
    setIsLoading(false);
  };

  const handleConvert = async () => {
    setIsLoading(true);
    await convertQuoteToInvoice(quoteId);
    setIsLoading(false);
    setIsOpen(false);
  };

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-800',
    SENT: 'bg-blue-100 text-blue-800',
    ACCEPTED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    EXPIRED: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <>
      <D.Dialog open={isOpen} onOpenChange={setIsOpen}>
        <D.DialogTrigger asChild>
          {trigger || (
            <Button variant="ghost" size="icon">
              <FileText className="h-4 w-4" />
            </Button>
          )}
        </D.DialogTrigger>
        <D.DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[94svh]">
          <D.DialogHeader className="mt-2">
            <D.DialogTitle className="flex gap-2">
              <FileText className="size-5" />
              {t('quotes.quoteNumber')}: {quote?.quoteNumber}
            </D.DialogTitle>
            <D.DialogDescription className="text-left">
              <Badge className={statusColors[quote?.status || 'DRAFT']}>
                {t(`quotes.${quote?.status?.toLowerCase()}`)}
              </Badge>
            </D.DialogDescription>
          </D.DialogHeader>

          {quote && (
            <div className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('quotes.status')}</label>
                      <select
                        {...form.register('status')}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="DRAFT">{t('quotes.draft')}</option>
                        <option value="SENT">{t('quotes.sent')}</option>
                        <option value="ACCEPTED">{t('quotes.accepted')}</option>
                        <option value="REJECTED">{t('quotes.rejected')}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('quotes.validUntil')}</label>
                      <Input {...form.register('validUntil')} type="date" />
                    </div>
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
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {t('common.save')}
                  </Button>
                </form>
              </Form>

              {quote.status === 'SENT' && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={handleConvert} disabled={isLoading} className="flex-1">
                    <Check className="size-4 mr-2" />
                    {t('quotes.convertToInvoice')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </D.DialogContent>
      </D.Dialog>
    </>
  );
}
