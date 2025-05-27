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
  Hospital,
  FileText,
  BriefcaseMedical,
  FileQuestion,
  User,
  Heart,
  Ban,
  PenLine,
  Search,
  MapPin,
} from 'lucide-react';

const patient: Patient = MOCK_PATIENT;

type PatientDetailItem = {
  key: keyof Patient | 'wardAndBed' | 'vitalSigns';
  label: string;
  value: string | undefined;
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
  {
    key: 'admissionDate',
    label: 'DOA', // Changed from AD to DOA as per image
    value: patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : undefined,
    icon: CalendarDays,
  },
  { key: 'lengthOfStay', label: 'LOS', value: patient.lengthOfStay, icon: Clock },
  { key: 'wardAndBed', label: '', value: (patient.wardNo && patient.bedDetails) ? `${patient.wardNo}, ${patient.bedDetails}` : patient.wardNo || patient.bedDetails, icon: BedDouble },
  { key: 'primaryConsultant', label: '', value: patient.primaryConsultant, icon: User },
  { key: 'specialty', label: '', value: patient.specialty, icon: BriefcaseMedical },
  { key: 'encounterProvider', label: '', value: patient.encounterProvider, icon: Hospital },
  { key: 'finalDiagnosis', label: 'Disease', value: patient.finalDiagnosis, icon: FileText },
  { key: 'reasonForVisit', label: '', value: patient.reasonForVisit, icon: FileQuestion },
];

export function SidebarNav() {
  const genderDisplay = patient.gender ? patient.gender.charAt(0).toUpperCase() : '';

  return (
    <SidebarContent className="flex h-full w-full flex-col bg-teal-600 text-white px-3 pt-3">
      {/* Added Greeting */}
      <div className="pb-3 text-sm font-medium text-sidebar-primary-foreground">
        Good morning, Sansys Doctor
      </div>

      <div className="flex flex-col items-center space-y-1 mb-2">
        <Avatar className="h-14 w-14">
          <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person patient" />
          <AvatarFallback className="bg-white">
            <User className="h-7 w-7 text-primary" />
          </AvatarFallback>
        </Avatar>
        
        <p className="text-sm font-medium">
          {patient.name} ({genderDisplay} {patient.age})
        </p>
      </div>

      {/* Main content section that scrolls */}
      <div className="flex-1 flex flex-col min-h-0">
        <ul className="space-y-1 text-xs pt-3 flex-1 min-h-0 overflow-y-auto no-scrollbar">
          {patientDetails.map((detail) => {
            if (!detail.value) return null; // Skip rendering if value is undefined or empty
            return (
              <li key={detail.key} className="flex items-start space-x-1.5">
                {detail.icon && <detail.icon className="h-3.5 w-3.5 shrink-0 mt-0.5 text-sidebar-primary-foreground" />}
                <div className="flex-1 min-w-0">
                  {detail.label && detail.label !== '' && (
                    <span className={detail.key === 'dob' ? 'font-normal' : 'font-medium'}>{detail.label}: </span>
                  )}
                  <span className="font-normal break-words"> 
                    {detail.value}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        {/* User Name and Location Section */}
        <div className="mt-3 pt-2 border-t border-sidebar-border text-xs">
          <div className="flex items-start space-x-1.5 mb-1">
            <User className="h-3.5 w-3.5 shrink-0 mt-0.5 text-sidebar-primary-foreground" />
            <span className="font-normal break-words">SANSYS DOCTOR</span>
          </div>
          <div className="flex items-start space-x-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-sidebar-primary-foreground" />
            <span className="font-normal break-words">Main Clinic</span>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-auto"> {/* This pushes the footer to the bottom */}
        <div className="flex items-center justify-around p-2 border-t border-sidebar-border">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-primary-foreground hover:bg-sidebar-accent">
            <Ban className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-primary-foreground hover:bg-sidebar-accent">
            <PenLine className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-primary-foreground hover:bg-sidebar-accent">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-center p-2 border-t border-sidebar-border">
          <Image
            src="/sansys.png" // Placeholder, replace with your actual logo path in /public
            alt="Company Logo"
            width={100} // Adjust as needed
            height={30} // Adjust as needed
            className="object-contain"
            priority
          />
        </div>
      </div>
    </SidebarContent>
  );
}
