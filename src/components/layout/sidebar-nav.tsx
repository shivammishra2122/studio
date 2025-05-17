
'use client';

import type { Patient, PatientDetailItem } from '@/lib/constants';
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
  User, // Keep User for AvatarFallback
  Hospital,
  FileText,
  BriefcaseMedical,
  FileQuestion,
} from 'lucide-react';
import Image from 'next/image';

const patient: Patient = MOCK_PATIENT;

const patientDetails: PatientDetailItem[] = [
  { key: 'wardAndBed', label: '', value: `${patient.wardNo}, ${patient.bedDetails}`, icon: BedDouble },
  {
    key: 'dob',
    label: 'DOB',
    value: patient.dob ? new Date(patient.dob).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : undefined,
    icon: CalendarDays
  },
  {
    key: 'admissionDate',
    label: 'AD',
    value: patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : undefined,
    icon: CalendarDays,
  },
  { key: 'lengthOfStay', label: '', value: patient.lengthOfStay, icon: Clock },
  { key: 'mobile', label: '', value: patient.mobile, icon: Phone },
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
      <SidebarContent className="px-3 pt-3 space-y-1 flex flex-col flex-1">
        {/* SidebarHeader removed */}
        
        <div className="flex flex-col items-center space-y-1 mb-2"> 
          <Avatar className="h-20 w-20"> 
            <AvatarImage 
              src={patient.avatarUrl} 
              alt={patient.name}
              data-ai-hint="person patient"
            />
            <AvatarFallback className="bg-white">
              <User className="h-10 w-10 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-md font-medium text-sidebar-foreground">
              {patient.name} ({genderInitial} {patient.age})
            </p>
          </div>
          <div className="mt-2 w-full px-4">
            <Image
              src="https://placehold.co/180x50.png"
              alt="Patient Barcode"
              width={180}
              height={50}
              className="object-contain mx-auto"
              data-ai-hint="barcode medical"
            />
          </div>
        </div>

        <ul className="space-y-1.5 text-xs text-sidebar-foreground pt-2">
          {patientDetails.map(
            (detail) => detail.value && (
              <li key={detail.key} className="flex items-start space-x-1.5"> 
                {detail.icon && <detail.icon className="h-3.5 w-3.5 text-sidebar-primary-foreground shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  {detail.label && detail.label !== 'DOB' && <span className="font-medium">{detail.label}: </span>}
                  {detail.label === 'DOB' && <span className="font-medium">DOB: </span>}
                  <span className="font-normal">{detail.value}</span>
                </div>
              </li>
            )
          )}
        </ul>

        <div className="mt-auto flex items-center justify-center p-2 border-t border-sidebar-border">
          <Image
            src="/company-logo.png" // Ensure this path is correct for your logo in the public folder
            alt="Company Logo"
            width={150} // Adjust as needed
            height={50}  // Adjust as needed
            className="object-contain"
            priority // Can be useful for LCP elements
          />
        </div>
      </SidebarContent>
    </>
  );
}

