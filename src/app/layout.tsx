import type { Metadata } from 'next';
import FrontendLayout from '@/components/frontend/FrontendLayout';
import ThemeProvider from '@/components/frontend/ThemeProvider';
import './globals.css';
import ToastProvider from "./common/ToastProvider";

export const metadata: Metadata = {
  title: {
    default: 'Smart PLC Eco System | Premium Motorcycle Parts',
    template: '%s | Smart PLC Eco System',
  },
  description: 'Bangladesh\'s premium destination for motorcycle parts. Engine, brakes, exhaust, electrical & more with vehicle fitment matching.',
  keywords: ['motorcycle parts', 'bike parts', 'Yamaha parts', 'Honda parts', 'Smart PLC', 'Bangladesh'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          <FrontendLayout>
            {children}
          </FrontendLayout>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
