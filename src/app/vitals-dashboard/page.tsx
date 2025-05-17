
'use client';

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Edit3, CalendarDays, ChevronDown, ChevronUp, RefreshCw, ArrowUpDown } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

const verticalNavItems = [
  "Vitals", "Intake/Output", "Problems", "Final Diagnosis", 
  "Chief-Complaints", "Allergies", "OPD/IPD Details"
];

const vitalTypes = [
  "B/P (mmHg)", "Temp (F)", "Resp (/min)", "Pulse (/min)", 
  "Height (In)", "Weight (kg)", "CVP (cmH2O)", "C/G (In)", 
  "Pulse Oximetry (%)", "Pain",
  "Early Warning Sign", "Location", "Entered By"
];

const mockVitalChartData = [
  { name: '1', Y_axis: 0 }, { name: '2', Y_axis: 10 }, { name: '3', Y_axis: 20 },
  { name: '4', Y_axis: 25 }, { name: '5', Y_axis: 40 }, { name: '6', Y_axis: 30 },
  { name: '7', Y_axis: 50 }, { name: '8', Y_axis: 65 }, { name: '9', Y_axis: 70 },
  { name: '10', Y_axis: 80 },
];

const mockIntakeOutputChartData = [
  { name: '08:00', series1: 400, series2: 240 },
  { name: '10:00', series1: 300, series2: 139 },
  { name: '12:00', series1: 200, series2: 980 },
  { name: '14:00', series1: 278, series2: 390 },
  { name: '16:00', series1: 189, series2: 480 },
  { name: '18:00', series1: 239, series2: 380 },
  { name: '20:00', series1: 349, series2: 430 },
];

const VitalsView = () => {
  const [visitDate, setVisitDate] = useState<string | undefined>();
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  return (
    <>
      {/* Vitals Data Area */}
      <div className="flex-[2] flex flex-col border rounded-md bg-card shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b bg-blue-700 text-white rounded-t-md">
          <h2 className="text-base font-semibold">Vitals</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5">
              <Checkbox id="enteredInError" className="border-white data-[state=checked]:bg-white data-[state=checked]:text-blue-700" />
              <Label htmlFor="enteredInError" className="text-xs text-white">Entered in Error</Label>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-blue-600">
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center space-x-2 p-2 border-b text-xs">
          <Label htmlFor="visitDate" className="shrink-0">Visit Date</Label>
          <Select value={visitDate} onValueChange={setVisitDate}>
            <SelectTrigger id="visitDate" className="h-8 w-28 text-xs">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-1">
            <Label htmlFor="fromDate" className="shrink-0">From</Label>
            <div className="relative">
              <Input id="fromDate" type="text" value={fromDate} onChange={(e) => setFromDate(e.target.value)} placeholder="DD/MM/YYYY" className="h-8 w-28 text-xs pr-8" />
              <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Label htmlFor="toDate" className="shrink-0">To</Label>
             <div className="relative">
              <Input id="toDate" type="text" value={toDate} onChange={(e) => setToDate(e.target.value)} placeholder="DD/MM/YYYY" className="h-8 w-28 text-xs pr-8" />
               <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Vitals Table Header (Date/Time) */}
        <div className="flex items-center justify-end p-2 bg-blue-700 text-white border-b text-xs font-medium">
          <div className="w-20 text-center">Date</div>
          <div className="w-20 text-center">Time</div>
        </div>
        
        <ScrollArea className="flex-1">
          <Table className="text-xs">
            <TableBody>
              {vitalTypes.map((vital) => (
                <TableRow key={vital} className="hover:bg-muted/30">
                  <TableCell className="font-medium py-1.5 border-r w-48">{vital}</TableCell>
                  <TableCell className="py-1.5 border-r w-20 text-center">-</TableCell>
                  <TableCell className="py-1.5 w-20 text-center">-</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <div className="flex items-center justify-center space-x-2 p-2 border-t">
          <Button size="sm" className="text-xs bg-orange-400 hover:bg-orange-500 text-white h-8">Vitals Entry</Button>
          <Button size="sm" className="text-xs bg-orange-400 hover:bg-orange-500 text-white h-8">Multiple Vitals Graph</Button>
          <Button size="sm" className="text-xs bg-orange-400 hover:bg-orange-500 text-white h-8">ICU Flow Sheet</Button>
        </div>
      </div>

      {/* Vitals Graph Area */}
      <div className="flex-[3] flex flex-col border rounded-md bg-card shadow">
        <div className="flex items-center p-2 border-b bg-blue-700 text-white rounded-t-md">
          <h2 className="text-base font-semibold">Vitals Graph</h2>
        </div>
        <div className="flex-1 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockVitalChartData} margin={{ top: 5, right: 20, bottom: 20, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} label={{ value: "X axis", position: 'insideBottom', offset: -10, fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} label={{ value: "Y axis", angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, dy: 40 }} />
              <Tooltip contentStyle={{ fontSize: 10, padding: '2px 5px' }}/>
              <Line type="monotone" dataKey="Y_axis" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

const IntakeOutputView = () => {
  const [fromDate, setFromDate] = useState<string>("05/16/2025 14:5");
  const [toDate, setToDate] = useState<string>("05/17/2025 14:5");

  const inputHeaders = ["IV FLUID", "BLOOD PRODUCT", "PO", "TUBE FEEDING", "INFUSION", "OTHER"];
  const outputHeaders = ["URINE", "N/G", "EMESIS", "DRAINAGE", "FAECES"];

  return (
    <>
      {/* Patient Intake/Output Summary Area */}
      <div className="flex-[7] flex flex-col border rounded-md bg-card shadow overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-2.5 border-b bg-sky-100 text-sky-800 rounded-t-md">
          <h2 className="text-base font-semibold">Patient Intake/Output Summary</h2>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-sky-700 hover:bg-sky-200">
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-sky-700 hover:bg-sky-200">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center space-x-3 p-2.5 border-b text-xs">
          <Label htmlFor="intakeFromDate" className="shrink-0">From Date</Label>
          <div className="relative">
            <Input id="intakeFromDate" type="text" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-8 w-36 text-xs pr-8" />
            <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
            </Button>
          </div>
          <Label htmlFor="intakeToDate" className="shrink-0">To Date</Label>
           <div className="relative">
            <Input id="intakeToDate" type="text" value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-8 w-36 text-xs pr-8" />
             <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-sky-200 text-sky-800">
                <th colSpan={inputHeaders.length} className="p-2 border text-center font-semibold">Input</th>
                <th colSpan={outputHeaders.length} className="p-2 border text-center font-semibold">Output</th>
              </tr>
              <tr className="bg-sky-50 text-sky-700">
                {inputHeaders.map(header => (
                  <th key={header} className="p-1.5 border font-medium text-center whitespace-nowrap">
                    {header.split(" ")[0]}<br/>{header.split(" ")[1] || ""}
                  </th>
                ))}
                {outputHeaders.map(header => (
                  <th key={header} className="p-1.5 border font-medium text-center whitespace-nowrap">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                {inputHeaders.map(header => <TableCell key={`input-data-${header}`} className="p-1.5 border text-center h-8">-</TableCell>)}
                {outputHeaders.map(header => <TableCell key={`output-data-${header}`} className="p-1.5 border text-center h-8">-</TableCell>)}
              </tr>
               <tr>
                {inputHeaders.map(header => <TableCell key={`input-data2-${header}`} className="p-1.5 border text-center h-8">-</TableCell>)}
                {outputHeaders.map(header => <TableCell key={`output-data2-${header}`} className="p-1.5 border text-center h-8">-</TableCell>)}
              </tr>
              <tr className="bg-slate-50">
                <TableCell colSpan={inputHeaders.length} className="p-1.5 border text-left font-semibold">Total:</TableCell>
                <TableCell colSpan={outputHeaders.length} className="p-1.5 border text-left font-semibold"></TableCell> 
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-2.5 border-t text-xs space-y-1">
            <div className="flex justify-between"><span>Total Intake Measured:</span><span> ml</span></div>
            <div className="flex justify-between"><span>Total Output Measured:</span><span> ml</span></div>
            <div className="flex justify-between"><span>Total Balanced Measured:</span><span> ml</span></div>
            <div className="text-green-600 text-center mt-1">M-Morning(08:00-13:59) E-Evening(14:00-19:59) N-Night(20:00-07:59)</div>
        </div>

        <div className="flex items-center justify-center space-x-2 p-2.5 border-t">
          <Button size="sm" className="text-xs bg-orange-400 hover:bg-orange-500 text-white h-8">Add Intake</Button>
          <Button size="sm" className="text-xs bg-orange-400 hover:bg-orange-500 text-white h-8">Add Output</Button>
          <Button size="sm" className="text-xs bg-orange-400 hover:bg-orange-500 text-white h-8">Update Intake</Button>
          <Button size="sm" className="text-xs bg-orange-400 hover:bg-orange-500 text-white h-8">Update Output</Button>
        </div>
      </div>

      {/* Intake/Output Graph Area */}
      <div className="flex-[3] flex flex-col border rounded-md bg-card shadow">
        <div className="flex items-center p-2.5 border-b bg-sky-100 text-sky-800 rounded-t-md">
          <h2 className="text-base font-semibold">Intake/Output Graph</h2>
        </div>
        <div className="flex-1 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockIntakeOutputChartData} margin={{ top: 5, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} label={{ value: "Date/Time", position: 'insideBottom', offset: -10, fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} label={{ value: "Total Intake / Output", angle: -90, position: 'insideLeft', offset: 0, fontSize: 10, dy:60 }} />
              <Tooltip contentStyle={{ fontSize: 10, padding: '2px 5px' }}/>
              <Legend verticalAlign="top" height={36} wrapperStyle={{fontSize: "10px"}} />
              <Line type="monotone" dataKey="series1" name="Series 1" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="series2" name="Series 2" stroke="#82ca9d" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

const ProblemsView = () => {
  const [showEntries, setShowEntries] = useState<string>("all");
  const [problemVisitDate, setProblemVisitDate] = useState<string>("10 SEP, 2024 13:10");
  const [statusToggle, setStatusToggle] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  // const [problemsData, setProblemsData] = useState<any[]>([]); // Placeholder for actual data

  const tableHeaders = ["Problems", "Immediacy", "Status", "Date of OnSet", "Edit", "Remove", "Restore", "Co-Morbidity"];

  return (
    <div className="flex-1 flex flex-col border rounded-md bg-card shadow text-xs">
      {/* Filter Bar */}
      <div className="flex items-center justify-between p-2.5 border-b bg-sky-100 text-sky-800 rounded-t-md">
        <div className="flex items-center space-x-2">
          <Label htmlFor="showEntriesProblem" className="text-xs">Show</Label>
          <Select value={showEntries} onValueChange={setShowEntries}>
            <SelectTrigger id="showEntriesProblem" className="h-7 w-20 text-xs">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor="showEntriesProblem" className="text-xs">entries</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="visitDateProblem" className="text-xs">Visit Date</Label>
          <Select value={problemVisitDate} onValueChange={setProblemVisitDate}>
            <SelectTrigger id="visitDateProblem" className="h-7 w-40 text-xs">
              <SelectValue placeholder="Select Date" />
            </SelectTrigger>
            <SelectContent>
              {/* Placeholder, ideally a date picker or dynamic list */}
              <SelectItem value="10 SEP, 2024 13:10">10 SEP, 2024 13:10</SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor="statusToggleProblem" className="text-xs">Status</Label>
          <Switch id="statusToggleProblem" checked={statusToggle} onCheckedChange={setStatusToggle} className="data-[state=checked]:bg-sky-600 data-[state=unchecked]:bg-gray-200 h-5 w-9"/>
          <Label htmlFor="statusToggleProblem" className="text-xs ml-1">ALL</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="searchProblem" className="text-xs">Search:</Label>
          <Input id="searchProblem" type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="h-7 w-32 text-xs" />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <Table className="text-xs">
          <TableHeader className="bg-sky-200 sticky top-0 z-10">
            <TableRow>
              {tableHeaders.map(header => (
                <TableHead key={header} className="py-2 px-3 text-sky-800 font-semibold h-8">
                  <div className="flex items-center justify-between">
                    {header}
                    <ArrowUpDown className="h-3 w-3 ml-1 text-sky-600 hover:text-sky-800 cursor-pointer" />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={tableHeaders.length} className="text-center py-10 text-muted-foreground">
                No Data Found
              </TableCell>
            </TableRow>
            {/* Placeholder for data rows if problemsData had items */}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground">
        <div>Showing 0 to 0 of 0 entries</div>
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Previous</Button>
          <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1 bg-sky-200 text-sky-800 border-sky-300">1</Button>
          <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Next</Button>
        </div>
      </div>

       {/* Action Button */}
       <div className="flex items-center justify-center p-2.5 border-t">
          <Button size="sm" className="text-xs bg-orange-400 hover:bg-orange-500 text-white h-8">New Problem</Button>
        </div>
    </div>
  );
};

const FinalDiagnosisView = () => {
  const [showEntries, setShowEntries] = useState<string>("10");
  const [visitDate, setVisitDate] = useState<string>("10 SEP, 2024 13:10");
  const [searchText, setSearchText] = useState<string>("");

  const tableHeaders = ["Primary/Secondary", "Diagnosis Description", "Comment", "Entered Date", "Provider", "Primary", "Add", "Remove"];
  
  return (
    <div className="flex-1 flex flex-col border rounded-md bg-card shadow text-xs">
      {/* Header */}
      <div className="p-2.5 border-b bg-sky-100 text-sky-800 rounded-t-md">
        <h2 className="text-base font-semibold">Diagnosis</h2>
      </div>
      {/* Filter Bar */}
      <div className="flex items-center justify-between p-2.5 border-b">
        <div className="flex items-center space-x-2">
          <Label htmlFor="showEntriesDiagnosis" className="text-xs">Show</Label>
          <Select value={showEntries} onValueChange={setShowEntries}>
            <SelectTrigger id="showEntriesDiagnosis" className="h-7 w-20 text-xs">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor="showEntriesDiagnosis" className="text-xs">entries</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="visitDateDiagnosis" className="text-xs">Visit Date</Label>
          <Select value={visitDate} onValueChange={setVisitDate}>
            <SelectTrigger id="visitDateDiagnosis" className="h-7 w-40 text-xs">
              <SelectValue placeholder="Select Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10 SEP, 2024 13:10">10 SEP, 2024 13:10</SelectItem>
              {/* Add other dates as needed */}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="searchDiagnosis" className="text-xs">Search:</Label>
          <Input id="searchDiagnosis" type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="h-7 w-48 text-xs" />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <Table className="text-xs">
          <TableHeader className="bg-sky-200 sticky top-0 z-10">
            <TableRow>
              {tableHeaders.map(header => (
                <TableHead key={header} className="py-2 px-3 text-sky-800 font-semibold h-8">
                  <div className="flex items-center justify-between">
                    {header}
                    <ArrowUpDown className="h-3 w-3 ml-1 text-sky-600 hover:text-sky-800 cursor-pointer" />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={tableHeaders.length} className="text-center py-10 text-muted-foreground">
                No Data Found
              </TableCell>
            </TableRow>
            {/* Placeholder for data rows */}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground">
        <div>Showing 0 to 0 of 0 entries</div>
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Previous</Button>
          {/* Pagination numbers could be dynamic */}
          <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Next</Button>
        </div>
      </div>

       {/* Action Button */}
       <div className="flex items-center justify-center p-2.5 border-t">
          <Button size="sm" className="text-xs bg-orange-400 hover:bg-orange-500 text-white h-8">New Diagnosis</Button>
        </div>
    </div>
  );
};


const VitalsDashboardPage: NextPage = () => {
  const [activeVerticalTab, setActiveVerticalTab] = useState<string>("Vitals");

  return (
    <div className="flex h-[calc(100vh-var(--top-nav-height,60px))] bg-background text-sm">
      <aside className="w-40 bg-card border-r p-2 flex flex-col space-y-1">
        {verticalNavItems.map((item) => (
          <Button
            key={item}
            variant={activeVerticalTab === item ? "secondary" : "ghost"}
            className={`w-full justify-start text-left h-10 px-3 ${activeVerticalTab === item ? 'bg-blue-700 text-white border-l-4 border-sky-400' : 'hover:bg-muted/50'}`}
            onClick={() => setActiveVerticalTab(item)}
          >
            {item}
          </Button>
        ))}
      </aside>

      <main className="flex-1 flex p-3 gap-3 overflow-hidden">
        {activeVerticalTab === "Vitals" && <VitalsView />}
        {activeVerticalTab === "Intake/Output" && <IntakeOutputView />}
        {activeVerticalTab === "Problems" && <ProblemsView />}
        {activeVerticalTab === "Final Diagnosis" && <FinalDiagnosisView />}
        {/* Add other views here based on activeVerticalTab */}
         {/* Placeholder for other views */}
         {activeVerticalTab !== "Vitals" && activeVerticalTab !== "Intake/Output" && activeVerticalTab !== "Problems" && activeVerticalTab !== "Final Diagnosis" && (
          <Card className="flex-1 flex items-center justify-center">
            <CardContent className="text-center">
              <CardTitle className="text-xl text-muted-foreground">
                {activeVerticalTab} View
              </CardTitle>
              <p className="text-sm text-muted-foreground">Content for this section is not yet implemented.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default VitalsDashboardPage;

    