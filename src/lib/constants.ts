
import type { LucideIcon } from 'lucide-react';
// Icons for direct use in page.tsx if needed elsewhere (Clock, PillIcon, Plus, MoreVertical were used by page.tsx directly)
import { Clock, Pill as PillIcon, Plus, MoreVertical, Phone, CalendarDays, User, Hospital } from 'lucide-react';


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

export type Patient = {
  id: string;
  name: string;
  avatarUrl: string;
  gender: string;
  age: number;
  wardNo: string;
  admissionDate: string;
  lengthOfStay: string;
  mobile: string;
};

export const MOCK_PATIENT: Patient = {
  id: 'pat123',
  name: 'Johnathan Doe',
  avatarUrl: 'https://placehold.co/100x100.png',
  gender: 'Male',
  age: 45,
  wardNo: 'C-302',
  admissionDate: '2024-07-15',
  lengthOfStay: '5 days',
  mobile: '+1-202-555-0182',
};

export const pageCardSampleContent: Record<string, string[]> = {
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
    ],
    "Encounter notes": [
      "Discussed lab results from last visit.",
      "Patient reported improved sleep quality.",
      "Medication adherence reviewed.",
      "Next appointment scheduled for follow-up.",
    ],
    "Clinical reminder": [
      "Annual flu shot due in October.",
      "Blood pressure check recommended.",
      "Fasting lipid panel next month.",
      "Follow up on specialist referral.",
    ],
    "Report": [
      "Pathology report for biopsy reviewed.",
      "Imaging report for CT abdomen available.",
      "Consultation summary from Dr. Smith.",
      "Discharge summary from recent hospitalization.",
    ]
  };


export { Clock, PillIcon, Plus, MoreVertical, Phone, CalendarDays, User, Hospital }; // Removed Briefcase
