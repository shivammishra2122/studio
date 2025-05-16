
'use client';

import type { Patient } from '@/lib/constants';
import { MOCK_PATIENT } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import type { LucideIcon } from 'lucide-react';
import { 
  BedDouble, CalendarDays, Clock, Phone, User, Hospital as HospitalIcon, FileText, BriefcaseMedical, FileQuestion 
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
  { label: 'Provider', value: patient.encounterProvider, icon: HospitalIcon },
  { label: 'Final Diagnosis', value: patient.finalDiagnosis, icon: FileText },
  { label: 'Posting', value: patient.posting, icon: BriefcaseMedical },
  { label: 'Reason for Visit', value: patient.reasonForVisit, icon: FileQuestion },
];

export function SidebarNav() {
  const genderInitial = patient.gender ? patient.gender.charAt(0).toUpperCase() : '';

  return (
    <>
      <SidebarHeader className="p-3 border-b border-sidebar-border">
        {/* Logo and title removed as per user request */}
      </SidebarHeader>

      <SidebarContent className="p-3 space-y-3">
        <div className="flex flex-col items-center space-y-1">
          <Avatar className="h-14 w-14 mb-2">
            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person patient" />
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-center">
            <h2 className="text-md font-medium text-sidebar-foreground">{patient.name}</h2>
            <p className="text-xs text-sidebar-foreground/80">
              {genderInitial} {patient.age}
            </p>
          </div>
        </div>

        <ul className="space-y-2 text-xs text-sidebar-foreground/80 pt-3">
          {patientDetails.map(
            (detail) =>
              detail.label !== 'Gender' &&
              detail.label !== 'Age' && (
                <li key={detail.label} className="flex items-start">
                  <span className="w-24 shrink-0 flex items-center">
                    {detail.icon && <detail.icon className="h-3.5 w-3.5 mr-1.5 text-sidebar-accent" />}
                    <span className="font-medium">{detail.label}:</span>
                  </span>
                  <span className="flex-1">{detail.value}</span>
                </li>
              )
          )}
        </ul>
      </SidebarContent>

      <SidebarFooter className="p-3 mt-auto border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 bg-red-500"> 
            <AvatarFallback className="text-white text-sm font-semibold">
              N 
            </AvatarFallback>
          </Avatar>
        </div>
      </SidebarFooter>
    </>
  );
}
