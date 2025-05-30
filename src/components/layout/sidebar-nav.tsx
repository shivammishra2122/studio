'use client';

import type { Patient } from '@/lib/constants'; // Assuming Patient type definition
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarContent } from '@/components/ui/sidebar'; // Your custom styled Sidebar
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import PatientDetailsProps from '@/components/layout/patient-details-sidebar';
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
  CircleUserRound,
} from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type PatientDetailItem = {
  key: string;
  label: string;
  value: string;
  icon: React.ElementType;
};

type DetailSection = {
  title?: string;
  items: PatientDetailItem[];
};

export function SidebarNav({ patient }: { patient: Patient }) {
  const [isPatientDetailsOpen, setIsPatientDetailsOpen] = useState(false);

  const genderDisplay = patient.gender ? patient.gender.charAt(0).toUpperCase() : '';
  const patientNameDisplay = `${patient.name || 'N/A'} (${genderDisplay}${patient.age !== undefined ? ` ${patient.age}` : ''})`;

  const twHsl = (variable: string) => `hsl(var(${variable}))`;

  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const sections: DetailSection[] = [
    {
      items: [
        { key: 'mobile', label: '', value: patient.mobile, icon: Phone },
        { key: 'dob', label: 'DOB', value: formatDate(patient.dob), icon: CalendarDays },
      ],
    },
    {
      title: 'ADMISSION',
      items: [
        { key: 'wardAndBed', label: '', value: `${patient.wardNo || ''}, ${patient.bedDetails || ''}`.replace(/^, |, $/g, ''), icon: BedDouble },
        { key: 'admissionDate', label: 'AD', value: formatDate(patient.admissionDate), icon: CalendarDays },
        { key: 'lengthOfStay', label: 'LOS', value: patient.lengthOfStay, icon: Clock },
        { key: 'encounterProvider', label: '', value: patient.encounterProvider, icon: Hospital },
      ],
    },
    {
      title: 'CLINICAL',
      items: [
        { key: 'primaryConsultant', label: '', value: patient.primaryConsultant ? `Dr. ${patient.primaryConsultant}` : '', icon: User },
        { key: 'specialty', label: '', value: patient.specialty, icon: BriefcaseMedical },
        { key: 'finalDiagnosis', label: 'Disease', value: patient.finalDiagnosis, icon: FileText },
        { key: 'reasonForVisit', label: '', value: patient.reasonForVisit, icon: FileQuestion },
      ],
    },
  ];

  return (
    <SidebarContent
      className="flex h-full w-full flex-col"
      style={{ // Apply sidebar background and foreground colors
        backgroundColor: twHsl('--sidebar-background'),
        color: twHsl('--sidebar-foreground'),
      }}
    >
      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar pb-1 pt-2 px-2.5">
        {/* Patient Info Header & Action Buttons */}

        <div className="pb-2.5"> {/* Wrapper for header and actions, add bottom padding before separator */}
          <div className="flex items-center justify-around py-1.5">
            {[
              { icon: Ban, label: 'Block' },
              { icon: Edit3, label: 'Edit' },
              { icon: Search, label: 'Search' },
            ].map((action) => (
              <Button
                key={action.label}
                variant="ghost"
                size="icon"

                className="h-4 w-8 rounded"
                style={{
                  color: twHsl('--sidebar-foreground'),
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = twHsl('--sidebar-accent')}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                aria-label={action.label}
              >
                <action.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>
        <div className="mb-2 flex flex-col items-center text-center"> {/* Reduced mb for tighter spacing before buttons */}
          <Avatar
            className="h-14 w-14 border-1 border-solid mb-1.5"
            style={{ borderColor: twHsl('--sidebar-accent') }}
          >
            <AvatarImage src={patient.avatarUrl} alt={patient.name || 'Patient Avatar'} />
            <AvatarFallback
              className="text-inherit"
              style={{ backgroundColor: twHsl('--sidebar-accent') }}
            >
              <CircleUserRound className="h-7 w-7" />
            </AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium leading-tight">
            <span
              className="cursor-pointer hover:underline"
              onClick={() => setIsPatientDetailsOpen(true)}
            >{patientNameDisplay}</span>
          </p>
          <p className="text-xs leading-tight opacity-80">
            UHID: {patient.id || '900752869578'}
          </p>
        </div>

        {/* Action Buttons Moved Here */}


        {/* White Separator */}
        <hr
          className="border-t my-0.5" // my-0.5 gives a tiny bit of space around it. Adjust if needed.
          style={{ borderColor: 'hsl(var(--sidebar-primary-foreground))' }} // Use --sidebar-primary-foreground (white)
        />

        {/* Patient Details Sections */}
        <div className="space-y-2.5 pt-2.5"> {/* Added pt-2.5 to give space after the separator */}
          {sections.map((section, sectionIndex) => (
            <div key={section.title || `section-${sectionIndex}`}>
              {section.title && ( // Only render title if it exists
                <h3
                  className="mb-1.5 text-[11px]  uppercase tracking-wide px-0.5 opacity-100"
                >
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((detail) => { // Map through detail items
                  const valueIsEmpty = !detail.value || detail.value.trim() === '' || detail.value.trim() === ',' || detail.value.toLowerCase().includes('undefined') || detail.value.toLowerCase() === 'n/a';
                  if (valueIsEmpty) return null; // Don't render if value is effectively empty

                  return (
                    <li key={detail.key} className="flex items-start space-x-1.5 text-xs">
                      <detail.icon
                        className="h-3.5 w-3.5 shrink-0 mt-[1px]"
                      />
                      <div className="flex-1 min-w-0 leading-snug">
                        {detail.label && detail.label !== '' && (
                          <span className="font-medium">
                            {detail.label}:{' '}
                          </span>
                        )}
                        <span className="font-normal opacity-90">
                          {detail.value}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer with Company Logo ONLY */}
      <div
        className="mt-auto border-t" // This border will use your --sidebar-border
        style={{ borderColor: twHsl('--sidebar-border') }}
      >
        <div
          className="flex items-center justify-center py-1.5 px-2"
        >
          <Image
            src="/sansys.png"
            alt="Sansys Informatics Logo"
            width={75}
            height={25}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Patient Details Dialog */}
      <Dialog open={isPatientDetailsOpen} onOpenChange={setIsPatientDetailsOpen}>
        <DialogContent className="max-w-screen-lg w-full h-full flex flex-col">
          <DialogHeader className="pb-4"> {/* Added bottom padding to the header */}
            {/* Using general theme colors for DialogTitle */}
            <DialogTitle style={{ color: twHsl('--foreground') }}>Patient Details</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-full overflow-y-auto pr-4"> {/* Add overflow-y-auto for scrollbar */}
            {/* Apply card-like styling to this container */}
            <div className="flex flex-col md:flex-row items-center gap-4 border rounded-md shadow-sm p-4 mb-4"
              style={{
                borderColor: twHsl('--border'), // Use the general border color
                backgroundColor: twHsl('--card'), // Use the card background color
              }}>
              <div className="w-24 h-24 bg-gray-200 rounded-sm flex-shrink-0">
                {/* Placeholder for image */}
              </div> {/* Removed the extra div here */}
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1.5 text-xs">
                <div className="col-span-1">
                  <p><span className="font-semibold">Name:</span> {patient.name || 'N/A'}</p>
                  <p><span className="font-semibold">Gender:</span> {patient.gender || 'N/A'}</p>
                  <p><span className="font-semibold">DOB:</span> {formatDate(patient.dob)}</p>
                  <p><span className="font-semibold">Age:</span> {patient.age !== undefined ? `${patient.age} Years, ${patient.age * 12} Months, and ${patient.age * 365} Days` : 'N/A'}</p>
                </div>
                <div className="col-span-1">
                  <p><span className="font-semibold">Aadhaar No:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Local Address:</span> {patient.address || 'N/A'}</p>
                  <p><span className="font-semibold">Mob No:</span> {patient.mobile || 'N/A'}</p>
                  <p><span className="font-semibold">Local PH No:</span> {patient.mobile || 'N/A'}</p> {/* Assuming same as mobile for now */}
                </div>
                <div className="col-span-1">
                  <p><span className="font-semibold">Email ID:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Father's Name:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Mother's Name:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Passport:</span> :</p> {/* Placeholder */}
                </div>
              </div>
              <div className="flex flex-col items-center text-xs">
                {/* Placeholder for barcode */}
                <div className="w-24 h-12 bg-gray-200 mb-1"></div>
                <p className="text-xs">00000000000</p> {/* Placeholder */}
              </div>
            </div>

            {/* Apply card-like styling to this container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 border rounded-md shadow-sm p-4 mb-4 text-xs"
              style={{
                borderColor: twHsl('--border'), // Use the general border color
                backgroundColor: twHsl('--card'), // Use the card background color
              }}>
              <div> {/* Removed explicit text-xs here, let parent grid control it */}
                <h4 className="font-semibold mb-1 text-xs">Patient Other Details</h4>
                <div className="grid grid-cols-2 gap-y-1 text-xs">
                  <p className='text-xs'><span className="font-semibold">Registration Date/Time:</span> {patient.registrationDateTime || 'N/A'}</p> {/* Kept text-xs for this line based on image */}
                  <p><span className="font-semibold">Permanent Address:</span> {patient.permanentAddress || 'N/A'}</p>
                  <p className='text-xs'><span className="font-semibold">Permanent Pin No:</span> :</p> {/* Placeholder, Kept text-xs for this line based on image */}
                  <p><span className="font-semibold">Permanent Mob No:</span> {patient.permanentMobile || 'N/A'}</p>
                  <p><span className="font-semibold">Local Guardian:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Relationship:</span> :</p> {/* Placeholder */} {/* Changed text-xs to text-base */}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-1 text-xs">IPD Details</h4>
                <div className="grid grid-cols-2 gap-y-1 text-xs"> {/* Set text size for content */}
                  <p><span className="font-semibold">Status:</span> {patient.ipdStatus || 'N/A'}</p>
                  <p><span className="font-semibold">IP No:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Admission Date:</span> {formatDate(patient.admissionDate)}</p>
                  <p><span className="font-semibold">Transferred:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Ward:</span> {patient.wardNo || 'N/A'}</p>
                  <p><span className="font-semibold">Specialty:</span> {patient.specialty || 'N/A'}</p>
                  <p><span className="font-semibold">Room/Bed:</span> {patient.bedDetails || 'N/A'}</p>
                  <p><span className="font-semibold">Primary Consultant 1:</span> {patient.primaryConsultant ? `Dr. ${patient.primaryConsultant}` : 'N/A'}</p>
                  <p><span className="font-semibold">Final Diagnosis:</span> {patient.finalDiagnosis || 'N/A'}</p> {/* Kept text-xs for consistency */}
                  <p><span className="font-semibold">Type Of Admission:</span> {patient.typeOfAdmission || 'N/A'}</p>
                  <p><span className="font-semibold">Comorbidity:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Referred By:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Special Precautions:</span> :</p> {/* Placeholder */}
                </div>
              </div>
            </div>

            {/* Apply card-like styling to this container */}
            <div className="border rounded-md shadow-sm p-4 mb-4 text-xs"
              style={{
                borderColor: twHsl('--border'), // Use the general border color
                backgroundColor: twHsl('--card'), // Use the card background color
              }}>
              <h4 className="font-semibold mb-1 text-xs">Remarks</h4>
              <p className="text-xs">{patient.remarks || 'N/A'}</p>
            </div>

            {/* Apply card-like styling to this container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 border rounded-md shadow-sm p-4 mb-4 text-xs"
              style={{
                borderColor: twHsl('--border'), // Use the general border color
                backgroundColor: twHsl('--card'), // Use the card background color
              }}>
              <div> {/* Removed explicit text-xs here */}
                <h4 className="font-semibold mb-1 text-xs">Insurance Details</h4> {/* Changed text-sm to text-xs */}
                <div className="grid grid-cols-2 gap-y-1 text-xs">
                  <p><span className="font-semibold">Payer Category:</span> :</p>
                </div>
              </div>
              <div> {/* Removed explicit text-xs here */}
                <h4 className="font-semibold mb-1 text-xs">Electronic Medical Legal Case/MLC Details</h4>
                <div className="grid grid-cols-2 gap-y-1 text-xs"> {/* Ensure grid items are text-xs */}
                  <p><span className="font-semibold">MLC ID:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Criticality:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">MLC Status:</span> :</p> {/* Placeholder */} {/* Changed text-sm to text-xs */}
                  <p><span className="font-semibold">Attempted By:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Facility Incharge:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Brought By:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Mode of Injury:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Ref By:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Faculty:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">MLC Report Link:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">CT OPD (Visit No + Date):</span> :</p> {/* Placeholder */}
                </div>
              </div>
            </div>

            {/* Apply card-like styling to this container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 border rounded-md shadow-sm p-4 mb-4 text-xs"
              style={{
                borderColor: twHsl('--border'), // Use the general border color
                backgroundColor: twHsl('--card'), // Use the card background color
              }}>
              <div> {/* Removed explicit text-xs here */}
                <h4 className="font-semibold mb-1 text-xs">Autopsy Details</h4>
                <div className="grid grid-cols-2 gap-y-1 text-xs">
                  <p><span className="font-semibold">Date of Death:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Source of Notification:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Death Certificate:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Death Report:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Death Card:</span> :</p> {/* Placeholder */}
                  <p><span className="font-semibold">Police Application:</span> :</p> {/* Placeholder */}
                </div>
              </div>
              <div className="flex justify-end items-end">
                {/* Placeholder for print button */}
                <Button size="sm" className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M6 3.75A1.5 1.5 0 017.5 2.25h9A1.5 1.5 0 0118 3.75v2.25c0 .621-.504 1.125-1.125 1.125H7.125A1.125 1.125 0 016 6v-2.25z" />
                    <path fillRule="evenodd" d="M5.25 9a6 6 0 016-6h2.25a6 6 0 016 6v3.375c0 4.006-3.245 7.25-7.25 7.25H9.75A7.25 7.25 0 012.5 12.375V9zm1.5 0a4.5 4.5 0 014.5-4.5h2.25a4.5 4.5 0 014.5 4.5v3.375c0 2.841-2.309 5.15-5.15 5.15H9.75A5.15 5.15 0 014.6 12.375V9z" clipRule="evenodd" />
                  </svg>
                  Print
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarContent>
  );
}