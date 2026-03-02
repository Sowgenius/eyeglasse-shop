import { Button } from '@/components/ui/button';
import * as D from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateCustomerMutation } from '@/redux/api/customers';
import { zodResolver } from '@hookform/resolvers/zod';
import { BadgePlus, UserPlus, Contact, MapPin, Calendar, Shield } from 'lucide-react';
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
              className="grid gap-4"
            >
              {/* Personal Information Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground border-b pb-1">
                  <Contact className="size-4" />
                  Personal Information
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('customers.firstName')} <span className="text-red-500">*</span></Label>
                    <Input id="firstName" {...form.register('firstName')} placeholder={t('customers.firstName')} />
                    {form.formState.errors.firstName && (
                      <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('customers.lastName')} <span className="text-red-500">*</span></Label>
                    <Input id="lastName" {...form.register('lastName')} placeholder={t('customers.lastName')} />
                    {form.formState.errors.lastName && (
                      <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('customers.email')}</Label>
                    <Input id="email" {...form.register('email')} type="email" placeholder={t('customers.email')} />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('customers.phone')}</Label>
                    <Input id="phone" {...form.register('phone')} placeholder="+33 6 12 34 56 78" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      {t('customers.birthDate')}
                    </div>
                  </Label>
                  <Input id="birthDate" {...form.register('birthDate')} type="date" />
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground border-b pb-1">
                  <MapPin className="size-4" />
                  Address
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">{t('customers.address')}</Label>
                  <Input id="address" {...form.register('address')} placeholder="Street address" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t('customers.city')}</Label>
                    <Input id="city" {...form.register('city')} placeholder={t('customers.city')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">{t('customers.postalCode')}</Label>
                    <Input id="postalCode" {...form.register('postalCode')} placeholder="75001" />
                  </div>
                </div>
              </div>

              {/* Insurance Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground border-b pb-1">
                  <Shield className="size-4" />
                  Insurance Information (Optional)
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="insuranceProvider">{t('customers.insuranceProvider')}</Label>
                    <Input id="insuranceProvider" {...form.register('insuranceProvider')} placeholder="e.g. MGEN, AXA, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insuranceNumber">{t('customers.insuranceNumber')}</Label>
                    <Input id="insuranceNumber" {...form.register('insuranceNumber')} placeholder="Policy number" />
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-2 pt-2">
                <Label htmlFor="notes">{t('customers.notes')}</Label>
                <textarea
                  id="notes"
                  {...form.register('notes')}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Additional notes about this customer..."
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
