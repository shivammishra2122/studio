
import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard } from 'lucide-react'; // Removed LineChart, CalendarDays, Pill

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  // { href: '/health-data', label: 'Health Data', icon: LineChart },
  // { href: '/appointments', label: 'Appointments', icon: CalendarDays },
  // { href: '/medications', label: 'Medications', icon: Pill },
];

export type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
};

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', doctor: 'Dr. Emily Carter', specialty: 'Cardiology', date: '2024-08-15', time: '10:00 AM', location: 'Heartbeat Clinic, Room 203' },
  { id: '2', doctor: 'Dr. John Smith', specialty: 'General Practice', date: '2024-08-22', time: '02:30 PM', location: 'City General Hospital, Wing A' },
  { id: '3', doctor: 'Dr. Sarah Lee', specialty: 'Endocrinology', date: '2024-09-05', time: '11:15 AM', location: 'Wellness Center, Suite 10' },
];

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  reason: string;
};

export const MOCK_MEDICATIONS: Medication[] = [
  { id: '1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', reason: 'High Blood Pressure' },
  { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', reason: 'Type 2 Diabetes' },
  { id: '3', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at night', reason: 'High Cholesterol' },
  { id: '4', name: 'Amoxicillin', dosage: '250mg', frequency: 'Three times daily', reason: 'Bacterial Infection (current)' },
];

export type HealthMetric = {
  name: string;
  value: string;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
  icon?: LucideIcon;
};

