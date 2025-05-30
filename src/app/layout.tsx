"use client";

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { TopNav } from '@/components/layout/top-nav';
import { usePathname } from 'next/navigation';
import { MOCK_PATIENT } from '@/lib/constants';
import { useState } from 'react';
import type { Patient } from '@/lib/constants';
import PatientsPage from './patients/page';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const mockPatients: Patient[] = [
  {
    id: '900752869578',
    name: 'Sarah Miller',
    avatarUrl: '',
    gender: 'F',
    age: 42,
    dob: '1982-03-15',
    wardNo: 'C-305',
    bedDetails: 'Bed A',
    admissionDate: '2024-07-15',
    lengthOfStay: '5 days',
    mobile: '+1-555-0102',
    primaryConsultant: 'Dr. Emily Carter',
    specialty: 'Cardiology',
    encounterProvider: 'City General Hospital',
    finalDiagnosis: 'Acute Bronchitis',
    posting: 'General Medicine',
    reasonForVisit: 'Routine Check-up & Consultation',
  },
  {
    id: '900752869579',
    name: 'John Doe',
    avatarUrl: '',
    gender: 'M',
    age: 55,
    dob: '1969-01-01',
    wardNo: 'B-201',
    bedDetails: 'Bed B',
    admissionDate: '2024-07-10',
    lengthOfStay: '10 days',
    mobile: '+1-555-0104',
    primaryConsultant: 'Dr. Alex Smith',
    specialty: 'General Medicine',
    encounterProvider: 'City General Hospital',
    finalDiagnosis: 'Hypertension',
    posting: 'General Medicine',
    reasonForVisit: 'Routine Check-up & Consultation',
  },
  {
    id: '900752869580',
    name: 'Priya Singh',
    avatarUrl: '',
    gender: 'F',
    age: 30,
    dob: '1994-01-01',
    wardNo: 'A-101',
    bedDetails: 'Bed C',
    admissionDate: '2024-07-12',
    lengthOfStay: '3 days',
    mobile: '+1-555-0103',
    primaryConsultant: 'Dr. Emily Carter',
    specialty: 'Endocrinology',
    encounterProvider: 'City General Hospital',
    finalDiagnosis: 'Diabetes Mellitus',
    posting: 'General Medicine',
    reasonForVisit: 'Routine Check-up & Consultation',
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideLayout = pathname === '/login' || pathname === '/patients';

  const [selectedPatient, setSelectedPatient] = useState<Patient>(mockPatients[0]);

  if (pathname === '/patients') {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
          <PatientsPage patients={mockPatients} onView={setSelectedPatient} />
          <Toaster />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        {hideLayout ? (
          <>
            {children}
            <Toaster />
          </>
        ) : (
          <SidebarProvider>
            <div className="flex flex-1 overflow-hidden">
              <Sidebar collapsible="icon" className="border-r border-sidebar-border">
                <SidebarNav patient={selectedPatient} />
              </Sidebar>
              <SidebarInset className="flex-1 flex flex-col bg-background no-scrollbar">
                <TopNav />
                <main className="flex-1 p-0 overflow-y-auto no-scrollbar">
                  {children}
                </main>
              </SidebarInset>
            </div>
            <Toaster />
          </SidebarProvider>
        )}
      </body>
    </html>
  );
}