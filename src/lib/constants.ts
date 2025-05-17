
import type { LucideIcon } from 'lucide-react';
// Icons for direct use in page.tsx if needed elsewhere
import { Clock, Pill as PillIcon, Plus, Edit3, FileText, Ban, ScanLine, ClipboardList, BellRing, BedDouble, User, CalendarDays, Phone, Hospital, BriefcaseMedical, FileQuestion, LayoutGrid } from 'lucide-react';


export type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  date: string; 
  time: string;
  avatarUrl: string;
};

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', doctor: 'Frederica Zegno', specialty: 'Cardiologist', date: '2024-06-22', time: '3 pm', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '2', doctor: 'Rosa Mann', specialty: 'Neurologist', date: '2024-06-27', time: '9 am', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: '3', doctor: 'Simon Sparcs', specialty: 'Orthologist', date: '2024-07-03', time: '5 pm', avatarUrl: 'https://placehold.co/40x40.png' },
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
  { id: 'prob5', description: 'Osteoarthritis' }, // Added 5th problem
];


export type Medication = {
  id: string;
  name: string;
  reason?: string; 
  amount: string; 
  timing: string; 
  status: 'Pending' | 'Active' | 'Discontinued';
};

export const MOCK_MEDICATIONS: Medication[] = [
  { id: '1', name: 'UltraVit OMEGA + DHA', reason: 'Heart', amount: '1x2', timing: 'before eating', status: 'Active' },
  { id: '2', name: 'Clopidogrel', reason: 'Heart', amount: '2x1', timing: 'after eating', status: 'Pending' },
  { id: '3', name: 'Ticagrelor', reason: 'Heart', amount: '3x/3', timing: 'after eating', status: 'Active' },
  { id: '4', name: 'Aspirin', reason: 'Pain Relief', amount: '1 tablet', timing: 'as needed', status: 'Active' },
  { id: '5', name: 'Metformin', reason: 'Diabetes', amount: '500mg', timing: 'twice daily', status: 'Discontinued' },
];

export type HealthMetric = {
  name: string;
  value: string;
  unit: string;
  icon?: LucideIcon;
  tabValue?: string; 
};

export const MOCK_PATIENT = {
  id: 'pat123',
  name: 'Sarah Miller',
  avatarUrl: '', 
  gender: 'Female',
  age: 42,
  dob: '1982-03-15',
  wardNo: 'C-305',
  bedDetails: 'Room 301, Bed A',
  admissionDate: '2024-07-15',
  lengthOfStay: '5 days',
  mobile: '+1-555-0102',
  primaryConsultant: 'Dr. Emily Carter',
  encounterProvider: 'City General Hospital',
  finalDiagnosis: 'Acute Bronchitis',
  posting: 'General Medicine',
  reasonForVisit: 'Routine Check-up & Consultation',
};
export type Patient = typeof MOCK_PATIENT;


export type PatientDetailItem = {
  key: string;
  label: string;
  value?: string;
  icon?: LucideIcon;
};


export const pageCardSampleContent: Record<string, string[]> = {
  "Allergies": ["Pollen", "Dust Mites", "Peanuts", "Shellfish", "Penicillin", "Aspirin"], 
  "Clinical notes": ["Follow-up in 3 months", "Monitor blood pressure", "Discussed diet changes", "Patient reports feeling well", "Reviewed recent lab results", "Adjusted medication dosage"], 
  "Radiology": ["Chest X-Ray: Clear", "MRI Brain: Normal", "CT Abdomen: No acute findings", "Ultrasound Pelvis: NAD", "Mammogram: BI-RADS 1", "Bone Density: Normal"], 
  "Encounter notes": ["Routine physical exam", "Medication review completed", "Vaccinations up to date", "Labs ordered for next visit", "Counseled on lifestyle modifications", "Patient questions addressed"], 
  "Clinical reminder": ["Annual flu shot due", "Colonoscopy screening overdue", "Mammogram recommended", "Follow up on lab results", "Schedule dental check-up", "Lipid panel in 6 months"], 
  "Report": ["Pathology Report: Pending", "Imaging Results: Stable", "Consultation Note: Cardiology", "Discharge Summary: Complete", "Operative Report: Appendectomy", "Progress Note: Improving"] 
};


export { Clock, PillIcon, Plus, Edit3, FileText, Ban, ScanLine, ClipboardList, BellRing, BedDouble, User, CalendarDays, Phone, Hospital, BriefcaseMedical, FileQuestion, LayoutGrid };

