
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
import { Edit3, CalendarDays, ChevronDown, ChevronUp } from 'lucide-react';

const verticalNavItems = [
  "Vitals", "Intake/Output", "Problems", "Final Diagnosis", 
  "Chief-Complaints", "Allergies", "OPD/IPD Details"
];

const vitalTypes = [
  "B/P (mmHg)", "Temp (F)", "Resp (/min)", "Pulse (/min)", 
  "Height (In)", "Weight (kg)", "CVP (cmH2O)", "C/G (In)", 
  "Pulse Oximetry (%)", "Pain"
];

const mockChartData = [
  { name: '1', Y_axis: 0 }, { name: '2', Y_axis: 10 }, { name: '3', Y_axis: 20 },
  { name: '4', Y_axis: 25 }, { name: '5', Y_axis: 40 }, { name: '6', Y_axis: 30 },
  { name: '7', Y_axis: 50 }, { name: '8', Y_axis: 65 }, { name: '9', Y_axis: 70 },
  { name: '10', Y_axis: 80 },
];

const VitalsDashboardPage: NextPage = () => {
  const [activeVerticalTab, setActiveVerticalTab] = useState<string>("Vitals");
  const [visitDate, setVisitDate] = useState<string | undefined>();
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  return (
    <div className="flex h-[calc(100vh-var(--top-nav-height,60px))] bg-background text-sm"> {/* Changed bg-sky-50 to bg-background */}
      {/* Left Vertical Navigation Panel */}
      <aside className="w-48 bg-card border-r p-2 flex flex-col space-y-1">
        {verticalNavItems.map((item) => (
          <Button
            key={item}
            variant={activeVerticalTab === item ? "secondary" : "ghost"}
            className={`w-full justify-start text-left h-10 px-3 ${activeVerticalTab === item ? 'bg-blue-100 text-blue-700 border-l-4 border-orange-500' : 'hover:bg-muted/50'}`}
            onClick={() => setActiveVerticalTab(item)}
          >
            {item}
          </Button>
        ))}
      </aside>

      {/* Right Content Panel */}
      <main className="flex-1 flex p-3 gap-3 overflow-hidden">
        {/* Vitals Data Area */}
        <div className="flex-[3] flex flex-col border rounded-md bg-card shadow">
          {/* Header */}
          <div className="flex items-center justify-between p-2 border-b bg-blue-100 text-blue-800 rounded-t-md">
            <h2 className="text-base font-semibold">{activeVerticalTab}</h2>
            <div className="flex items-center space-x-2">
              <Checkbox id="enteredInError" />
              <Label htmlFor="enteredInError" className="text-xs">Entered in Error</Label>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-700 hover:bg-blue-200">
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center space-x-2 p-2 border-b text-xs">
            <Label htmlFor="visitDate" className="shrink-0">Visit Date</Label>
            <Select value={visitDate} onValueChange={setVisitDate}>
              <SelectTrigger id="visitDate" className="h-8 w-36 text-xs">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-8 text-xs">Today</Button>
            <div className="flex items-center space-x-1">
              <Label htmlFor="fromDate" className="shrink-0">From Date</Label>
              <div className="relative">
                <Input id="fromDate" type="text" value={fromDate} onChange={(e) => setFromDate(e.target.value)} placeholder="DD/MM/YYYY" className="h-8 w-32 text-xs pr-8" />
                <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Label htmlFor="toDate" className="shrink-0">To Date</Label>
               <div className="relative">
                <Input id="toDate" type="text" value={toDate} onChange={(e) => setToDate(e.target.value)} placeholder="DD/MM/YYYY" className="h-8 w-32 text-xs pr-8" />
                 <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Vitals Table Header (Date/Time) */}
          <div className="flex items-center justify-end p-2 bg-blue-100 text-blue-800 border-b text-xs font-medium">
            <div className="w-20 text-center">Date</div>
            <div className="w-20 text-center">Time</div>
          </div>
          
          {/* Vitals Table */}
          <ScrollArea className="flex-1">
            <Table className="text-xs">
              <TableBody>
                {vitalTypes.map((vital) => (
                  <TableRow key={vital} className="hover:bg-muted/30">
                    <TableCell className="font-medium py-1.5 border-r w-48">{vital}</TableCell>
                    {/* Placeholder for actual data columns if needed */}
                    <TableCell className="py-1.5 border-r w-20 text-center">-</TableCell>
                    <TableCell className="py-1.5 w-20 text-center">-</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-2 p-2 border-t">
            <Button size="sm" className="text-xs bg-orange-400 hover:bg-orange-500 text-white h-8">Vitals Entry</Button>
            <Button size="sm" className="text-xs bg-orange-400 hover:bg-orange-500 text-white h-8">Multiple Vitals Graph</Button>
            <Button size="sm" className="text-xs bg-orange-400 hover:bg-orange-500 text-white h-8">ICU Flow Sheet</Button>
          </div>
        </div>

        {/* Vitals Graph Area */}
        <div className="flex-1 flex flex-col border rounded-md bg-card shadow">
          <div className="flex items-center p-2 border-b bg-blue-100 text-blue-800 rounded-t-md">
            <h2 className="text-base font-semibold">Vitals Graph</h2>
          </div>
          <div className="flex-1 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData} margin={{ top: 5, right: 20, bottom: 20, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} label={{ value: "X axis", position: 'insideBottom', offset: -10, fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} label={{ value: "Y axis", angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, dy: 40 }} />
                <Tooltip contentStyle={{ fontSize: 10, padding: '2px 5px' }}/>
                <Line type="monotone" dataKey="Y_axis" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VitalsDashboardPage;
