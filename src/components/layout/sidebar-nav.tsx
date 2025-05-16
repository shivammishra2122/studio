
'use client';

import type { Patient } from '@/lib/constants';
import { MOCK_PATIENT } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarContent,
  SidebarHeader,
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
  User, 
  Ban,
  Edit3,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image'; 
import { SansysLogo } from '@/components/icons/sansys-logo';


type PatientDetailItem = {
  key: keyof Patient | 'wardAndBed'; 
  label: string;
  value: string;
  icon?: LucideIcon;
};

const patient: Patient = MOCK_PATIENT;

const patientDetails: PatientDetailItem[] = [
  { key: 'wardAndBed', label: '', value: `${patient.wardNo}, ${patient.bedDetails}`, icon: BedDouble },
  {
    key: 'admissionDate',
    label: 'AD',
    value: new Date(patient.admissionDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
    icon: CalendarDays,
  },
  { key: 'lengthOfStay', label: '', value: patient.lengthOfStay, icon: Clock },
  { key: 'mobile', label: '', value: patient.mobile, icon: Phone },
  {
    key: 'dob',
    label: 'DOB',
    value: new Date(patient.dob).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
    icon: CalendarDays
  },
  { key: 'primaryConsultant', label: '', value: patient.primaryConsultant, icon: User },
  { key: 'encounterProvider', label: '', value: patient.encounterProvider, icon: Hospital },
  { key: 'finalDiagnosis', label: '', value: patient.finalDiagnosis, icon: FileText },
  { key: 'posting', label: '', value: patient.posting, icon: BriefcaseMedical },
  { key: 'reasonForVisit', label: '', value: patient.reasonForVisit, icon: FileQuestion },
];


export function SidebarNav() {
  const genderInitial = patient.gender ? patient.gender.charAt(0).toUpperCase() : '';

  return (
    <>
      <SidebarContent className="p-3 space-y-2 flex flex-col">
        <SidebarHeader className="flex justify-center items-center"> {/* Removed mb-2 */}
          <SansysLogo />
        </SidebarHeader>

        <div className="flex flex-col items-center space-y-1">
          <Avatar className="h-20 w-20 mb-1">
            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person patient"/>
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-md font-medium text-sidebar-foreground">{patient.name}</h2>
            <p className="text-xs text-sidebar-foreground">
              {genderInitial} {patient.age}
            </p>
          </div>
        </div>

        <ul className="space-y-1 text-xs text-sidebar-foreground pt-2">
          {patientDetails.map(
            (detail) => (
              <li key={detail.key} className="flex items-start space-x-1.5">
                {detail.icon && <detail.icon className="h-3.5 w-3.5 text-sidebar-primary-foreground shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  {detail.label && <span className="font-medium">{detail.label}: </span>}
                  <span className="font-normal">{detail.value}</span>
                </div>
              </li>
            )
          )}
        </ul>

        <div className="mt-auto flex items-center justify-around p-2 border-t border-sidebar-border">
          <Button variant="ghost" size="icon" className="text-sidebar-primary-foreground hover:bg-sidebar-accent">
            <Ban className="h-5 w-5" />
            <span className="sr-only">Ban</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-sidebar-primary-foreground hover:bg-sidebar-accent">
            <Edit3 className="h-5 w-5" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-sidebar-primary-foreground hover:bg-sidebar-accent">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </SidebarContent>
    </>
  );
}
