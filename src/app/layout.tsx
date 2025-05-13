import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HealthView',
  description: 'Your personal health dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen`}>
        
        <div className="flex flex-1 overflow-hidden"> {/* Container for sidebar and main content below header */}
          <SidebarProvider>
            <Sidebar>
              <SidebarNav />
            </Sidebar>
            <SidebarInset className="flex-1 overflow-y-auto bg-background"> {/* Ensure content area scrolls and has a background */}
              {children}
            </SidebarInset>
          </SidebarProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
