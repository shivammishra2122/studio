
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart } from 'recharts';
import { Droplet, HeartPulse, Activity, Thermometer, Scale, CalendarPlus, FilePlus2 } from 'lucide-react';
import type { HealthMetric, Appointment, Medication } from '@/lib/constants';
import { MOCK_APPOINTMENTS, MOCK_MEDICATIONS } from '@/lib/constants';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const keyIndicators: HealthMetric[] = [
  { name: 'Blood Glucose', value: '98', unit: 'mg/dL', trend: 'stable', icon: Droplet },
  { name: 'Heart Rate', value: '72', unit: 'bpm', trend: 'stable', icon: HeartPulse },
  { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', trend: 'stable', icon: Activity },
  { name: 'Body Temperature', value: '36.8', unit: '°C', trend: 'stable', icon: Thermometer },
  { name: 'Weight', value: '70', unit: 'kg', trend: 'down', icon: Scale },
];

const loremIpsumText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

// Data and config from health-data/page.tsx
const glucoseData = [
  { date: '2024-07-01', level: 95 },
  { date: '2024-07-02', level: 102 },
  { date: '2024-07-03', level: 98 },
  { date: '2024-07-04', level: 110 },
  { date: '2024-07-05', level: 105 },
  { date: '2024-07-06', level: 99 },
  { date: '2024-07-07', level: 108 },
];

const ecgData = [
  { time: '0s', value: 0.1 }, { time: '0.1s', value: 0.5 }, { time: '0.2s', value: -0.2 },
  { time: '0.3s', value: 1.0 }, { time: '0.4s', value: -0.3 }, { time: '0.5s', value: 0.2 },
  { time: '0.6s', value: 0.6 }, { time: '0.7s', value: -0.1 }, { time: '0.8s', value: 1.1 },
];

const ctScanReadings = [
  { organ: 'Lungs', finding: 'Clear' },
  { organ: 'Liver', finding: 'Normal' },
  { organ: 'Kidneys', finding: 'Slight calcification' },
];

const glucoseChartConfig = {
  level: {
    label: 'Glucose (mg/dL)',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const ecgChartConfig = {
  value: {
    label: 'ECG (mV)',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;


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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {keyIndicators.map((indicator) => (
          <Card key={indicator.name} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {indicator.name}
              </CardTitle>
              {indicator.icon && <indicator.icon className="h-5 w-5 text-primary" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {indicator.value} <span className="text-xs text-muted-foreground">{indicator.unit}</span>
              </div>
              {indicator.trend && (
                <p className={`text-xs ${indicator.trend === 'up' ? 'text-red-500' : indicator.trend === 'down' ? 'text-green-500' : 'text-muted-foreground'} mt-1`}>
                  {indicator.trend === 'up' ? '▲ Increased' : indicator.trend === 'down' ? '▼ Decreased' : '● Stable'}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Appointments Section */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              You have {appointments.length} upcoming appointment{appointments.length === 1 ? '' : 's'}.
            </CardDescription>
          </div>
          <Button>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Schedule New
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell className="font-medium">{appt.doctor}</TableCell>
                  <TableCell>{appt.specialty}</TableCell>
                  <TableCell>{new Date(appt.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                  <TableCell>{appt.time}</TableCell>
                  <TableCell className="hidden md:table-cell">{appt.location}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Details</Button>
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

      {/* Medications Section */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Medications</CardTitle>
            <CardDescription>
              You are currently taking {medications.length} medication{medications.length === 1 ? '' : 's'}.
            </CardDescription>
          </div>
          <Button>
            <FilePlus2 className="mr-2 h-4 w-4" />
            Add Medication
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead className="hidden md:table-cell">Reason</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medications.map((med) => (
                <TableRow key={med.id}>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>{med.frequency}</TableCell>
                  <TableCell className="hidden md:table-cell">{med.reason}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Details</Button>
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

      {/* Health Data Section with Tabs */}
      <Card className="shadow-lg col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Health Data Visualizations</CardTitle>
          <CardDescription>Toggle between different health charts and summaries.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="glucose">
            <TabsList className="grid w-full grid-cols-3 mb-4"> {/* Changed to grid-cols-3 */}
              <TabsTrigger value="glucose">Glucose Levels</TabsTrigger>
              <TabsTrigger value="ecg">ECG Sample</TabsTrigger>
              <TabsTrigger value="ct-scan">CT Scan Summary</TabsTrigger> {/* New Trigger */}
            </TabsList>
            <TabsContent value="glucose">
              <Card>
                <CardHeader>
                  <CardTitle>Glucose Levels Over Time</CardTitle>
                </CardHeader>
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
                <CardHeader>
                  <CardTitle>Electrocardiogram (ECG) Sample</CardTitle>
                </CardHeader>
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
            <TabsContent value="ct-scan"> {/* New Content for CT Scan */}
              <Card>
                <CardHeader>
                  <CardTitle>CT Scan Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {ctScanReadings.map((reading, index) => (
                      <li key={index} className="flex justify-between p-2 rounded-md bg-secondary/50">
                        <span className="font-medium text-secondary-foreground">{reading.organ}:</span>
                        <span className="text-muted-foreground">{reading.finding}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Note: This is a simplified summary. Always consult your doctor for detailed analysis.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={`lorem-box-${item}`} className="shadow-lg">
            <CardHeader>
              <CardTitle>Informational Box {item}</CardTitle>
              <CardDescription>Additional health insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{loremIpsumText}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Image 
                src="https://placehold.co/100x100.png" 
                alt="Fitness Activity" 
                width={100} 
                height={100} 
                className="rounded-lg"
                data-ai-hint="fitness activity" 
              />
              <div>
                <h3 className="font-semibold">Morning Run</h3>
                <p className="text-sm text-muted-foreground">Completed 5km in 30 minutes.</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Health Tip of the Day</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="flex items-center space-x-4">
              <Image 
                src="https://placehold.co/100x100.png" 
                alt="Healthy Food" 
                width={100} 
                height={100} 
                className="rounded-lg"
                data-ai-hint="healthy food"
              />
              <div>
                <h3 className="font-semibold">Stay Hydrated</h3>
                <p className="text-sm text-muted-foreground">Remember to drink at least 8 glasses of water today for optimal health and energy levels.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
