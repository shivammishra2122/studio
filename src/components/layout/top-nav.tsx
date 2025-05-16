
'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
// Menu icon might become unused if SidebarTrigger's default PanelLeft is acceptable.
// If Menu icon is critical, SidebarTrigger itself needs modification or a different approach.
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
        {/* 
          Use SidebarTrigger directly. It's already a Button component.
          It will render its default icon (PanelLeft).
          If a different icon (like Menu) is strictly required here, 
          the SidebarTrigger component in sidebar.tsx would need to be refactored 
          to accept a custom icon child, or a different trigger mechanism used.
        */}
        <SidebarTrigger className="h-8 w-8" />
      </div>

      {/* Navigation buttons - scrollable on small screens */}
      <div className="flex-grow flex items-center space-x-1 overflow-x-auto no-scrollbar">
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

