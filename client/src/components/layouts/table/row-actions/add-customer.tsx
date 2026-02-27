import { Button } from '@/components/ui/button';
import * as D from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateCustomerMutation } from '@/redux/api/customers';
import { zodResolver } from '@hookform/resolvers/zod';
import { BadgePlus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { z } from 'zod';

const customerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  birthDate: z.string().optional(),
  notes: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export function AddCustomer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createCustomer] = useCreateCustomerMutation();
  const { t } = useTranslation('common');

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      birthDate: '',
      notes: '',
      insuranceProvider: '',
      insuranceNumber: '',
    },
  });

  return (
    <>
      <D.Dialog open={isOpen} onOpenChange={setIsOpen}>
        <D.DialogTrigger asChild>
          <Button size={'sm'} className="flex gap-2 items-center h-8">
            <UserPlus className="size-4" />
            {t('customers.addCustomer')}
          </Button>
        </D.DialogTrigger>
        <D.DialogContent className="sm:max-w-[550px] overflow-y-auto max-h-[94svh]">
          <D.DialogHeader className="mt-2">
            <D.DialogTitle className="flex gap-2">
              <UserPlus className="size-5" />
              {t('customers.addCustomer')}
            </D.DialogTitle>
            <D.DialogDescription className="text-left">
              {t('customers.addCustomerDescription')}
            </D.DialogDescription>
          </D.DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (values) => {
                setIsLoading(true);
                await createCustomer(values);
                setIsOpen(false);
                setIsLoading(false);
                form.reset();
              })}
              className="grid gap-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('customers.firstName')}</label>
                  <Input {...form.register('firstName')} placeholder={t('customers.firstName')} />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('customers.lastName')}</label>
                  <Input {...form.register('lastName')} placeholder={t('customers.lastName')} />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('customers.email')}</label>
                <Input {...form.register('email')} type="email" placeholder={t('customers.email')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('customers.phone')}</label>
                <Input {...form.register('phone')} placeholder={t('customers.phone')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('customers.address')}</label>
                <Input {...form.register('address')} placeholder={t('customers.address')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('customers.city')}</label>
                  <Input {...form.register('city')} placeholder={t('customers.city')} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('customers.postalCode')}</label>
                  <Input {...form.register('postalCode')} placeholder={t('customers.postalCode')} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('customers.birthDate')}</label>
                <Input {...form.register('birthDate')} type="date" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('customers.insuranceProvider')}</label>
                  <Input {...form.register('insuranceProvider')} placeholder={t('customers.insuranceProvider')} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('customers.insuranceNumber')}</label>
                  <Input {...form.register('insuranceNumber')} placeholder={t('customers.insuranceNumber')} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('customers.notes')}</label>
                <textarea
                  {...form.register('notes')}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t('customers.notes')}
                />
              </div>

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full mt-3"
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
