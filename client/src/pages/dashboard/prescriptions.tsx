import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { useGetPrescriptionsQuery, useDeletePrescriptionMutation } from '@/redux/api/prescriptions';
import { useTranslation } from 'next-i18next';
import { PlusIcon, SearchIcon, FileTextIcon, TrashIcon, EyeIcon } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { AddPrescription } from '@/components/layouts/table/row-actions/add-prescription';
import { EditPrescription } from '@/components/layouts/table/row-actions/edit-prescription';

export default function DashboardPrescriptions() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const locale = router.locale === 'en' ? enUS : fr;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useGetPrescriptionsQuery({ page, limit: 10, search });
  const [deletePrescription] = useDeletePrescriptionMutation();

  const handleDelete = async (id: string) => {
    if (confirm(t('prescriptions.deletePrescription') + '?')) {
      await deletePrescription(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('prescriptions.title')}</h1>
          </div>
          <AddPrescription />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t('common.search')}
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 animate-pulse bg-slate-100 rounded" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('customers.title')}</TableHead>
                    <TableHead>{t('prescriptions.prescriptionDate')}</TableHead>
                    <TableHead>{t('prescriptions.expiryDate')}</TableHead>
                    <TableHead>{t('prescriptions.prescribedBy')}</TableHead>
                    <TableHead>{t('prescriptions.rightEyeValues')}</TableHead>
                    <TableHead>{t('prescriptions.leftEyeValues')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell className="font-medium">
                        {prescription.customer.firstName} {prescription.customer.lastName}
                      </TableCell>
                      <TableCell>
                        {format(new Date(prescription.prescriptionDate), 'dd/MM/yyyy', { locale })}
                      </TableCell>
                      <TableCell>
                        {prescription.expiryDate
                          ? format(new Date(prescription.expiryDate), 'dd/MM/yyyy', { locale })
                          : '-'}
                      </TableCell>
                      <TableCell>{prescription.prescribedBy || '-'}</TableCell>
                      <TableCell>
                        {prescription.odSph || '-'}
                        {prescription.odCyl && ` / ${prescription.odCyl}`}
                        {prescription.odAxis && ` / ${prescription.odAxis}`}
                      </TableCell>
                      <TableCell>
                        {prescription.osSph || '-'}
                        {prescription.osCyl && ` / ${prescription.osCyl}`}
                        {prescription.osAxis && ` / ${prescription.osAxis}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <EditPrescription prescriptionId={prescription.id} />
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(prescription.id)}>
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {data && data.pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  {t('common.previous')}
                </Button>
                <span className="flex items-center px-4">
                  {page} / {data.pagination.totalPages}
                </span>
                <Button variant="outline" disabled={page >= data.pagination.totalPages} onClick={() => setPage(page + 1)}>
                  {t('common.next')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </DashboardLayout>
  );
}
