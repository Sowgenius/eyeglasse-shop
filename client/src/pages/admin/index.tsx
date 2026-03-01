import { useEffect, useState } from 'react';
import { NextHead } from '@/components/next-head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  CheckCircle, 
  XCircle, 
  UserX, 
  UserCheck, 
  Shield, 
  User,
  Loader2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { SERVER_DOMAIN } from '@/config';
import Cookies from 'js-cookie';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'MANAGER';
  status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
  createdAt: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation('common');

  const fetchUsers = async () => {
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${SERVER_DOMAIN}/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('admin.error'),
        description: t('admin.failedToLoadUsers'),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = async (userId: string, action: string) => {
    setActionLoading(userId);
    const token = Cookies.get('token');
    try {
      const res = await fetch(`${SERVER_DOMAIN}/admin/${userId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: t('admin.success'),
          description: data.message,
        });
        fetchUsers();
      } else {
        toast({
          variant: 'destructive',
          title: t('admin.error'),
          description: data.message || t('admin.actionFailed'),
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('admin.error'),
        description: t('admin.networkError'),
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'USER' | 'MANAGER') => {
    setActionLoading(userId);
    const token = Cookies.get('token');
    try {
      const res = await fetch(`${SERVER_DOMAIN}/admin/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: t('admin.success'),
          description: `${t('admin.roleUpdated')} ${newRole}`,
        });
        fetchUsers();
      } else {
        toast({
          variant: 'destructive',
          title: t('admin.error'),
          description: data.message || t('admin.actionFailed'),
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('admin.error'),
        description: t('admin.networkError'),
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      PENDING: { variant: 'secondary', label: t('admin.pending') },
      ACTIVE: { variant: 'default', label: t('admin.active') },
      REJECTED: { variant: 'destructive', label: t('admin.rejected') },
      SUSPENDED: { variant: 'outline', label: t('admin.suspended') },
    };
    const config = variants[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const pendingUsers = users.filter(u => u.status === 'PENDING');
  const activeUsers = users.filter(u => u.status === 'ACTIVE');

  return (
    <>
      <NextHead title={t('admin.title')} />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">{t('admin.title')}</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.totalUsers')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.pendingApproval')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingUsers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.activeUsers')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeUsers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t('admin.managers')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.role === 'MANAGER').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Users Section */}
        {pendingUsers.length > 0 && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <UserCheck className="h-5 w-5" />
                {t('admin.pendingApproval')} ({pendingUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.name')}</TableHead>
                    <TableHead>{t('admin.email')}</TableHead>
                    <TableHead>{t('admin.role')}</TableHead>
                    <TableHead>{t('admin.registered')}</TableHead>
                    <TableHead className="text-right">{t('admin.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'MANAGER' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleAction(user.id, 'approve')}
                            disabled={actionLoading === user.id}
                          >
                            {actionLoading === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            {t('admin.approve')}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAction(user.id, 'reject')}
                            disabled={actionLoading === user.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            {t('admin.reject')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* All Users Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.allUsers')}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.name')}</TableHead>
                    <TableHead>{t('admin.email')}</TableHead>
                    <TableHead>{t('admin.role')}</TableHead>
                    <TableHead>{t('admin.status')}</TableHead>
                    <TableHead>{t('admin.registered')}</TableHead>
                    <TableHead className="text-right">{t('admin.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.role === 'MANAGER' ? (
                            <Shield className="h-4 w-4 text-blue-500" />
                          ) : (
                            <User className="h-4 w-4 text-gray-500" />
                          )}
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as 'USER' | 'MANAGER')}
                            disabled={actionLoading === user.id}
                            className="border rounded px-2 py-1 text-sm"
                          >
                            <option value="USER">{t('admin.user')}</option>
                            <option value="MANAGER">{t('admin.manager')}</option>
                          </select>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {user.status === 'SUSPENDED' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(user.id, 'activate')}
                              disabled={actionLoading === user.id}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              {t('admin.activate')}
                            </Button>
                          ) : user.status === 'ACTIVE' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(user.id, 'suspend')}
                              disabled={actionLoading === user.id}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              {t('admin.suspend')}
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'fr', ['common'])),
    },
  };
};
