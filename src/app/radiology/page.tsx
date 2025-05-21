'use client';

import type { NextPage } from 'next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// ScrollArea removed
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, ArrowUpDown, FileSearch2 } from 'lucide-react';

const radiologySubNavItems = ["Radiology Test", "Pending Results", "Archived Scans"];

type RadiologyEntryDataType = {
  id: string;
  sNo: string;
  imagingProcedure: string;
  imagingType: string;
  orderDateTime: string;
  status: "ACTIVE" | "COMPLETE";
  provider: string;
};

const mockRadiologyEntries: RadiologyEntryDataType[] = [
  { id: '1', sNo: '1', imagingProcedure: 'USG RENAL DOPPLER', imagingType: 'US', orderDateTime: '31 AUG, 2022 10:43', status: 'ACTIVE', provider: 'Sansys Doctor' },
  { id: '2', sNo: '2', imagingProcedure: 'X-RAY CHEST PA/AP VIEW', imagingType: 'RAD', orderDateTime: '31 AUG, 2022 10:43', status: 'COMPLETE', provider: 'Sansys Doctor' },
  { id: '3', sNo: '3', imagingProcedure: 'USG ABDOMINAL DOPPLER (PORTO CAVAL)', imagingType: 'US', orderDateTime: '31 AUG, 2022 11:25', status: 'COMPLETE', provider: 'Sansys Doctor' },
];

const RadiologyPage: NextPage = () => {
  const [activeSubNav, setActiveSubNav] = useState<string>(radiologySubNavItems[0]);

  // State for filters
  const [visitDate, setVisitDate] = useState<string>("18 DEC, 2022 23:36 - ICU ONE");
  const [orderFrom, setOrderFrom] = useState<string>("");
  const [orderTo, setToDate] = useState<string>(""); // Renamed to avoid conflict with potential date-fns import
  const [showEntries, setShowEntries] = useState<string>("All");
  const [searchText, setSearchText] = useState<string>("");

  const filteredEntries = mockRadiologyEntries; 

  return (
    <div className="flex flex-col h-[calc(100vh-var(--top-nav-height,40px))] bg-background text-sm p-3">
      {/* Horizontal Sub-Navigation Bar */}
      <div className="flex items-end space-x-1 px-1 pb-0 mb-3 overflow-x-auto no-scrollbar border-b-2 border-border bg-card">
        {radiologySubNavItems.map((item) => (
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col gap-3 overflow-hidden">
        {activeSubNav === "Radiology Test" && (
          <Card className="flex-1 flex flex-col shadow overflow-hidden">
            <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
              <CardTitle className="text-base font-semibold">Radiology List - Active &amp; Completed</CardTitle>
            </CardHeader>

            <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
              {/* Filter Bars */}
              <div className="space-y-2 mb-2 text-xs">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <Label htmlFor="visitDate" className="shrink-0">Visit Date</Label>
                  <Select value={visitDate} onValueChange={setVisitDate}>
                    <SelectTrigger id="visitDate" className="h-7 w-48 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18 DEC, 2022 23:36 - ICU ONE">18 DEC, 2022 23:36 - ICU ONE</SelectItem>
                    </SelectContent>
                  </Select>

                  <Label htmlFor="orderFrom" className="shrink-0">Order From</Label>
                  <div className="relative">
                    <Input id="orderFrom" type="text" value={orderFrom} onChange={e => setOrderFrom(e.target.value)} className="h-7 w-28 text-xs pr-7" />
                    <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>

                  <Label htmlFor="orderTo" className="shrink-0">Order To</Label>
                  <div className="relative">
                    <Input id="orderTo" type="text" value={orderTo} onChange={e => setToDate(e.target.value)} className="h-7 w-28 text-xs pr-7" />
                    <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                   <Label htmlFor="showEntries" className="shrink-0">Show</Label>
                    <Select value={showEntries} onValueChange={setShowEntries}>
                        <SelectTrigger id="showEntries" className="h-7 w-20 text-xs">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                  <Label className="shrink-0">entries</Label>
                  <div className="flex-grow"></div> 
                  <Label htmlFor="radiologySearch" className="shrink-0">Search:</Label>
                  <Input id="radiologySearch" type="text" value={searchText} onChange={e => setSearchText(e.target.value)} className="h-7 w-40 text-xs" />
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-hidden min-h-0">
                <Table className="text-xs min-w-[80rem] flex-1 min-h-0">
                  <TableHeader className="bg-accent sticky top-0 z-10">
                    <TableRow>
                      {[
                        "S No.", "Imaging Procedure", "Imaging Type", "Order Date and Time", 
                        "Status", "Provider", "Result View", "Imaging Pacs", "Order View"
                      ].map(header => (
                        <TableHead key={header} className="py-2 px-3 text-foreground font-semibold h-8 whitespace-nowrap">
                          <div className="flex items-center justify-between">
                            {header}
                            <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.length > 0 ? filteredEntries.map((entry, index) => (
                      <TableRow key={entry.id} className={`hover:bg-muted/30 ${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                        <TableCell className="py-1.5 px-3 whitespace-nowrap">{entry.sNo}</TableCell>
                        <TableCell className="py-1.5 px-3 whitespace-nowrap">{entry.imagingProcedure}</TableCell> {/* Keep this nowrap */}
                        <TableCell className="py-1.5 px-3 whitespace-nowrap">{entry.imagingType}</TableCell>
                        <TableCell className="py-1.5 px-3 whitespace-nowrap">{entry.orderDateTime}</TableCell>
                        <TableCell className="py-1.5 px-3 whitespace-nowrap">{entry.status}</TableCell>
                        <TableCell className="py-1.5 px-3 whitespace-nowrap">{entry.provider}</TableCell>
                        <TableCell className="py-1.5 px-3 text-center">
                          <Button variant="ghost" size="icon" className="h-6 w-6"><FileSearch2 className="h-3.5 w-3.5 text-blue-600" /></Button>
                        </TableCell>
                        <TableCell className="py-1.5 px-3 text-center">
                          <Button variant="ghost" size="icon" className="h-6 w-6"><FileSearch2 className="h-3.5 w-3.5 text-blue-600" /></Button>
                        </TableCell>
                        <TableCell className="py-1.5 px-3 text-center">
                          <Button variant="ghost" size="icon" className="h-6 w-6"><FileSearch2 className="h-3.5 w-3.5 text-blue-600" /></Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                          No radiology entries found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
                <div>Showing {filteredEntries.length > 0 ? 1 : 0} to {filteredEntries.length} of {filteredEntries.length} entries</div>
                <div className="flex items-center space-x-1">
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Previous</Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1 bg-accent text-foreground border-border">1</Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {activeSubNav !== "Radiology Test" && (
          <Card className="flex-1 flex items-center justify-center">
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

export default RadiologyPage;