
'use client';

import type { NextPage } from 'next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, Printer } from 'lucide-react';

const labSubNavItems = ["Most Recent", "Cumulative", "Lab Test", "Results & Graph"];

type LabResultEntryType = {
  labTest: string;
  results: string;
  units: string;
  refRange: string;
  isOutOfRange?: boolean;
};

const mockLabResults: LabResultEntryType[] = [
  { labTest: 'MCV', results: '92.6', units: 'fL', refRange: '83 to 101' },
  { labTest: 'MCH', results: '31.2', units: 'pg', refRange: '27 to 32' },
  { labTest: 'MCHC', results: '33.7', units: 'gm/dL', refRange: '31.5 to 34.5' },
  { labTest: 'PLATELET COUNT', results: '152', units: '10~9/L', refRange: '150 to 410' },
  { labTest: 'TLC', results: '8.91', units: '10~9/L', refRange: '4 to 10' },
  { labTest: 'NEUTROPHILS', results: '85.4', units: '%', refRange: '40 to 80', isOutOfRange: true },
  { labTest: 'LYMPHOCYTES', results: '6.8', units: '%', refRange: '20 to 40', isOutOfRange: true },
  { labTest: 'MONOCYTES', results: '6.8', units: '%', refRange: '2 to 10' },
  { labTest: 'EOSINOPHILS', results: '0.9', units: '%', refRange: '1.0 to 6.0', isOutOfRange: true },
  { labTest: 'BASOPHILS', results: '0.1', units: '%', refRange: '0 to 2' },
];

const LabPage: NextPage = () => {
  const [activeSubNav, setActiveSubNav] = useState<string>(labSubNavItems[0]);

  return (
    <div className="flex flex-col h-[calc(100vh-var(--top-nav-height,60px))] bg-background text-sm p-3">
      {/* Horizontal Navigation Bar */}
      <div className="flex items-center space-x-0.5 border-b border-border px-1 pb-1 mb-3 overflow-x-auto no-scrollbar bg-card">
        {labSubNavItems.map((item) => (
          <Button
            key={item}
            variant={activeSubNav === item ? "default" : "ghost"}
            size="sm"
            className={`text-xs px-2 py-1 h-7 whitespace-nowrap ${activeSubNav === item ? 'hover:bg-primary hover:text-primary-foreground' : 'hover:bg-accent hover:text-foreground'}`}
            onClick={() => setActiveSubNav(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      {/* Main Content Panel */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeSubNav === "Most Recent" && (
          <Card className="flex-1 flex flex-col shadow-sm">
            <CardHeader className="p-0">
              <div className="flex items-center justify-between p-2.5 border-b bg-accent text-foreground rounded-t-md">
                <CardTitle className="text-base font-semibold">Lab Results - Most Recents</CardTitle>
                <div className="flex items-center space-x-1">
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground">&lt;&lt; Oldest</Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground">&lt; Previous</Button>
                  <span className="text-xs text-foreground mx-2">Collected: 25 AUG, 2022 23:31</span>
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground">Next &gt;</Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground">Newest &gt;&gt;</Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50 ml-2">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1 min-h-0">
                <Table className="text-xs">
                  <TableHeader className="sticky top-0 bg-muted z-10">
                    <TableRow>
                      <TableHead className="py-2 px-3 font-semibold text-foreground w-[30%]">Lab Test</TableHead>
                      <TableHead className="py-2 px-3 font-semibold text-foreground w-[20%]">Results</TableHead>
                      <TableHead className="py-2 px-3 font-semibold text-foreground w-[20%]">Units</TableHead>
                      <TableHead className="py-2 px-3 font-semibold text-foreground w-[30%]">Ref Range</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLabResults.map((result) => (
                      <TableRow key={result.labTest} className="hover:bg-muted/30">
                        <TableCell className={`py-1.5 px-3 ${result.isOutOfRange ? 'font-bold' : ''}`}>{result.labTest}</TableCell>
                        <TableCell className={`py-1.5 px-3 ${result.isOutOfRange ? 'font-bold' : ''}`}>{result.results}</TableCell>
                        <TableCell className="py-1.5 px-3">{result.units}</TableCell>
                        <TableCell className={`py-1.5 px-3 ${result.isOutOfRange ? 'font-bold' : ''}`}>{result.refRange}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              <div className="flex items-center justify-between p-2.5 border-t text-xs text-foreground">
                <div className="flex space-x-4">
                  <span>Specimen: BLOOD</span>
                  <span>Accession: HE 0825 7</span>
                  <span>Provider: DOCTOR,SAN</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-muted/50">
                  <Printer className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSubNav !== "Most Recent" && (
          <Card className="flex-1 flex items-center justify-center shadow-sm">
            <CardContent className="text-center">
              <CardTitle className="text-xl text-muted-foreground">
                {activeSubNav} View
              </CardTitle>
              <p className="text-sm text-muted-foreground">Content for this section is not yet implemented.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default LabPage;

