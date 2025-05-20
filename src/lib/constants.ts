import type { LucideIcon } from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart'; // Added import for ChartConfig
// Icons for direct use in page.tsx if needed elsewhere
import {
  Clock, Pill as PillIcon, Plus, Edit3, FileText, Ban, ScanLine, ClipboardList, BellRing,
  BedDouble, User, CalendarDays, Phone, Hospital, BriefcaseMedical, FileQuestion, LayoutGrid,
  Droplet, HeartPulse, Activity, Thermometer, Scale
} from 'lucide-react';


export type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  avatarUrl: string;
};

export type Problem = {
  id: string;
  description: string;
};

export const MOCK_PROBLEMS: Problem[] = [
  { id: 'prob1', description: 'Chronic Hypertension' },
  { id: 'prob2', description: 'Type 2 Diabetes Mellitus' },
  { id: 'prob3', description: 'Asthma - Intermittent' },
  { id: 'prob4', description: 'Allergic Rhinitis' },
  { id: 'prob5', description: 'Osteoarthritis' },
];


export type Medication = {
  id: string;
  name: string;
  reason?: string;
  amount?: string;
  timing?: string;
  status: 'Active' | 'Discontinued' | 'Pending';
};

export const MOCK_MEDICATIONS: Medication[] = [
  { id: '1', name: 'UltraVit OMEGA + DHA', reason: 'Heart', amount: '1x2', timing: 'before eating', status: 'Active' },
  { id: '2', name: 'Clopidogrel', reason: 'Heart', amount: '2x1', timing: 'after eating', status: 'Active' },
  { id: '3', name: 'Ticagrelor', reason: 'Heart', amount: '3x/3', timing: 'after eating', status: 'Active' },
  { id: '4', name: 'Aspirin', reason: 'Pain Relief', amount: '1 tablet', timing: 'as needed', status: 'Discontinued' },
  { id: '5', name: 'Metformin', reason: 'Diabetes', amount: '500mg', timing: 'twice daily', status: 'Pending' },
];

export type HealthMetric = {
  name: string;
  value: string;
  unit: string;
  icon?: LucideIcon;
  tabValue?: string;

};

export const MOCK_KEY_INDICATORS: HealthMetric[] = [
  { name: 'Blood Glucose', value: '98', unit: 'mg/dL', icon: Droplet, tabValue: 'blood-glucose' },
  { name: 'Heart Rate', value: '72', unit: 'bpm', icon: HeartPulse, tabValue: 'heart-rate' },
  { name: 'Blood Pressure', value: '120/95', unit: 'mmHg', icon: Activity, tabValue: 'blood-pressure' },
  { name: 'Body Temperature', value: '108', unit: 'F', icon: Thermometer, tabValue: 'body-temperature' },
  { name: 'Weight', value: '70', unit: 'kg', icon: Scale, tabValue: 'weight' },
];

export const MOCK_HEART_RATE_MONITOR_DATA: Array<{ time: string; hr: number }> = [
  { time: '0s', hr: 75 }, { time: '1s', hr: 78 }, { time: '2s', hr: 72 },
  { time: '3s', hr: 80 }, { time: '4s', hr: 77 }, { time: '5s', hr: 75 },
  { time: '6s', hr: 79 }, { time: '7s', hr: 76 },
];

export const MOCK_HEART_RATE_MONITOR_CHART_CONFIG: ChartConfig = { hr: { label: 'Heart Rate (bpm)', color: 'hsl(var(--chart-1))' } };


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


export const pageCardSampleContent: Record<string, string[]> = {
  "Allergies": ["Pollen Allergy", "Dust Mite Sensitivity", "Peanut Allergy", "Shellfish Reaction", "Penicillin Allergy"],
  "Clinical notes": ["Follow-up in 3 months.", "Monitor blood pressure daily.", "Discussed dietary changes.", "Patient reports feeling well.", "Reviewed recent lab results.", "Adjusted medication dosage." ],
  "Radiology": ["Chest X-Ray: Clear", "MRI Brain: Normal findings", "CT Abdomen: No acute issues", "Ultrasound Pelvis: NAD", "Mammogram: BI-RADS 1 (Normal)", "Knee X-Ray: Mild arthritis"],
  "Encounter notes": ["Routine physical exam completed.", "Medication review performed.", "Vaccinations up to date.", "Labs ordered for next visit.", "Counseled on lifestyle mods.", "Patient questions addressed." ],
  "Clinical reminder": ["Annual flu shot due soon.", "Colonoscopy screening overdue.", "Mammogram recommended next year.", "Follow up on lab results.", "Schedule dental check-up.", "Lipid panel in 6 months."],
  "Report": ["Pathology Report: Pending", "Imaging Results: Stable", "Consult Note: Cardiology", "Discharge Summary: Complete", "Operative Report: Appendectomy"]
};


export { Clock, PillIcon, Plus, Edit3, FileText, Ban, ScanLine, ClipboardList, BellRing, BedDouble, User, CalendarDays, Phone, Hospital, BriefcaseMedical, FileQuestion, LayoutGrid, Droplet, HeartPulse, Activity, Thermometer, Scale };

// Removed MOCK_APPOINTMENTS as it was conflicting with Problem card and not clearly used. If needed, it should be re-evaluated.
export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'appt1', doctor: 'Dr. John Smith', specialty: 'Cardiology', date: '2024-08-15', time: '10:00 AM', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'appt2', doctor: 'Dr. Emily White', specialty: 'Neurology', date: '2024-08-22', time: '02:30 PM', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'appt3', doctor: 'Dr. Michael Lee', specialty: 'Orthopedics', date: '2024-09-05', time: '11:15 AM', avatarUrl: 'https://placehold.co/40x40.png' },
  { id: 'appt4', doctor: 'Dr. Olivia Green', specialty: 'Dermatology', date: '2024-09-10', time: '09:30 AM', avatarUrl: 'https://placehold.co/40x40.png' },
];