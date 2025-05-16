
'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
// PanelLeft is the default icon for SidebarTrigger, Menu might not be needed explicitly
// import { Menu } from 'lucide-react'; 

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
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {/* Using PanelLeft from SidebarTrigger directly */}
          </Button>
        </SidebarTrigger>
      </div>

      {/* Navigation buttons - scrollable on small screens */}
      <div className="flex-grow flex items-center space-x-0.5 overflow-x-auto no-scrollbar"> {/* Reduced space-x-1 to space-x-0.5 */}
        {navButtonLabels.map((label, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="text-xs px-2 py-1 h-7 whitespace-nowrap"
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
