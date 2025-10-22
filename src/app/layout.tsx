'use client';

import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/auth-context';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const isPublicFormPage = pathname?.startsWith('/form/');

  return (
    <html lang="en" className="dark">
      <head>
        <title>FormBuilder - Create Dynamic Forms with AI</title>
        <meta name="description" content="Build beautiful forms with AI assistance, collect responses, and analyze data." />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <AuthProvider>
          {!isAuthPage && !isPublicFormPage && <Navbar />}
          <main className={!isAuthPage && !isPublicFormPage ? "min-h-[calc(100vh-4rem)]" : "min-h-screen"}>
            {children}
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}