
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart } from 'recharts';
import { 
  Droplet, HeartPulse, Activity, Thermometer, Scale, Edit3, Clock, Pill as PillIcon, Plus, MoreVertical
} from 'lucide-react';
import type { HealthMetric, Appointment, Medication } from '@/lib/constants';
import { MOCK_APPOINTMENTS, MOCK_MEDICATIONS } from '@/lib/constants';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from '@/components/ui/badge';

const keyIndicators: HealthMetric[] = [
  { name: 'Blood Glucose', value: '98', unit: 'mg/dL', trend: 'stable', icon: Droplet },
  { name: 'Heart Rate', value: '72', unit: 'bpm', trend: 'stable', icon: HeartPulse },
  { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', trend: 'stable', icon: Activity },
  { name: 'Body Temperature', value: '36.8', unit: '°C', trend: 'stable', icon: Thermometer },
  { name: 'Weight', value: '70', unit: 'kg', trend: 'down', icon: Scale },
];

const loremIpsumText: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

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

export default function DashboardPage(): JSX.Element {
  const appointments: Appointment[] = MOCK_APPOINTMENTS;
  const medications: Medication[] = MOCK_MEDICATIONS;

  return (
    <div className="flex flex-1 flex-col p-3 md:p-4 space-y-3">
      
      {/* Container for Health Data Visualizations and Vitals */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Health Data Visualizations Card (Left Side) */}
        <Card className="shadow-lg w-full md:w-[65%]">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-2 px-3">
            <CardTitle className="text-base font-semibold">Health Data Visualizations</CardTitle>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Edit3 className="h-3.5 w-3.5" />
              <span className="sr-only">Edit Visualizations</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-1 px-2 pb-2">
            <Tabs defaultValue="glucose">
              <TabsList className="grid w-full grid-cols-3 mb-1.5 h-9">
                <TabsTrigger value="glucose" className="text-xs px-2 py-1">Glucose</TabsTrigger>
                <TabsTrigger value="ecg" className="text-xs px-2 py-1">ECG</TabsTrigger>
                <TabsTrigger value="ct-scan" className="text-xs px-2 py-1">CT Scan</TabsTrigger>
              </TabsList>
              <TabsContent value="glucose">
                <Card>
                  <CardContent className="p-1.5 max-h-[170px] overflow-y-auto">
                    <ChartContainer config={glucoseChartConfig} className="h-[160px] w-full">
                      <RechartsLineChart data={glucoseData} margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={6} fontSize={9} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={6} fontSize={9} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="level" type="monotone" stroke="var(--color-level)" strokeWidth={1.5} dot={{r: 2}} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ecg">
                <Card>
                  <CardContent className="p-1.5 max-h-[170px] overflow-y-auto">
                    <ChartContainer config={ecgChartConfig} className="h-[160px] w-full">
                      <RechartsLineChart data={ecgData} margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={6} fontSize={9} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={6} fontSize={9} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={1.5} dot={false} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ct-scan">
                <Card>
                  <CardContent className="p-2 max-h-[170px] overflow-y-auto space-y-1">
                    <ul className="space-y-1">
                      {ctScanReadings.map((reading, index) => (
                        <li key={index} className="flex justify-between p-1 rounded-md bg-secondary/50 text-xs">
                          <span className="font-medium text-secondary-foreground">{reading.organ}:</span>
                          <span className="text-muted-foreground">{reading.finding}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-1.5 text-xs text-muted-foreground">Note: Simplified summary. Consult doctor for details.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Vitals Card (Right Side) */}
        <div className="w-full md:w-[35%]">
          <Card className="shadow-md h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-2 px-3">
              <CardTitle className="text-base font-semibold">Vitals</CardTitle>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Vitals</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-1.5 pt-1 px-2 pb-2 max-h-[calc(170px+4rem)] overflow-y-auto">
              {keyIndicators.map((indicator) => (
                <div key={indicator.name} className="flex items-center justify-between p-1.5 rounded-lg bg-muted/50">
                  <div className="flex items-center">
                    {indicator.icon && <indicator.icon className="h-4 w-4 text-primary mr-1.5" />}
                    <span className="text-xs font-medium text-foreground">{indicator.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-foreground">{indicator.value}</span>
                    <span className="text-xs text-muted-foreground ml-0.5">{indicator.unit}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
            <div className="flex items-center space-x-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Upcoming Appointments</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{appointments.length}</Badge>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-7 w-7 mr-0.5">
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Appointments</span>
              </Button>
              <Button variant="default" size="icon" className="h-7 w-7">
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only">Schedule New Appointment</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 max-h-[180px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%] px-2 py-1.5 text-xs">Doctor</TableHead>
                  <TableHead className="px-2 py-1.5 text-xs">Date</TableHead>
                  <TableHead className="px-2 py-1.5 text-xs">Time</TableHead>
                  <TableHead className="text-right px-2 py-1.5 text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell className="px-2 py-1">
                      <div className="flex items-center space-x-1.5">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={appt.avatarUrl} alt={appt.doctor} data-ai-hint="person doctor" />
                          <AvatarFallback className="text-xs">{appt.doctor.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-xs">{appt.doctor}</div>
                          <div className="text-xs text-muted-foreground">{appt.specialty}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-2 py-1 text-xs">{new Date(appt.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
                    <TableCell className="px-2 py-1 text-xs">{appt.time}</TableCell>
                    <TableCell className="text-right px-2 py-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-3.5 w-3.5" />
                        <span className="sr-only">More options</span>
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

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
            <div className="flex items-center space-x-1.5">
              <PillIcon className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Medications History</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{medications.length}</Badge>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-7 w-7 mr-0.5">
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Medications</span>
              </Button>
              <Button variant="default" size="icon" className="h-7 w-7">
                <Plus className="h-3.5 w-3.5" />
                <span className="sr-only">Add Medication</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 max-h-[180px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%] px-2 py-1.5 text-xs">Medicines</TableHead>
                  <TableHead className="px-2 py-1.5 text-xs">Amount</TableHead>
                  <TableHead className="px-2 py-1.5 text-xs">Time</TableHead>
                  <TableHead className="text-right px-2 py-1.5 text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="px-2 py-1">
                      <div>
                          <div className="font-medium text-xs">{med.name}</div>
                          {med.reason && <div className="text-xs text-muted-foreground">{med.reason}</div>}
                        </div>
                    </TableCell>
                    <TableCell className="px-2 py-1 text-xs">{med.amount}</TableCell>
                    <TableCell className="px-2 py-1 text-xs">{med.timing}</TableCell>
                    <TableCell className="text-right px-2 py-1">
                      <Checkbox checked={med.taken} aria-label={med.taken ? 'Taken' : 'Not taken'} className="h-3 w-3" />
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
      
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {informationalCardTitles.map((title) => (
          <Card key={title.toLowerCase().replace(/\s+/g, '-')} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
              <div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="text-xs">Additional health insights</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit {title}</span>
              </Button>
            </CardHeader>
            <CardContent className="p-2 max-h-[80px] overflow-y-auto">
              <p className="text-xs text-muted-foreground">{loremIpsumText}</p>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
