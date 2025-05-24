
'use client';

import type { NextPage } from 'next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const nursingSubNavItems = ["Nurse Order", "Nurse Chart List", "Pharmacy"];

const nurseOrderOptions = [
  "POC Test",
  "Nursing Procedure Order",
  "Homecare Service Request",
  "Nursing Care"
];

const NursingPage: NextPage = () => {
  const [activeSubNav, setActiveSubNav] = useState<string>(nursingSubNavItems[0]);

  return (
    <div className="flex flex-col h-[calc(100vh-var(--top-nav-height,60px))] bg-background text-sm p-3">
      {/* Horizontal Navigation Bar */}
      <div className="flex items-end space-x-1 px-1 pb-0 mb-3 overflow-x-auto no-scrollbar border-b-2 border-border bg-card">
        {nursingSubNavItems.map((item) => (
          <Button
            key={item}
            onClick={() => setActiveSubNav(item)}
            className={`text-xs px-3 py-1.5 h-auto rounded-b-none rounded-t-md whitespace-nowrap focus-visible:ring-0 focus-visible:ring-offset-0
              ${activeSubNav === item
                ? 'bg-background text-primary border-x border-t border-border border-b-2 border-b-background shadow-sm relative -mb-px z-10 hover:bg-background hover:text-primary' 
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground border-x border-t border-transparent'
              }`}
          >
            {item}
          </Button>
        ))}
      </div>

      {/* Right Content Panel */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeSubNav === "Nurse Order" && (
          <Card className="flex-1 flex flex-col shadow-sm">
            <CardHeader className="bg-accent py-3 px-4 border-b rounded-t-md">
              <CardTitle className="text-base font-semibold text-foreground">Nurse Order</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {nurseOrderOptions.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  className="w-full max-w-xs justify-start text-left h-10 px-4 bg-muted hover:bg-muted/80 text-foreground rounded-lg shadow-sm"
                >
                  {option}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {activeSubNav === "Nurse Chart List" && (
          <Card className="flex-1 flex items-center justify-center shadow-sm">
            <CardContent className="text-center">
              <CardTitle className="text-xl text-muted-foreground">
                Nurse Chart List
              </CardTitle>
              <p className="text-sm text-muted-foreground">Content for this section is not yet implemented.</p>
            </CardContent>
          </Card>
        )}

        {activeSubNav === "Pharmacy" && (
          <Card className="flex-1 flex items-center justify-center shadow-sm">
            <CardContent className="text-center">
              <CardTitle className="text-xl text-muted-foreground">
                Pharmacy
              </CardTitle>
              <p className="text-sm text-muted-foreground">Content for this section is not yet implemented.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default NursingPage;
