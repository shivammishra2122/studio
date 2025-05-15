
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader as ShadcnCardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart } from 'recharts';
import { 
  Droplet, HeartPulse, Activity, Thermometer, Scale, Edit3, Clock, Pill as PillIcon, Plus, MoreVertical,
  Trash2, FileText, Ban, ScanLine, ClipboardList, BellRing
} from 'lucide-react';
import type { HealthMetric, Appointment, Medication } from '@/lib/constants';
import { MOCK_APPOINTMENTS, MOCK_MEDICATIONS, LOREM_IPSUM_TEXT } from '@/lib/constants';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle as DialogUITitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


const keyIndicators: HealthMetric[] = [
  { name: 'Blood Glucose', value: '98', unit: 'mg/dL', icon: Droplet },
  { name: 'Heart Rate', value: '72', unit: 'bpm', icon: HeartPulse },
  { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity },
  { name: 'Body Temperature', value: '36.8', unit: '°C', icon: Thermometer },
  { name: 'Weight', value: '70', unit: 'kg', icon: Scale },
];

const glucoseData: Array<{ date: string; level: number }> = [
  { date: '2024-07-01', level: 95 }, { date: '2024-07-02', level: 102 }, { date: '2024-07-03', level: 98 },
  { date: '2024-07-04', level: 110 }, { date: '2024-07-05', level: 105 }, { date: '2024-07-06', level: 99 },
  { date: '2024-07-07', level: 108 },
];

const ecgData: Array<{ time: string; value: number }> = [
  { time: '0s', value: 0.1 }, { time: '0.1s', value: 0.5 }, { time: '0.2s', value: -0.2 },
  { time: '0.3s', value: 1.0 }, { time: '0.4s', value: -0.3 }, { time: '0.5s', value: 0.2 },
  { time: '0.6s', value: 0.6 }, { time: '0.7s', value: -0.1 }, { time: '0.8s', value: 1.1 },
];

const ctScanReadings: Array<{ organ: string; finding: string }> = [
  { organ: 'Lungs', finding: 'Clear' }, { organ: 'Liver', finding: 'Normal' }, { organ: 'Kidneys', finding: 'Slight calcification' },
];

const glucoseChartConfig: ChartConfig = { level: { label: 'Glucose (mg/dL)', color: 'hsl(var(--chart-1))' } };
const ecgChartConfig: ChartConfig = { value: { label: 'ECG (mV)', color: 'hsl(var(--chart-2))' } };

const informationalCardTitles: string[] = [
  "Allergies",
  "Clinical notes",
  "Radiology",
  "Encounter notes",
  "Clinical reminder",
  "Report" 
];

const initialPageCardSampleContent: Record<string, string[]> = {
  "Allergies": ["Pollen", "Peanuts", "Dust Mites", "Penicillin"],
  "Clinical notes": ["Mild cough noted.", "Rest advised.", "Follow-up in 1 week.", "Vitals stable."],
  "Radiology": ["Chest X-Ray: NAD.", "MRI Brain: Age-consistent.", "US Abdomen: Normal.", "CT Pelvis: WNL."],
  "Encounter notes": ["Discussed lab results.", "Improved sleep reported.", "Medication adherence good.", "Next F/U scheduled."],
  "Clinical reminder": ["Flu shot due Oct.", "BP check quarterly.", "Lipid panel next month.", "Specialist referral pending."],
  "Report": ["Pathology #123: Benign.", "Imaging #678: NAD.", "Consult (Smith): Stable.", "Discharge Sum: Recovered."]
};


export default function DashboardPage(): JSX.Element {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS);
  
  // For informational cards, we'll use LOREM_IPSUM_TEXT for content based on the image
  // The specific items per card are not shown in the image for these, so lorem ipsum is a good placeholder.

  // Dialog states
  const [isAddAppointmentDialogOpen, setIsAddAppointmentDialogOpen] = useState(false);
  const [newAppointmentInput, setNewAppointmentInput] = useState('');
  const [isAddMedicationDialogOpen, setIsAddMedicationDialogOpen] = useState(false);
  const [newMedicationInput, setNewMedicationInput] = useState('');
  
  // We don't need state for informational card content if it's just lorem ipsum and not editable items.

  const handleAddAppointment = () => {
    if (!newAppointmentInput.trim()) return;
    const newAppt: Appointment = {
      id: Date.now().toString(),
      doctor: newAppointmentInput,
      specialty: 'Specialty', // Placeholder
      date: new Date().toISOString().split('T')[0], // Today's date
      time: 'N/A', // Placeholder
      location: 'N/A',
      avatarUrl: 'https://placehold.co/40x40.png',
    };
    setAppointments(prev => [newAppt, ...prev]);
    setNewAppointmentInput('');
    setIsAddAppointmentDialogOpen(false);
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(appt => appt.id !== id));
  };

  const handleAddMedication = () => {
    if (!newMedicationInput.trim()) return;
    const newMed: Medication = {
      id: Date.now().toString(),
      name: newMedicationInput,
      reason: 'General', // Placeholder
      amount: 'N/A',
      timing: 'N/A',
      taken: false,
    };
    setMedications(prev => [newMed, ...prev]);
    setNewMedicationInput('');
    setIsAddMedicationDialogOpen(false);
  };

  const handleDeleteMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };
  

  return (
    <div className="flex flex-1 flex-col p-6 space-y-6 bg-background"> {/* Added bg-background based on image */}
      
      {/* Top Row: Charts/Vitals */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Health Data Visualizations Card (Charts ONLY) */}
        <Card className="shadow-lg w-full md:w-[65%] rounded-lg">
          {/* CardHeader removed as per image */}
          <CardContent className="pt-4 px-4 pb-4"> {/* Adjusted padding based on image */}
            <Tabs defaultValue="glucose">
              <TabsList className="grid w-full grid-cols-3 mb-4 h-10">
                <TabsTrigger value="glucose" className="text-sm px-3 py-2">Glucose</TabsTrigger>
                <TabsTrigger value="ecg" className="text-sm px-3 py-2">ECG</TabsTrigger>
                <TabsTrigger value="ct-scan" className="text-sm px-3 py-2">CT Scan</TabsTrigger>
              </TabsList>
              <TabsContent value="glucose">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-0 max-h-[200px] overflow-y-auto no-scrollbar">
                    <ChartContainer config={glucoseChartConfig} className="h-[180px] w-full">
                      <RechartsLineChart data={glucoseData} margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={6} fontSize={10} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={6} fontSize={10} domain={[30, 120]} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="level" type="monotone" stroke="var(--color-level)" strokeWidth={2} dot={{r: 3}} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ecg">
                 <Card className="border-0 shadow-none">
                  <CardContent className="p-0 max-h-[200px] overflow-y-auto no-scrollbar">
                    <ChartContainer config={ecgChartConfig} className="h-[180px] w-full">
                      <RechartsLineChart data={ecgData} margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={6} fontSize={10} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={6} fontSize={10} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} dot={false} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ct-scan">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-2 max-h-[200px] overflow-y-auto no-scrollbar space-y-1.5">
                    <ul className="space-y-1.5">
                      {ctScanReadings.map((reading, index) => (
                        <li key={index} className="flex justify-between p-1.5 rounded-md bg-muted/70 text-sm">
                          <span className="font-medium text-foreground">{reading.organ}:</span>
                          <span className="text-muted-foreground">{reading.finding}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-muted-foreground">Note: Simplified. Consult doctor for details.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Vitals Card */}
        <div className="w-full md:w-[35%]">
          <Card className="shadow-lg h-full rounded-lg">
            {/* CardHeader removed as per image */}
            <CardContent className="space-y-2 p-4 max-h-[calc(200px+3rem)] overflow-y-auto no-scrollbar">
              {keyIndicators.map((indicator) => (
                <div key={indicator.name} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/70">
                  <div className="flex items-center">
                    {indicator.icon && <indicator.icon className="h-5 w-5 text-primary mr-2" />}
                    <span className="text-sm font-medium text-foreground">{indicator.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-semibold text-foreground">{indicator.value}</span>
                    <span className="text-xs text-muted-foreground ml-0.5">{indicator.unit}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Middle Row: Appointments & Medications */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg rounded-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-3 pb-2 px-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="text-md font-semibold">Upcoming Appointments</CardTitle>
              <Badge variant="secondary" className="text-xs px-2 py-0.5">{appointments.length}</Badge>
            </div>
            <div className="flex items-center space-x-1">
              <Dialog open={isAddAppointmentDialogOpen} onOpenChange={setIsAddAppointmentDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogUITitle>Add New Appointment</DialogUITitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="apptName" className="text-right">Doctor</Label>
                      <Input id="apptName" value={newAppointmentInput} onChange={(e) => setNewAppointmentInput(e.target.value)} className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleAddAppointment}>Add</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
               <Button variant="default" size="icon" className="h-8 w-8" onClick={() => setIsAddAppointmentDialogOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </ShadcnCardHeader>
          <CardContent className="p-0 max-h-[250px] overflow-y-auto no-scrollbar">
            <Table>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell className="px-3 py-2.5">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={appt.avatarUrl} alt={appt.doctor} data-ai-hint="person doctor" />
                          <AvatarFallback>{appt.doctor.substring(0,1)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{appt.doctor}</div>
                          <div className="text-xs text-muted-foreground">{appt.specialty}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-xs">{new Date(appt.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
                    <TableCell className="px-3 py-2.5 text-xs">{appt.time}</TableCell>
                    <TableCell className="text-right px-3 py-2.5">
                       <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteAppointment(appt.id)}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {appointments.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No upcoming appointments.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-3 pb-2 px-4">
            <div className="flex items-center space-x-2">
              <PillIcon className="h-5 w-5 text-primary" />
              <CardTitle className="text-md font-semibold">Medications History</CardTitle>
              <Badge variant="secondary" className="text-xs px-2 py-0.5">{medications.length}</Badge>
            </div>
             <div className="flex items-center space-x-1">
                <Dialog open={isAddMedicationDialogOpen} onOpenChange={setIsAddMedicationDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit3 className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogUITitle>Add New Medication</DialogUITitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="medName" className="text-right">Name</Label>
                            <Input id="medName" value={newMedicationInput} onChange={(e) => setNewMedicationInput(e.target.value)} className="col-span-3" />
                        </div>
                        </div>
                        <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button onClick={handleAddMedication}>Add</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button variant="default" size="icon" className="h-8 w-8" onClick={() => setIsAddMedicationDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
          </ShadcnCardHeader>
          <CardContent className="p-0 max-h-[250px] overflow-y-auto no-scrollbar">
            <Table>
              <TableBody>
                {medications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="px-3 py-2.5">
                      <div>
                          <div className="font-medium text-sm">{med.name}</div>
                          {med.reason && <div className="text-xs text-muted-foreground">{med.reason}</div>}
                        </div>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-xs">{med.amount}</TableCell>
                    <TableCell className="px-3 py-2.5 text-xs">{med.timing}</TableCell>
                     <TableCell className="text-right px-3 py-2.5">
                       <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteMedication(med.id)}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {medications.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No medications listed.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Bottom Row: Informational Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {informationalCardTitles.map((title) => (
          <Card key={title.toLowerCase().replace(/\s+/g, '-')} className="shadow-lg rounded-lg">
            <ShadcnCardHeader className="flex flex-row items-center justify-between pt-3 pb-2 px-4">
              <div>
                <CardTitle className="text-md font-semibold">{title}</CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit3 className="h-4 w-4" />
                {/* This edit button for informational cards is not functional for adding/deleting items in this iteration */}
                <span className="sr-only">Edit {title}</span>
              </Button>
            </ShadcnCardHeader>
            <CardContent className="p-3 pt-2 max-h-[150px] overflow-y-auto no-scrollbar">
              <p className="text-sm text-muted-foreground leading-relaxed">{LOREM_IPSUM_TEXT}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
