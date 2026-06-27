'use client';

import { Suspense } from 'react';
import AdminDashboard from './adminDashboard';

function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center text-slate-400">
      Loading admin...
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminDashboard />
    </Suspense>
  );
}
