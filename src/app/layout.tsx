
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3 } from 'lucide-react';


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

const leftPanelCardTitles = ["Allergies", "Clinical notes", "Radiology"];

const cardSampleContent: Record<string, string[]> = {
  "Allergies": [
    "Pollen - Seasonal, causes sneezing.",
    "Peanuts - Severe, requires EpiPen.",
    "Dust Mites - Mild, managed with antihistamines.",
    "Penicillin - Rash, hives.",
  ],
  "Clinical notes": [
    "Patient presented with mild cough.",
    "Advised rest and hydration.",
    "Follow-up scheduled in 1 week if symptoms persist.",
    "Routine check-up, vitals stable.",
  ],
  "Radiology": [
    "Chest X-Ray: Clear, no abnormalities noted.",
    "MRI Brain: Normal for age.",
    "Ultrasound Abdomen: No acute findings.",
    "CT Pelvis: Within normal limits.",
  ]
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel */}
          <aside className="w-72 bg-muted/20 p-3 space-y-3 border-r overflow-y-auto hidden md:flex md:flex-col no-scrollbar">
            <h2 className="text-lg font-semibold text-foreground px-1 pt-1">Patient Insights</h2>
            {leftPanelCardTitles.map((title) => (
              <Card key={title.toLowerCase().replace(/\s+/g, '-')} className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
                  <div>
                    <CardTitle className="text-sm font-semibold">{title}</CardTitle>
                    <CardDescription className="text-xs">Quick summary</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Edit3 className="h-3.5 w-3.5" />
                    <span className="sr-only">Edit {title}</span>
                  </Button>
                </CardHeader>
                <CardContent className="p-2 pt-1 max-h-[100px] overflow-y-auto no-scrollbar">
                  <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                    {(cardSampleContent[title] || ["No data available."]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                     {(!cardSampleContent[title] || cardSampleContent[title].length < 4) && Array(4 - (cardSampleContent[title]?.length || 0)).fill(null).map((_, i) => (
                      <li key={`placeholder-${i}`}>Sample placeholder item {i + (cardSampleContent[title]?.length || 0) + 1}.</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </aside>

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
