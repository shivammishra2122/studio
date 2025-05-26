
'use client';

import type { Patient } from '@/lib/constants';
import { MOCK_PATIENT } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarContent } from '@/components/ui/sidebar';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Phone,
  CalendarDays,
  BedDouble,
  Clock,
  User, 
  Hospital,
  FileText,
  BriefcaseMedical,
  FileQuestion,
  Ban,
  Edit3,
  Search,
} from 'lucide-react';

const patient: Patient = MOCK_PATIENT;

type PatientDetailItem = {
  key: keyof Patient | 'wardAndBed';
  label: string;
  value: string;
  icon?: React.ElementType;
};

const patientDetails: PatientDetailItem[] = [
  { key: 'mobile', label: '', value: patient.mobile, icon: Phone },
  {
    key: 'dob',
    label: 'DOB', 
    value: patient.dob ? new Date(patient.dob).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    icon: CalendarDays,
  },
  { key: 'wardAndBed', label: '', value: `${patient.wardNo}, ${patient.bedDetails}`, icon: BedDouble },
  {
    key: 'admissionDate',
    label: 'AD', 
    value: patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    icon: CalendarDays,
  },
  { key: 'lengthOfStay', label: 'LOS', value: patient.lengthOfStay, icon: Clock },
  { key: 'primaryConsultant', label: '', value: patient.primaryConsultant, icon: User },
  { key: 'specialty', label: '', value: patient.specialty, icon: BriefcaseMedical },
  { key: 'encounterProvider', label: '', value: patient.encounterProvider, icon: Hospital },
  { key: 'finalDiagnosis', label: 'Disease', value: patient.finalDiagnosis, icon: FileText },
  { key: 'reasonForVisit', label: '', value: patient.reasonForVisit, icon: FileQuestion },
];

export function SidebarNav() {
  const genderDisplay = patient.gender ? patient.gender.charAt(0).toUpperCase() : '';

  return (
    <SidebarContent className="flex h-full w-full flex-col bg-sidebar text-sidebar-primary-foreground px-3 pt-3">
      <div className="min-h-0 gap-2 overflow-y-auto no-scrollbar flex flex-col flex-1">
        {/* Patient Info Section */}
        <div className="flex flex-col items-center space-y-1 mb-1"> 
          <Avatar className="h-14 w-14">
            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person patient" />
            <AvatarFallback className="bg-white">
              <User className="h-8 w-8 text-primary" />
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center mt-1"> {/* Name, Gender, Age */}
            <p className="text-sm font-medium">
              {patient.name} ({genderDisplay} {patient.age})
            </p>
          </div>

          {/* UID: 2734577854 - Text directly */}
          <div className="w-full px-4 text-center"> {/* Removed mt-1 from here */}
            <p className="text-xs font-medium text-sidebar-primary-foreground">
              UID: 2734577854
            </p>
          </div>
        </div>

        {/* Patient Details List */}
        <ul className="space-y-1 text-xs pt-2">
          {patientDetails.map((detail) => {
            if (!detail.value) return null; 

            const isDob = detail.key === 'dob';
            const showLabel = detail.label !== '';

            return (
              <li key={detail.key} className="flex items-start space-x-1.5">
                {detail.icon && <detail.icon className="h-3.5 w-3.5 shrink-0 mt-0.5 text-sidebar-primary-foreground" />}
                <div className="flex-1 min-w-0">
                  {showLabel && (
                    <span className={`${isDob ? 'font-normal' : 'font-medium'}`}>
                      {detail.label}:{' '}
                    </span>
                  )}
                  <span className="font-normal">{detail.value}</span>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Footer with Action Icons and Company Logo */}
        <div className="mt-auto">
          <div className="flex items-center justify-around p-2 border-t border-sidebar-border">
            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-sidebar-accent text-sidebar-primary-foreground">
              <Ban className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-sidebar-accent text-sidebar-primary-foreground">
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-sidebar-accent text-sidebar-primary-foreground">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-center p-2 border-t border-sidebar-border">
            <Image
              src="/sansys.png" 
              alt="Sansys Informatics Logo"
              width={120} 
              height={40}  
              className="object-contain"
              priority 
            />
          </div>
        </div>
      </div>
    </SidebarContent>
  );
}
