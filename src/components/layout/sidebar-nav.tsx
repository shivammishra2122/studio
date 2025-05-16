
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MOCK_PATIENT } from '@/lib/constants';
import type { Patient } from '@/lib/constants';
import { LayoutGrid, User as UserIcon, CalendarDays, Home, Hourglass, PhoneCall } from 'lucide-react';

const patient: Patient = MOCK_PATIENT;

const patientDetails = [
  { label: 'Gender', value: patient.gender, icon: UserIcon },
  { label: 'Age', value: `${patient.age} years`, icon: UserIcon },
  { label: 'Ward', value: patient.wardNo, icon: Home },
  { label: 'Admitted', value: new Date(patient.admissionDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }), icon: CalendarDays },
  { label: 'Stay', value: patient.lengthOfStay, icon: Hourglass },
  { label: 'Mobile', value: patient.mobile, icon: PhoneCall },
];

export function SidebarNav() {
  const pathname = usePathname();
  const genderInitial = patient.gender ? patient.gender.charAt(0).toUpperCase() : '';

  return (
    <>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        {/* Logo and title removed as per user request */}
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-3"> {/* Reduced space-y for overall compactness */}
        <div className="flex flex-col space-y-2"> {/* Changed from items-center and adjusted space */}
          <div className="flex items-center space-x-2">
            <Avatar className="h-10 w-10"> {/* Reduced Avatar size and removed ring */}
              <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person patient" />
              <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-md font-medium text-sidebar-foreground">{patient.name}</h2>
              <p className="text-xs text-sidebar-foreground/80">
                {genderInitial} {patient.age}
              </p>
            </div>
          </div>
        </div>

        <ul className="space-y-1 text-xs text-sidebar-foreground/80 pt-2"> {/* Added pt-2 for spacing */}
          {patientDetails.map((detail) => (
            // Only display details other than gender and age here, as they are now in the header line
            (detail.label !== 'Gender' && detail.label !== 'Age') && (
              <li key={detail.label} className="flex items-center">
                <detail.icon className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">
                  {detail.label === 'Mobile' ? detail.value : `${detail.label}: ${detail.value}`}
                </span>
              </li>
            )
          ))}
        </ul>

        <SidebarMenu>
          {/* Dashboard menu item removed */}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 bg-red-500"> {/* Assuming this is a user/notification avatar */}
            <AvatarFallback className="text-white text-sm font-semibold">N</AvatarFallback>
          </Avatar>
          {/* Can add user name or settings button here if needed later */}
        </div>
      </SidebarFooter>
    </>
  );
}

