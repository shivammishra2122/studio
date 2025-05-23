'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpDown, RefreshCw } from 'lucide-react';

const subNavItems = ["COPD List", "MLC/Non-MLC Note"];

const copdTableHeaders = [
  { name: "Visit", className: "w-[10%]" },
  { name: "Visit Date/Time", className: "w-[12%]" },
  { name: "Type", className: "w-[8%]" },
  { name: "MLC", className: "w-[8%]" },
  { name: "MLC/Progress Id", className: "w-[10%]" },
  { name: "Treating Facility", className: "w-[12%]" },
  { name: "Injury", className: "w-[10%]" },
  { name: "Criticality", className: "w-[10%]" },
  { name: "Consultant Name", className: "w-[10%]" },
  { name: "Attended By", className: "w-[10%]" },
  { name: "Referred From", className: "w-[10%]" },
];

const EmergencyCarePage = () => {
  const [activeSubNav, setActiveSubNav] = useState<string>(subNavItems[0]);
  const [showEntries, setShowEntries] = useState<string>("10");
  const [searchText, setSearchText] = useState<string>("");

  return (
    <div className="flex flex-col h-[calc(100vh-var(--top-nav-height,40px))] bg-background text-sm p-3">
      {/* Horizontal Navigation Bar */}
      <div className="flex items-end space-x-1 px-1 pb-0 mb-3 overflow-x-auto no-scrollbar border-b-2 border-border bg-card">
        {subNavItems.map((item) => (
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

      <main className="flex-1 flex flex-col gap-3 overflow-hidden">
        {activeSubNav === "COPD List" && (
          <Card className="flex-1 flex flex-col shadow overflow-hidden">
            <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Patient COPD List</CardTitle>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="showEntries" className="text-xs shrink-0">Show</Label>
                  <Select value={showEntries} onValueChange={setShowEntries}>
                    <SelectTrigger id="showEntries" className="h-7 w-20 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label htmlFor="showEntries" className="text-xs shrink-0">entries</Label>
                  <div className="flex-grow"></div>
                  <Label htmlFor="copdSearch" className="text-xs shrink-0">Search:</Label>
                  <Input
                    id="copdSearch"
                    type="text"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    className="h-7 w-40 text-xs"
                  />
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto min-h-0 relative">
                <Table className="text-xs w-full">
                  <TableHeader className="bg-background sticky top-0 z-10 border-b">
                    <TableRow>
                      {copdTableHeaders.map(header => (
                        <TableHead
                          key={header.name}
                          className={`py-2 px-3 text-foreground font-semibold h-auto whitespace-normal ${header.className}`}
                        >
                          <div className="flex items-center justify-between">
                            {header.name}
                            <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan={copdTableHeaders.length}
                        className="text-center py-10 text-muted-foreground whitespace-normal"
                      >
                        No Data Found
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
                <div>Showing 0 to 0 of 0 entries</div>
                <div className="flex items-center space-x-1">
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Previous</Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Next</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-2.5 border-t flex justify-center space-x-2">
              <Button size="sm" className="text-xs bg-orange-400 hover:bg-orange-500 text-white h-8">Create MLC</Button>
              <Button size="sm" className="text-xs bg-orange-400 hover:bg-orange-500 text-white h-8">Create Progress</Button>
              <Button size="sm" className="text-xs bg-orange-400 hover:bg-orange-500 text-white h-8">Print MLC Report</Button>
              <Button size="sm" className="text-xs bg-orange-400 hover:bg-orange-500 text-white h-8">Print Progress Note</Button>
            </CardFooter>
          </Card>
        )}

        {activeSubNav === "MLC/Non-MLC Note" && (
          <Card className="flex-1 flex items-center justify-center shadow">
            <CardContent className="text-center">
              <CardTitle className="text-xl text-muted-foreground">
                MLC/Non-MLC Note View
              </CardTitle>
              <p className="text-sm text-muted-foreground">Content for this section is not yet implemented.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default EmergencyCarePage;