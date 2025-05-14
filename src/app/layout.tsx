import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarInset, SidebarRail, SidebarTrigger } from '@/components/ui/sidebar'; // Added SidebarRail and SidebarTrigger
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
        
        <div className="flex flex-1 overflow-hidden">
          <SidebarProvider>
            {/* Mobile-only trigger to open the sidebar */}
            <div className="md:hidden fixed top-4 left-4 z-50">
              <SidebarTrigger />
            </div>
            
            <Sidebar collapsible="icon">
              <SidebarNav />
            </Sidebar>
            <SidebarRail /> {/* Added for desktop edge-click toggle */}
            <SidebarInset className="flex-1 overflow-y-auto bg-background">
              {children}
            </SidebarInset>
          </SidebarProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
