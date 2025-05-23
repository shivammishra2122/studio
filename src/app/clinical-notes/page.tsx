'use client';

import type { NextPage } from 'next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader as ShadcnTableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogUITitle, DialogClose } from '@/components/ui/dialog';
import { Settings, RefreshCw, CalendarDays, ArrowUpDown, MessageSquare, Edit2, FileSignature, X, ImageUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const clinicalNotesSubNavItems = [
  "Notes View", "New Notes", "Scanned Notes",
  "Clinical Report", "Clinical Reminder",
  "Clinical Reminder Analysis", "Clinical Template"
];

type NoteEntryDataType = {
  id: string;
  notesTitle: string; 
  dateOfEntry: string;
  status: "COMPLETED" | "UNSIGNED" | "DRAFT" | "PENDING";
  author: string;
  location: string;
  cosigner?: string;
};

const mockNoteEntries: NoteEntryDataType[] = [
  {
    id: '1',
    notesTitle: 'Physiotherapy Progress Note - Patient making good progress with range of motion exercises. Strength improving. Continue current plan.',
    dateOfEntry: '21 MAY, 2025 12:19',
    status: 'UNSIGNED',
    author: 'Sansys Dr.', // Shortened
    location: 'ICU 1', // Shortened
    cosigner: '', 
  },
  {
    id: '2',
    notesTitle: 'Psychologist Activity Sheet - Patient reports feeling less anxious this week. Coping mechanisms discussed and practiced.',
    dateOfEntry: '21 MAY, 2025 12:18',
    status: 'UNSIGNED',
    author: 'Sansys Dr.', // Shortened
    location: 'ICU 1', // Shortened
    cosigner: '', 
  },
  {
    id: '3',
    notesTitle: 'Initial Assessment - Orthopedics and subsequent follow-up notes regarding patient recovery progress. Patient reported moderate pain relief after medication adjustment. Discussed further physical therapy options. Scheduled follow-up in 2 weeks. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    dateOfEntry: '15 MAY, 2025 20:05',
    status: 'COMPLETED',
    author: 'Dr. J. Doe', // Shortened
    location: 'Gen Ward', // Shortened
    cosigner: 'Dr. S. Ray' // Shortened
  },
  {
    id: '4',
    notesTitle: 'Routine Checkup - General Medicine. Patient reports feeling well overall. Discussed annual vaccinations and preventative care. No acute complaints.',
    dateOfEntry: '18 MAY, 2025 09:00',
    status: 'COMPLETED',
    author: 'Dr. Lisa Ray',
    location: 'Clinic A',
    cosigner: 'Dr. John Davis'
  },
  {
    id: '5',
    notesTitle: 'Pre-operative Assessment - Surgery. Patient cleared for upcoming procedure. Anesthesia plan reviewed. Consent forms signed.',
    dateOfEntry: '19 MAY, 2025 11:45',
    status: 'COMPLETED',
    author: 'Dr. M. Chen',
    location: 'Surg Pre-Op',
    cosigner: 'Dr. S. Bell'
  },
  {
    id: '6',
    notesTitle: 'Discharge Summary - Pediatrics. Patient discharged in stable condition. Follow-up appointment scheduled. Instructions provided.',
    dateOfEntry: '20 MAY, 2025 16:30',
    status: 'PENDING',
    author: 'Dr. K. Young',
    location: 'Peds Ward',
    cosigner: 'Dr. M. Garcia'
  },
  {
    id: '7',
    notesTitle: 'Mental Health Consultation - Psychiatry. Patient reports improvement in mood and anxiety levels. Medication adherence discussed.',
    dateOfEntry: '21 MAY, 2025 13:00',
    status: 'DRAFT',
    author: 'Dr. O. Green',
    location: 'Behavioral H.',
    cosigner: undefined
  },
  {
    id: '8',
    notesTitle: 'Physical Therapy Session - Rehabilitation. Patient completed all prescribed exercises. Range of motion improved.',
    dateOfEntry: '22 MAY, 2025 15:00',
    status: 'COMPLETED',
    author: 'Laura White, PT',
    location: 'Rehab Center',
    cosigner: 'Dr. R. Brown'
  }
];


const ClinicalNotesPage: NextPage = () => { 
  const [activeSubNav, setActiveSubNav] = useState<string>(clinicalNotesSubNavItems[0]);

  // State for filters
  const [groupBy, setGroupBy] = useState<string>("visitDate");
  const [selectedDate, setSelectedDate] = useState<string>("15 MAY, 2025 19:45"); 
  const [statusFilter, setStatusFilter] = useState<string>("ALL"); 
  const [fromDate, setFromDate] = useState<string>("");
  const [toDateValue, setToDateValue] = useState<string>(""); 
  const [searchText, setSearchText] = useState<string>("");

  // State for Note Detail Dialog
  const [isNoteDetailDialogOpen, setIsNoteDetailDialogOpen] = useState(false);
  const [selectedNoteContent, setSelectedNoteContent] = useState<string>("");

  const filteredNotes = mockNoteEntries;

  const handleNoteClick = (noteContent: string) => {
    setSelectedNoteContent(noteContent);
    setIsNoteDetailDialogOpen(true);
  };

  const truncateText = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--top-nav-height,60px))] bg-background text-sm p-3">
      {/* Horizontal Navigation Bar */}
      <div className="flex items-end space-x-1 px-1 pb-0 mb-3 overflow-x-auto no-scrollbar border-b-2 border-border bg-card">
        {clinicalNotesSubNavItems.map((item) => (
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
        {activeSubNav === "Notes View" && (
           <Card className="flex-1 flex flex-col shadow overflow-hidden">
            {/* CardHeader removed */}
            <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
              {/* Filter Bar - Single Line */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs mb-2">
                  <Label htmlFor="groupBy" className="shrink-0">Group By</Label>
                  <Select value={groupBy} onValueChange={setGroupBy}>
                    <SelectTrigger id="groupBy" className="h-7 w-28 text-xs">
                      <SelectValue placeholder="Visit Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visitDate">Visit Date</SelectItem>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="author">Author</SelectItem>
                    </SelectContent>
                  </Select>

                  <Label htmlFor="selectedDate" className="shrink-0">Select</Label>
                  <div className="relative">
                      <Input id="selectedDate" type="text" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="h-7 w-32 text-xs pr-7" />
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
                      <SelectItem value="UNSIGNED">UNSIGNED</SelectItem>
                    </SelectContent>
                  </Select>

                  <Label htmlFor="fromDate" className="shrink-0">From Date</Label>
                   <div className="relative">
                      <Input id="fromDate" type="text" value={fromDate} onChange={e => setFromDate(e.target.value)} className="h-7 w-24 text-xs pr-7" />
                      <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
              
                  <Label htmlFor="toDate" className="shrink-0">To</Label>
                  <div className="relative">
                      <Input id="toDate" type="text" value={toDateValue} onChange={e => setToDateValue(e.target.value)} className="h-7 w-24 text-xs pr-7" />
                      <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  
                  <Label htmlFor="notesSearch" className="shrink-0">Search:</Label>
                  <Input id="notesSearch" type="text" value={searchText} onChange={e => setSearchText(e.target.value)} className="h-7 w-28 text-xs" />
              </div>

              <div className="flex-1 overflow-auto min-h-0"> 
                <Table className="text-xs min-w-[80rem]"> 
                  <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
                    <TableRow>
                      {[
                        { name: "Notes Title", className: "min-w-[8rem]" },
                        { name: "Date of Entry", className: "whitespace-nowrap" }, 
                        { name: "Status", className: "whitespace-nowrap" }, 
                        { name: "Sign" }, 
                        { name: "Edit" },
                        { name: "Action" }, 
                        { name: "Author", className: "" },
                        { name: "Location", className: "" },
                        { name: "Cosigner", className: "" },
                        { name: "Image Upload" }
                      ].map(header => (
                        <TableHead key={header.name} className={`py-2 px-3 text-foreground font-semibold h-8 ${header.className || 'whitespace-nowrap'}`}>
                          <div className="flex items-center justify-between">
                            {header.name}
                            <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </ShadcnTableHeader>
                  <TableBody>
                    {filteredNotes.length > 0 ? filteredNotes.map((note, index) => (
                      <TableRow key={note.id} onClick={() => handleNoteClick(note.notesTitle)} className={`cursor-pointer hover:bg-muted/50 ${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                        <TableCell className="py-1.5 px-3 min-w-[8rem]">{truncateText(note.notesTitle, 40)}</TableCell>
                        <TableCell className="py-1.5 px-3">{note.dateOfEntry}</TableCell> 
                        <TableCell className="py-1.5 px-3 whitespace-nowrap">{note.status}</TableCell>
                        <TableCell className="py-1.5 px-3 text-center">
                          <Button variant="ghost" size="icon" className="h-6 w-6"><FileSignature className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                        <TableCell className="py-1.5 px-3 text-center">
                          <Button variant="ghost" size="icon" className="h-6 w-6"><Edit2 className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                        <TableCell className="py-1.5 px-3 text-center">
                          <Button variant="ghost" size="icon" className="h-6 w-6"><MessageSquare className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                        <TableCell className="py-1.5 px-3">{note.author}</TableCell>
                        <TableCell className="py-1.5 px-3">{note.location}</TableCell>
                        <TableCell className="py-1.5 px-3">{note.cosigner || '-'}</TableCell>
                        <TableCell className="py-1.5 px-3 text-center">
                          <Button variant="ghost" size="icon" className="h-6 w-6"><ImageUp className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                          No notes found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-start p-2.5 border-t text-xs text-muted-foreground mt-auto">
                <div>Showing {filteredNotes.length > 0 ? 1 : 0} to {filteredNotes.length} of {filteredNotes.length} entries</div>
              </div>
            </CardContent>
          </Card>
        )}
         {activeSubNav !== "Notes View" && (
          <Card className="flex-1 flex items-center justify-center">
            <CardContent className="text-center">
              <DialogUITitle className="text-xl text-muted-foreground">
                {activeSubNav} View
              </DialogUITitle>
              <p className="text-sm text-muted-foreground">Content for this section is not yet implemented.</p>
            </CardContent>
          </Card>
        )}
      </main>

      <Dialog open={isNoteDetailDialogOpen} onOpenChange={setIsNoteDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogUITitle>Note Detail</DialogUITitle> 
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1 rounded-md">
            <div className="text-sm whitespace-pre-wrap p-3 border rounded-md bg-muted/30">
                {selectedNoteContent}
            </div>
          </ScrollArea>
          <div className="flex justify-end pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicalNotesPage;
