'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface FrontendLayoutProps {
  children: React.ReactNode;
}

export default function FrontendLayout({ children }: FrontendLayoutProps) {
  const pathname = usePathname();
  const isAdminDashboard = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

  if (isAdminDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
