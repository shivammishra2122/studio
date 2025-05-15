
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader as ShadcnCardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader as ShadcnTableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart } from 'recharts';
import { 
  Droplet, HeartPulse, Activity, Thermometer, Scale, Edit3, Clock, Pill as PillIcon, Plus, MoreVertical,
  Trash2 // Added Trash2 for delete functionality
} from 'lucide-react';
import type { HealthMetric, Appointment, Medication } from '@/lib/constants';
import { MOCK_APPOINTMENTS, MOCK_MEDICATIONS, LOREM_IPSUM_TEXT } from '@/lib/constants'; // LOREM_IPSUM_TEXT imported

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
  "Radiology"
];


export default function DashboardPage(): JSX.Element {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS);
  
  // Dialog states for appointments
  const [isAddAppointmentDialogOpen, setIsAddAppointmentDialogOpen] = useState(false);
  const [newAppointmentInput, setNewAppointmentInput] = useState('');

  // Dialog states for medications
  const [isAddMedicationDialogOpen, setIsAddMedicationDialogOpen] = useState(false);
  const [newMedicationInput, setNewMedicationInput] = useState('');

  const handleAddAppointment = () => {
    if (!newAppointmentInput.trim()) return;
    const newAppt: Appointment = {
      id: Date.now().toString(),
      doctor: newAppointmentInput,
      specialty: 'Specialty', 
      date: new Date().toISOString().split('T')[0], 
      time: 'N/A', 
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
      reason: 'General',
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
    <div className="flex flex-1 flex-col p-3 space-y-3 bg-background"> {/* Reduced padding and space */}
      
      {/* Top Row: Charts/Vitals */}
      <div className="flex flex-col md:flex-row gap-3"> {/* Reduced gap */}
        {/* Health Data Visualizations Card (Charts ONLY) */}
        <Card className="shadow-lg w-full md:w-[65%] rounded-lg">
          <CardContent className="pt-2 px-2 pb-2"> {/* Reduced padding */}
            <Tabs defaultValue="glucose">
              <TabsList className="grid w-full grid-cols-3 mb-2 h-8"> {/* Reduced height and margin */}
                <TabsTrigger value="glucose" className="text-xs px-2 py-1">Glucose</TabsTrigger> {/* Reduced font size and padding */}
                <TabsTrigger value="ecg" className="text-xs px-2 py-1">ECG</TabsTrigger> {/* Reduced font size and padding */}
                <TabsTrigger value="ct-scan" className="text-xs px-2 py-1">CT Scan</TabsTrigger> {/* Reduced font size and padding */}
              </TabsList>
              <TabsContent value="glucose">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-1.5 max-h-[150px] overflow-y-auto no-scrollbar"> {/* Reduced padding and max-height */}
                    <ChartContainer config={glucoseChartConfig} className="h-[140px] w-full"> {/* Reduced height */}
                      <RechartsLineChart data={glucoseData} margin={{ left: 0, right: 5, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={4} fontSize={9} /> {/* Reduced font size and margin */}
                        <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={9} domain={[0, 120]} /> {/* Reduced font size and margin */}
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="level" type="monotone" stroke="var(--color-level)" strokeWidth={1.5} dot={{r: 2}} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ecg">
                 <Card className="border-0 shadow-none">
                  <CardContent className="p-1.5 max-h-[150px] overflow-y-auto no-scrollbar"> {/* Reduced padding and max-height */}
                    <ChartContainer config={ecgChartConfig} className="h-[140px] w-full"> {/* Reduced height */}
                      <RechartsLineChart data={ecgData} margin={{ left: 0, right: 5, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={4} fontSize={9} /> {/* Reduced font size and margin */}
                        <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={9} /> {/* Reduced font size and margin */}
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={1.5} dot={false} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ct-scan">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-1.5 max-h-[150px] overflow-y-auto no-scrollbar space-y-0.5"> {/* Reduced padding, max-height and space */}
                    <ul className="space-y-0.5"> {/* Reduced space */}
                      {ctScanReadings.map((reading, index) => (
                        <li key={index} className="flex justify-between p-1 rounded-md bg-muted/70 text-xs"> {/* Reduced padding */}
                          <span className="font-medium text-foreground">{reading.organ}:</span>
                          <span className="text-muted-foreground">{reading.finding}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-1 text-xs text-muted-foreground">Note: Simplified. Consult doctor for details.</p> {/* Reduced margin */}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Vitals Card */}
        <div className="w-full md:w-[35%]">
          <Card className="shadow-lg h-full rounded-lg">
            <CardContent className="space-y-1.5 p-2 max-h-[calc(150px+2rem)] overflow-y-auto no-scrollbar"> {/* Reduced padding, space, and max-height */}
              {keyIndicators.map((indicator) => (
                <div key={indicator.name} className="flex items-center justify-between p-1.5 rounded-lg bg-muted/70"> {/* Reduced padding */}
                  <div className="flex items-center">
                    {indicator.icon && <indicator.icon className="h-4 w-4 text-primary mr-1.5" />} {/* Reduced icon size and margin */}
                    <span className="text-xs font-medium text-foreground">{indicator.name}</span> {/* Reduced font size */}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-foreground">{indicator.value}</span> {/* Reduced font size */}
                    <span className="text-xs text-muted-foreground ml-0.5">{indicator.unit}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Middle Row: Appointments & Medications */}
      <div className="grid gap-3 md:grid-cols-2"> {/* Reduced gap */}
        <Card className="shadow-lg rounded-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-2"> {/* Reduced padding */}
            <div className="flex items-center space-x-1.5"> {/* Reduced space */}
              <Clock className="h-4 w-4 text-primary" /> {/* Reduced icon size */}
              <CardTitle className="text-sm font-semibold">Upcoming Appointments</CardTitle> {/* Reduced font size */}
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{appointments.length}</Badge>
            </div>
            <div className="flex items-center space-x-1">
              <Dialog open={isAddAppointmentDialogOpen} onOpenChange={setIsAddAppointmentDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7"> {/* Reduced button size */}
                    <Edit3 className="h-3.5 w-3.5" /> {/* Reduced icon size */}
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
               <Button variant="default" size="icon" className="h-7 w-7" onClick={() => setIsAddAppointmentDialogOpen(true)}> {/* Reduced button size */}
                <Plus className="h-3.5 w-3.5" /> {/* Reduced icon size */}
              </Button>
            </div>
          </ShadcnCardHeader>
          <CardContent className="p-0 max-h-[150px] overflow-y-auto no-scrollbar"> {/* Reduced max-height */}
            <Table>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell className="px-1.5 py-1"> {/* Reduced padding */}
                      <div className="flex items-center space-x-1.5"> {/* Reduced space */}
                        <Avatar className="h-7 w-7"> {/* Reduced avatar size */}
                          <AvatarImage src={appt.avatarUrl} alt={appt.doctor} data-ai-hint="person doctor" />
                          <AvatarFallback>{appt.doctor.substring(0,1)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-xs">{appt.doctor}</div>
                          <div className="text-xs text-muted-foreground">{appt.specialty}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-1.5 py-1 text-xs">{new Date(appt.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell> {/* Reduced padding */}
                    <TableCell className="px-1.5 py-1 text-xs">{appt.time}</TableCell> {/* Reduced padding */}
                    <TableCell className="text-right px-1.5 py-1"> {/* Reduced padding */}
                       <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteAppointment(appt.id)}> {/* Reduced button size */}
                        <Trash2 className="h-3.5 w-3.5" /> {/* Changed to Trash2, reduced icon size */}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {appointments.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">No upcoming appointments.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-2"> {/* Reduced padding */}
            <div className="flex items-center space-x-1.5"> {/* Reduced space */}
              <PillIcon className="h-4 w-4 text-primary" /> {/* Reduced icon size */}
              <CardTitle className="text-sm font-semibold">Medications History</CardTitle> {/* Reduced font size */}
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{medications.length}</Badge>
            </div>
             <div className="flex items-center space-x-1">
                <Dialog open={isAddMedicationDialogOpen} onOpenChange={setIsAddMedicationDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7"> {/* Reduced button size */}
                            <Edit3 className="h-3.5 w-3.5" /> {/* Reduced icon size */}
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
                <Button variant="default" size="icon" className="h-7 w-7" onClick={() => setIsAddMedicationDialogOpen(true)}> {/* Reduced button size */}
                    <Plus className="h-3.5 w-3.5" /> {/* Reduced icon size */}
                </Button>
            </div>
          </ShadcnCardHeader>
          <CardContent className="p-0 max-h-[150px] overflow-y-auto no-scrollbar"> {/* Reduced max-height */}
            <Table>
              <TableBody>
                {medications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="px-1.5 py-1"> {/* Reduced padding */}
                      <div>
                          <div className="font-medium text-xs">{med.name}</div>
                          {med.reason && <div className="text-xs text-muted-foreground">{med.reason}</div>}
                        </div>
                    </TableCell>
                    <TableCell className="px-1.5 py-1 text-xs">{med.amount}</TableCell> {/* Reduced padding */}
                    <TableCell className="px-1.5 py-1 text-xs">{med.timing}</TableCell> {/* Reduced padding */}
                     <TableCell className="text-right px-1.5 py-1"> {/* Reduced padding */}
                       <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteMedication(med.id)}> {/* Reduced button size */}
                        <Trash2 className="h-3.5 w-3.5" /> {/* Changed to Trash2, reduced icon size */}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {medications.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">No medications listed.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Bottom Row: Informational Cards */}
      <div className="grid gap-3 md:grid-cols-3"> {/* Reduced gap */}
        {informationalCardTitles.map((title) => (
          <Card key={title.toLowerCase().replace(/\s+/g, '-')} className="shadow-lg rounded-lg">
            <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-2"> {/* Reduced padding */}
              <div>
                <CardTitle className="text-sm font-semibold">{title}</CardTitle> {/* Reduced font size */}
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7"> {/* Reduced button size */}
                <Edit3 className="h-3.5 w-3.5" /> {/* Reduced icon size */}
                <span className="sr-only">Edit {title}</span>
              </Button>
            </ShadcnCardHeader>
            <CardContent className="p-1.5 pt-1 max-h-[100px] overflow-y-auto no-scrollbar"> {/* Reduced padding and max-height */}
              <p className="text-xs text-muted-foreground leading-normal">{LOREM_IPSUM_TEXT}</p> {/* Reduced font size and leading */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

