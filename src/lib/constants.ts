
import type { LucideIcon } from 'lucide-react';
// Icons for direct use in page.tsx if needed elsewhere
import { Clock, Pill as PillIcon, Plus, MoreVertical, Phone, CalendarDays, User, Hospital, FileText, Ban, ScanLine, ClipboardList, BellRing } from 'lucide-react';


export type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  date: string; 
  time: string;
  location: string; 
  avatarUrl: string;
};

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', doctor: 'Frederica Zegno', specialty: 'Doctor cardiologist', date: '2024-06-22', time: '3 pm', location: 'Heartbeat Clinic, Room 203', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '2', doctor: 'Rosa Mann', specialty: 'Doctor neurologist', date: '2024-06-27', time: '9 am', location: 'City General Hospital, Wing A', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '3', doctor: 'Simon Sparcs', specialty: 'Doctor Orthologist', date: '2024-07-03', time: '5 pm', location: 'Wellness Center, Suite 10', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '4', doctor: 'Dr. Angela Lee', specialty: 'Pediatrician', date: '2024-07-10', time: '11 am', location: 'Children s Wellness, Suite 5', avatarUrl: 'https://placehold.co/40x40.png' },
];

export type Medication = {
  id: string;
  name: string;
  reason?: string; 
  amount: string; 
  timing: string; 
  taken: boolean;
};

export const MOCK_MEDICATIONS: Medication[] = [
  { id: '1', name: 'UltraVit OMEGA + DHA', reason: 'Heart', amount: '1x2', timing: 'before eating', taken: true },
  { id: '2', name: 'Clopidogrel', reason: 'Heart', amount: '2x1', timing: 'after eating', taken: false },
  { id: '3', name: 'Ticagrelor', reason: 'Heart', amount: '3x/3', timing: 'after eating', taken: false },
  { id: '4', name: 'Aspirin', reason: 'Pain Relief', amount: '1 tablet', timing: 'as needed', taken: true },
];

export type HealthMetric = {
  name: string;
  value: string;
  unit: string;
  icon?: LucideIcon;
};

export const MOCK_PATIENT = {
  id: 'pat123',
  name: 'Johnathan Doe',
  avatarUrl: 'https://placehold.co/100x100.png',
  gender: 'Male',
  age: 45,
  wardNo: 'C-302',
  admissionDate: '2024-07-15',
  lengthOfStay: '5 days',
  mobile: '+1-202-555-0182',
  bedDetails: 'Room 301, Bed A',
  primaryConsultant: 'Dr. Emily Carter',
  encounterProvider: 'City General Hospital',
  reasonForVisit: 'Routine Check-up & Consultation',
};
export type Patient = typeof MOCK_PATIENT;


export const pageCardSampleContent: Record<string, string[]> = {
    "Allergies": [
      "Pollen Allergy",
      "Peanut Allergy",
      "Dust Mite Allergy",
      "Penicillin Allergy",
    ],
    "Clinical notes": [
      "Patient presented with mild cough.",
      "Advised rest and increased fluid intake.",
      "Follow-up scheduled in one week.",
      "Routine check-up, vitals stable.",
    ],
    "Radiology": [
      "Chest X-Ray: No acute findings.",
      "MRI Brain: Consistent with age.",
      "Abdominal Ultrasound: Unremarkable.",
      "CT Pelvis: Within normal limits.",
    ],
    "Encounter notes": [
      "Discussed recent lab results.",
      "Patient reports improved sleep quality.",
      "Medication adherence reviewed and confirmed.",
      "Next appointment scheduled for routine follow-up.",
    ],
    "Clinical reminder": [
      "Annual flu vaccination due in October.",
      "Blood pressure check recommended quarterly.",
      "Fasting lipid panel due next month.",
      "Follow up on specialist referral initiated.",
    ],
    "Report": [ // This content is used for the Report card in the top section now
      "Pathology Report (Biopsy #12345): Benign.",
      "Imaging Report (CT Abdomen #67890): NAD.",
      "Consultation Summary (Dr. Smith): Stable.",
      "Discharge Summary (Visit #54321): Recovered.",
    ]
  };


export { Clock, PillIcon, Plus, MoreVertical, Phone, CalendarDays, User, Hospital, FileText, Ban, ScanLine, ClipboardList, BellRing };
