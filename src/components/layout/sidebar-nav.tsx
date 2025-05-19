
'use client';

import type { Patient } from '@/lib/constants';
import { MOCK_PATIENT } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarContent } from '@/components/ui/sidebar';
import {
  Phone,
  CalendarDays,
  BedDouble,
  Clock,
  Hospital,
  FileText,
  BriefcaseMedical,
  FileQuestion,
  User,
  Heart,
  Ban,
  PenLine,
  Search,
} from 'lucide-react';

const patient: Patient = MOCK_PATIENT;

type PatientDetailItem = {
  key: keyof Patient | 'wardAndBed' | 'vitalSigns';
  label: string;
  value?: string; // Made value optional to match existing data structure
  icon?: typeof Phone; // Kept icon type as is, can be refined if needed
};

const patientDetails: PatientDetailItem[] = [
  { key: 'mobile', label: '', value: patient.mobile, icon: Phone },
  {
    key: 'dob',
    label: '',
    value: patient.dob ? new Date(patient.dob).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : undefined,
    icon: CalendarDays,
  },
  { key: 'wardAndBed', label: '', value: `${patient.wardNo}, ${patient.bedDetails}`, icon: BedDouble },
  {
    key: 'admissionDate',
    label: '',
    value: patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : undefined,
    icon: CalendarDays,
  },
  { key: 'lengthOfStay', label: '', value: patient.lengthOfStay, icon: Clock },
  { key: 'primaryConsultant', label: '', value: patient.primaryConsultant, icon: User },
  { key: 'encounterProvider', label: '', value: patient.encounterProvider, icon: Hospital },
  { key: 'finalDiagnosis', label: '', value: patient.finalDiagnosis, icon: FileText },
  { key: 'posting', label: '', value: patient.posting, icon: BriefcaseMedical },
  { key: 'reasonForVisit', label: '', value: patient.reasonForVisit, icon: FileQuestion },
];

export function SidebarNav() {
  const genderDisplay = patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1).toLowerCase() : '';

  return (
    <SidebarContent className="flex h-full w-full flex-col bg-teal-600 text-white">
      <div className="min-h-0 gap-2 overflow-auto px-3 pt-3 space-y-0 flex flex-col flex-1">
        <div className="flex flex-col items-center space-y-2 mb-2">
          <Avatar className="h-20 w-20">
            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person patient" />
            <AvatarFallback className="bg-white">
              <User className="h-10 w-10 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="mt-2 w-full px-4">
            
              <p className="text-sm font-medium"> 2734577854 </p>
            
          </div>
          <div className="text-center">
            <p className="text-md font-medium">
              {patient.name}
            </p>
            <p className="text-sm">
              {genderDisplay} {patient.age}
            </p>
          </div>
        </div>

        <ul className="space-y-0.5 text-xs pt-0.5">
          {patientDetails.map((detail) => (
            detail.value && ( // Added check for detail.value to prevent rendering empty items
              <li key={detail.key} className="flex items-start space-x-1.5">
                {detail.icon && <detail.icon className="h-3.5 w-3.5 shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  {detail.label && <span className="font-semibold">{detail.label}: </span>}
                  <span className={detail.key === 'vitalSigns' ? 'font-semibold text-lg' : 'font-normal'}>
                    {detail.value}
                  </span>
                </div>
              </li>
            )
          ))}
        </ul>

        <div className="mt-auto">
          <div className="flex items-center justify-around p-2 border-t border-sidebar-border">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 w-10 hover:bg-sidebar-accent text-white">
              <Ban className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 w-10 hover:bg-sidebar-accent text-white">
              <PenLine className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 w-10 hover:bg-sidebar-accent text-white">
              <Search className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-center p-2 border-t border-sidebar-border">
            <img
              alt="Company Logo"
              width="150"
              height="50"
              decoding="async"
              className="object-contain"
              src="/sansys.png"
            />
          </div>
        </div>
      </div>
    </SidebarContent>
  );
}
