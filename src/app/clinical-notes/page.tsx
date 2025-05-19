
'use client';

import type { NextPage } from 'next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, RefreshCw, CalendarDays, ArrowUpDown, MessageSquare, Edit2, Trash2, CheckCircle2, ImageUp } from 'lucide-react';

const clinicalNotesSubNavItems = [
  "Notes View", "New Notes", "Scanned Notes", 
  "Clinical Report", "Clinical Reminder", 
  "Clinical Reminder Analysis", "Clinical Template"
];

type NoteEntryDataType = {
  id: string;
  notesTitle: string;
  dateOfEntry: string;
  status: "COMPLETED" | "PENDING" | "DRAFT";
  signed: boolean;
  author: string;
  location: string;
  cosigner?: string;
};

const mockNoteEntries: NoteEntryDataType[] = [
  { 
    id: '1', 
    notesTitle: 'Initial Assessment - Orthopedics', 
    dateOfEntry: '15 MAY, 2025 20:05', 
    status: 'COMPLETED', 
    signed: true,
    author: 'Sansys Doctor', 
    location: 'ICU ONE',
    cosigner: 'Dr. Jane Doe' 
  },
  { 
    id: '2', 
    notesTitle: 'Follow-up Visit - Cardiology', 
    dateOfEntry: '16 MAY, 2025 10:30', 
    status: 'PENDING', 
    signed: false,
    author: 'Dr. Smith', 
    location: 'Cardiology Wing',
  },
];


const ClinicalNotesPage: NextPage = () => {
  const [activeSubNav, setActiveSubNav] = useState<string>(clinicalNotesSubNavItems[0]);
  
  // State for filters
  const [groupBy, setGroupBy] = useState<string>("visitDate");
  const [selectedDate, setSelectedDate] = useState<string>("15 MAY, 2025 19:45");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  // Placeholder for filtered notes
  const filteredNotes = mockNoteEntries;

  return (
    <div className="flex h-[calc(100vh-var(--top-nav-height,60px))] bg-background text-sm">
      {/* Left Sub-Navigation Panel */}
      <aside className="w-48 bg-card border-r p-2 flex flex-col space-y-1">
        {clinicalNotesSubNavItems.map((item) => (
          <Button
            key={item}
            variant={activeSubNav === item ? "secondary" : "ghost"}
            className={`w-full justify-start text-left h-9 px-2.5 text-xs ${activeSubNav === item ? 'bg-blue-700 text-white border-l-4 border-sky-400 hover:bg-blue-700 hover:text-white' : 'hover:bg-muted/50 hover:text-foreground'}`}
            onClick={() => setActiveSubNav(item)}
          >
            {item}
          </Button>
        ))}
      </aside>

      {/* Right Content Panel */}
      <main className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
        {/* For now, only "Notes View" content is implemented */}
        {activeSubNav === "Notes View" && (
           <Card className="flex-1 flex flex-col shadow">
            <CardHeader className="p-2.5 border-b bg-accent text-foreground rounded-t-md">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Note View</CardTitle>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground hover:bg-muted/50">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground hover:bg-muted/50">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
              {/* Filter Bar */}
              <div className="flex items-center space-x-2 text-xs mb-2">
                <Label htmlFor="groupBy" className="shrink-0">Group By</Label>
                <Select value={groupBy} onValueChange={setGroupBy}>
                  <SelectTrigger id="groupBy" className="h-7 w-32 text-xs">
                    <SelectValue placeholder="Visit Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visitDate">Visit Date</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                  </SelectContent>
                </Select>

                <Label htmlFor="selectedDate" className="shrink-0 hidden sm:inline">Select</Label> {/* Hide on small screens if too cramped */}
                <div className="relative">
                    <Input id="selectedDate" type="text" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="h-7 w-36 text-xs pr-7" />
                    <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>

                <Label htmlFor="statusFilter" className="shrink-0">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="statusFilter" className="h-7 w-24 text-xs">
                    <SelectValue placeholder="ALL" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">ALL</SelectItem>
                    <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="DRAFT">DRAFT</SelectItem>
                  </SelectContent>
                </Select>
                
                <Label htmlFor="fromDate" className="shrink-0 hidden md:inline">From Date</Label>
                 <div className="relative hidden md:block">
                    <Input id="fromDate" type="text" value={fromDate} onChange={e => setFromDate(e.target.value)} className="h-7 w-28 text-xs pr-7" />
                    <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>

                <Label htmlFor="toDate" className="shrink-0 hidden md:inline">To</Label>
                <div className="relative hidden md:block">
                    <Input id="toDate" type="text" value={toDate} onChange={e => setToDate(e.target.value)} className="h-7 w-28 text-xs pr-7" />
                    <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
                <div className="flex-grow"></div> {/* Pushes search to the right */}
                <Label htmlFor="notesSearch" className="shrink-0">Search:</Label>
                <Input id="notesSearch" type="text" value={searchText} onChange={e => setSearchText(e.target.value)} className="h-7 w-32 text-xs" />
              </div>

              {/* Table */}
              <ScrollArea className="flex-1">
                <Table className="text-xs">
                  <TableHeader className="bg-accent sticky top-0 z-10">
                    <TableRow>
                      {[
                        "Notes Title", "Date of Entry", "Status", "Sign", "Edit", 
                        "Delete", "Action", "Author", "Location", "Cosigner", "Image Upload"
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
                    {filteredNotes.length > 0 ? filteredNotes.map(note => (
                      <TableRow key={note.id}>
                        <TableCell className="py-1.5 px-3 whitespace-nowrap">{note.notesTitle}</TableCell>
                        <TableCell className="py-1.5 px-3 whitespace-nowrap">{note.dateOfEntry}</TableCell>
                        <TableCell className="py-1.5 px-3 whitespace-nowrap">{note.status}</TableCell>
                        <TableCell className="py-1.5 px-3 text-center">
                          {note.signed && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                        </TableCell>
                        <TableCell className="py-1.5 px-3 text-center">
                          <Button variant="ghost" size="icon" className="h-6 w-6"><Edit2 className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                        <TableCell className="py-1.5 px-3 text-center">
                          <Button variant="ghost" size="icon" className="h-6 w-6"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                        <TableCell className="py-1.5 px-3 text-center">
                          <Button variant="ghost" size="icon" className="h-6 w-6"><MessageSquare className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                        <TableCell className="py-1.5 px-3 whitespace-nowrap">{note.author}</TableCell>
                        <TableCell className="py-1.5 px-3 whitespace-nowrap">{note.location}</TableCell>
                        <TableCell className="py-1.5 px-3 whitespace-nowrap">{note.cosigner || '-'}</TableCell>
                        <TableCell className="py-1.5 px-3 text-center">
                          <Button variant="ghost" size="icon" className="h-6 w-6"><ImageUp className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-10 text-muted-foreground">
                          No notes found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>

              {/* Footer */}
              <div className="flex items-center justify-start p-2.5 border-t text-xs text-muted-foreground mt-auto">
                <div>Showing {filteredNotes.length > 0 ? 1 : 0} to {filteredNotes.length} of {filteredNotes.length} entries</div>
                {/* Pagination can be added here if needed */}
              </div>
            </CardContent>
          </Card>
        )}
         {/* Placeholder for other Clinical Notes sub-views */}
         {activeSubNav !== "Notes View" && (
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

export default ClinicalNotesPage;

    