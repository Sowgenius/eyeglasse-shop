import { Button } from '@/components/ui/button';
import * as D from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useGetPrescriptionQuery, useUpdatePrescriptionMutation } from '@/redux/api/prescriptions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pill } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { z } from 'zod';

const prescriptionSchema = z.object({
  prescriptionDate: z.string().optional(),
  expiryDate: z.string().optional(),
  prescribedBy: z.string().optional(),
  odSph: z.string().optional(),
  odCyl: z.string().optional(),
  odAxis: z.string().optional(),
  odAdd: z.string().optional(),
  odPd: z.string().optional(),
  osSph: z.string().optional(),
  osCyl: z.string().optional(),
  osAxis: z.string().optional(),
  osAdd: z.string().optional(),
  osPd: z.string().optional(),
  notes: z.string().optional(),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

interface EditPrescriptionProps {
  prescriptionId: string;
  trigger?: React.ReactNode;
}

export function EditPrescription({ prescriptionId, trigger }: EditPrescriptionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updatePrescription] = useUpdatePrescriptionMutation();
  const { data: prescription } = useGetPrescriptionQuery(prescriptionId);
  const { t } = useTranslation('common');

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    values: prescription ? {
      prescriptionDate: prescription.prescriptionDate ? prescription.prescriptionDate.split('T')[0] : '',
      expiryDate: prescription.expiryDate ? prescription.expiryDate.split('T')[0] : '',
      prescribedBy: prescription.prescribedBy || '',
      odSph: prescription.odSph || '',
      odCyl: prescription.odCyl || '',
      odAxis: prescription.odAxis || '',
      odAdd: prescription.odAdd || '',
      odPd: prescription.odPd || '',
      osSph: prescription.osSph || '',
      osCyl: prescription.osCyl || '',
      osAxis: prescription.osAxis || '',
      osAdd: prescription.osAdd || '',
      osPd: prescription.osPd || '',
      notes: prescription.notes || '',
    } : undefined,
  });

  const handleSubmit = async (values: PrescriptionFormValues) => {
    setIsLoading(true);
    await updatePrescription({ id: prescriptionId, data: values });
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <D.Dialog open={isOpen} onOpenChange={setIsOpen}>
        <D.DialogTrigger asChild>
          {trigger || (
            <Button variant="ghost" size="icon">
              <Pill className="h-4 w-4" />
            </Button>
          )}
        </D.DialogTrigger>
        <D.DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[94svh]">
          <D.DialogHeader className="mt-2">
            <D.DialogTitle className="flex gap-2">
              <Pill className="size-5" />
              {t('prescriptions.editPrescription')}
            </D.DialogTitle>
          </D.DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('prescriptions.prescriptionDate')}</label>
                  <Input {...form.register('prescriptionDate')} type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('prescriptions.expiryDate')}</label>
                  <Input {...form.register('expiryDate')} type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('prescriptions.prescribedBy')}</label>
                <Input {...form.register('prescribedBy')} placeholder={t('prescriptions.prescribedBy')} />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">{t('prescriptions.rightEye')} (OD)</h3>
                <div className="grid grid-cols-5 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">SPH</label>
                    <Input {...form.register('odSph')} placeholder="SPH" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">CYL</label>
                    <Input {...form.register('odCyl')} placeholder="CYL" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Axis</label>
                    <Input {...form.register('odAxis')} placeholder="Axis" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Add</label>
                    <Input {...form.register('odAdd')} placeholder="Add" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">PD</label>
                    <Input {...form.register('odPd')} placeholder="PD" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">{t('prescriptions.leftEye')} (OS)</h3>
                <div className="grid grid-cols-5 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">SPH</label>
                    <Input {...form.register('osSph')} placeholder="SPH" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">CYL</label>
                    <Input {...form.register('osCyl')} placeholder="CYL" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Axis</label>
                    <Input {...form.register('osAxis')} placeholder="Axis" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Add</label>
                    <Input {...form.register('osAdd')} placeholder="Add" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">PD</label>
                    <Input {...form.register('osPd')} placeholder="PD" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('invoices.notes')}</label>
                <textarea
                  {...form.register('notes')}
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? t('common.saving') : t('common.save')}
              </Button>
            </form>
          </Form>
        </D.DialogContent>
      </D.Dialog>
    </>
  );
}
