
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
// Removed Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Edit3 as they are no longer directly used in this layout for the left panel.
// If Toaster or children require them, they'd be imported by those components.

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

// Removed leftPanelCardTitles and cardSampleContent

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel Removed */}

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-background no-scrollbar">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
