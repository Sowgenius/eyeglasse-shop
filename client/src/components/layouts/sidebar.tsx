'use client';

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
  LayoutDashboardIcon,
} from 'lucide-react';
import Link from 'next/link';
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
    { title: t('navigation.dashboard'), href: '/dashboard', icon: LayoutDashboardIcon },
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

  const isActive = (href: string) => {
    return router.pathname === href || router.pathname.startsWith(href + '/');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/20">
            <BarChart3Icon className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-slate-900 dark:text-white">
            {t('common.appName')}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex h-[calc(100vh-4rem)] flex-col justify-between p-3">
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'
                )}
              >
                {/* Active indicator */}
                {isActive(item.href) && (
                  <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600 dark:bg-blue-500" />
                )}
                
                <item.icon 
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive(item.href)
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300'
                  )} 
                />
                <span className="flex-1">{item.title}</span>
                
                {/* Active dot */}
                {isActive(item.href) && (
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="space-y-1 border-t border-slate-200 pt-3 dark:border-slate-800">
          {bottomNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'
                )}
              >
                {isActive(item.href) && (
                  <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600 dark:bg-blue-500" />
                )}
                <item.icon 
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive(item.href)
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300'
                  )} 
                />
                <span className="flex-1">{item.title}</span>
                {isActive(item.href) && (
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
