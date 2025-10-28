'use client';

import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/auth-context';

import { usePathname } from 'next/navigation';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const isPublicFormPage = pathname?.startsWith('/form/');
  const isHomePage = pathname === '/';

  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <title>QuiryAI - Create Dynamic Forms with AI</title>
        <meta name="description" content="Build beautiful forms with AI assistance, collect responses, and analyze data." />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <AuthProvider>
          {!isAuthPage && !isPublicFormPage && !isHomePage && <Navbar />}
          <main className={!isAuthPage && !isPublicFormPage && !isHomePage ? "min-h-[calc(100vh-4rem)]" : "min-h-screen"}>
            {children}
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}