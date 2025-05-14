
'use client';

// Removed PageHeader import as it's not used
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart'; // Keep this
import { CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart } from 'recharts';
import { Droplet, HeartPulse, Activity, Thermometer, Scale, Edit3, Clock, Pill as PillIcon, Plus, MoreVertical } from 'lucide-react';
import type { HealthMetric, Appointment, Medication } from '@/lib/constants';
import { MOCK_APPOINTMENTS, MOCK_MEDICATIONS } from '@/lib/constants';
// Removed Image import as it's not used
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

const loremIpsumText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."; // Shortened

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
    <div className="flex flex-1 flex-col p-4 md:p-6 space-y-4">
      {/* Container for Health Data Visualizations and Vitals */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Health Data Visualizations Card (Left Side) */}
        <Card className="shadow-lg w-full md:w-[65%]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-4">
            <CardTitle className="text-md font-semibold">Health Data Visualizations</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit3 className="h-4 w-4" />
              <span className="sr-only">Edit Visualizations</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-2 px-3 pb-3">
            <Tabs defaultValue="glucose">
              <TabsList className="grid w-full grid-cols-3 mb-2">
                <TabsTrigger value="glucose">Glucose</TabsTrigger>
                <TabsTrigger value="ecg">ECG</TabsTrigger>
                <TabsTrigger value="ct-scan">CT Scan</TabsTrigger>
              </TabsList>
              <TabsContent value="glucose">
                <Card>
                  <CardContent className="p-2 max-h-[200px] overflow-y-auto"> {/* Reduced height and padding */}
                    <ChartContainer config={glucoseChartConfig} className="h-[180px] w-full"> {/* Reduced height */}
                      <RechartsLineChart data={glucoseData} margin={{ left: 0, right: 12, top: 5, bottom: 0 }}>
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
                  <CardContent className="p-2 max-h-[200px] overflow-y-auto"> {/* Reduced height and padding */}
                    <ChartContainer config={ecgChartConfig} className="h-[180px] w-full"> {/* Reduced height */}
                      <RechartsLineChart data={ecgData} margin={{ left: 0, right: 12, top: 5, bottom: 0 }}>
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
                  <CardContent className="p-3 max-h-[200px] overflow-y-auto space-y-1.5"> {/* Reduced height and padding */}
                    <ul className="space-y-1.5">
                      {ctScanReadings.map((reading, index) => (
                        <li key={index} className="flex justify-between p-1.5 rounded-md bg-secondary/50 text-xs">
                          <span className="font-medium text-secondary-foreground">{reading.organ}:</span>
                          <span className="text-muted-foreground">{reading.finding}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-muted-foreground">Note: Simplified summary. Consult doctor for details.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Vitals Card (Right Side) */}
        <div className="w-full md:w-[35%]">
          <Card className="shadow-md h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-3 px-4">
              <CardTitle className="text-md font-semibold">Vitals</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0"> {/* Smaller button */}
                <Edit3 className="h-4 w-4" />
                <span className="sr-only">Edit Vitals</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 pt-2 px-3 pb-3 max-h-[calc(200px+3rem)] overflow-y-auto"> {/* Max height and scroll */}
              {keyIndicators.map((indicator) => (
                <div key={indicator.name} className="flex items-center justify-between p-2 rounded-lg bg-muted/50"> {/* Reduced padding */}
                  <div className="flex items-center">
                    {indicator.icon && <indicator.icon className="h-5 w-5 text-primary mr-2" />} {/* Smaller icon */}
                    <span className="text-xs font-medium text-foreground">{indicator.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-foreground">{indicator.value}</span> {/* Font size consistency */}
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
          <CardHeader className="flex flex-row items-center justify-between pt-3 pb-2 px-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="text-md">Upcoming Appointments</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{appointments.length}</Badge>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-8 w-8 mr-1"> {/* Smaller buttons */}
                <Edit3 className="h-4 w-4" />
                <span className="sr-only">Edit Appointments</span>
              </Button>
              <Button variant="default" size="icon" className="h-8 w-8"> {/* Smaller buttons */}
                <Plus className="h-4 w-4" />
                <span className="sr-only">Schedule New Appointment</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 max-h-[200px] overflow-y-auto"> {/* Max height and scroll */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%] px-3 py-2 text-xs">Doctor</TableHead>
                  <TableHead className="px-3 py-2 text-xs">Date</TableHead>
                  <TableHead className="px-3 py-2 text-xs">Time</TableHead>
                  <TableHead className="text-right px-3 py-2 text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell className="px-3 py-1.5"> {/* Reduced padding */}
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-7 w-7"> {/* Smaller avatar */}
                          <AvatarImage src={appt.avatarUrl} alt={appt.doctor} data-ai-hint="person doctor" />
                          <AvatarFallback className="text-xs">{appt.doctor.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-xs">{appt.doctor}</div>
                          <div className="text-xs text-muted-foreground">{appt.specialty}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-1.5 text-xs">{new Date(appt.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</TableCell>
                    <TableCell className="px-3 py-1.5 text-xs">{appt.time}</TableCell>
                    <TableCell className="text-right px-3 py-1.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7"> {/* Smaller button */}
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
          <CardHeader className="flex flex-row items-center justify-between pt-3 pb-2 px-4">
            <div className="flex items-center space-x-2">
              <PillIcon className="h-5 w-5 text-primary" />
              <CardTitle className="text-md">Medications History</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{medications.length}</Badge>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-8 w-8 mr-1"> {/* Smaller buttons */}
                <Edit3 className="h-4 w-4" />
                <span className="sr-only">Edit Medications</span>
              </Button>
              <Button variant="default" size="icon" className="h-8 w-8"> {/* Smaller buttons */}
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add Medication</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 max-h-[200px] overflow-y-auto"> {/* Max height and scroll */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%] px-3 py-2 text-xs">Medicines</TableHead>
                  <TableHead className="px-3 py-2 text-xs">Amount</TableHead>
                  <TableHead className="px-3 py-2 text-xs">Time</TableHead>
                  <TableHead className="text-right px-3 py-2 text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="px-3 py-1.5"> {/* Reduced padding */}
                      <div>
                          <div className="font-medium text-xs">{med.name}</div>
                          {med.reason && <div className="text-xs text-muted-foreground">{med.reason}</div>}
                        </div>
                    </TableCell>
                    <TableCell className="px-3 py-1.5 text-xs">{med.amount}</TableCell>
                    <TableCell className="px-3 py-1.5 text-xs">{med.timing}</TableCell>
                    <TableCell className="text-right px-3 py-1.5">
                      <Checkbox checked={med.taken} aria-label={med.taken ? 'Taken' : 'Not taken'} className="h-3.5 w-3.5" /> {/* Smaller checkbox */}
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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> {/* Reduced gap */}
        {informationalCardTitles.map((title) => (
          <Card key={title.toLowerCase().replace(/\s+/g, '-')} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pt-3 pb-2 px-4"> {/* Flex header for edit icon */}
              <div>
                <CardTitle className="text-md">{title}</CardTitle>
                <CardDescription className="text-xs">Additional health insights</CardDescription> {/* Reduced font */}
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8"> {/* Smaller button */}
                <Edit3 className="h-4 w-4" />
                <span className="sr-only">Edit {title}</span>
              </Button>
            </CardHeader>
            <CardContent className="p-3 max-h-[100px] overflow-y-auto"> {/* Reduced padding, max height and scroll */}
              <p className="text-xs text-muted-foreground">{loremIpsumText}</p> {/* Reduced font */}
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}

    