
'use client';

import { Card, CardContent, CardDescription, CardTitle, CardHeader as ShadcnCardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader as ShadcnTableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart'; 
import { CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart } from 'recharts';
import { 
  Droplet, HeartPulse, Activity, Thermometer, Scale, Edit3, Clock, Pill as PillIcon, Plus,
  FileText, Ban, ScanLine, ClipboardList, BellRing, LucideIcon, Trash2
} from 'lucide-react';
import type { HealthMetric, Problem, Medication } from '@/lib/constants'; 
import { MOCK_PROBLEMS, MOCK_MEDICATIONS, MOCK_PATIENT, pageCardSampleContent } from '@/lib/constants'; 

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle as DialogUITitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

// Define a type for key indicators that includes a tabValue
type KeyIndicatorWithTab = HealthMetric & { tabValue: string };

const keyIndicators: KeyIndicatorWithTab[] = [
  { name: 'Blood Glucose', value: '98', unit: 'mg/dL', icon: Droplet, tabValue: 'blood-glucose' },
  { name: 'Heart Rate', value: '72', unit: 'bpm', icon: HeartPulse, tabValue: 'heart-rate' },
  { name: 'Blood Pressure', value: '120/95', unit: 'mmHg', icon: Activity, tabValue: 'blood-pressure'},
  { name: 'Body Temperature', value: '108', unit: 'F', icon: Thermometer, tabValue: 'body-temperature' },
  { name: 'Weight', value: '70', unit: 'kg', icon: Scale, tabValue: 'weight' },
  { name: 'Radiology Reports', value: 'View', unit: '', icon: ScanLine, tabValue: 'radiology-reports' },
];

const heartRateMonitorData: Array<{ time: string; hr: number }> = [
  { time: '0s', hr: 75 }, { time: '1s', hr: 78 }, { time: '2s', hr: 72 },
  { time: '3s', hr: 80 }, { time: '4s', hr: 77 }, { time: '5s', hr: 75 },
  { time: '6s', hr: 79 }, { time: '7s', hr: 76 },
];

const glucoseData: Array<{ date: string; level: number }> = [
  { date: 'Mon', level: 95 }, { date: 'Tue', level: 102 }, { date: 'Wed', level: 98 },
  { date: 'Thu', level: 110 }, { date: 'Fri', level: 105 }, { date: 'Sat', level: 99 },
  { date: 'Sun', level: 108 },
];

const bloodPressureData: Array<{ date: string; systolic: number; diastolic: number }> = [
  { date: 'Mon', systolic: 120, diastolic: 80 },
  { date: 'Tue', systolic: 122, diastolic: 82 },
  { date: 'Wed', systolic: 118, diastolic: 78 },
  { date: 'Thu', systolic: 125, diastolic: 85 },
  { date: 'Fri', systolic: 120, diastolic: 80 },
  { date: 'Sat', systolic: 123, diastolic: 81 },
  { date: 'Sun', systolic: 119, diastolic: 79 },
];


const heartRateMonitorChartConfig: ChartConfig = { hr: { label: 'Heart Rate (bpm)', color: 'hsl(var(--chart-1))' } };
const glucoseChartConfig: ChartConfig = { level: { label: 'Glucose (mg/dL)', color: 'hsl(var(--chart-2))' } };
const bloodPressureChartConfig: ChartConfig = { 
  systolic: { label: 'Systolic (mmHg)', color: 'hsl(var(--chart-1))' },
  diastolic: { label: 'Diastolic (mmHg)', color: 'hsl(var(--chart-3))' },
};


const infoCardIcons: Record<string, LucideIcon> = {
  "Allergies": Ban,
  "Radiology": ScanLine,
  "Encounter notes": ClipboardList,
  "Clinical reminder": BellRing,
  "Clinical notes": FileText, 
  "Report": FileText, 
};

// "Allergies", "Report", and "Radiology" are explicitly placed.
// "Clinical notes", "Encounter notes", "Clinical reminder" will be in the bottom loop
const informationalCardTitles: string[] = [
  "Clinical notes",
  "Encounter notes",
  "Clinical reminder"
];


export default function DashboardPage(): JSX.Element {
  const [problems, setProblems] = useState<Problem[]>(MOCK_PROBLEMS);
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS);
  const [dynamicPageCardSampleContent, setDynamicPageCardSampleContent] = useState<Record<string, string[]>>(() => JSON.parse(JSON.stringify(pageCardSampleContent)));
  
  const [isAddProblemDialogOpen, setIsAddProblemDialogOpen] = useState(false);
  const [newProblemInput, setNewProblemInput] = useState('');

  const [isAddMedicationDialogOpen, setIsAddMedicationDialogOpen] = useState(false);
  const [newMedicationInput, setNewMedicationInput] = useState('');
  
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [editingInfoCardTitle, setEditingInfoCardTitle] = useState<string | null>(null);
  const [newItemInput, setNewItemInput] = useState('');

  const [activeChartTab, setActiveChartTab] = useState<string>('heart-rate');


  const handleAddProblem = () => {
    if (!newProblemInput.trim()) return;
    const newProb: Problem = {
      id: Date.now().toString(),
      description: newProblemInput,
    };
    setProblems(prev => [newProb, ...prev]);
    setNewProblemInput('');
    setIsAddProblemDialogOpen(false);
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


  const handleOpenAddItemDialog = (title: string) => {
    setEditingInfoCardTitle(title);
    setNewItemInput('');
    setIsAddItemDialogOpen(true);
  };

  const handleSaveNewInfoItem = () => {
    if (!newItemInput.trim() || !editingInfoCardTitle) return;
    setDynamicPageCardSampleContent(prev => ({
      ...prev,
      [editingInfoCardTitle]: [newItemInput, ...(prev[editingInfoCardTitle] || [])]
    }));
    setNewItemInput('');
    setIsAddItemDialogOpen(false);
    setEditingInfoCardTitle(null);
  };
  

  return (
    <div className="flex flex-1 flex-col p-3 bg-background">
      
      {/* Top Row: Problem ,chart,vital */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-2">
        <Card className="lg:col-span-3 shadow-lg">
            <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-0 px-3">
              <div className="flex items-center space-x-1.5">
                <Clock className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Problem</CardTitle>
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{problems.length}</Badge>
              </div>
              <Dialog open={isAddProblemDialogOpen} onOpenChange={setIsAddProblemDialogOpen}>
                  <DialogTrigger asChild>
                       <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Edit3 className="h-3.5 w-3.5" />
                           <span className="sr-only">Add Problem</span>
                      </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogUITitle>Add New Problem</DialogUITitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="problemDesc" className="text-right">Description</Label>
                        <Input id="problemDesc" value={newProblemInput} onChange={(e) => setNewProblemInput(e.target.value)} className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                      <Button onClick={handleAddProblem}>Add</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
            </ShadcnCardHeader>
            <CardContent className="p-0 max-h-[180px] overflow-y-auto no-scrollbar">
              <Table>
                <TableBody>
                  {problems.map((problem) => (
                    <TableRow key={problem.id}>
                      <TableCell className="px-2 py-1">
                        <div className="font-medium text-xs">{problem.description}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {problems.length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground">No problems listed.</p>
              )}
            </CardContent>
        </Card>
        
        <Card className="lg:col-span-6 shadow-lg h-full">
          <CardContent className="pt-2 px-2 pb-2">
            <Tabs value={activeChartTab} onValueChange={setActiveChartTab} className="w-full">
              {/* TabsList removed as per user request */}
              <TabsContent value="heart-rate">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-1.5 max-h-[150px] overflow-y-auto no-scrollbar">
                    <ChartContainer config={heartRateMonitorChartConfig} className="h-[140px] w-full">
                      <RechartsLineChart data={heartRateMonitorData} margin={{ left: 0, right: 5, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={9} domain={[60, 120]} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="hr" type="monotone" stroke="var(--color-hr)" strokeWidth={1.5} dot={{r: 2}} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="blood-glucose">
                 <Card className="border-0 shadow-none">
                  <CardContent className="p-1.5 max-h-[150px] overflow-y-auto no-scrollbar">
                    <ChartContainer config={glucoseChartConfig} className="h-[140px] w-full">
                      <RechartsLineChart data={glucoseData} margin={{ left: 0, right: 5, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="level" type="monotone" stroke="var(--color-level)" strokeWidth={1.5} dot={{r: 2}} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="blood-pressure">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-1.5 max-h-[150px] overflow-y-auto no-scrollbar">
                    <ChartContainer config={bloodPressureChartConfig} className="h-[140px] w-full">
                      <RechartsLineChart data={bloodPressureData} margin={{ left: 0, right: 5, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Line dataKey="systolic" type="monotone" stroke="var(--color-systolic)" strokeWidth={1.5} dot={{r: 2}} />
                        <Line dataKey="diastolic" type="monotone" stroke="var(--color-diastolic)" strokeWidth={1.5} dot={{r: 2}} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="radiology-reports">
                <Card className="border-0 shadow-none">
                   <ShadcnCardHeader className="flex flex-row items-center justify-between pt-1 pb-0 px-1">
                    <CardTitle className="text-sm">Radiology Reports</CardTitle>
                  </ShadcnCardHeader>
                  <CardContent className="p-1.5 max-h-[120px] overflow-y-auto no-scrollbar">
                    <Table>
                      <TableBody>
                        {(dynamicPageCardSampleContent["Radiology"] || []).map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="px-2 py-1">
                              <div className="font-medium text-xs">{item}</div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {(dynamicPageCardSampleContent["Radiology"] || []).length === 0 && (
                      <p className="py-4 text-center text-xs text-muted-foreground">No radiology items.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-lg h-full">
          <CardContent className="space-y-1.5 p-2 max-h-44 overflow-y-auto no-scrollbar"> 
            {keyIndicators.map((indicator) => (
              <div 
                key={indicator.name} 
                className="flex items-center justify-between p-1.5 rounded-lg bg-muted/70 hover:bg-muted/90 cursor-pointer"
                onClick={() => setActiveChartTab(indicator.tabValue)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveChartTab(indicator.tabValue);}}
              >
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

      {/* Second Row: Allergies ,medical history ,report, radiology  */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-2">
        <Card className="md:col-span-1 shadow-lg">
            <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-0 px-3">
              <div className="flex items-center space-x-1.5">
                <Ban className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Allergies</CardTitle>
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{(dynamicPageCardSampleContent["Allergies"] || []).length}</Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenAddItemDialog("Allergies")}>
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Allergies</span>
              </Button>
            </ShadcnCardHeader>
            <CardContent className="p-0 max-h-[180px] overflow-y-auto no-scrollbar">
              <Table>
                <TableBody>
                  {(dynamicPageCardSampleContent["Allergies"] || []).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="px-2 py-1">
                        <div className="font-medium text-xs">{item}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(dynamicPageCardSampleContent["Allergies"] || []).length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground">No allergies listed.</p>
              )}
            </CardContent>
        </Card>
        
        <Card className="md:col-span-2 shadow-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-0 px-3">
            <div className="flex items-center space-x-1.5">
              <PillIcon className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Medications History</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{medications.length}</Badge>
            </div>
            <Dialog open={isAddMedicationDialogOpen} onOpenChange={setIsAddMedicationDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Edit3 className="h-3.5 w-3.5" />
                  <span className="sr-only">Add Medication</span>
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

        <Card className="md:col-span-1 shadow-lg">
            <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-0 px-3">
              <div className="flex items-center space-x-1.5">
                <FileText className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Report</CardTitle>
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{(dynamicPageCardSampleContent["Report"] || []).length}</Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenAddItemDialog("Report")}>
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Report</span>
              </Button>
            </ShadcnCardHeader>
            <CardContent className="p-0 max-h-[180px] overflow-y-auto no-scrollbar">
              <Table>
                <TableBody>
                  {(dynamicPageCardSampleContent["Report"] || []).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="px-2 py-1">
                        <div className="font-medium text-xs">{item}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(dynamicPageCardSampleContent["Report"] || []).length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground">No report items.</p>
              )}
            </CardContent>
        </Card>

        <Card className="md:col-span-1 shadow-lg">
            <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-0 px-3">
              <div className="flex items-center space-x-1.5">
                <ScanLine className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Radiology</CardTitle>
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{(dynamicPageCardSampleContent["Radiology"] || []).length}</Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenAddItemDialog("Radiology")}>
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Radiology</span>
              </Button>
            </ShadcnCardHeader>
            <CardContent className="p-0 max-h-[180px] overflow-y-auto no-scrollbar">
              <Table>
                <TableBody>
                  {(dynamicPageCardSampleContent["Radiology"] || []).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="px-2 py-1">
                        <div className="font-medium text-xs">{item}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(dynamicPageCardSampleContent["Radiology"] || []).length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground">No radiology items.</p>
              )}
            </CardContent>
        </Card>
      </div>
      
      {/* Third Row: clinical notes,encounter notes,clinical reminder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {informationalCardTitles.map((title) => {
          const IconComponent = infoCardIcons[title] || FileText; 
          const items = dynamicPageCardSampleContent[title] || [];
          return (
            <Card key={title.toLowerCase().replace(/\s+/g, '-')} className="shadow-lg">
              <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-0 px-3">
                <div className="flex items-center space-x-1.5">
                  <IconComponent className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">{title}</CardTitle>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{items.length}</Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenAddItemDialog(title)}>
                  <Edit3 className="h-3.5 w-3.5" />
                  <span className="sr-only">Add to {title}</span>
                </Button>
              </ShadcnCardHeader>
              <CardContent className="p-0 max-h-[180px] overflow-y-auto no-scrollbar">
                <Table>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="px-2 py-1">
                          <div className="font-medium text-xs">{item}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {items.length === 0 && (
                  <p className="py-4 text-center text-xs text-muted-foreground">No items listed.</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Common Dialog for adding items to informational cards */}
      <Dialog open={isAddItemDialogOpen && !!editingInfoCardTitle} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setIsAddItemDialogOpen(false);
          setEditingInfoCardTitle(null);
        } else {
          setIsAddItemDialogOpen(true);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogUITitle>Add New Item to {editingInfoCardTitle}</DialogUITitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="itemName" className="text-right">Item</Label>
              <Input id="itemName" value={newItemInput} onChange={(e) => setNewItemInput(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSaveNewInfoItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}


    