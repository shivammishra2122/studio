import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import type { Patient } from '@/lib/constants';
import ClientLayout from '@/components/layout/client-layout';

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

const patientData = {
  '900752869578': {
    problems: [
      { id: 'prob1', description: 'Chronic Hypertension' },
      { id: 'prob2', description: 'Type 2 Diabetes Mellitus' },
    ],
    medications: [
      { id: '1', name: 'UltraVit OMEGA + DHA', status: 'Active' as 'Active' },
      { id: '2', name: 'Clopidogrel', status: 'Active' as 'Active' },
    ],
    allergies: [
      { id: '1', allergen: 'Peanuts', reaction: 'Rash', severity: 'Moderate' as 'Moderate', dateOnset: '2023-01-15', treatment: 'Antihistamine', status: 'Active' as 'Active', notes: 'Avoid all peanut products', createdBy: 'Dr. Smith', createdAt: '2023-01-15T10:00:00Z' },
    ],
    vitals: {},
  },
  '900752869579': {
    problems: [
      { id: 'prob3', description: 'Hypertension' },
    ],
    medications: [
      { id: '3', name: 'Aspirin', status: 'Active' as 'Active' },
    ],
    allergies: [
      { id: '2', allergen: 'Shellfish', reaction: 'Anaphylaxis', severity: 'Severe' as 'Severe', dateOnset: '2022-06-10', treatment: 'Epinephrine', status: 'Active' as 'Active', notes: 'Carry epinephrine', createdBy: 'Dr. Jones', createdAt: '2022-06-10T14:30:00Z' },
    ],
    vitals: {},
  },
  '900752869580': {
    problems: [
      { id: 'prob4', description: 'Diabetes Mellitus' },
    ],
    medications: [
      { id: '4', name: 'Metformin', status: 'Active' as 'Active' },
    ],
    allergies: [],
    vitals: {},
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <ClientLayout
          mockPatients={mockPatients}
          patientData={patientData}
        >
          {children}
        </ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}