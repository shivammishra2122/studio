
'use client';

import type { NextPage } from 'next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader as ShadcnTableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogUITitle, DialogFooter, DialogClose } from '@/components/ui/dialog'; // Corrected DialogTitle import alias
import { Settings, RefreshCw, CalendarDays, ArrowUpDown, MessageSquare, Edit2, CheckCircle2, ImageUp, X, FileSignature } from 'lucide-react';
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
    notesTitle: 'Physiotherapy Progress Note - Patient making good progress with range of motion exercises. Strength improving. Continue current plan. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    dateOfEntry: '21 MAY, 2025 12:19',
    status: 'UNSIGNED',
    author: 'Sansys Dr.',
    location: 'ICU 1',
    cosigner: '', 
  },
  {
    id: '2',
    notesTitle: 'Psychologist Activity Sheet - Patient reports feeling less anxious this week. Coping mechanisms discussed and practiced. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    dateOfEntry: '21 MAY, 2025 12:18',
    status: 'UNSIGNED',
    author: 'Sansys Dr.',
    location: 'ICU 1',
    cosigner: '', 
  },
  {
    id: '3',
    notesTitle: 'Initial Assessment - Orthopedics and subsequent follow-up notes regarding patient recovery progress. Patient reported moderate pain relief after medication adjustment. Discussed further physical therapy options. Scheduled follow-up in 2 weeks. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    dateOfEntry: '15 MAY, 2025 20:05',
    status: 'COMPLETED',
    author: 'Dr. J. Doe', 
    location: 'Gen Ward', 
    cosigner: 'Dr. S. Ray'
  },
  {
    id: '4',
    notesTitle: 'Routine Checkup - General Medicine. Patient reports feeling well overall. Discussed annual vaccinations and preventative care. No acute complaints. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    dateOfEntry: '18 MAY, 2025 09:00',
    status: 'COMPLETED',
    author: 'Dr. Lisa Ray',
    location: 'Clinic A',
    cosigner: 'Dr. John Davis'
  },
  {
    id: '5',
    notesTitle: 'Pre-operative Assessment - Surgery. Patient cleared for upcoming procedure. Anesthesia plan reviewed. Consent forms signed. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
    dateOfEntry: '19 MAY, 2025 11:45',
    status: 'COMPLETED',
    author: 'Dr. M. Chen',
    location: 'Surg Pre-Op',
    cosigner: 'Dr. S. Bell'
  },
  {
    id: '6',
    notesTitle: 'Discharge Summary - Pediatrics. Patient discharged in stable condition. Follow-up appointment scheduled. Instructions provided. Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
    dateOfEntry: '20 MAY, 2025 16:30',
    status: 'PENDING',
    author: 'Dr. K. Young',
    location: 'Peds Ward',
    cosigner: 'Dr. M. Garcia'
  },
  {
    id: '7',
    notesTitle: 'Mental Health Consultation - Psychiatry. Patient reports improvement in mood and anxiety levels. Medication adherence discussed. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
    dateOfEntry: '21 MAY, 2025 13:00',
    status: 'DRAFT',
    author: 'Dr. O. Green',
    location: 'Behavioral H.',
    cosigner: undefined // Or an empty string if preferred
  },
  {
    id: '8',
    notesTitle: 'Physical Therapy Session - Rehabilitation. Patient completed all prescribed exercises. Range of motion improved. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.',
    dateOfEntry: '22 MAY, 2025 15:00',
    status: 'COMPLETED',
    author: 'Laura White, PT',
    location: 'Rehab Center',
    cosigner: 'Dr. R. Brown'
  }
];


const ClinicalNotesPage = () => { 
  const [activeSubNav, setActiveSubNav] = useState<string>(clinicalNotesSubNavItems[0]);
  const [viewMode, setViewMode] = useState<'table' | 'detail'>('table');

  // State for filters
  const [groupBy, setGroupBy] = useState<string>("visitDate");
  const [selectedDate, setSelectedDate] = useState<string>("15 MAY, 2025 19:45"); 
  const [statusFilter, setStatusFilter] = useState<string>("ALL"); 
  const [fromDate, setFromDate] = useState<string>("");
  const [toDateValue, setToDateValue] = useState<string>(""); 
  const [searchText, setSearchText] = useState<string>("");

  // State for Note Detail 
  const [selectedNoteContent, setSelectedNoteContent] = useState<string>("");
  const [isNoteDetailDialogOpen, setIsNoteDetailDialogOpen] = useState(false); // Re-added this line

  const filteredNotes = mockNoteEntries;

  const handleNoteClick = (fullNoteContent: string) => {
    setSelectedNoteContent(fullNoteContent);
    setViewMode('detail');
  };

  const truncateText = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--top-nav-height,40px))] bg-background text-sm p-3">
      {/* Horizontal Navigation Bar */}
      <div className="flex items-end space-x-1 px-1 pb-0 mb-3 overflow-x-auto no-scrollbar border-b-2 border-border bg-card">
        {clinicalNotesSubNavItems.map((item) => (
          <Button
            key={item}
            onClick={() => {
              setActiveSubNav(item);
              setViewMode('table'); 
            }}
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
            <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
              {viewMode === 'table' ? (
                <>
                  {/* Filter Bar - Single Line */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs mb-2">
                      <Label htmlFor="groupBy" className="shrink-0 text-xs">Group By</Label>
                      <Select value={groupBy} onValueChange={setGroupBy}>
                        <SelectTrigger id="groupBy" className="h-6 w-28 text-xs">
                          <SelectValue placeholder="Visit Date" className="text-xs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="visitDate" className="text-xs">Visit Date</SelectItem>
                          <SelectItem value="patient" className="text-xs">Patient</SelectItem>
                          <SelectItem value="author" className="text-xs">Author</SelectItem>
                        </SelectContent>
                      </Select>

                      <Label htmlFor="selectedDate" className="shrink-0 text-xs">Select</Label>
                      <div className="relative">
                          <Input id="selectedDate" type="text" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="h-6 w-32 text-xs pr-7" />
                          <CalendarDays className="h-3 w-3 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>

                      <Label htmlFor="statusFilter" className="shrink-0 text-xs">Status</Label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger id="statusFilter" className="h-6 w-24 text-xs">
                          <SelectValue placeholder="ALL" className="text-xs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL" className="text-xs">ALL</SelectItem>
                          <SelectItem value="COMPLETED" className="text-xs">COMPLETED</SelectItem>
                          <SelectItem value="PENDING" className="text-xs">PENDING</SelectItem>
                          <SelectItem value="DRAFT" className="text-xs">DRAFT</SelectItem>
                          <SelectItem value="UNSIGNED" className="text-xs">UNSIGNED</SelectItem>
                        </SelectContent>
                      </Select>

                      <Label htmlFor="fromDate" className="shrink-0 text-xs">From Date</Label>
                       <div className="relative">
                          <Input id="fromDate" type="text" value={fromDate} onChange={e => setFromDate(e.target.value)} className="h-6 w-24 text-xs pr-7" />
                          <CalendarDays className="h-3 w-3 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>
                  
                      <Label htmlFor="toDate" className="shrink-0 text-xs">To</Label>
                      <div className="relative">
                          <Input id="toDate" type="text" value={toDateValue} onChange={e => setToDateValue(e.target.value)} className="h-6 w-24 text-xs pr-7" />
                          <CalendarDays className="h-3 w-3 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>
                      
                      <Label htmlFor="notesSearch" className="shrink-0 text-xs">Search:</Label>
                      <Input id="notesSearch" type="text" value={searchText} onChange={e => setSearchText(e.target.value)} className="h-6 w-28 text-xs" />
                  </div>

                  <div className="flex-1 overflow-auto min-h-0"> 
                    <Table className="text-xs w-full"> 
                      <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
                        <TableRow>
                          {[
                            { name: "Notes Title", className: "min-w-[8rem]" }, 
                            { name: "Date of Entry", className: "" }, 
                            { name: "Status", className: "" }, 
                            { name: "Sign" }, 
                            { name: "Edit" },
                            { name: "Action" }, 
                            { name: "Author", className: "" },
                            { name: "Location", className: "" },
                            { name: "Cosigner", className: "" },
                            { name: "Image Upload" }
                          ].map(header => (
                            <TableHead key={header.name} className={`py-2 px-3 text-foreground font-semibold h-auto ${header.className || ''}`}> 
                              <div className="flex items-center justify-between">
                                <span className="break-words text-xs">{header.name}</span> 
                                <ArrowUpDown className="h-3 w-3 ml-1 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer" />
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
                            <TableCell className="py-1.5 px-3">{note.status}</TableCell> 
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
                </>
              ) : ( // viewMode === 'detail'
                <>
                  <div className="flex items-center justify-between p-2.5 border-b">
                    <Button variant="outline" size="sm" onClick={() => setViewMode('table')} className="text-xs h-7">
                      <X className="h-3.5 w-3.5 mr-1.5" /> Back to List
                    </Button>
                    <h3 className="text-base font-semibold text-foreground">Note Detail</h3>
                  </div>
                  <ScrollArea className="flex-1 p-2.5 min-h-0">
                    <div className="text-sm whitespace-pre-wrap p-3 border rounded-md bg-muted/30">
                        {selectedNoteContent}
                    </div>
                  </ScrollArea>
                </>
              )}
            </CardContent>
          </Card>
        )}
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


