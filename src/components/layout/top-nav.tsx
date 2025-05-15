
'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';

const navButtonLabels = [
  "Home", "Patients", "Appointments", "Billing", "Reports",
  "Messages", "Tasks", "Analytics", "Settings", "Help"
];

export function TopNav() {
  return (
    <div className="bg-card border-b border-border px-3 py-2.5 sticky top-0 z-30 flex items-center space-x-2">
      {/* Hamburger menu for mobile/tablet to toggle sidebar sheet */}
      <div className="md:hidden">
        <SidebarTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SidebarTrigger>
      </div>

      {/* Navigation buttons - scrollable on small screens */}
      <div className="flex-grow flex items-center space-x-1 overflow-x-auto no-scrollbar">
        {navButtonLabels.map((label, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="text-xs px-2 py-1 h-7 whitespace-nowrap" // Compact buttons
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
