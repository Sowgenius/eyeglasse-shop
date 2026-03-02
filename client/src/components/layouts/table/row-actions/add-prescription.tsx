import { Button } from '@/components/ui/button';
import * as D from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCreatePrescriptionMutation } from '@/redux/api/prescriptions';
import { useGetCustomersQuery } from '@/redux/api/customers';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pill, Plus, HelpCircle, Eye } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { z } from 'zod';

const prescriptionSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  prescriptionDate: z.string().min(1, 'Prescription date is required'),
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

export function AddPrescription() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createPrescription] = useCreatePrescriptionMutation();
  const { data: customersData } = useGetCustomersQuery({ limit: 100 });
  const { t } = useTranslation('common');

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      customerId: '',
      prescriptionDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      prescribedBy: '',
      odSph: '',
      odCyl: '',
      odAxis: '',
      odAdd: '',
      odPd: '',
      osSph: '',
      osCyl: '',
      osAxis: '',
      osAdd: '',
      osPd: '',
      notes: '',
    },
  });

  const handleSubmit = async (values: PrescriptionFormValues) => {
    setIsLoading(true);
    await createPrescription({
      ...values,
      prescriptionDate: new Date(values.prescriptionDate).toISOString(),
      expiryDate: values.expiryDate ? new Date(values.expiryDate).toISOString() : undefined,
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
            {t('prescriptions.addPrescription')}
          </Button>
        </D.DialogTrigger>
        <D.DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[94svh]">
          <D.DialogHeader className="mt-2">
            <D.DialogTitle className="flex gap-2">
              <Pill className="size-5" />
              {t('prescriptions.addPrescription')}
            </D.DialogTitle>
            <D.DialogDescription className="text-left">
              {t('prescriptions.addPrescriptionDescription')}
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
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="size-4" />
                  <h3 className="font-medium">{t('prescriptions.rightEye')} (OD)</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <HelpCircle className="size-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Right Eye - Oculus Dexter</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      SPH
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <HelpCircle className="size-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Sphere - Lens power for nearsightedness/farsightedness</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input {...form.register('odSph')} placeholder="e.g. -2.50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      CYL
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <HelpCircle className="size-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cylinder - Lens power for astigmatism</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input {...form.register('odCyl')} placeholder="e.g. -0.75" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      Axis
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <HelpCircle className="size-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Axis - Orientation of astigmatism (1-180 degrees)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input {...form.register('odAxis')} placeholder="e.g. 180" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      Add
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <HelpCircle className="size-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Addition - Extra power for reading (bifocals/progressives)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input {...form.register('odAdd')} placeholder="e.g. +1.50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      PD
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <HelpCircle className="size-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Pupillary Distance - Distance between pupils in mm</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input {...form.register('odPd')} placeholder="e.g. 62" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="size-4" />
                  <h3 className="font-medium">{t('prescriptions.leftEye')} (OS)</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <HelpCircle className="size-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Left Eye - Oculus Sinister</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">SPH</Label>
                    <Input {...form.register('osSph')} placeholder="e.g. -2.50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">CYL</Label>
                    <Input {...form.register('osCyl')} placeholder="e.g. -0.75" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Axis</Label>
                    <Input {...form.register('osAxis')} placeholder="e.g. 180" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Add</Label>
                    <Input {...form.register('osAdd')} placeholder="e.g. +1.50" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">PD</Label>
                    <Input {...form.register('osPd')} placeholder="e.g. 62" />
                  </div>
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
                {isLoading ? t('common.saving') : t('common.save')}
              </Button>
            </form>
          </Form>
        </D.DialogContent>
      </D.Dialog>
    </>
  );
}
