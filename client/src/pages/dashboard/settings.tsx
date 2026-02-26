import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfileQuery } from '@/redux/api';
import { useTranslation } from 'next-i18next';
import { Toaster } from '@/components/ui/toaster';
import { UserIcon, MailIcon, LockIcon } from 'lucide-react';

export default function DashboardSettings() {
  const { t } = useTranslation('common');
  const { data: user } = useProfileQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('navigation.settings')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('auth.profile')}</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="p-3 bg-slate-100 rounded-full">
                <UserIcon className="h-6 w-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <Label>{t('auth.name')}</Label>
                <p className="text-sm text-muted-foreground">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="p-3 bg-slate-100 rounded-full">
                <MailIcon className="h-6 w-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <Label>{t('auth.email')}</Label>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="p-3 bg-slate-100 rounded-full">
                <LockIcon className="h-6 w-6 text-slate-600" />
              </div>
              <div className="flex-1">
                <Label>{t('auth.password')}</Label>
                <p className="text-sm text-muted-foreground">••••••••</p>
              </div>
              <Button variant="outline">{t('common.edit')}</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </DashboardLayout>
  );
}
