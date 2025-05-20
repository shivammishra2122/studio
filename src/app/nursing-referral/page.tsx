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

const NursingReferralPage: NextPage = () => {
  const [activeSubNav, setActiveSubNav] = useState<string>(nursingSubNavItems[0]);

  return (
    <div className="flex h-[calc(100vh-var(--top-nav-height,60px))] bg-background text-sm">
      {/* Left Vertical Navigation Panel */}
      <aside className="w-52 bg-card border-r p-3 flex flex-col space-y-1">
        {nursingSubNavItems.map((item) => (
          <Button
            key={item}
            variant={activeSubNav === item ? "secondary" : "ghost"}
            className={`w-full justify-start text-left h-10 px-3 text-sm ${
              activeSubNav === item
                ? 'bg-secondary text-primary border-l-4 border-primary hover:bg-secondary hover:text-primary'
                : 'hover:bg-accent hover:text-foreground'
            }`}
            onClick={() => setActiveSubNav(item)}
          >
            {item}
          </Button>
        ))}
      </aside>

      {/* Right Content Panel */}
      <main className="flex-1 p-3 flex flex-col">
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

export default NursingReferralPage;