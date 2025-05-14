
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart } from 'recharts';
import { Droplet, Activity, Thermometer, Edit3, Clock, Pill as PillIcon, Plus, MoreVertical } from 'lucide-react';
import type { HealthMetric, Appointment, Medication } from '@/lib/constants';
import { MOCK_APPOINTMENTS, MOCK_MEDICATIONS } from '@/lib/constants';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from '@/components/ui/badge';

const keyIndicators: HealthMetric[] = [
  { name: 'Heart Rate', value: '72', unit: 'bpm', icon: Droplet },
  { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity },
  { name: 'Body Temperature', value: '36.8', unit: '°C', icon: Thermometer },
];

const loremIpsumText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."; // Shortened

const glucoseData = [
  { date: '2024-07-01', level: 95 }, { date: '2024-07-02', level: 102 }, { date: '2024-07-03', level: 98 },
  { date: '2024-07-04', level: 110 }, { date: '2024-07-05', level: 105 }, { date: '2024-07-06', level: 99 },
  { date: '2024-07-07', level: 108 },
];

const ecgData = [
  { time: '0s', value: 0.1 }, { time: '0.1s', value: 0.5 }, { time: '0.2s', value: -0.2 },
  { time: '0.3s', value: 1.0 }, { time: '0.4s', value: -0.3 }, { time: '0.5s', value: 0.2 },
  { time: '0.6s', value: 0.6 }, { time: '0.7s', value: -0.1 }, { time: '0.8s', value: 1.1 },
];

const ctScanReadings = [
  { organ: 'Lungs', finding: 'Clear' }, { organ: 'Liver', finding: 'Normal' }, { organ: 'Kidneys', finding: 'Slight calcification' },
];

const glucoseChartConfig: ChartConfig = { level: { label: 'Glucose (mg/dL)', color: 'hsl(var(--chart-1))' } };
const ecgChartConfig: ChartConfig = { value: { label: 'ECG (mV)', color: 'hsl(var(--chart-2))' } };


const informationalCardTitles = [
  "Allergies",
  "Clinical notes",
  "Radiology",
  "Encounter notes",
  "Clinical reminder",
  "Report"
];

export default function DashboardPage() {
  const appointments: Appointment[] = MOCK_APPOINTMENTS;
  const medications: Medication[] = MOCK_MEDICATIONS;

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6 space-y-4"> {/* Reduced space-y */}
      {/* PageHeader removed */}
      
      {/* Container for Health Data Visualizations and Vitals */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Health Data Visualizations Card (Left Side) */}
        <Card className="shadow-lg w-full md:w-[65%]">
          <CardHeader>
            <CardTitle>Health Data Visualizations</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="glucose">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="glucose">Glucose Levels</TabsTrigger>
                <TabsTrigger value="ecg">ECG Sample</TabsTrigger>
                <TabsTrigger value="ct-scan">CT Scan Summary</TabsTrigger>
              </TabsList>
              <TabsContent value="glucose">
                <Card>
                  <CardContent className="pt-4"> {/* Reduced top padding */}
                    <ChartContainer config={glucoseChartConfig} className="h-[250px] w-full"> {/* Reduced height */}
                      <RechartsLineChart data={glucoseData} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="level" type="monotone" stroke="var(--color-level)" strokeWidth={2} dot={true} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ecg">
                <Card>
                  <CardContent className="pt-4"> {/* Reduced top padding */}
                    <ChartContainer config={ecgChartConfig} className="h-[250px] w-full"> {/* Reduced height */}
                      <RechartsLineChart data={ecgData} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={10} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} dot={false} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ct-scan">
                <Card>
                  <CardContent className="pt-4"> {/* Reduced top padding */}
                    <ul className="space-y-1 text-sm"> {/* Reduced space and font */}
                      {ctScanReadings.map((reading, index) => (
                        <li key={index} className="flex justify-between p-1.5 rounded-md bg-secondary/50"> {/* Reduced padding */}
                          <span className="font-medium text-secondary-foreground">{reading.organ}:</span>
                          <span className="text-muted-foreground">{reading.finding}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-muted-foreground">Note: This is a simplified summary. Always consult your doctor for detailed analysis.</p> {/* Reduced margin and font */}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Vitals Card (Right Side) */}
        <div className="w-full md:w-[35%]">
          <Card className="shadow-md h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4"> {/* Reduced padding */}
              <CardTitle className="text-base font-semibold">Vitals</CardTitle> {/* Reduced font size */}
              <Button variant="ghost" size="sm"><Edit3 className="h-4 w-4 mr-1" /> Edit</Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-2"> {/* Reduced space and padding */}
              {keyIndicators.map((indicator) => (
                <div key={indicator.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/50"> {/* Reduced padding */}
                  <div className="flex items-center">
                    {indicator.icon && <indicator.icon className="h-5 w-5 text-primary mr-2" />} {/* Reduced size and margin */}
                    <span className="text-xs font-medium text-foreground">{indicator.name}</span> {/* Reduced font size */}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground">{indicator.value}</span> {/* Reduced font size */}
                    <span className="text-xs text-muted-foreground ml-1">{indicator.unit}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2"> {/* Reduced gap */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pt-4 pb-2"> {/* Reduced padding */}
            <div className="flex items-center space-x-2"> {/* Reduced space */}
              <Clock className="h-5 w-5 text-primary" /> {/* Reduced size */}
              <CardTitle className="text-base">Upcoming Appointments</CardTitle> {/* Reduced font size */}
              <Badge variant="secondary" className="text-xs">{appointments.length}</Badge> {/* Reduced font size */}
            </div>
            <Button variant="default" size="icon" className="h-8 w-8"> {/* Reduced size */}
              <Plus className="h-4 w-4" /> {/* Reduced size */}
              <span className="sr-only">Schedule New Appointment</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-2 pb-4"> {/* Reduced padding */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%] h-10 text-xs">Doctor</TableHead> {/* Reduced height and font */}
                  <TableHead className="h-10 text-xs">Date</TableHead>
                  <TableHead className="h-10 text-xs">Time</TableHead>
                  <TableHead className="text-right h-10 text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell className="p-2"> {/* Reduced padding */}
                      <div className="flex items-center space-x-2"> {/* Reduced space */}
                        <Avatar className="h-8 w-8"> {/* Reduced size */}
                          <AvatarImage src={appt.avatarUrl} alt={appt.doctor} data-ai-hint="person doctor" />
                          <AvatarFallback className="text-xs">{appt.doctor.substring(0, 2).toUpperCase()}</AvatarFallback> {/* Reduced font size */}
                        </Avatar>
                        <div>
                          <div className="font-medium text-xs">{appt.doctor}</div> {/* Reduced font size */}
                          <div className="text-xs text-muted-foreground">{appt.specialty}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 text-xs">{new Date(appt.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell> {/* Reduced padding and font */}
                    <TableCell className="p-2 text-xs">{appt.time}</TableCell> {/* Reduced padding and font */}
                    <TableCell className="text-right p-2"> {/* Reduced padding */}
                      <Button variant="ghost" size="icon" className="h-7 w-7"> {/* Reduced size */}
                        <MoreVertical className="h-4 w-4" /> {/* Reduced size */}
                        <span className="sr-only">More options</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {appointments.length === 0 && (
              <p className="py-6 text-center text-xs text-muted-foreground">No upcoming appointments.</p> {/* Reduced padding and font */}
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pt-4 pb-2"> {/* Reduced padding */}
            <div className="flex items-center space-x-2"> {/* Reduced space */}
              <PillIcon className="h-5 w-5 text-primary" /> {/* Reduced size */}
              <CardTitle className="text-base">Your Medications</CardTitle> {/* Reduced font size */}
              <Badge variant="secondary" className="text-xs">{medications.length}</Badge> {/* Reduced font size */}
            </div>
            <Button variant="default" size="icon" className="h-8 w-8"> {/* Reduced size */}
              <Plus className="h-4 w-4" /> {/* Reduced size */}
              <span className="sr-only">Add Medication</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-2 pb-4"> {/* Reduced padding */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%] h-10 text-xs">Medicines</TableHead> {/* Reduced height and font */}
                  <TableHead className="h-10 text-xs">Amount</TableHead>
                  <TableHead className="h-10 text-xs">Time</TableHead>
                  <TableHead className="text-right h-10 text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="p-2"> {/* Reduced padding */}
                      <div>
                          <div className="font-medium text-xs">{med.name}</div> {/* Reduced font size */}
                          {med.reason && <div className="text-xs text-muted-foreground">{med.reason}</div>}
                        </div>
                    </TableCell>
                    <TableCell className="p-2 text-xs">{med.amount}</TableCell> {/* Reduced padding and font */}
                    <TableCell className="p-2 text-xs">{med.timing}</TableCell> {/* Reduced padding and font */}
                    <TableCell className="text-right p-2"> {/* Reduced padding */}
                      <Checkbox checked={med.taken} aria-label={med.taken ? 'Taken' : 'Not taken'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {medications.length === 0 && (
              <p className="py-6 text-center text-xs text-muted-foreground">No medications listed.</p> {/* Reduced padding and font */}
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> {/* Reduced gap */}
        {informationalCardTitles.map((title) => (
          <Card key={title.toLowerCase().replace(/\s+/g, '-')} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between p-4"> {/* Adjusted padding & added flex for button */}
              <div>
                <CardTitle className="text-sm">{title}</CardTitle> {/* Reduced font size */}
                <CardDescription className="text-xs">Additional health insights</CardDescription> {/* Reduced font size */}
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7"> {/* Reduced size */}
                <Edit3 className="h-4 w-4" />
                <span className="sr-only">Edit {title}</span>
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0"> {/* Adjusted padding */}
              <p className="text-xs text-muted-foreground">{loremIpsumText}</p> {/* Reduced font size */}
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}

    