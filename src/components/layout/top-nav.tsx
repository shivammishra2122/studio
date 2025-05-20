
'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

const navButtonLabels = [
  "Cover Sheet", "Dashboard", "Orders", "Clinical Notes", "Discharge Summary",
  "Emergency Care", "Postmortem", "Nursing", "Referral", "Lab", "Radiology",
  "Blood Center", "BI", "Report"
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
        {navButtonLabels.map((label, index) => {
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
          } else if (label === "Nursing"){ // Changed from "Nursing "
            href="/nursing";
          } else if (label === "Referral") {
            href="/referral";
          } else if (label === "Lab"){
            href="/lab";
          } else if (label === "Radiology") {
            href="/radiology"; 
          }  else if (label === "BI") {
            href="/bi"; 
          } else if (label === "Report") {
            href="/report"; 
          }
          
          const isActive = pathname === href;
          
          if (label === "Blood Center" && href === "/") { // Example for an unlinked button
             return (
                <Button
                key={index}
                variant="ghost"
                size="sm"
                className="text-xs px-2 py-1 h-7 whitespace-nowrap hover:bg-accent hover:text-foreground"
                >
                {label}
                </Button>
            );
          }

          return (
            <Link key={index} href={href} passHref legacyBehavior>
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
    </div>
  );
}
