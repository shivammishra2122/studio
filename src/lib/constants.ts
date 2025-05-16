import type { LucideIcon } from 'lucide-react';
// Icons for direct use in page.tsx if needed elsewhere
import { Clock, Pill as PillIcon, Plus, MoreVertical, FileText, Ban, ScanLine, ClipboardList, BellRing, Edit3, BedDouble, BriefcaseMedical, FileQuestion, LayoutGrid } from 'lucide-react';


export type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  date: string; 
  time: string;
  avatarUrl: string;
};

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', doctor: 'Frederica Zegno', specialty: 'Doctor cardiologist', date: '2024-06-22', time: '3 pm', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '2', doctor: 'Rosa Mann', specialty: 'Doctor neurologist', date: '2024-06-27', time: '9 am', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '3', doctor: 'Simon Sparcs', specialty: 'Doctor Orthologist', date: '2024-07-03', time: '5 pm', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '4', doctor: 'Dr. Angela Lee', specialty: 'Pediatrician', date: '2024-07-10', time: '11 am', avatarUrl: 'https://placehold.co/40x40.png' },
];

export type Problem = {
  id: string;
  description: string;
};

export const MOCK_PROBLEMS: Problem[] = [
  { id: 'prob1', description: 'Chronic Hypertension' },
  { id: 'prob2', description: 'Type 2 Diabetes Mellitus' },
  { id: 'prob3', description: 'Asthma - Intermittent' },
  { id: 'prob4', description: 'Allergic Rhinitis' },
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
  // date?: string; // Removed date from here
};

export const MOCK_PATIENT = {
  id: 'pat123',
  name: 'Sarah Miller',
  avatarUrl: 'https://placehold.co/100x100.png',
  gender: 'Female',
  age: 42,
  dob: '1982-03-15', // Added DOB
  wardNo: 'C-305',
  admissionDate: '2024-07-15',
  lengthOfStay: '5 days',
  mobile: '+1-555-0102',
  bedDetails: 'Room 301, Bed A', // Added
  primaryConsultant: 'Dr. Emily Carter', // Added
  encounterProvider: 'City General Hospital', // Added
  finalDiagnosis: 'Acute Bronchitis', // Added
  posting: 'General Medicine', // Added
  reasonForVisit: 'Routine Check-up & Consultation', // Added
};
export type Patient = typeof MOCK_PATIENT;


// Simplified for single-line list items
export const pageCardSampleContent: Record<string, string[]> = {
  "Allergies": ["Pollen", "Dust Mites", "Peanuts", "Shellfish"],
  "Clinical notes": ["Follow-up in 3 months", "Monitor blood pressure", "Discussed diet changes", "Patient reports feeling well"],
  "Radiology": ["Chest X-Ray: Clear", "MRI Brain: Normal", "CT Abdomen: No acute findings", "Ultrasound Pelvis: NAD"],
  "Encounter notes": ["Routine physical exam", "Medication review completed", "Vaccinations up to date", "Labs ordered for next visit"],
  "Clinical reminder": ["Annual flu shot due", "Colonoscopy screening overdue", "Mammogram recommended", "Follow up on lab results"],
  "Report": ["Pathology Report: Pending", "Imaging Results: Reviewed", "Consultation Note: Added", "Discharge Summary: Finalized"]
};


export { Clock, PillIcon, Plus, MoreVertical, FileText, Ban, ScanLine, ClipboardList, BellRing, Edit3, BedDouble, BriefcaseMedical, FileQuestion, LayoutGrid };