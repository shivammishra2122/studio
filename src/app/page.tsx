
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart } from 'recharts';
import { 
  Droplet, HeartPulse, Activity, Thermometer, Scale, Edit3, Clock, Pill as PillIcon, Plus, MoreVertical,
  User, Hospital, CalendarDays, Phone
} from 'lucide-react';
import type { HealthMetric, Appointment, Medication } from '@/lib/constants'; 
import { MOCK_APPOINTMENTS, MOCK_MEDICATIONS, MOCK_PATIENT, pageCardSampleContent } from '@/lib/constants'; 

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from '@/components/ui/badge';

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
  "Clinical reminder"
];


export default function DashboardPage() {
  const appointments: Appointment[] = MOCK_APPOINTMENTS;
  const medications: Medication[] = MOCK_MEDICATIONS;
  

  return (
    <div className="flex flex-1 flex-col p-3 md:p-4 space-y-3">
      
      {/* Top Row: Charts/Vitals + Patient Details/Report */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Left part of Top Row: Health Data Viz (Charts + Vitals) */}
        <div className="w-full lg:w-[65%] flex flex-col md:flex-row gap-3">
            {/* Health Data Visualizations Card (Charts ONLY) */}
            <Card className="shadow-lg w-full md:w-[65%]">
              <CardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
                <CardTitle className="text-base font-semibold">Health Data Visualizations</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Edit3 className="h-3.5 w-3.5" />
                    <span className="sr-only">Edit Health Data</span>
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
                      <CardContent className="p-1.5 max-h-[170px] overflow-y-auto no-scrollbar">
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
                      <CardContent className="p-1.5 max-h-[170px] overflow-y-auto no-scrollbar">
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
                      <CardContent className="p-2 max-h-[170px] overflow-y-auto no-scrollbar space-y-1">
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

            {/* Vitals Card */}
            <div className="w-full md:w-[35%]">
              <Card className="shadow-md h-full">
                <CardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
                  <CardTitle className="text-base font-semibold">Vitals</CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Edit3 className="h-3.5 w-3.5" /><span className="sr-only">Edit Vitals</span></Button>
                </CardHeader>
                <CardContent className="space-y-1.5 pt-1 px-2 pb-2 max-h-[calc(170px+2.5rem)] overflow-y-auto no-scrollbar">
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

        {/* Right part of Top Row: Patient Details Card & Report Card */}
        <div className="w-full lg:w-[35%] flex flex-col gap-3">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
              <CardTitle className="text-base font-semibold">Patient Details</CardTitle>
              <Button variant="ghost" size="icon" className="h-7 w-7"><Edit3 className="h-3.5 w-3.5" /><span className="sr-only">Edit Patient Details</span></Button>
            </CardHeader>
            <CardContent className="p-3 space-y-2 text-xs no-scrollbar max-h-[calc(170px+4rem)] overflow-y-auto"> 
                <div className="flex items-center space-x-3 mb-2">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={MOCK_PATIENT.avatarUrl} alt={MOCK_PATIENT.name} data-ai-hint="person patient"/>
                        <AvatarFallback>{MOCK_PATIENT.name.substring(0,1)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm text-foreground">{MOCK_PATIENT.name}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1">
                    <div className="flex items-center"><User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />Gender: {MOCK_PATIENT.gender}</div>
                    <div className="flex items-center"><User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />Age: {MOCK_PATIENT.age}</div>
                    <div className="flex items-center col-span-2"><Hospital className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />Ward No: {MOCK_PATIENT.wardNo}</div>
                    <div className="flex items-center col-span-2"><CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />Admission: {new Date(MOCK_PATIENT.admissionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                    <div className="flex items-center col-span-2"><Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />Stay: {MOCK_PATIENT.lengthOfStay}</div>
                    <div className="flex items-center col-span-2"><Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />Mobile: {MOCK_PATIENT.mobile}</div>
                </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
              <div>
                <CardTitle className="text-sm font-semibold">Report</CardTitle>
                <CardDescription className="text-xs">Quick summary</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Report</span>
              </Button>
            </CardHeader>
            <CardContent className="p-2 pt-1 max-h-[100px] overflow-y-auto no-scrollbar">
              <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                {(pageCardSampleContent["Report"] || ["No data available."]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
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
          <CardContent className="p-0 max-h-[180px] overflow-y-auto no-scrollbar">
            <Table>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell className="px-2 py-1">
                      <div className="flex items-center space-x-1.5">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={appt.avatarUrl} alt={appt.doctor} data-ai-hint="person doctor" />
                          <AvatarFallback>{appt.doctor.substring(0,1)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-xs">{appt.doctor}</div>
                          <div className="text-xs text-muted-foreground">{appt.specialty}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs px-2 py-1">{new Date(appt.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</TableCell>
                    <TableCell className="text-xs px-2 py-1">{appt.time}</TableCell>
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
          <CardContent className="p-0 max-h-[180px] overflow-y-auto no-scrollbar">
            <Table>
              <TableBody>
                {medications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="px-2 py-1">
                      <div>
                          <div className="font-medium text-xs">{med.name}</div>
                          {med.reason && <div className="text-xs text-muted-foreground">{med.reason}</div>}
                        </div>
                    </TableCell>
                    <TableCell className="text-xs px-2 py-1">{med.amount}</TableCell>
                    <TableCell className="text-xs px-2 py-1">{med.timing}</TableCell>
                    <TableCell className="text-right px-2 py-1">
                      <Checkbox checked={med.taken} aria-label={med.taken ? 'Taken' : 'Not taken'} className="h-4 w-4" />
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
                <CardTitle className="text-sm font-semibold">{title}</CardTitle>
                <CardDescription className="text-xs">Quick summary</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit {title}</span>
              </Button>
            </CardHeader>
            <CardContent className="p-2 pt-1 max-h-[100px] overflow-y-auto no-scrollbar">
              <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                {(pageCardSampleContent[title] || ["No data available."]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}

