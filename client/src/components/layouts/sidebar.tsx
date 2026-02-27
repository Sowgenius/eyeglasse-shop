import { cn } from '@/lib/utils';
import { useProfileQuery } from '@/redux/api';
import {
  BarChart3Icon,
  ClipboardListIcon,
  UsersIcon,
  PackageIcon,
  FileTextIcon,
  ReceiptIcon,
  SettingsIcon,
  ShieldIcon,
  ArrowLeftRightIcon,
  LucideIcon,
} from 'lucide-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export function Sidebar() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { data: user } = useProfileQuery();

  const isManager = user?.role === 'MANAGER';

  const mainNavItems: NavItem[] = [
    { title: t('navigation.dashboard'), href: '/dashboard', icon: BarChart3Icon },
    { title: t('navigation.transactions'), href: '/dashboard/transactions', icon: ArrowLeftRightIcon },
    { title: t('navigation.products'), href: '/dashboard/products', icon: PackageIcon },
    { title: t('navigation.customers'), href: '/dashboard/customers', icon: UsersIcon },
    { title: t('navigation.quotes'), href: '/dashboard/quotes', icon: ClipboardListIcon },
    { title: t('navigation.invoices'), href: '/dashboard/invoices', icon: ReceiptIcon },
    { title: t('navigation.prescriptions'), href: '/dashboard/prescriptions', icon: FileTextIcon },
    { title: t('navigation.reports'), href: '/dashboard/reports', icon: BarChart3Icon },
  ];

  const bottomNavItems: NavItem[] = [
    { title: t('navigation.settings'), href: '/dashboard/settings', icon: SettingsIcon },
  ];

  if (isManager) {
    bottomNavItems.unshift({
      title: t('navigation.admin'),
      href: '/admin',
      icon: ShieldIcon,
    });
  }

  return (
    <aside className="w-64 min-h-screen border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-lg font-semibold">{t('common.appName')}</span>
      </div>

      <nav className="flex flex-col h-[calc(100vh-4rem)] justify-between p-4">
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  router.pathname === item.href || router.pathname.startsWith(item.href + '/')
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon className="size-5" />
                {item.title}
              </a>
            </li>
          ))}
        </ul>

        <ul className="space-y-1 border-t pt-4">
          {bottomNavItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  router.pathname === item.href
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon className="size-5" />
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
