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
  LayoutDashboardIcon,
  XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface NavItem {
  title: string;
  href: string;
  icon: any;
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
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

  const isActive = (href: string) => router.pathname === href || router.pathname.startsWith(href + '/');

  const NavLink = ({ item }: { item: NavItem }) => (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        isActive(item.href)
          ? 'bg-black text-white dark:bg-white dark:text-black'
          : 'text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
      )}
      onClick={onClose}
    >
      <item.icon className="h-5 w-5 shrink-0" />
      <span>{item.title}</span>
    </Link>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-black transition-transform duration-200",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          aria-label="Close menu"
        >
          <XIcon className="h-5 w-5" />
        </button>

        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-700 px-6">
          <span className="text-lg font-bold text-black dark:text-white">
            {t('common.appName')}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex h-[calc(100vh-4rem)] flex-col justify-between p-3 overflow-y-auto">
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <li key={item.href}><NavLink item={item} /></li>
            ))}
          </ul>
          <ul className="space-y-1 border-t border-gray-200 pt-3 dark:border-gray-700">
            {bottomNavItems.map((item) => (
              <li key={item.href}><NavLink item={item} /></li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
