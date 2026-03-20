'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: '🏠' },
  { href: '/issues', label: 'Issues', icon: '✔' },
  { href: '/profile', label: 'Profile', icon: '👤' },
] as const;

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Bottom navigation"
      className="md:hidden fixed left-0 right-0 bottom-0 z-50 border-t border-border bg-background/80 backdrop-blur-md pb-[env(safe-area-inset-bottom,0px)]"
    >
      {/* Row height matches layout main bottom padding calc (3.5rem + safe-area + buffer) */}
      <div className="h-14 flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/' || pathname.startsWith('/dashboard')
              : pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-1/3 ${
                isActive ? 'text-accent font-bold' : 'text-text-muted hover:text-white transition-colors'
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

