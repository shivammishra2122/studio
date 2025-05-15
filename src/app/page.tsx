'use client';

import { Card, CardContent, CardDescription, CardTitle, CardHeader as ShadcnCardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader as ShadcnTableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart'; 
import { CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart } from 'recharts';
import { 
  Droplet, HeartPulse, Activity, Thermometer, Scale, Edit3, Clock, Pill as PillIcon, Plus, MoreVertical,
  FileText, Ban, ScanLine, ClipboardList, BellRing 
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

const heartRateMonitorData: Array<{ time: string; bpm: number }> = [
  { time: '08:00', bpm: 65 }, { time: '09:00', bpm: 70 }, { time: '10:00', bpm: 72 },
  { time: '11:00', bpm: 68 }, { time: '12:00', bpm: 75 }, { time: '13:00', bpm: 73 },
  { time: '14:00', bpm: 70 },
];

const ecgData: Array<{ time: string; value: number }> = [
  { time: '0s', value: 0.1 }, { time: '0.1s', value: 0.5 }, { time: '0.2s', value: -0.2 },
  { time: '0.3s', value: 1.0 }, { time: '0.4s', value: -0.3 }, { time: '0.5s', value: 0.2 },
  { time: '0.6s', value: 0.6 }, { time: '0.7s', value: -0.1 }, { time: '0.8s', value: 1.1 },
];

const ctScanReadings: Array<{ organ: string; finding: string }> = [
  { organ: 'Lungs', finding: 'Clear' }, { organ: 'Liver', finding: 'Normal' }, { organ: 'Kidneys', finding: 'Slight calcification' },
];

const heartRateMonitorChartConfig: ChartConfig = { bpm: { label: 'Heart Rate (bpm)', color: 'hsl(var(--chart-4))' } };
const ecgChartConfig: ChartConfig = { value: { label: 'ECG (mV)', color: 'hsl(var(--chart-2))' } };

const informationalCardTitles: string[] = [
  "Allergies",
  "Radiology",
  "Encounter notes",
  "Clinical reminder"
];

const reportButtonLabels: string[] = [
  "Pathology", "Imaging", "Consults", "Discharge", 
  "Lab Work", "Notes", "Procedures", "Med Admin",
  "Orders", "Care Plan", "Allergies Sum", "Vitals Chart"
];


export default function DashboardPage(): JSX.Element {
  const appointments: Appointment[] = MOCK_APPOINTMENTS;
  const medications: Medication[] = MOCK_MEDICATIONS;

  return (
    <div className="flex flex-1 flex-col p-3 md:p-4 space-y-3">
      
      {/* Top Section: Patient Details, Report, Charts, Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-3">
        {/* Item 1: Patient Details */}
        <Card className="shadow-lg md:col-span-6 lg:col-span-3">
          <CardContent className="p-3 space-y-1.5 text-xs no-scrollbar max-h-[220px] overflow-y-auto">
            <div className="flex items-center space-x-2 mb-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={MOCK_PATIENT.avatarUrl} alt={MOCK_PATIENT.name} data-ai-hint="person patient"/>
                <AvatarFallback>{MOCK_PATIENT.name.substring(0,1)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm text-foreground">{MOCK_PATIENT.name}</p>
                <p className="text-xs text-muted-foreground">
                  {MOCK_PATIENT.gender.substring(0,1)} {MOCK_PATIENT.age}
                </p>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div>{MOCK_PATIENT.mobile}</div>
              <div>{MOCK_PATIENT.bedDetails}</div>
              <div>Admission: {new Date(MOCK_PATIENT.admissionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              <div>Stay: {MOCK_PATIENT.lengthOfStay}</div>
              <div>Consultant: {MOCK_PATIENT.primaryConsultant}</div>
              <div>Provider: {MOCK_PATIENT.encounterProvider}</div>
              <div>Reason: {MOCK_PATIENT.reasonForVisit}</div>
            </div>
          </CardContent>
        </Card>

        {/* Item 2: Report Card - Bento Grid Style */}
        <Card className="shadow-lg md:col-span-6 lg:col-span-2">
          <CardContent className="p-2 max-h-[220px] overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-2 gap-1.5">
              {reportButtonLabels.map((label, index) => (
                <Button key={index} variant="outline" size="sm" className="text-xs w-full h-auto py-1.5">
                  {label}
                </Button>
              ))}
            </div>
             {reportButtonLabels.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">No report items listed.</p>
            )}
          </CardContent>
        </Card>
        
        {/* Item 3: Health Data Visualizations (Charts ONLY) */}
        <Card className="shadow-lg md:col-span-8 lg:col-span-5">
          <CardContent className="pt-1 px-2 pb-2">
            <Tabs defaultValue="heart-rate">
              <TabsList className="grid w-full grid-cols-3 mb-1.5 h-9">
                <TabsTrigger value="heart-rate" className="text-xs px-2 py-1">Heart Rate</TabsTrigger>
                <TabsTrigger value="ecg" className="text-xs px-2 py-1">ECG</TabsTrigger>
                <TabsTrigger value="ct-scan" className="text-xs px-2 py-1">CT Scan</TabsTrigger>
              </TabsList>
              <TabsContent value="heart-rate">
                <Card>
                  <CardContent className="p-1.5 max-h-[170px] overflow-y-auto no-scrollbar">
                    <ChartContainer config={heartRateMonitorChartConfig} className="h-[160px] w-full">
                      <RechartsLineChart data={heartRateMonitorData} margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={6} fontSize={9} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={6} fontSize={9} domain={[60, 120]} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="bpm" type="monotone" stroke="var(--color-bpm)" strokeWidth={1.5} dot={{r: 2}} />
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

        {/* Item 4: Vitals Card */}
        <Card className="shadow-md h-full md:col-span-4 lg:col-span-2">
          <CardContent className="space-y-1.5 p-2 max-h-[220px] overflow-y-auto no-scrollbar">
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
      
      {/* Middle Row: Problem, Medications, Clinical Notes, Report (Details) */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
            <div className="flex items-center space-x-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Problem</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{appointments.length}</Badge>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Problem</span>
              </Button>
            </div>
          </ShadcnCardHeader>
          <CardContent className="p-0 max-h-[180px] overflow-y-auto no-scrollbar">
            <Table>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell className="px-2 py-1">
                      <div className="font-medium text-xs">{appt.doctor}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {appointments.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">No problems listed.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
            <div className="flex items-center space-x-1.5">
              <PillIcon className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Medications History</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{medications.length}</Badge>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Medications</span>
              </Button>
            </div>
          </ShadcnCardHeader>
          <CardContent className="p-0 max-h-[180px] overflow-y-auto no-scrollbar">
            <Table>
              <TableBody>
                {medications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="px-2 py-1">
                      <div className="font-medium text-xs">{med.name}</div>
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

        <Card className="shadow-lg">
            <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
                <div className="flex items-center space-x-1.5">
                    <FileText className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">Clinical notes</CardTitle>
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      {pageCardSampleContent["Clinical notes"]?.length || 0}
                    </Badge>
                </div>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Clinical notes</span>
              </Button>
            </ShadcnCardHeader>
            <CardContent className="p-0 max-h-[180px] overflow-y-auto no-scrollbar">
               <Table>
                <TableBody>
                  {(pageCardSampleContent["Clinical notes"] || []).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="px-2 py-1">
                        <div className="font-medium text-xs">{item}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(pageCardSampleContent["Clinical notes"]?.length || 0) === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground">No clinical notes listed.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
               <div className="flex items-center space-x-1.5">
                    <FileText className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">Report (Details)</CardTitle>
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      {pageCardSampleContent["Report (Details)"]?.length || 0} 
                    </Badge>
                </div>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Report Details</span>
              </Button>
            </ShadcnCardHeader>
            <CardContent className="p-0 max-h-[180px] overflow-y-auto no-scrollbar">
               <Table>
                <TableBody>
                  {(pageCardSampleContent["Report (Details)"] || []).map((item, index) => ( 
                    <TableRow key={index}>
                      <TableCell className="px-2 py-1">
                        <div className="font-medium text-xs">{item}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(pageCardSampleContent["Report (Details)"]?.length || 0) === 0 && ( 
                <p className="py-4 text-center text-xs text-muted-foreground">No report details listed.</p>
              )}
            </CardContent>
          </Card>
      </div>
      
      {/* Bottom Row: Remaining informational cards */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {informationalCardTitles.map((title) => {
          let IconComponent;
          switch (title) {
            case "Allergies": IconComponent = Ban; break;
            case "Radiology": IconComponent = ScanLine; break;
            case "Encounter notes": IconComponent = ClipboardList; break;
            case "Clinical reminder": IconComponent = BellRing; break;
            default: IconComponent = FileText; 
          }
          return (
            <Card key={title.toLowerCase().replace(/\s+/g, '-')} className="shadow-lg">
              <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
                <div className="flex items-center space-x-1.5">
                  <IconComponent className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">{title}</CardTitle>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                     {pageCardSampleContent[title]?.length || 0}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Edit3 className="h-3.5 w-3.5" />
                    <span className="sr-only">Edit {title}</span>
                  </Button>
                </div>
              </ShadcnCardHeader>
              <CardContent className="p-0 max-h-[180px] overflow-y-auto no-scrollbar">
                <Table>
                  <TableBody>
                    {(pageCardSampleContent[title] || []).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="px-2 py-1">
                          <div className="font-medium text-xs">{item}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {(pageCardSampleContent[title]?.length || 0) === 0 && (
                  <p className="py-4 text-center text-xs text-muted-foreground">No {title.toLowerCase()} data listed.</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
}

