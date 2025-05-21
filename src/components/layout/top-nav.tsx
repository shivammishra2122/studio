
'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navButtonLabels = [
  "Cover Sheet", "Dashboard", "Orders", "Clinical Notes", "Discharge Summary",
  "Emergency Care", "Postmortem", "Nursing", "Referral", "Lab", "Radiology",
  "Blood Center", "Report" // "BI" removed
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <div className="bg-card border-b border-border px-1 py-1 sticky top-0 z-30 flex items-center space-x-0.5">
      <div className="md:hidden">
        <SidebarTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Menu className="h-4 w-4" />
          </Button>
        </SidebarTrigger>
      </div>

      <div className="flex-grow flex items-center space-x-0.5 overflow-x-auto no-scrollbar">
        {navButtonLabels.map((label) => {
          let href = "/";
          if (label === "Cover Sheet") {
            href = "/";
          } else if (label === "Dashboard") {
            href = "/vitals-dashboard";
          } else if (label === "Orders") {
            href = "/orders";
          } else if (label === "Clinical Notes"){
            href = "/clinical-notes";
          } else if (label === "Discharge Summary"){
            href="/discharge-summary";
          } else if (label === "Emergency Care"){
            href="/emergency-care";
          } else if (label === "Postmortem"){
            href="/postmortem";
          } else if (label === "Nursing"){
            href="/nursing";
          } else if (label === "Referral") {
            href="/referral";
          } else if (label === "Lab"){
            href="/lab";
          } else if (label === "Radiology") {
            href="/radiology";
          } else if (label === "Report") {
            href="/report";
          }
          
          const isActive = pathname === href;
          
          // For "Blood Center" or any other non-linked button currently
          if (label === "Blood Center" && href === "/") {
             return (
                <Button
                key={label}
                variant="ghost"
                size="sm"
                className="text-xs px-2 py-1 h-7 whitespace-nowrap hover:bg-accent hover:text-foreground"
                >
                {label}
                </Button>
            );
          }

          return (
            <Link key={label} href={href} passHref legacyBehavior>
              <Button
                asChild
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`text-xs px-2 py-1 h-7 whitespace-nowrap ${!isActive ? 'hover:bg-accent hover:text-foreground' : 'hover:bg-primary hover:text-primary-foreground'}`}
              >
                <a>{label}</a>
              </Button>
            </Link>
          );
        })}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Help</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
