'use client';

import type { NextPage } from 'next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader as ShadcnTableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogUITitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
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
    cosigner: undefined
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
  const [groupBy, setGroupBy] = useState<string>("visitDate");
  const [selectedDate, setSelectedDate] = useState<string>("15 MAY, 2025 19:45"); 
  const [statusFilter, setStatusFilter] = useState<string>("ALL"); 
  const [fromDate, setFromDate] = useState<string>("");
  const [toDateValue, setToDateValue] = useState<string>(""); 
  const [searchText, setSearchText] = useState<string>("");
  const [selectedNoteContent, setSelectedNoteContent] = useState<string>(mockNoteEntries[0].notesTitle);
  const [isNoteDetailDialogOpen, setIsNoteDetailDialogOpen] = useState(false);

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

      <main className="flex-1 flex flex-col gap-3 overflow-hidden">
        {activeSubNav === "Notes View" && (
           <Card className="flex-1 flex flex-col shadow overflow-hidden">
            <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
              {viewMode === 'table' ? (
                <>
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

                  <div className="flex items-center justify-start p-2.5 border-t text-xs text-muted-foreground mt-auto">
                    <div>Showing {filteredNotes.length > 0 ? 1 : 0} to {filteredNotes.length} of {filteredNotes.length} entries</div>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 h-full">
                  {/* Left Side: List of Note Titles */}
                  <div className="w-1/3 border-r flex flex-col">
                    <div className="flex items-center justify-between p-2.5 border-b">
                      <h3 className="text-base font-semibold text-foreground">Notes</h3>
                      <Button variant="outline" size="sm" onClick={() => setViewMode('table')} className="text-xs h-7">
                        <X className="h-3.5 w-3.5 mr-1.5" /> Back to Table
                      </Button>
                    </div>
                    <ScrollArea className="flex-1">
                      {filteredNotes.map((note, index) => (
                        <div
                          key={note.id}
                          onClick={() => setSelectedNoteContent(note.notesTitle)}
                          className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${
                            selectedNoteContent === note.notesTitle ? 'bg-muted' : ''
                          }`}
                        >
                          <p className="text-sm font-medium">{truncateText(note.notesTitle, 40)}</p>
                          <p className="text-xs text-muted-foreground">{note.dateOfEntry}</p>
                        </div>
                      ))}
                    </ScrollArea>
                  </div>
                  {/* Right Side: Selected Note Description */}
                  <div className="w-2/3 flex flex-col">
                    <div className="p-2.5 border-b">
                      <h3 className="text-base font-semibold text-foreground">Note Detail</h3>
                    </div>
                    <ScrollArea className="flex-1 p-2.5">
                      <div className="text-sm whitespace-pre-wrap p-3 border rounded-md bg-muted/30">
                        {selectedNoteContent}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {activeSubNav === "New Notes" && <NewNotesView />}
        {activeSubNav === "Scanned Notes" && <ScannedNotesView />}
        {activeSubNav === "Clinical Report" && <ClinicalReportView />}
        {activeSubNav === "Clinical Reminder" && <ClinicalReminderView />}
        {activeSubNav === "Clinical Reminder Analysis" && <ClinicalReminderAnalysisView />}
        {activeSubNav === "Clinical Template" && <ClinicalTemplateView />}
        
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

type NewNoteTemplateType = {
  id: string;
  templateName: string;
  department: string;
  lastUpdated: string;
};

// Mock New Notes Template Data
const mockNewNoteTemplates: NewNoteTemplateType[] = [
  { 
    id: '1', 
    templateName: 'Progress Note - General Medicine', 
    department: 'General Medicine', 
    lastUpdated: '20 MAY, 2025 14:00' 
  },
  { 
    id: '2', 
    templateName: 'Post-Operative Note - Surgery', 
    department: 'Surgery', 
    lastUpdated: '21 MAY, 2025 09:30' 
  },
  { 
    id: '3', 
    templateName: 'Psychiatric Assessment', 
    department: 'Psychiatry', 
    lastUpdated: '22 MAY, 2025 11:15' 
  },
  { 
    id: '4', 
    templateName: 'Physical Therapy Session Note', 
    department: 'Rehabilitation', 
    lastUpdated: '23 MAY, 2025 13:45' 
  },
  { 
    id: '5', 
    templateName: 'Pediatric Discharge Summary', 
    department: 'Pediatrics', 
    lastUpdated: '24 MAY, 2025 08:00' 
  },
];

const NewNotesView = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteContent, setNoteContent] = useState<string>("");
  const [status, setStatus] = useState<"DRAFT" | "PENDING">("DRAFT");

  const handleSave = (status: "DRAFT" | "PENDING") => {
    setStatus(status);
    // Placeholder for save logic
    console.log("Saving note:", { title: noteTitle, content: noteContent, status });
  };

  return (
    <Card className="flex-1 flex flex-col shadow overflow-hidden">
      <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b pb-2 mb-2">
          <h3 className="text-base font-semibold text-foreground">New Clinical Note</h3>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3 text-xs flex-1 flex flex-col">
          <div className="flex items-center gap-x-3">
            <Label htmlFor="noteTemplate" className="shrink-0">Select Template</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger id="noteTemplate" className="h-7 w-48 text-xs">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {mockNewNoteTemplates.map(template => (
                  <SelectItem key={template.id} value={template.templateName} className="text-xs">
                    {template.templateName} ({template.department})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-x-3">
            <Label htmlFor="noteTitle" className="shrink-0">Note Title</Label>
            <Input
              id="noteTitle"
              type="text"
              value={noteTitle}
              onChange={e => setNoteTitle(e.target.value)}
              className="h-7 w-full text-xs"
              placeholder="Enter note title"
            />
          </div>

          <div className="flex flex-col flex-1">
            <Label htmlFor="noteContent" className="mb-1">Note Content</Label>
            <ScrollArea className="flex-1 border rounded-md">
              <textarea
                id="noteContent"
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                className="w-full h-full p-2 text-xs resize-none border-none focus:outline-none"
                placeholder="Enter clinical note details..."
              />
            </ScrollArea>
          </div>

          <div className="flex justify-end space-x-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave("DRAFT")}
              className="h-7 text-xs"
            >
              Save as Draft
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleSave("PENDING")}
              className="h-7 text-xs"
            >
              Submit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type ScannedNoteDataType = {
  id: string;
  documentName: string;
  scanDate: string;
  scanTime: string;
  uploadedBy: string;
  status: "VERIFIED" | "PENDING";
  location: string;
};

// Mock Scanned Notes Data
const mockScannedNotes: ScannedNoteDataType[] = [
  { 
    id: '1', 
    documentName: 'Handwritten Progress Note - ICU', 
    scanDate: '20 MAY, 2025', 
    scanTime: '10:30', 
    uploadedBy: 'Nurse Patel', 
    status: 'VERIFIED', 
    location: 'ICU 1' 
  },
  { 
    id: '2', 
    documentName: 'Surgical Consent Form', 
    scanDate: '21 MAY, 2025', 
    scanTime: '14:00', 
    uploadedBy: 'Nurse Sharma', 
    status: 'PENDING', 
    location: 'Surg Pre-Op' 
  },
  { 
    id: '3', 
    documentName: 'Discharge Summary Scan', 
    scanDate: '22 MAY, 2025', 
    scanTime: '09:15', 
    uploadedBy: 'Dr. Gupta', 
    status: 'VERIFIED', 
    location: 'Gen Ward' 
  },
  { 
    id: '4', 
    documentName: 'Lab Results - Handwritten', 
    scanDate: '23 MAY, 2025', 
    scanTime: '11:45', 
    uploadedBy: 'Nurse Singh', 
    status: 'PENDING', 
    location: 'Clinic A' 
  },
  { 
    id: '5', 
    documentName: 'Patient Consent Form', 
    scanDate: '24 MAY, 2025', 
    scanTime: '08:00', 
    uploadedBy: 'Dr. Verma', 
    status: 'VERIFIED', 
    location: 'Peds Ward' 
  },
];

const ScannedNotesView = () => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  const filteredScannedNotes = mockScannedNotes;

  const scannedNotesTableHeaders = [
    "Document Name",
    "Scan Date:Time",
    "Uploaded By",
    "Status",
    "Action",
    "Location",
  ];

  return (
    <Card className="flex-1 flex flex-col shadow overflow-hidden">
      <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs mb-2">
          <Label htmlFor="scannedStatus" className="shrink-0 text-xs">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="scannedStatus" className="h-6 w-24 text-xs">
              <SelectValue placeholder="ALL" className="text-xs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">ALL</SelectItem>
              <SelectItem value="VERIFIED" className="text-xs">VERIFIED</SelectItem>
              <SelectItem value="PENDING" className="text-xs">PENDING</SelectItem>
            </SelectContent>
          </Select>

          <Label htmlFor="scannedFromDate" className="shrink-0 text-xs">From Date</Label>
          <div className="relative">
            <Input
              id="scannedFromDate"
              type="text"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="h-6 w-24 text-xs pr-7"
            />
            <CalendarDays className="h-3 w-3 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>

          <Label htmlFor="scannedToDate" className="shrink-0 text-xs">To</Label>
          <div className="relative">
            <Input
              id="scannedToDate"
              type="text"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="h-6 w-24 text-xs pr-7"
            />
            <CalendarDays className="h-3 w-3 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>

          <Label htmlFor="scannedSearch" className="shrink-0 text-xs">Search:</Label>
          <Input
            id="scannedSearch"
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="h-6 w-28 text-xs"
          />
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <Table className="text-xs w-full">
            <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
              <TableRow>
                {scannedNotesTableHeaders.map(header => (
                  <TableHead key={header} className="py-2 px-3 text-foreground font-semibold h-auto">
                    <div className="flex items-center justify-between">
                      <span className="break-words text-xs">{header}</span>
                      <ArrowUpDown className="h-3 w-3 ml-1 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </ShadcnTableHeader>
            <TableBody>
              {filteredScannedNotes.length > 0 ? filteredScannedNotes.map((note, index) => (
                <TableRow key={note.id} className={`hover:bg-muted/50 ${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                  <TableCell className="py-1.5 px-3">{note.documentName}</TableCell>
                  <TableCell className="py-1.5 px-3">{note.scanDate} {note.scanTime}</TableCell>
                  <TableCell className="py-1.5 px-3">{note.uploadedBy}</TableCell>
                  <TableCell className="py-1.5 px-3">{note.status}</TableCell>
                  <TableCell className="py-1.5 px-3 text-center">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      {note.status === "PENDING" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <FileSignature className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="py-1.5 px-3">{note.location}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No scanned notes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-start p-2.5 border-t text-xs text-muted-foreground mt-auto">
          <div>Showing {filteredScannedNotes.length > 0 ? 1 : 0} to {filteredScannedNotes.length} of {filteredScannedNotes.length} entries</div>
        </div>
      </CardContent>
    </Card>
  );
};

type ClinicalReportDataType = {
  id: string;
  reportTitle: string;
  generatedDate: string;
  generatedTime: string;
  department: string;
  generatedBy: string;
  summary: string;
};

// Mock Clinical Report Data
const mockClinicalReports: ClinicalReportDataType[] = [
  { 
    id: '1', 
    reportTitle: 'Monthly Patient Outcomes - ICU', 
    generatedDate: '20 MAY, 2025', 
    generatedTime: '15:00', 
    department: 'ICU', 
    generatedBy: 'Dr. Sharma', 
    summary: 'Summary of patient outcomes in ICU for May 2025, including recovery rates and complications.' 
  },
  { 
    id: '2', 
    reportTitle: 'Surgical Procedure Report', 
    generatedDate: '21 MAY, 2025', 
    generatedTime: '12:30', 
    department: 'Surgery', 
    generatedBy: 'Dr. Gupta', 
    summary: 'Details of surgical procedures performed, including success rates and post-op complications.' 
  },
  { 
    id: '3', 
    reportTitle: 'Psychiatric Ward Summary', 
    generatedDate: '22 MAY, 2025', 
    generatedTime: '10:00', 
    department: 'Psychiatry', 
    generatedBy: 'Dr. Patel', 
    summary: 'Overview of patient progress, medication adherence, and therapy outcomes in the psychiatric ward.' 
  },
  { 
    id: '4', 
    reportTitle: 'Rehabilitation Progress Report', 
    generatedDate: '23 MAY, 2025', 
    generatedTime: '14:15', 
    department: 'Rehabilitation', 
    generatedBy: 'Laura White, PT', 
    summary: 'Progress of patients in rehabilitation, focusing on physical therapy outcomes.' 
  },
  { 
    id: '5', 
    reportTitle: 'Pediatric Admissions Report', 
    generatedDate: '24 MAY, 2025', 
    generatedTime: '09:00', 
    department: 'Pediatrics', 
    generatedBy: 'Dr. Young', 
    summary: 'Summary of pediatric admissions, including common diagnoses and treatment plans.' 
  },
];

const ClinicalReportView = () => {
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [selectedReportSummary, setSelectedReportSummary] = useState<string>("");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const filteredReports = mockClinicalReports;

  const clinicalReportTableHeaders = [
    "Report Title",
    "Generated Date:Time",
    "Department",
    "Generated By",
    "Action",
  ];

  const handleViewReport = (summary: string) => {
    setSelectedReportSummary(summary);
    setIsReportDialogOpen(true);
  };

  return (
    <>
      <Card className="flex-1 flex flex-col shadow overflow-hidden">
        <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs mb-2">
            <Label htmlFor="reportDepartment" className="shrink-0 text-xs">Department</Label>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger id="reportDepartment" className="h-6 w-24 text-xs">
                <SelectValue placeholder="ALL" className="text-xs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">ALL</SelectItem>
                <SelectItem value="ICU" className="text-xs">ICU</SelectItem>
                <SelectItem value="Surgery" className="text-xs">Surgery</SelectItem>
                <SelectItem value="Psychiatry" className="text-xs">Psychiatry</SelectItem>
                <SelectItem value="Rehabilitation" className="text-xs">Rehabilitation</SelectItem>
                <SelectItem value="Pediatrics" className="text-xs">Pediatrics</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="reportFromDate" className="shrink-0 text-xs">From Date</Label>
            <div className="relative">
              <Input
                id="reportFromDate"
                type="text"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="h-6 w-24 text-xs pr-7"
              />
              <CalendarDays className="h-3 w-3 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>

            <Label htmlFor="reportToDate" className="shrink-0 text-xs">To</Label>
            <div className="relative">
              <Input
                id="reportToDate"
                type="text"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="h-6 w-24 text-xs pr-7"
              />
              <CalendarDays className="h-3 w-3 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>

            <Label htmlFor="reportSearch" className="shrink-0 text-xs">Search:</Label>
            <Input
              id="reportSearch"
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="h-6 w-28 text-xs"
            />
          </div>

          <div className="flex-1 overflow-auto min-h-0">
            <Table className="text-xs w-full">
              <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
                <TableRow>
                  {clinicalReportTableHeaders.map(header => (
                    <TableHead key={header} className="py-2 px-3 text-foreground font-semibold h-auto">
                      <div className="flex items-center justify-between">
                        <span className="break-words text-xs">{header}</span>
                        <ArrowUpDown className="h-3 w-3 ml-1 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer" />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </ShadcnTableHeader>
              <TableBody>
                {filteredReports.length > 0 ? filteredReports.map((report, index) => (
                  <TableRow key={report.id} className={`hover:bg-muted/50 ${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                    <TableCell className="py-1.5 px-3">{report.reportTitle}</TableCell>
                    <TableCell className="py-1.5 px-3">{report.generatedDate} {report.generatedTime}</TableCell>
                    <TableCell className="py-1.5 px-3">{report.department}</TableCell>
                    <TableCell className="py-1.5 px-3">{report.generatedBy}</TableCell>
                    <TableCell className="py-1.5 px-3 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleViewReport(report.summary)}
                      >
                        <FileSignature className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No clinical reports found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-start p-2.5 border-t text-xs text-muted-foreground mt-auto">
            <div>Showing {filteredReports.length > 0 ? 1 : 0} to {filteredReports.length} of {filteredReports.length} entries</div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogUITitle>Report Summary</DialogUITitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1 rounded-md">
            <div className="text-sm whitespace-pre-wrap p-3 border rounded-md bg-muted/30">
              {selectedReportSummary}
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
    </>
  );
};

type ClinicalReminderDataType = {
  id: string;
  reminderTitle: string;
  dueDate: string;
  dueTime: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "COMPLETED" | "OVERDUE";
  assignedTo: string;
  patient: string;
};

// Mock Clinical Reminder Data
const mockClinicalReminders: ClinicalReminderDataType[] = [
  { 
    id: '1', 
    reminderTitle: 'Follow-up Appointment', 
    dueDate: '25 MAY, 2025', 
    dueTime: '09:00', 
    priority: 'MEDIUM', 
    status: 'PENDING', 
    assignedTo: 'Dr. Sharma', 
    patient: 'John Doe' 
  },
  { 
    id: '2', 
    reminderTitle: 'Lab Results Review', 
    dueDate: '24 MAY, 2025', 
    dueTime: '14:30', 
    priority: 'HIGH', 
    status: 'OVERDUE', 
    assignedTo: 'Dr. Gupta', 
    patient: 'Jane Smith' 
  },
  { 
    id: '3', 
    reminderTitle: 'Medication Renewal', 
    dueDate: '26 MAY, 2025', 
    dueTime: '10:00', 
    priority: 'LOW', 
    status: 'PENDING', 
    assignedTo: 'Nurse Patel', 
    patient: 'Alice Brown' 
  },
  { 
    id: '4', 
    reminderTitle: 'Vaccination Schedule', 
    dueDate: '23 MAY, 2025', 
    dueTime: '11:00', 
    priority: 'MEDIUM', 
    status: 'COMPLETED', 
    assignedTo: 'Dr. Singh', 
    patient: 'Bob Wilson' 
  },
  { 
    id: '5', 
    reminderTitle: 'Annual Checkup', 
    dueDate: '27 MAY, 2025', 
    dueTime: '08:30', 
    priority: 'LOW', 
    status: 'PENDING', 
    assignedTo: 'Dr. Verma', 
    patient: 'Emma Davis' 
  },
];

// Clinical Reminder View
const ClinicalReminderView = () => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  const filteredReminders = mockClinicalReminders;

  const clinicalReminderTableHeaders = [
    "Reminder Title",
    "Due Date:Time",
    "Priority",
    "Status",
    "Assigned To",
    "Patient",
    "Action",
  ];

  const handleMarkAsCompleted = (id: string) => {
    // Placeholder for marking reminder as completed
    console.log(`Marking reminder ${id} as completed`);
  };

  return (
    <Card className="flex-1 flex flex-col shadow overflow-hidden">
      <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs mb-2">
          <Label htmlFor="reminderStatus" className="shrink-0 text-xs">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="reminderStatus" className="h-6 w-24 text-xs">
              <SelectValue placeholder="ALL" className="text-xs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">ALL</SelectItem>
              <SelectItem value="PENDING" className="text-xs">PENDING</SelectItem>
              <SelectItem value="COMPLETED" className="text-xs">COMPLETED</SelectItem>
              <SelectItem value="OVERDUE" className="text-xs">OVERDUE</SelectItem>
            </SelectContent>
          </Select>

          <Label htmlFor="reminderPriority" className="shrink-0 text-xs">Priority</Label>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger id="reminderPriority" className="h-6 w-24 text-xs">
              <SelectValue placeholder="ALL" className="text-xs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">ALL</SelectItem>
              <SelectItem value="LOW" className="text-xs">LOW</SelectItem>
              <SelectItem value="MEDIUM" className="text-xs">MEDIUM</SelectItem>
              <SelectItem value="HIGH" className="text-xs">HIGH</SelectItem>
            </SelectContent>
          </Select>

          <Label htmlFor="reminderFromDate" className="shrink-0 text-xs">From Date</Label>
          <div className="relative">
            <Input
              id="reminderFromDate"
              type="text"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="h-6 w-24 text-xs pr-7"
            />
            <CalendarDays className="h-3 w-3 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>

          <Label htmlFor="reminderToDate" className="shrink-0 text-xs">To</Label>
          <div className="relative">
            <Input
              id="reminderToDate"
              type="text"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="h-6 w-24 text-xs pr-7"
            />
            <CalendarDays className="h-3 w-3 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>

          <Label htmlFor="reminderSearch" className="shrink-0 text-xs">Search:</Label>
          <Input
            id="reminderSearch"
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="h-6 w-28 text-xs"
          />
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <Table className="text-xs w-full">
            <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
              <TableRow>
                {clinicalReminderTableHeaders.map(header => (
                  <TableHead key={header} className="py-2 px-3 text-foreground font-semibold h-auto">
                    <div className="flex items-center justify-between">
                      <span className="break-words text-xs">{header}</span>
                      <ArrowUpDown className="h-3 w-3 ml-1 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </ShadcnTableHeader>
            <TableBody>
              {filteredReminders.length > 0 ? filteredReminders.map((reminder, index) => (
                <TableRow key={reminder.id} className={`hover:bg-muted/50 ${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                  <TableCell className="py-1.5 px-3">{reminder.reminderTitle}</TableCell>
                  <TableCell className="py-1.5 px-3">{reminder.dueDate} {reminder.dueTime}</TableCell>
                  <TableCell className="py-1.5 px-3">{reminder.priority}</TableCell>
                  <TableCell className="py-1.5 px-3">{reminder.status}</TableCell>
                  <TableCell className="py-1.5 px-3">{reminder.assignedTo}</TableCell>
                  <TableCell className="py-1.5 px-3">{reminder.patient}</TableCell>
                  <TableCell className="py-1.5 px-3 text-center">
                    {reminder.status !== "COMPLETED" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleMarkAsCompleted(reminder.id)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No clinical reminders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-start p-2.5 border-t text-xs text-muted-foreground mt-auto">
          <div>Showing {filteredReminders.length > 0 ? 1 : 0} to {filteredReminders.length} of {filteredReminders.length} entries</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Clinical Reminder Analysis Data Type
type ClinicalReminderAnalysisDataType = {
  id: string;
  department: string;
  totalReminders: number;
  completedReminders: number;
  overdueReminders: number;
  completionRate: string;
  analysisDate: string;
};

// Mock Clinical Reminder Analysis Data
const mockClinicalReminderAnalysis: ClinicalReminderAnalysisDataType[] = [
  { 
    id: '1', 
    department: 'ICU', 
    totalReminders: 50, 
    completedReminders: 40, 
    overdueReminders: 5, 
    completionRate: '80%', 
    analysisDate: '24 MAY, 2025' 
  },
  { 
    id: '2', 
    department: 'Surgery', 
    totalReminders: 30, 
    completedReminders: 25, 
    overdueReminders: 2, 
    completionRate: '83%', 
    analysisDate: '24 MAY, 2025' 
  },
  { 
    id: '3', 
    department: 'Psychiatry', 
    totalReminders: 20, 
    completedReminders: 15, 
    overdueReminders: 3, 
    completionRate: '75%', 
    analysisDate: '24 MAY, 2025' 
  },
  { 
    id: '4', 
    department: 'Rehabilitation', 
    totalReminders: 40, 
    completedReminders: 35, 
    overdueReminders: 1, 
    completionRate: '88%', 
    analysisDate: '24 MAY, 2025' 
  },
  { 
    id: '5', 
    department: 'Pediatrics', 
    totalReminders: 25, 
    completedReminders: 20, 
    overdueReminders: 2, 
    completionRate: '80%', 
    analysisDate: '24 MAY, 2025' 
  },
];

// Clinical Reminder Analysis View
const ClinicalReminderAnalysisView = () => {
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [analysisDate, setAnalysisDate] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [selectedAnalysisSummary, setSelectedAnalysisSummary] = useState<string>("");
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);

  const filteredAnalysis = mockClinicalReminderAnalysis;

  const clinicalReminderAnalysisTableHeaders = [
    "Department",
    "Total Reminders",
    "Completed Reminders",
    "Overdue Reminders",
    "Completion Rate",
    "Analysis Date",
    "Action",
  ];

  const handleViewSummary = (department: string) => {
    const summary = `Analysis for ${department}: Total Reminders: ${filteredAnalysis.find(d => d.department === department)?.totalReminders}, Completed: ${filteredAnalysis.find(d => d.department === department)?.completedReminders}, Overdue: ${filteredAnalysis.find(d => d.department === department)?.overdueReminders}, Completion Rate: ${filteredAnalysis.find(d => d.department === department)?.completionRate}`;
    setSelectedAnalysisSummary(summary);
    setIsAnalysisDialogOpen(true);
  };

  return (
    <>
      <Card className="flex-1 flex flex-col shadow overflow-hidden">
        <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs mb-2">
            <Label htmlFor="analysisDepartment" className="shrink-0 text-xs">Department</Label>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger id="analysisDepartment" className="h-6 w-24 text-xs">
                <SelectValue placeholder="ALL" className="text-xs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">ALL</SelectItem>
                <SelectItem value="ICU" className="text-xs">ICU</SelectItem>
                <SelectItem value="Surgery" className="text-xs">Surgery</SelectItem>
                <SelectItem value="Psychiatry" className="text-xs">Psychiatry</SelectItem>
                <SelectItem value="Rehabilitation" className="text-xs">Rehabilitation</SelectItem>
                <SelectItem value="Pediatrics" className="text-xs">Pediatrics</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="analysisDate" className="shrink-0 text-xs">Analysis Date</Label>
            <div className="relative">
              <Input
                id="analysisDate"
                type="text"
                value={analysisDate}
                onChange={e => setAnalysisDate(e.target.value)}
                className="h-6 w-24 text-xs pr-7"
              />
              <CalendarDays className="h-3 w-3 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>

            <Label htmlFor="analysisSearch" className="shrink-0 text-xs">Search:</Label>
            <Input
              id="analysisSearch"
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="h-6 w-28 text-xs"
            />
          </div>

          <div className="flex-1 overflow-auto min-h-0">
            <Table className="text-xs w-full">
              <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
                <TableRow>
                  {clinicalReminderAnalysisTableHeaders.map(header => (
                    <TableHead key={header} className="py-2 px-3 text-foreground font-semibold h-auto">
                      <div className="flex items-center justify-between">
                        <span className="break-words text-xs">{header}</span>
                        <ArrowUpDown className="h-3 w-3 ml-1 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer" />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </ShadcnTableHeader>
              <TableBody>
                {filteredAnalysis.length > 0 ? filteredAnalysis.map((data, index) => (
                  <TableRow key={data.id} className={`hover:bg-muted/50 ${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                    <TableCell className="py-1.5 px-3">{data.department}</TableCell>
                    <TableCell className="py-1.5 px-3">{data.totalReminders}</TableCell>
                    <TableCell className="py-1.5 px-3">{data.completedReminders}</TableCell>
                    <TableCell className="py-1.5 px-3">{data.overdueReminders}</TableCell>
                    <TableCell className="py-1.5 px-3">{data.completionRate}</TableCell>
                    <TableCell className="py-1.5 px-3">{data.analysisDate}</TableCell>
                    <TableCell className="py-1.5 px-3 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleViewSummary(data.department)}
                      >
                        <FileSignature className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No clinical reminder analysis data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-start p-2.5 border-t text-xs text-muted-foreground mt-auto">
            <div>Showing {filteredAnalysis.length > 0 ? 1 : 0} to {filteredAnalysis.length} of {filteredAnalysis.length} entries</div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAnalysisDialogOpen} onOpenChange={setIsAnalysisDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogUITitle>Reminder Analysis Summary</DialogUITitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1 rounded-md">
            <div className="text-sm whitespace-pre-wrap p-3 border rounded-md bg-muted/30">
              {selectedAnalysisSummary}
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
    </>
  );
};

// Clinical Template Data Type
type ClinicalTemplateDataType = {
  id: string;
  templateName: string;
  department: string;
  lastUpdated: string;
  createdBy: string;
  contentPreview: string;
};

// Mock Clinical Template Data
const mockClinicalTemplates: ClinicalTemplateDataType[] = [
  { 
    id: '1', 
    templateName: 'Progress Note - General Medicine', 
    department: 'General Medicine', 
    lastUpdated: '20 MAY, 2025 14:00', 
    createdBy: 'Dr. Sharma', 
    contentPreview: 'Patient presents with... Vital signs: BP, HR, Temp...' 
  },
  { 
    id: '2', 
    templateName: 'Post-Operative Note - Surgery', 
    department: 'Surgery', 
    lastUpdated: '21 MAY, 2025 09:30', 
    createdBy: 'Dr. Gupta', 
    contentPreview: 'Procedure performed... Post-op status: Stable...' 
  },
  { 
    id: '3', 
    templateName: 'Psychiatric Assessment', 
    department: 'Psychiatry', 
    lastUpdated: '22 MAY, 2025 11:15', 
    createdBy: 'Dr. Patel', 
    contentPreview: 'Mental status exam... Mood: Stable...' 
  },
  { 
    id: '4', 
    templateName: 'Physical Therapy Session Note', 
    department: 'Rehabilitation', 
    lastUpdated: '23 MAY, 2025 13:45', 
    createdBy: 'Laura White, PT', 
    contentPreview: 'Range of motion exercises... Progress: Improved...' 
  },
  { 
    id: '5', 
    templateName: 'Pediatric Discharge Summary', 
    department: 'Pediatrics', 
    lastUpdated: '24 MAY, 2025 08:00', 
    createdBy: 'Dr. Young', 
    contentPreview: 'Discharge condition: Stable... Follow-up: 1 week...' 
  },
];

// Clinical Template View
const ClinicalTemplateView = () => {
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [searchText, setSearchText] = useState<string>("");
  const [selectedTemplateContent, setSelectedTemplateContent] = useState<string>("");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);

  const filteredTemplates = mockClinicalTemplates;

  const clinicalTemplateTableHeaders = [
    "Template Name",
    "Department",
    "Last Updated",
    "Created By",
    "Action",
  ];

  const handleViewTemplate = (content: string) => {
    setSelectedTemplateContent(content);
    setIsTemplateDialogOpen(true);
  };

  return (
    <>
      <Card className="flex-1 flex flex-col shadow overflow-hidden">
        <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs mb-2">
            <Label htmlFor="templateDepartment" className="shrink-0 text-xs">Department</Label>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger id="templateDepartment" className="h-6 w-24 text-xs">
                <SelectValue placeholder="ALL" className="text-xs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">ALL</SelectItem>
                <SelectItem value="General Medicine" className="text-xs">General Medicine</SelectItem>
                <SelectItem value="Surgery" className="text-xs">Surgery</SelectItem>
                <SelectItem value="Psychiatry" className="text-xs">Psychiatry</SelectItem>
                <SelectItem value="Rehabilitation" className="text-xs">Rehabilitation</SelectItem>
                <SelectItem value="Pediatrics" className="text-xs">Pediatrics</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="templateSearch" className="shrink-0 text-xs">Search:</Label>
            <Input
              id="templateSearch"
              type="text"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="h-6 w-28 text-xs"
            />
          </div>

          <div className="flex-1 overflow-auto min-h-0">
            <Table className="text-xs w-full">
              <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
                <TableRow>
                  {clinicalTemplateTableHeaders.map(header => (
                    <TableHead key={header} className="py-2 px-3 text-foreground font-semibold h-auto">
                      <div className="flex items-center justify-between">
                        <span className="break-words text-xs">{header}</span>
                        <ArrowUpDown className="h-3 w-3 ml-1 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer" />
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </ShadcnTableHeader>
              <TableBody>
                {filteredTemplates.length > 0 ? filteredTemplates.map((template, index) => (
                  <TableRow key={template.id} className={`hover:bg-muted/50 ${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                    <TableCell className="py-1.5 px-3">{template.templateName}</TableCell>
                    <TableCell className="py-1.5 px-3">{template.department}</TableCell>
                    <TableCell className="py-1.5 px-3">{template.lastUpdated}</TableCell>
                    <TableCell className="py-1.5 px-3">{template.createdBy}</TableCell>
                    <TableCell className="py-1.5 px-3 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleViewTemplate(template.contentPreview)}
                      >
                        <FileSignature className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No clinical templates found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-start p-2.5 border-t text-xs text-muted-foreground mt-auto">
            <div>Showing {filteredTemplates.length > 0 ? 1 : 0} to {filteredTemplates.length} of {filteredTemplates.length} entries</div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogUITitle>Template Preview</DialogUITitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1 rounded-md">
            <div className="text-sm whitespace-pre-wrap p-3 border rounded-md bg-muted/30">
              {selectedTemplateContent}
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
    </>
  );
};

export default ClinicalNotesPage;