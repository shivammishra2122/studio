'use client';

import type { Patient } from '@/lib/constants';
import { MOCK_PATIENT } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarContent } from '@/components/ui/sidebar';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // Added this import
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
  Edit3, // Changed from PenLine
  Search,
} from 'lucide-react';

const patient: Patient = MOCK_PATIENT;

type PatientDetailItem = {
  key: keyof Patient | 'wardAndBed';
  label: string;
  value?: string; 
  icon?: React.ElementType; 
};

const patientDetails: PatientDetailItem[] = [
  { key: 'mobile', label: '', value: patient.mobile, icon: Phone },
  {
    key: 'dob',
    label: 'DOB', 
    value: patient.dob ? new Date(patient.dob).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : undefined,
    icon: CalendarDays,
  },
  { key: 'wardAndBed', label: '', value: patient.wardNo && patient.bedDetails ? `${patient.wardNo}, ${patient.bedDetails}` : patient.wardNo || patient.bedDetails, icon: BedDouble },
  {
    key: 'admissionDate',
    label: 'AD', 
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
  const genderDisplay = patient.gender ? patient.gender.charAt(0).toUpperCase() : '';

  return (
    <SidebarContent className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground px-3 pt-3">
      
      <div className="min-h-0 gap-2 overflow-y-auto no-scrollbar flex flex-col flex-1">
        {/* Patient Avatar, Name, UID Section */}
        <div className="flex flex-col items-center space-y-1 mb-2"> 
          <Avatar className="h-16 w-16"> 
            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person patient" />
            <AvatarFallback className="bg-white">
              <User className="h-8 w-8 text-primary" /> 
            </AvatarFallback>
          </Avatar>
           <div className="mt-1 w-full px-4 text-center">
            <p className="text-sm font-medium text-sidebar-primary-foreground">
              {patient.name} ({genderDisplay} {patient.age})
            </p>
          </div>
          <div className="mt-0.5 w-full px-4"> {/* UID/Barcode container */}
            <p className="text-xs font-medium text-sidebar-primary-foreground text-center">
              UID: 2734577854
            </p>
          </div>
        </div>

        {/* Patient Details List */}
        <ul className="space-y-1 text-xs pt-2"> 
          {patientDetails.map((detail) => (
            detail.value && (
              <li key={detail.key} className="flex items-start space-x-1"> 
                {detail.icon && <detail.icon className="h-3.5 w-3.5 shrink-0 mt-0.5 text-sidebar-primary-foreground" />}
                <div className="flex-1 min-w-0">
                  {detail.label && <span className={detail.key === 'dob' || detail.key === 'admissionDate' ? "font-normal" : "font-semibold"}>{detail.label}</span>}
                  <span className="font-normal">
                    {detail.label ? ' ' : ''}{detail.value}
                  </span>
                </div>
              </li>
            )
          ))}
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
              src="/sansys.png" // Placeholder, ensure this is in /public
              alt="Company Logo"
              width={150} 
              height={50}  
              className="object-contain"
              priority 
            />
          </div>
        </div>
      </div>
    </SidebarContent>
  );
}
