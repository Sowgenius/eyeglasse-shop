import { Button } from '@/components/ui/button';
import * as D from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/format-currency';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { PrinterIcon, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'fixed' | 'percentage';
}

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  status: string;
  dueDate: string;
  notes?: string;
  terms?: string;
  createdAt: string;
}

interface PrintInvoiceProps {
  invoice: InvoiceData;
}

export function PrintInvoice({ invoice }: PrintInvoiceProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale === 'en' ? enUS : fr;
  const [isPrintMode, setIsPrintMode] = useState(false);

  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
  };

  const calculateItemTotal = (item: InvoiceItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = item.discountType === 'percentage'
      ? subtotal * (item.discount / 100)
      : item.discount;
    return subtotal - discountAmount;
  };

  if (isPrintMode) {
    return (
      <div className="print-container">
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            @page {
              margin: 1cm;
            }
          }
        `}</style>
        
        <div className="print-area p-8 max-w-3xl mx-auto">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold">INVOICE</h1>
              <p className="text-lg text-gray-600">#{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">Issue Date: {format(new Date(invoice.createdAt), 'dd MMMM yyyy', { locale })}</p>
              <p className="font-semibold">Due Date: {format(new Date(invoice.dueDate), 'dd MMMM yyyy', { locale })}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To:</h2>
            <div className="text-lg">
              <p className="font-semibold">{invoice.customer.firstName} {invoice.customer.lastName}</p>
              {invoice.customer.email && <p>{invoice.customer.email}</p>}
              {invoice.customer.phone && <p>{invoice.customer.phone}</p>}
              {invoice.customer.address && <p>{invoice.customer.address}</p>}
              {invoice.customer.city && <p>{invoice.customer.city}</p>}
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-8 border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3">Description</th>
                <th className="text-center py-3">Qty</th>
                <th className="text-right py-3">Unit Price</th>
                <th className="text-right py-3">Discount</th>
                <th className="text-right py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3">{item.description}</td>
                  <td className="text-center py-3">{item.quantity}</td>
                  <td className="text-right py-3">{formatCurrency(item.unitPrice)}</td>
                  <td className="text-right py-3">
                    {item.discountType === 'percentage' ? `${item.discount}%` : formatCurrency(item.discount)}
                  </td>
                  <td className="text-right py-3">{formatCurrency(calculateItemTotal(item))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Tax ({invoice.taxRate}%):</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-gray-300 font-bold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
              <div className="flex justify-between py-2 text-green-600">
                <span>Amount Paid:</span>
                <span>{formatCurrency(invoice.amountPaid)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-red-600">
                <span>Balance Due:</span>
                <span>{formatCurrency(invoice.balanceDue)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Notes:</h3>
              <p className="text-gray-600">{invoice.notes}</p>
            </div>
          )}

          {/* Terms */}
          {invoice.terms && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Terms & Conditions:</h3>
              <p className="text-gray-600 text-sm">{invoice.terms}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-4 border-t text-center text-sm text-gray-500">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handlePrint}
      title="Print Invoice"
    >
      <PrinterIcon className="h-4 w-4" />
    </Button>
  );
}

// Dialog version for viewing and printing
interface ViewInvoiceDialogProps {
  invoice: InvoiceData;
  trigger: React.ReactNode;
}

export function ViewInvoiceDialog({ invoice, trigger }: ViewInvoiceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale === 'en' ? enUS : fr;

  const calculateItemTotal = (item: InvoiceItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = item.discountType === 'percentage'
      ? subtotal * (item.discount / 100)
      : item.discount;
    return subtotal - discountAmount;
  };

  return (
    <D.Dialog open={isOpen} onOpenChange={setIsOpen}>
      <D.DialogTrigger asChild>
        {trigger}
      </D.DialogTrigger>
      <D.DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <D.DialogHeader>
          <D.DialogTitle className="flex items-center gap-2">
            Invoice #{invoice.invoiceNumber}
          </D.DialogTitle>
        </D.DialogHeader>

        <div className="space-y-4">
          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Issue Date</p>
              <p className="font-medium">{format(new Date(invoice.createdAt), 'dd/MM/yyyy', { locale })}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Due Date</p>
              <p className="font-medium">{format(new Date(invoice.dueDate), 'dd/MM/yyyy', { locale })}</p>
            </div>
          </div>

          {/* Customer */}
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-1">Bill To:</p>
            <p className="font-medium">{invoice.customer.firstName} {invoice.customer.lastName}</p>
            {invoice.customer.email && <p className="text-sm">{invoice.customer.email}</p>}
            {invoice.customer.phone && <p className="text-sm">{invoice.customer.phone}</p>}
          </div>

          {/* Items */}
          <div className="border-t pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>{item.description}</div>
                      {item.discount > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Discount: {item.discountType === 'percentage' ? `${item.discount}%` : formatCurrency(item.discount)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(calculateItemTotal(item))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="border-t pt-4 flex justify-end">
            <div className="w-48 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({invoice.taxRate}%):</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Paid:</span>
                <span>{formatCurrency(invoice.amountPaid)}</span>
              </div>
              <div className="flex justify-between font-bold text-red-600">
                <span>Due:</span>
                <span>{formatCurrency(invoice.balanceDue)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-1">Notes:</p>
              <p className="text-sm">{invoice.notes}</p>
            </div>
          )}

          {/* Print Button */}
          <div className="border-t pt-4 flex justify-end">
            <Button onClick={() => window.print()} className="flex gap-2">
              <PrinterIcon className="size-4" />
              Print Invoice
            </Button>
          </div>
        </div>
      </D.DialogContent>
    </D.Dialog>
  );
}
