'use client';

import type { Patient } from '@/lib/constants';
import { MOCK_PATIENT } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarContent } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button'; // Added this import
import Image from 'next/image';
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

// This array defines the order and content of patient details in the sidebar
const patientDetails: PatientDetailItem[] = [
  { key: 'mobile', label: '', value: patient.mobile, icon: Phone },
  {
    key: 'dob',
    label: 'DOB', // Only DOB and AD show labels
    value: patient.dob ? new Date(patient.dob).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : undefined,
    icon: CalendarDays,
  },
  { key: 'wardAndBed', label: '', value: patient.wardNo && patient.bedDetails ? `${patient.wardNo}, ${patient.bedDetails}` : patient.wardNo || patient.bedDetails, icon: BedDouble },
  {
    key: 'admissionDate',
    label: 'AD', // Only DOB and AD show labels
    value: patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : undefined,
    icon: CalendarDays,
  },
  { key: 'lengthOfStay', label: '', value: patient.lengthOfStay, icon: Clock },
  { key: 'primaryConsultant', label: 'Consultant', value: patient.primaryConsultant, icon: User },
  { key: 'encounterProvider', label: 'Provider', value: patient.encounterProvider, icon: Hospital },
  { key: 'finalDiagnosis', label: '', value: patient.finalDiagnosis, icon: FileText },
  { key: 'posting', label: '', value: patient.posting, icon: BriefcaseMedical },
  { key: 'reasonForVisit', label: '', value: patient.reasonForVisit, icon: FileQuestion },
];

export function SidebarNav() {
  const genderDisplay = patient.gender ? patient.gender.charAt(0).toUpperCase() : '';

  return (
    <SidebarContent className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground px-3 pt-3">
      {/* Main content area of the sidebar, allows scrolling if content overflows */}
      <div className="min-h-0 gap-2 overflow-y-auto no-scrollbar flex flex-col flex-1">
        {/* Patient Avatar, Barcode, Name, Gender, Age - Centered */}
        <div className="flex flex-col items-center space-y-2 mb-2">
          <Avatar className="h-20 w-20"> {/* Increased size */}
            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person patient" />
            <AvatarFallback className="bg-white"> {/* White background for fallback */}
              <User className="h-10 w-10 text-primary" /> {/* Primary color for icon */}
            </AvatarFallback>
          </Avatar>
          <div className="mt-2 w-full px-4"> {/* Barcode container */}
            <Image
              src="https://placehold.co/150x30/007B8A/FFF.png?text=2734577854&font=roboto" // Placeholder barcode image
              alt="Patient Barcode"
              width={150} // Adjust width as needed
              height={30}  // Adjust height as needed
              className="object-contain mx-auto" // Centered barcode
              data-ai-hint="barcode medical"
            />
          </div>
          <div className="text-center">
            <p className="text-md font-medium">
              {patient.name} ({genderDisplay} {patient.age})
            </p>
          </div>
        </div>

        {/* Patient Details List - Left Aligned with Icons */}
        <ul className="space-y-1 text-xs pt-3"> {/* Increased top padding and space between items */}
          {patientDetails.map((detail) => (
             detail.value && ( // Only render if value exists
              <li key={detail.key} className="flex items-start space-x-1.5">
                {detail.icon && <detail.icon className="h-3.5 w-3.5 shrink-0 mt-0.5 text-sidebar-primary-foreground" />}
                <div className="flex-1 min-w-0">
                  {detail.label && <span className={detail.key === 'dob' || detail.key === 'admissionDate' ? "font-normal" : "font-medium"}>{detail.label}: </span>}
                  <span className="font-normal">
                    {detail.value}
                  </span>
                </div>
              </li>
            )
          ))}
        </ul>

        {/* Footer with Action Icons and Company Logo */}
        <div className="mt-auto"> {/* Pushes content to the bottom */}
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
            {/* Ensure company-logo.png is in the public folder */}
            <Image
              src="/sansys.png"
              alt="Company Logo"
              width={150} // Adjust as needed
              height={50}  // Adjust as needed
              className="object-contain"
              priority // If it's important for LCP
            />
          </div>
        </div>
      </div>
    </SidebarContent>
  );
}
