
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
import { AppLogo } from '@/components/icons/app-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MOCK_PATIENT } from '@/lib/constants';
import type { Patient } from '@/lib/constants';
import { LayoutGrid, User as UserIcon, CalendarDays, BriefcaseMedical, PhoneCall, Home, Hourglass } from 'lucide-react'; // Using specific icon names

const patient: Patient = MOCK_PATIENT;

const patientDetails = [
  { label: 'Gender', value: patient.gender, icon: UserIcon },
  { label: 'Age', value: `${patient.age} years`, icon: UserIcon }, // Re-using UserIcon for Age
  { label: 'Ward', value: patient.wardNo, icon: Home }, // Using Home for Ward
  { label: 'Admitted', value: new Date(patient.admissionDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }), icon: CalendarDays },
  { label: 'Stay', value: patient.lengthOfStay, icon: Hourglass },
  { label: 'Mobile', value: patient.mobile, icon: PhoneCall },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <AppLogo className="size-7 text-primary" />
          <h1 className="text-xl font-semibold text-sidebar-foreground">HealthView</h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-4">
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-24 w-24 ring-2 ring-sidebar-primary">
            <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person patient" />
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-medium text-sidebar-foreground">{patient.name}</h2>
        </div>

        <ul className="space-y-1.5 text-xs text-sidebar-foreground/80">
          {patientDetails.map((detail) => (
            <li key={detail.label} className="flex items-center">
              <detail.icon className="mr-2 h-3.5 w-3.5" />
              <span>{detail.label === 'Mobile' ? detail.value : `${detail.label}: ${detail.value}`}</span>
            </li>
          ))}
        </ul>

        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" passHref legacyBehavior>
              <SidebarMenuButton
                isActive={pathname === '/'}
                className="data-[active=true]:bg-sidebar-menu-item-active-background data-[active=true]:text-sidebar-menu-item-active-foreground"
              >
                <LayoutGrid />
                Dashboard
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 bg-red-500">
            <AvatarFallback className="text-white text-sm font-semibold">N</AvatarFallback>
          </Avatar>
          {/* Can add user name or settings button here if needed later */}
        </div>
      </SidebarFooter>
    </>
  );
}
