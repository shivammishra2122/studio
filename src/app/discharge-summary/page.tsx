
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
import { Edit3, RefreshCw, ArrowUpDown, MessageSquare, FileSignature, Trash2, CheckCircle2 } from 'lucide-react';

type SummaryEntryDataType = {
  id: string;
  summaryTitle: string;
  dateOfEntry: string;
  status: "UNSIGNED" | "COMPLETED";
  signedBy?: string; 
  author: string;
  location: string;
  cosigner?: string;
};

const mockSummaryEntries: SummaryEntryDataType[] = [
  { 
    id: '1', 
    summaryTitle: 'Discharge Summary Orthopedics - Patient showed significant improvement post-surgery and physical therapy. Range of motion increased and pain levels reduced. Follow-up scheduled in 4 weeks. Prescribed home exercises and ongoing medication.', 
    dateOfEntry: '17 MAY, 2025 12:00', 
    status: 'UNSIGNED', 
    author: 'Internalmed Doc Primary Care', 
    location: 'ICU ONE - General Ward, Bed A101',
    cosigner: 'Sansys Doctor Supervising MD' 
  },
  { 
    id: '2', 
    summaryTitle: 'DISCHARGE SUMMARY NEUROSURGERY - Patient stable post-op for craniotomy. No neurological deficits noted. Wound healing well. Advised on activity restrictions and follow-up for suture removal and MRI.', 
    dateOfEntry: '12 JUL, 2023 16:09', 
    status: 'COMPLETED', 
    author: 'Sansys Doctor Neuro Team', 
    location: 'ICU ONE - Neuro ICU, Bed N203',
    cosigner: 'Sansys Doctor Head of Neurosurgery'
  },
  { 
    id: '3', 
    summaryTitle: 'Cardiology Discharge Summary - Acute MI managed with PCI. Patient asymptomatic at discharge. Echocardiogram showed improved EF. Medications: Aspirin, Clopidogrel, Atorvastatin, Metoprolol. Cardiac rehab referral made.', 
    dateOfEntry: '05 AUG, 2024 11:30', 
    status: 'COMPLETED', 
    author: 'Dr. Cardio Heart Specialist', 
    location: 'CCU - Coronary Care Unit, Bed C5',
    cosigner: 'Dr. SeniorCardio Chief Cardiologist'
  },
];

const DischargeSummaryPage: NextPage = () => {
  const [showEntries, setShowEntries] = useState<string>("10");
  const [visitDate, setVisitDate] = useState<string>("15 MAY, 2025 19:45");
  const [searchText, setSearchText] = useState<string>("");

  const filteredSummaries = mockSummaryEntries;

  return (
    <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden h-[calc(100vh-var(--top-nav-height,60px))]">
      <Card className="flex-1 flex flex-col shadow overflow-hidden">
        <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Discharge Summaries Details</CardTitle>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center space-x-2 text-xs mb-2 gap-y-2">
            <Label htmlFor="showEntries" className="shrink-0">Show</Label>
            <Select value={showEntries} onValueChange={setShowEntries}>
              <SelectTrigger id="showEntries" className="h-7 w-20 text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <Label className="shrink-0">entries</Label>

            <div className="flex-grow"></div> 

            <Label htmlFor="visitDate" className="shrink-0">Visit Date</Label>
            <Select value={visitDate} onValueChange={setVisitDate}>
              <SelectTrigger id="visitDate" className="h-7 w-40 text-xs">
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15 MAY, 2025 19:45">15 MAY, 2025 19:45</SelectItem>
                <SelectItem value="12 JUL, 2023 16:09">12 JUL, 2023 16:09</SelectItem>
                <SelectItem value="05 AUG, 2024 11:30">05 AUG, 2024 11:30</SelectItem>
              </SelectContent>
            </Select>
            
            <Label htmlFor="summarySearch" className="shrink-0">Search:</Label>
            <Input id="summarySearch" type="text" value={searchText} onChange={e => setSearchText(e.target.value)} className="h-7 w-32 text-xs" />
          </div>

          {/* Table Section */}
          <div className="flex-1 overflow-hidden min-h-0">
            <Table className="text-xs min-w-[75rem] flex-1 min-h-0">
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  {[
                    { name: "Discharge Summaries Title", className: "min-w-[20rem]" },
                    { name: "Date of Entry" }, 
                    { name: "Status" }, 
                    { name: "Sign" }, 
                    { name: "Edit" }, 
                    { name: "Delete" }, 
                    { name: "Action" }, 
                    { name: "Author" }, 
                    { name: "Location" }, 
                    { name: "Cosigner" }
                  ].map(header => (
                    <TableHead key={header.name} className={`py-2 px-3 text-foreground font-semibold h-8 whitespace-nowrap ${header.className || ''}`}>
                      <div className="flex items-center justify-between">
                        {header.name}
                        <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSummaries.length > 0 ? filteredSummaries.map((summary, index) => (
                  <TableRow key={summary.id} className={`hover:bg-muted/30 ${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                    <TableCell className={`py-1.5 px-3 ${summary.summaryTitle.length > 50 ? '' : 'whitespace-nowrap'}`}>{summary.summaryTitle}</TableCell>
                    <TableCell className="py-1.5 px-3 whitespace-nowrap">{summary.dateOfEntry}</TableCell>
                    <TableCell className="py-1.5 px-3 whitespace-nowrap">{summary.status}</TableCell>
                    <TableCell className="py-1.5 px-3 text-center">
                      {summary.status === "COMPLETED" ? 
                        <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" /> :
                        <Button variant="ghost" size="icon" className="h-6 w-6"><FileSignature className="h-3.5 w-3.5" /></Button>
                      }
                    </TableCell>
                    <TableCell className="py-1.5 px-3 text-center">
                      <Button variant="ghost" size="icon" className="h-6 w-6"><Edit3 className="h-3.5 w-3.5" /></Button>
                    </TableCell>
                    <TableCell className="py-1.5 px-3 text-center">
                      <Button variant="ghost" size="icon" className="h-6 w-6"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </TableCell>
                    <TableCell className="py-1.5 px-3 text-center">
                      <Button variant="ghost" size="icon" className="h-6 w-6"><MessageSquare className="h-3.5 w-3.5" /></Button>
                    </TableCell>
                    <TableCell className="py-1.5 px-3 whitespace-nowrap">{summary.author}</TableCell>
                    <TableCell className="py-1.5 px-3 whitespace-nowrap">{summary.location}</TableCell>
                    <TableCell className="py-1.5 px-3 whitespace-nowrap">{summary.cosigner || '-'}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                      No discharge summaries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
            <div>Showing {filteredSummaries.length > 0 ? 1 : 0} to {filteredSummaries.length} of {filteredSummaries.length} entries</div>
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Previous</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1 bg-accent text-foreground border-border">1</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  