'use client';

import type { NextPage } from 'next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays } from 'lucide-react';
import { Patient } from '@/services/api';

const biSubNavItems = ["BI Dashboard", "Key Performance Indicators", "Custom BI Reports"];

const BiPage: NextPage<{ patient?: Patient }> = ({ patient }) => {
  const [activeSubNav, setActiveSubNav] = useState<string>(biSubNavItems[0]);

  // State for form fields
  const [noteDateFrom, setNoteDateFrom] = useState<string>("05/20/2025");
  const [noteDateTo, setNoteDateTo] = useState<string>("05/20/2025");
  const [title, setTitle] = useState<string>("All");
  const [attendingPhysician, setAttendingPhysician] = useState<string>("All");
  const [author, setAuthor] = useState<string>("All");
  const [noteType, setNoteType] = useState<string>("All");
  const [icdCode, setIcdCode] = useState<string>("");

  const [content1, setContent1] = useState<string>("");
  const [orCondition, setOrCondition] = useState<string | undefined>();
  const [content2, setContent2] = useState<string>("");
  const [content3, setContent3] = useState<string>("");
  const [content4, setContent4] = useState<string>("");
  const [ageFrom, setAgeFrom] = useState<string>("");
  const [ageTo, setAgeTo] = useState<string>("");
  const [wardLocation, setWardLocation] = useState<string | undefined>();


  return (
    <div className="flex flex-col h-[calc(100vh-var(--top-nav-height,60px))] bg-background text-sm p-3">
      {/* Horizontal Sub-Navigation Bar */}
      <div className="flex items-center space-x-0.5 border-b border-border px-1 pb-1 mb-3 overflow-x-auto no-scrollbar bg-card">
        {biSubNavItems.map((item) => (
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeSubNav === "BI Dashboard" ? (
          <Card className="flex-1 flex flex-col shadow-sm">
            <CardHeader className="py-2 px-4 border-b bg-accent rounded-t-md">
              <CardTitle className="text-base font-semibold text-foreground">BI Tools Search</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {/* Left Column */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="noteDateFrom" className="w-36 shrink-0 text-xs">Note Date From <span className="text-red-500">*</span></Label>
                    <div className="relative flex-1">
                      <Input id="noteDateFrom" type="text" value={noteDateFrom} onChange={e => setNoteDateFrom(e.target.value)} className="h-8 text-xs pr-8" />
                      <CalendarDays className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <Label htmlFor="noteDateTo" className="shrink-0 text-xs">To <span className="text-red-500">*</span></Label>
                    <div className="relative flex-1">
                      <Input id="noteDateTo" type="text" value={noteDateTo} onChange={e => setNoteDateTo(e.target.value)} className="h-8 text-xs pr-8" />
                      <CalendarDays className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>

                  {[
                    { label: "Title", id: "title", value: title, setter: setTitle, options: ["All", "Option B", "Option C"] },
                    { label: "Attending Physician", id: "attendingPhysician", value: attendingPhysician, setter: setAttendingPhysician, options: ["All", "Dr. Smith", "Dr. Jones"] },
                    { label: "Author", id: "author", value: author, setter: setAuthor, options: ["All", "User X", "User Y"] },
                    { label: "Note Type", id: "noteType", value: noteType, setter: setNoteType, options: ["All", "Progress Note", "Consult Note"] },
                  ].map(field => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Label htmlFor={field.id} className="w-36 shrink-0 text-xs">{field.label}</Label>
                      <Select value={field.value} onValueChange={field.setter}>
                        <SelectTrigger id={field.id} className="h-8 text-xs flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map(opt => <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="icdCode" className="w-36 shrink-0 text-xs">ICD Code</Label>
                    <Input id="icdCode" value={icdCode} onChange={e => setIcdCode(e.target.value)} className="h-8 text-xs flex-1" />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="content1" className="w-24 shrink-0 text-xs">Content1 <span className="text-red-500">*</span></Label>
                    <Input id="content1" value={content1} onChange={e => setContent1(e.target.value)} className="h-8 text-xs flex-1" />
                    <Select value={orCondition} onValueChange={setOrCondition}>
                      <SelectTrigger id="orCondition" className="h-8 text-xs w-20">
                        <SelectValue placeholder="OR" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND" className="text-xs">AND</SelectItem>
                        <SelectItem value="OR" className="text-xs">OR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {[
                    { label: "Content2", id: "content2", value: content2, setter: setContent2 },
                    { label: "Content3", id: "content3", value: content3, setter: setContent3 },
                    { label: "Content4", id: "content4", value: content4, setter: setContent4 },
                  ].map(field => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Label htmlFor={field.id} className="w-24 shrink-0 text-xs">{field.label}</Label>
                      <Input id={field.id} value={field.value} onChange={e => field.setter(e.target.value)} className="h-8 text-xs flex-1" />
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="ageFrom" className="w-24 shrink-0 text-xs">Age From</Label>
                    <Input id="ageFrom" type="text" value={ageFrom} onChange={e => setAgeFrom(e.target.value)} className="h-8 text-xs w-20" />
                    <Label htmlFor="ageTo" className="shrink-0 text-xs">To</Label>
                    <Input id="ageTo" type="text" value={ageTo} onChange={e => setAgeTo(e.target.value)} className="h-8 text-xs w-20 flex-1" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="wardLocation" className="w-24 shrink-0 text-xs">Ward Location</Label>
                    <Select value={wardLocation} onValueChange={setWardLocation}>
                      <SelectTrigger id="wardLocation" className="h-8 text-xs flex-1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ward A" className="text-xs">Ward A</SelectItem>
                        <SelectItem value="Ward B" className="text-xs">Ward B</SelectItem>
                        <SelectItem value="ICU" className="text-xs">ICU</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t flex justify-center space-x-3">
              <Button size="sm" className="text-xs h-8 bg-yellow-500 hover:bg-yellow-600 text-white">Search</Button>
              <Button size="sm" className="text-xs h-8 bg-yellow-500 hover:bg-yellow-600 text-white">Reset</Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="flex-1 flex items-center justify-center shadow-sm">
            <CardContent className="text-center">
              <CardTitle className="text-xl text-muted-foreground">
                {activeSubNav}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Content for this section is not yet implemented.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default BiPage;

