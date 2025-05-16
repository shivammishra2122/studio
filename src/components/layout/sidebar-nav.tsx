
'use client';

import type { Patient } from '@/lib/constants';
import { MOCK_PATIENT } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppLogo } from '@/components/icons/app-logo';
import {
  SidebarContent,
} from '@/components/ui/sidebar';
import type { LucideIcon } from 'lucide-react'; 
import { 
  BedDouble, CalendarDays, Clock, Phone, User, Hospital, FileText, BriefcaseMedical, FileQuestion, LayoutGrid 
} from 'lucide-react';

const patient: Patient = MOCK_PATIENT;

type PatientDetailItem = {
  label: string; 
  value: string;
  icon?: LucideIcon;
};

const patientDetails: PatientDetailItem[] = [
  { label: 'Ward', value: patient.wardNo, icon: BedDouble },
  {
    label: 'Admitted',
    value: new Date(patient.admissionDate).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    }),
    icon: CalendarDays,
  },
  { label: 'Stay', value: patient.lengthOfStay, icon: Clock },
  { label: 'Mobile', value: patient.mobile, icon: Phone },
  {
    label: 'DOB',
    value: new Date(patient.dob).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    }),
    icon: CalendarDays,
  },
  { label: 'Consultant', value: patient.primaryConsultant, icon: User },
  { label: 'Provider', value: patient.encounterProvider, icon: Hospital },
  { label: 'Final Diagnosis', value: patient.finalDiagnosis, icon: FileText },
  { label: 'Posting', value: patient.posting, icon: BriefcaseMedical },
  { label: 'Reason for Visit', value: patient.reasonForVisit, icon: FileQuestion },
];

export function SidebarNav() {
  const genderInitial = patient.gender ? patient.gender.charAt(0).toUpperCase() : '';

  return (
    <>
      {/* SidebarHeader removed */}

      <SidebarContent className="p-3 space-y-3">
        <div className="flex flex-col items-center space-y-1">
          <Avatar className="h-14 w-14 mb-2">
            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person patient" />
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-center">
            <h2 className="text-md font-medium text-sidebar-foreground">{patient.name}</h2>
            <p className="text-xs text-sidebar-foreground">
              {genderInitial} {patient.age}
            </p>
          </div>
        </div>

        <ul className="space-y-1.5 text-xs text-sidebar-foreground pt-3">
          {patientDetails.map(
            (detail) =>
              detail.label !== 'Gender' && 
              detail.label !== 'Age' && (
                <li key={detail.label} className="flex items-center space-x-1.5">
                  {detail.icon && <detail.icon className="h-3.5 w-3.5 text-sidebar-primary-foreground shrink-0" />}
                  <span className="flex-1 font-normal">{detail.value}</span> {/* Changed from font-semibold */}
                </li>
              )
          )}
        </ul>
      </SidebarContent>

      {/* SidebarFooter removed */}
    </>
  );
}

