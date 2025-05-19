
'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';

const navButtonLabels = [
  "Cover Sheet", "Dashboard", "Orders", "Clinical Notes", "Discharge Summary",
  "Emergency Care", "Postmortem", "Nursing Referral", "Lab", "Radiology",
  "Blood Center", "BI", "Report"
];

export function TopNav() {
  return (
    <div className="bg-card border-b border-border px-3 py-2.5 sticky top-0 z-30 flex items-center space-x-2">
      {/* Hamburger menu for mobile/tablet to toggle sidebar sheet */}
      <div className="md:hidden">
        <SidebarTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" />
        </SidebarTrigger>
      </div>

      {/* Navigation buttons - scrollable on small screens */}
      <div className="flex-grow flex items-center space-x-0.5 overflow-x-auto no-scrollbar">
        {navButtonLabels.map((label, index) => {
          if (label === "Dashboard") {
            return (
              <Link key={index} href="/vitals-dashboard" passHref legacyBehavior>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-xs px-2 py-1 h-7 whitespace-nowrap"
                >
                  <a>{label}</a>
                </Button>
              </Link>
            );
          }
          if (label === "Orders") {
            return (
              <Link key={index} href="/orders" passHref legacyBehavior>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-xs px-2 py-1 h-7 whitespace-nowrap"
                >
                  <a>{label}</a>
                </Button>
              </Link>
            );
          }
          if (label ==="Clinical Notes"){
            return(
              <Link key={index} href="/clinical-notes" passHref legacyBehavior>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-xs px-2 py-1 h-7 whitespace-nowrap"
                >
                  <a>{label}</a>
                </Button>
              </Link>
            );
          }
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="text-xs px-2 py-1 h-7 whitespace-nowrap"
            >
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
