
import type { LucideIcon } from 'lucide-react';
// Icons for direct use in page.tsx if needed elsewhere (Clock, PillIcon, Plus, MoreVertical were used by page.tsx directly)
import { Clock, Pill as PillIcon, Plus, MoreVertical } from 'lucide-react';

export const LOREM_IPSUM_TEXT: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

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
  trend?: 'up' | 'down' | 'stable';
  icon?: LucideIcon;
};

export { Clock, PillIcon, Plus, MoreVertical };
