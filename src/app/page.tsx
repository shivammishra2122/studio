
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart } from 'recharts';
import { Droplet, HeartPulse, Activity, Thermometer, Scale, Edit3, Clock, Pill as PillIcon, Plus, MoreVertical } from 'lucide-react';
import type { HealthMetric, Appointment, Medication } from '@/lib/constants';
import { MOCK_APPOINTMENTS, MOCK_MEDICATIONS } from '@/lib/constants';
import Image from 'next/image';
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

const loremIpsumText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

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

const glucoseChartConfig = { level: { label: 'Glucose (mg/dL)', color: 'hsl(var(--chart-1))' } } satisfies ChartConfig;
const ecgChartConfig = { value: { label: 'ECG (mV)', color: 'hsl(var(--chart-2))' } } satisfies ChartConfig;

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
    <div className="flex flex-1 flex-col p-4 md:p-6 space-y-6">
      <PageHeader title="Dashboard" description="Overview of your current health status." />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Welcome Back!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Here's a summary of your health. Stay proactive and healthy!</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Health Data Visualizations</CardTitle>
          <CardDescription>Charts and key health indicators.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-[65%]">
            <Tabs defaultValue="glucose">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="glucose">Glucose Levels</TabsTrigger>
                <TabsTrigger value="ecg">ECG Sample</TabsTrigger>
                <TabsTrigger value="ct-scan">CT Scan Summary</TabsTrigger>
              </TabsList>
              <TabsContent value="glucose">
                <Card>
                  <CardHeader><CardTitle>Glucose Levels Over Time</CardTitle></CardHeader>
                  <CardContent>
                    <ChartContainer config={glucoseChartConfig} className="h-[300px] w-full">
                      <RechartsLineChart data={glucoseData} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="level" type="monotone" stroke="var(--color-level)" strokeWidth={2} dot={true} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ecg">
                <Card>
                  <CardHeader><CardTitle>Electrocardiogram (ECG) Sample</CardTitle></CardHeader>
                  <CardContent>
                    <ChartContainer config={ecgChartConfig} className="h-[300px] w-full">
                      <RechartsLineChart data={ecgData} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} dot={false} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ct-scan">
                <Card>
                  <CardHeader><CardTitle>CT Scan Summary</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {ctScanReadings.map((reading, index) => (
                        <li key={index} className="flex justify-between p-2 rounded-md bg-secondary/50">
                          <span className="font-medium text-secondary-foreground">{reading.organ}:</span>
                          <span className="text-muted-foreground">{reading.finding}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-muted-foreground">Note: This is a simplified summary. Always consult your doctor for detailed analysis.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div className="w-full md:w-[35%] md:pl-4">
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Vitals</CardTitle>
                <Button variant="ghost" size="sm"><Edit3 className="h-4 w-4 mr-1" /> Edit</Button>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                {keyIndicators.map((indicator) => (
                  <div key={indicator.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center">
                      {indicator.icon && <indicator.icon className="h-6 w-6 text-primary mr-3" />}
                      <span className="text-sm font-medium text-foreground">{indicator.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-foreground">{indicator.value}</span>
                      <span className="text-xs text-muted-foreground ml-1">{indicator.unit}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
              <Badge variant="secondary" className="text-sm">{appointments.length}</Badge>
            </div>
            <Button variant="default" size="icon">
              <Plus className="h-5 w-5" />
              <span className="sr-only">Schedule New Appointment</span>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={appt.avatarUrl} alt={appt.doctor} data-ai-hint="person doctor" />
                          <AvatarFallback>{appt.doctor.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{appt.doctor}</div>
                          <div className="text-xs text-muted-foreground">{appt.specialty}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(appt.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {appointments.length === 0 && (
              <p className="py-10 text-center text-muted-foreground">No upcoming appointments.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <PillIcon className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg">Your Medications</CardTitle>
              <Badge variant="secondary" className="text-sm">{medications.length}</Badge>
            </div>
            <Button variant="default" size="icon">
              <Plus className="h-5 w-5" />
              <span className="sr-only">Add Medication</span>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Medicines</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell>
                      <div>
                          <div className="font-medium">{med.name}</div>
                          {med.reason && <div className="text-xs text-muted-foreground">{med.reason}</div>}
                        </div>
                    </TableCell>
                    <TableCell>{med.amount}</TableCell>
                    <TableCell>{med.timing}</TableCell>
                    <TableCell className="text-right">
                      <Checkbox checked={med.taken} aria-label={med.taken ? 'Taken' : 'Not taken'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {medications.length === 0 && (
              <p className="py-10 text-center text-muted-foreground">No medications listed.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {informationalCardTitles.map((title) => (
          <Card key={title.toLowerCase().replace(/\s+/g, '-')} className="shadow-lg">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>Additional health insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{loremIpsumText}</p>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}

    