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
import { useGetCustomersQuery, useDeleteCustomerMutation } from '@/redux/api/customers';
import { useTranslation } from 'next-i18next';
import { PlusIcon, SearchIcon, TrashIcon } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { AddCustomer } from '@/components/layouts/table/row-actions/add-customer';
import { EditCustomer } from '@/components/layouts/table/row-actions/edit-customer';

export default function DashboardCustomers() {
  const { t } = useTranslation('common');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useGetCustomersQuery({ page, limit: 10, search });
  const [deleteCustomer] = useDeleteCustomerMutation();

  const handleDelete = async (id: string) => {
    if (confirm(t('customers.deleteCustomer') + '?')) {
      await deleteCustomer(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('customers.title')}</h1>
          </div>
          <AddCustomer />
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
                    <TableHead>{t('customers.firstName')}</TableHead>
                    <TableHead>{t('customers.lastName')}</TableHead>
                    <TableHead>{t('customers.email')}</TableHead>
                    <TableHead>{t('customers.phone')}</TableHead>
                    <TableHead>{t('customers.city')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.firstName}</TableCell>
                      <TableCell>{customer.lastName}</TableCell>
                      <TableCell>{customer.email || '-'}</TableCell>
                      <TableCell>{customer.phone || '-'}</TableCell>
                      <TableCell>{customer.city || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <EditCustomer customerId={customer.id} />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(customer.id)}
                          >
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
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  {t('common.previous')}
                </Button>
                <span className="flex items-center px-4">
                  {page} / {data.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= data.pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                >
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
