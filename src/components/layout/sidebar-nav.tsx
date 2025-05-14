
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { NAV_ITEMS } from '@/lib/constants';
import { AppLogo } from '@/components/icons/app-logo';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MOCK_PATIENT } from '@/lib/constants';
import type { Patient } from '@/lib/constants';
import { User as UserIcon, VenetianMask, Building, CalendarDays, Smartphone, Hourglass } from 'lucide-react';

export function SidebarNav() {
  const pathname = usePathname();
  const patient: Patient = MOCK_PATIENT;

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <AppLogo className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">
              HealthView
            </h1>
          </Link>
           <div className="md:hidden"> {/* Show trigger only on mobile inside sidebar */}
             <SidebarTrigger />
           </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Patient Info Section - Visible only when sidebar is expanded */}
        <div className="p-4 border-b border-sidebar-border group-data-[collapsible=icon]:hidden">
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-20 w-20">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} data-ai-hint="person patient"/>
              <AvatarFallback>{patient.name.substring(0, 1)}</AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold text-sidebar-foreground">{patient.name}</h2>
            <div className="space-y-1.5 text-xs text-sidebar-foreground/80 w-full">
              <div className="flex items-center space-x-2">
                <VenetianMask className="h-3.5 w-3.5 text-sidebar-foreground/70" />
                <span>{patient.gender}</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserIcon className="h-3.5 w-3.5 text-sidebar-foreground/70" />
                <span>{patient.age} years</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="h-3.5 w-3.5 text-sidebar-foreground/70" />
                <span>Ward: {patient.wardNo}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarDays className="h-3.5 w-3.5 text-sidebar-foreground/70" />
                <span>Admitted: {new Date(patient.admissionDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Hourglass className="h-3.5 w-3.5 text-sidebar-foreground/70" />
                <span>Stay: {patient.lengthOfStay}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-3.5 w-3.5 text-sidebar-foreground/70" />
                <span>{patient.mobileNumber}</span>
              </div>
            </div>
          </div>
        </div>

        <SidebarMenu>
          {NAV_ITEMS.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right', align: 'center' }}
                  className={cn(
                    pathname === item.href
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90'
                      : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    'justify-start'
                  )}
                >
                  <a>
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
