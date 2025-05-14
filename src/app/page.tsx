
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
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


const loremIpsumText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."; 

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
    <div className="flex flex-1 flex-col px-4 py-2 space-y-2">
      
      <Card className="shadow-lg">
        <CardHeader className="p-4"> 
          <CardTitle className="text-lg">Health Data Visualizations</CardTitle> 
          <CardDescription className="text-xs">Charts and key health indicators.</CardDescription> 
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 p-4"> 
          <div className="w-full md:w-[65%]">
            <Tabs defaultValue="glucose">
              <TabsList className="grid w-full grid-cols-3 mb-2 h-9"> 
                <TabsTrigger value="glucose" className="text-xs">Glucose Levels</TabsTrigger> 
                <TabsTrigger value="ecg" className="text-xs">ECG Sample</TabsTrigger> 
                <TabsTrigger value="ct-scan" className="text-xs">CT Scan Summary</TabsTrigger> 
              </TabsList>
              <TabsContent value="glucose">
                <Card>
                  <CardHeader className="p-3"><CardTitle className="text-base">Glucose Levels Over Time</CardTitle></CardHeader> 
                  <CardContent className="p-2"> 
                    <ChartContainer config={glucoseChartConfig} className="h-[200px] w-full"> 
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
                  <CardHeader className="p-3"><CardTitle className="text-base">Electrocardiogram (ECG) Sample</CardTitle></CardHeader> 
                  <CardContent className="p-2"> 
                    <ChartContainer config={ecgChartConfig} className="h-[200px] w-full"> 
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
                  <CardHeader className="p-3"><CardTitle className="text-base">CT Scan Summary</CardTitle></CardHeader> 
                  <CardContent className="p-3"> 
                    <ul className="space-y-1 text-xs"> 
                      {ctScanReadings.map((reading, index) => (
                        <li key={index} className="flex justify-between p-1.5 rounded-md bg-secondary/50"> 
                          <span className="font-medium text-secondary-foreground">{reading.organ}:</span>
                          <span className="text-muted-foreground">{reading.finding}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-muted-foreground">Note: This is a simplified summary. Always consult your doctor for detailed analysis.</p> 
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div className="w-full md:w-[35%] md:pl-2"> 
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-1 p-3"> 
                <CardTitle className="text-base font-semibold">Vitals</CardTitle> 
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs"><Edit3 className="h-3.5 w-3.5 mr-1" /> Edit</Button> 
              </CardHeader>
              <CardContent className="space-y-2 pt-1 p-3"> 
                {keyIndicators.map((indicator) => (
                  <div key={indicator.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/50"> 
                    <div className="flex items-center">
                      {indicator.icon && <indicator.icon className="h-5 w-5 text-primary mr-2" />} 
                      <span className="text-xs font-medium text-foreground">{indicator.name}</span> 
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-foreground">{indicator.value}</span> 
                      <span className="text-xs text-muted-foreground ml-1">{indicator.unit}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2"> 
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between p-3"> 
            <div className="flex items-center space-x-2"> 
              <Clock className="h-5 w-5 text-primary" /> 
              <CardTitle className="text-base">Upcoming Appointments</CardTitle> 
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{appointments.length}</Badge> 
            </div>
            <Button variant="default" size="icon" className="h-7 w-7"> 
              <Plus className="h-4 w-4" /> 
              <span className="sr-only">Schedule New Appointment</span>
            </Button>
          </CardHeader>
          <CardContent className="p-3"> 
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%] text-xs h-10 px-2">Doctor</TableHead> 
                  <TableHead className="text-xs h-10 px-2">Date</TableHead> 
                  <TableHead className="text-xs h-10 px-2">Time</TableHead> 
                  <TableHead className="text-right text-xs h-10 px-2">Actions</TableHead> 
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell className="p-2"> 
                      <div className="flex items-center space-x-2"> 
                        <Avatar className="h-7 w-7"> 
                          <AvatarImage src={appt.avatarUrl} alt={appt.doctor} data-ai-hint="person doctor" />
                          <AvatarFallback className="text-xs">{appt.doctor.substring(0, 2).toUpperCase()}</AvatarFallback> 
                        </Avatar>
                        <div>
                          <div className="font-medium text-xs">{appt.doctor}</div> 
                          <div className="text-xs text-muted-foreground">{appt.specialty}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs p-2">{new Date(appt.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell> 
                    <TableCell className="text-xs p-2">{appt.time}</TableCell> 
                    <TableCell className="text-right p-2"> 
                      <Button variant="ghost" size="icon" className="h-7 w-7"> 
                        <MoreVertical className="h-4 w-4" /> 
                        <span className="sr-only">More options</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {appointments.length === 0 && (
              <p className="py-6 text-center text-xs text-muted-foreground">No upcoming appointments.</p> 
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between p-3"> 
            <div className="flex items-center space-x-2"> 
              <PillIcon className="h-5 w-5 text-primary" /> 
              <CardTitle className="text-base">Your Medications</CardTitle> 
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{medications.length}</Badge> 
            </div>
            <Button variant="default" size="icon" className="h-7 w-7"> 
              <Plus className="h-4 w-4" /> 
              <span className="sr-only">Add Medication</span>
            </Button>
          </CardHeader>
          <CardContent className="p-3"> 
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%] text-xs h-10 px-2">Medicines</TableHead> 
                  <TableHead className="text-xs h-10 px-2">Amount</TableHead> 
                  <TableHead className="text-xs h-10 px-2">Time</TableHead> 
                  <TableHead className="text-right text-xs h-10 px-2">Status</TableHead> 
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="p-2"> 
                      <div>
                          <div className="font-medium text-xs">{med.name}</div> 
                          {med.reason && <div className="text-xs text-muted-foreground">{med.reason}</div>}
                        </div>
                    </TableCell>
                    <TableCell className="text-xs p-2">{med.amount}</TableCell> 
                    <TableCell className="text-xs p-2">{med.timing}</TableCell> 
                    <TableCell className="text-right p-2"> 
                      <Checkbox checked={med.taken} aria-label={med.taken ? 'Taken' : 'Not taken'} className="h-3.5 w-3.5"/> 
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {medications.length === 0 && (
              <p className="py-6 text-center text-xs text-muted-foreground">No medications listed.</p> 
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> 
        {informationalCardTitles.map((title) => (
          <Card key={title.toLowerCase().replace(/\s+/g, '-')} className="shadow-lg">
            <CardHeader className="p-3"> 
              <CardTitle className="text-sm">{title}</CardTitle> 
              <CardDescription className="text-xs">Additional health insights</CardDescription> 
            </CardHeader>
            <CardContent className="p-3"> 
              <p className="text-xs text-muted-foreground">{loremIpsumText}</p> 
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
    

    