
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
    <div className="bg-card border-b border-border px-3 py-2.5 sticky top-0 z-30 flex items-center space-x-0.5">
      {/* Hamburger menu for mobile/tablet to toggle sidebar sheet */}
      <div className="md:hidden">
        <SidebarTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" />
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
            // Assuming you might want a placeholder or a specific page
            href="/radiology"; // You'll need to create this page
          } else if (label === "Blood Center") {
            href="/blood-center"; // You'll need to create this page
          } else if (label === "BI") {
            href="/bi"; // You'll need to create this page
          } else if (label === "Report") {
            href="/report"; // You'll need to create this page
          }
          
          // For pages not yet created or default behavior
          if (href === "/" && label !== "Cover Sheet" && label !== "Dashboard" && label !== "Orders" && label !== "Clinical Notes" && label !== "Discharge Summary" && label !== "Emergency Care" && label !== "Postmortem" && label !== "Nursing Referral" && label !== "Lab") {
             // Check if the page exists, if not, make it a plain button for now
            if (["Radiology", "Blood Center", "BI", "Report"].includes(label) && !["/radiology", "/blood-center", "/bi", "/report"].includes(href) ) {
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
          }


          return (
            <Link key={index} href={href} passHref legacyBehavior>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-xs px-2 py-1 h-7 whitespace-nowrap hover:bg-accent hover:text-foreground"
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
    