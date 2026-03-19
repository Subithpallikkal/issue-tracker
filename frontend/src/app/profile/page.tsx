import Link from 'next/link';
import ProfilePanel from '@/components/profile/ProfilePanel';

export default function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>›</span>
          <span className="text-white">Profile</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Profile</h1>
      </div>

      <ProfilePanel />
    </div>
  );
}

