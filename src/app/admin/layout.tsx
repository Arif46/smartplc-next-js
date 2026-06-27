import type { Metadata } from 'next';
import { Suspense } from 'react';
import './admin.css';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Smart PLC Eco System',
  description: 'Administrative dashboard for Smart PLC Eco System',
};

function AdminRouteLoading() {
  return (
    <div className="admin-shell min-h-screen flex items-center justify-center text-slate-400" style={{ background: 'var(--admin-bg)' }}>
      Loading...
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell min-h-screen" style={{ background: 'var(--admin-bg)' }}>
      <Suspense fallback={<AdminRouteLoading />}>{children}</Suspense>
    </div>
  );
}
