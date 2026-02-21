import { Logo } from '../logo';
import { UserProfile } from './user-profile';
import { LanguageSwitcher } from '../language-switcher';
import { SyncStatusIndicator } from '@/components/sync-status-indicator';

export function Header() {
  return (
    <header className="container pt-5 sm:pt-6 flex items-center justify-between">
      <Logo
        className={{
          wrapper: 'text-lg font-semibold',
          logo: 'md:size-7',
        }}
      />
      <div className="flex items-center gap-2">
        <SyncStatusIndicator />
        <LanguageSwitcher />
        <UserProfile />
      </div>
    </header>
  );
}
