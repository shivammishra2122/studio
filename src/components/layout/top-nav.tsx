
'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react'; // Assuming Menu icon for sidebar trigger

const navButtonLabels = [
  "Cover Sheet", "Dashboard", "Orders", "Clinical Notes", "Discharge Summary",
  "Emergency Care", "Postmortem", "Nursing Referral", "Lab", "Radiology",
  "Blood Center", "BI", "Report"
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <div className="bg-card border-b border-border px-1 py-1 sticky top-0 z-30 flex items-center space-x-0.5"> {/* Reduced px and py */}
      {/* Hamburger menu for mobile/tablet to toggle sidebar sheet */}
      <div className="md:hidden">
        <SidebarTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7"> {/* Reduced size */}
            <Menu className="h-4 w-4" /> {/* Reduced icon size */}
          </Button>
        </SidebarTrigger>
      </div>

      {/* Navigation buttons - scrollable on small screens */}
      <div className="flex-grow flex items-center space-x-0.5 overflow-x-auto no-scrollbar">
        {navButtonLabels.map((label, index) => {
          let href = "/"; // Default to home
          if (label === "Cover Sheet") {
            href = "/";
          } else if (label === "Dashboard") {
            href = "/vitals-dashboard";
          } else if (label === "Orders") {
            href = "/orders";
          } else if (label ==="Clinical Notes"){
            href = "/clinical-notes";
          } else if (label ==="Discharge Summary"){
            href="/discharge-summary";
          } else if (label ==="Emergency Care"){
            href="/emergency-care";
          } else if (label ==="Postmortem"){
            href="/postmortem";
          } else if (label ==="Nursing Referral"){
            href="/nursing-referral";
          } else if (label ==="Lab"){
            href="/lab";
          } else if (label === "Radiology") {
            href="/radiology"; 
          } else if (label === "Blood Center") {
            href="/blood-center"; // Assuming a new page, placeholder for now
          } else if (label === "BI") {
            href="/bi"; 
          } else if (label === "Report") {
            href="/report"; 
          }
          
          const isActive = pathname === href;
          
          // For pages not yet created (like Blood Center)
          if (href === "/" && !["Cover Sheet", "Dashboard", "Orders", "Clinical Notes", "Discharge Summary", "Emergency Care", "Postmortem", "Nursing Referral", "Lab", "Radiology", "BI", "Report"].includes(label) || (label === "Blood Center" && href === "/")) {
             return (
                <Button
                key={index}
                variant="ghost"
                size="sm"
                className="text-xs px-2 py-1 h-7 whitespace-nowrap hover:bg-accent hover:text-foreground"
                // onClick={() => alert(`${label} page not yet implemented.`)} // Optional: for unlinked buttons
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
