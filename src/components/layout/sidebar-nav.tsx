
'use client';

import type { Patient } from '@/lib/constants';
import { MOCK_PATIENT } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarContent,
} from '@/components/ui/sidebar';
import type { LucideIcon } from 'lucide-react';
import {
  Phone, 
  CalendarDays, 
  BedDouble, 
  Clock, 
  Hospital, 
  FileText, 
  BriefcaseMedical, 
  FileQuestion,
  User // Added User icon import
} from 'lucide-react';

const patient: Patient = MOCK_PATIENT;

type PatientDetailItem = {
  key: keyof Patient | 'wardAndBed'; // wardAndBed is a composite key
  label: string;
  value: string;
  icon?: LucideIcon;
};

const patientDetails: PatientDetailItem[] = [
  { key: 'mobile', label: '', value: patient.mobile, icon: Phone },
  {
    key: 'dob',
    label: 'DOB',
    value: new Date(patient.dob).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
    icon: CalendarDays
  },
  { key: 'wardAndBed', label: '', value: `${patient.wardNo}, ${patient.bedDetails}`, icon: BedDouble },
  {
    key: 'admissionDate',
    label: '',
    value: new Date(patient.admissionDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
    icon: CalendarDays,
  },
  { key: 'lengthOfStay', label: '', value: patient.lengthOfStay, icon: Clock },
  { key: 'primaryConsultant', label: 'Consultant', value: patient.primaryConsultant, icon: User },
  { key: 'encounterProvider', label: 'Provider', value: patient.encounterProvider, icon: Hospital },
  { key: 'finalDiagnosis', label: 'Diagnosis', value: patient.finalDiagnosis, icon: FileText },
  { key: 'posting', label: 'Posting', value: patient.posting, icon: BriefcaseMedical },
  { key: 'reasonForVisit', label: 'Reason', value: patient.reasonForVisit, icon: FileQuestion },
];


export function SidebarNav() {
  const genderInitial = patient.gender ? patient.gender.charAt(0).toUpperCase() : '';

  return (
    <>
      <SidebarContent className="p-3 space-y-3">
        <div className="flex flex-col items-center space-y-1">
          <Avatar className="h-14 w-14 mb-1">
            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person patient"/>
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex items-center text-center"> 
            <h2 className="text-md font-medium text-sidebar-foreground">{patient.name}</h2>
            <span className="text-sidebar-foreground mx-1">/</span> {/* Separator */}
            <p className="text-xs text-sidebar-foreground">
              {genderInitial} {patient.age}
            </p>
          </div>
        </div>

        <ul className="space-y-1.5 text-xs text-sidebar-foreground pt-3">
          {patientDetails.map(
            (detail) => (
              <li key={detail.key} className="flex items-start space-x-1.5">
                {detail.icon && <detail.icon className="h-3.5 w-3.5 text-sidebar-primary-foreground shrink-0 mt-0.5" />}
                <div className="flex-1">
                  {detail.label && detail.label !== 'DOB' && <span className="font-medium">{detail.label}: </span>}
                  {detail.label === 'DOB' && <span className="font-medium">DOB: </span>}
                  <span className="font-normal">{detail.value}</span>
                </div>
              </li>
            )
          )}
        </ul>
      </SidebarContent>
    </>
  );
}

