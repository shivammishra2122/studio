
'use client';

import type { Patient } from '@/lib/constants';
import { MOCK_PATIENT } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';

const patient: Patient = MOCK_PATIENT;

const patientDetails = [
  { label: 'Gender', value: patient.gender },
  { label: 'Age', value: `${patient.age} years` },
  { label: 'Ward', value: patient.wardNo },
  {
    label: 'Admitted',
    value: new Date(patient.admissionDate).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    }),
  },
  { label: 'Stay', value: patient.lengthOfStay },
  { label: 'Mobile', value: patient.mobile },
  {
    label: 'DOB',
    value: new Date(patient.dob).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    }),
  },
  { label: 'Consultant', value: patient.primaryConsultant }, // Renamed
  { label: 'Provider', value: patient.encounterProvider }, // Renamed
  { label: 'Final Diagnosis', value: patient.finalDiagnosis },
  { label: 'Posting', value: patient.posting },
  { label: 'Reason for Visit', value: patient.reasonForVisit },
];

export function SidebarNav() {
  const genderInitial = patient.gender ? patient.gender.charAt(0).toUpperCase() : '';

  return (
    <>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        {/* Logo and title removed as per user request */}
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-3">
        <div className="flex flex-col items-center space-y-1">
          <Avatar className="h-16 w-16 mb-2">
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

        <ul className="space-y-1 text-xs text-sidebar-foreground/80 pt-2">
          {patientDetails.map(
            (detail) =>
              detail.label !== 'Gender' &&
              detail.label !== 'Age' && (
                <li key={detail.label} className="flex items-start">
                  <span className="font-medium w-28 shrink-0">{detail.label}:</span>
                  <span className="flex-1">{detail.value}</span> {/* Removed truncate, allows wrapping */}
                </li>
              )
          )}
        </ul>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border">
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
