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
  Trash2, FileText, Ban, ScanLine, ClipboardList, BellRing
} from 'lucide-react';
import type { HealthMetric, Problem, Medication } from '@/lib/constants'; // Changed Appointment to Problem
import { MOCK_MEDICATIONS, MOCK_PATIENT, pageCardSampleContent, MOCK_PROBLEMS } from '@/lib/constants'; // Added MOCK_PROBLEMS

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

const heartRateMonitorData: Array<{ time: string; hr: number }> = [
  { time: '0s', hr: 75 }, { time: '1s', hr: 78 }, { time: '2s', hr: 72 },
  { time: '3s', hr: 80 }, { time: '4s', hr: 77 }, { time: '5s', hr: 75 },
  { time: '6s', hr: 79 }, { time: '7s', hr: 76 },
];

const ecgData: Array<{ time: string; value: number }> = [
  { time: '0s', value: 0.1 }, { time: '0.1s', value: 0.5 }, { time: '0.2s', value: -0.2 },
  { time: '0.3s', value: 1.0 }, { time: '0.4s', value: -0.3 }, { time: '0.5s', value: 0.2 },
  { time: '0.6s', value: 0.6 }, { time: '0.7s', value: -0.1 }, { time: '0.8s', value: 1.1 },
];

const ctScanReadings: Array<{ organ: string; finding: string }> = [
  { organ: 'Lungs', finding: 'Clear' }, { organ: 'Liver', finding: 'Normal' }, { organ: 'Kidneys', finding: 'Slight calcification' },
];

const heartRateMonitorChartConfig: ChartConfig = { hr: { label: 'Heart Rate (bpm)', color: 'hsl(var(--chart-1))' } };
const ecgChartConfig: ChartConfig = { value: { label: 'ECG (mV)', color: 'hsl(var(--chart-2))' } };

const informationalCardTitles: string[] = [
  "Allergies", // Icon: Ban
  "Radiology", // Icon: ScanLine
  "Encounter notes", // Icon: ClipboardList
  "Clinical reminder" // Icon: BellRing
];

const infoCardIcons: Record<string, LucideIcon> = {
  "Allergies": Ban,
  "Radiology": ScanLine,
  "Encounter notes": ClipboardList,
  "Clinical reminder": BellRing,
  "Clinical notes": FileText, // Kept for direct use
  "Report": FileText, // Kept for direct use (buttons)
};


export default function DashboardPage(): JSX.Element {
  const [problems, setProblems] = useState<Problem[]>(MOCK_PROBLEMS);
  const [medications, setMedications] = useState<Medication[]>(MOCK_MEDICATIONS);
  const [dynamicPageCardSampleContent, setDynamicPageCardSampleContent] = useState<Record<string, string[]>>(() => JSON.parse(JSON.stringify(pageCardSampleContent)));
  
  // Dialog states for problems
  const [isAddProblemDialogOpen, setIsAddProblemDialogOpen] = useState(false);
  const [newProblemInput, setNewProblemInput] = useState('');

  // Dialog states for medications
  const [isAddMedicationDialogOpen, setIsAddMedicationDialogOpen] = useState(false);
  const [newMedicationInput, setNewMedicationInput] = useState('');
  
  // Dialog states for informational cards
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [editingInfoCardTitle, setEditingInfoCardTitle] = useState<string | null>(null);
  const [newItemInput, setNewItemInput] = useState('');


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

  const handleDeleteProblem = (id: string) => {
    setProblems(prev => prev.filter(prob => prob.id !== id));
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

  const handleDeleteInfoItem = (cardTitle: string, itemIndex: number) => {
    setDynamicPageCardSampleContent(prev => ({
      ...prev,
      [cardTitle]: (prev[cardTitle] || []).filter((_, idx) => idx !== itemIndex)
    }));
  };
  

  return (
    <div className="flex flex-1 flex-col p-3 space-y-3 bg-background">
      
      {/* Top Row: Charts, Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-3">
        {/* Health Data Visualizations Card (Charts ONLY) */}
        <Card className="shadow-lg md:col-span-8 lg:col-span-8 h-full">
          <CardContent className="pt-2 px-2 pb-2">
            <Tabs defaultValue="heart-rate">
              <TabsList className="grid w-full grid-cols-3 mb-2 h-8">
                <TabsTrigger value="heart-rate" className="text-xs px-2 py-1">Heart Rate</TabsTrigger>
                <TabsTrigger value="ecg" className="text-xs px-2 py-1">ECG</TabsTrigger>
                <TabsTrigger value="ct-scan" className="text-xs px-2 py-1">CT Scan</TabsTrigger>
              </TabsList>
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
              <TabsContent value="ecg">
                 <Card className="border-0 shadow-none">
                  <CardContent className="p-1.5 max-h-[150px] overflow-y-auto no-scrollbar">
                    <ChartContainer config={ecgChartConfig} className="h-[140px] w-full">
                      <RechartsLineChart data={ecgData} margin={{ left: 0, right: 5, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={4} fontSize={9} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={1.5} dot={false} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="ct-scan">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-1.5 max-h-[150px] overflow-y-auto no-scrollbar space-y-0.5">
                    <ul className="space-y-0.5">
                      {ctScanReadings.map((reading, index) => (
                        <li key={index} className="flex justify-between p-1 rounded-md bg-muted/70 text-xs">
                          <span className="font-medium text-foreground">{reading.organ}:</span>
                          <span className="text-muted-foreground">{reading.finding}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-1 text-xs text-muted-foreground">Note: Simplified. Consult doctor for details.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Vitals Card */}
        <div className="md:col-span-4 lg:col-span-4 h-full">
          <Card className="shadow-lg h-full">
            <CardContent className="space-y-1.5 p-2 max-h-[calc(150px+2rem)] overflow-y-auto no-scrollbar">
              {keyIndicators.map((indicator) => (
                <div key={indicator.name} className="flex items-center justify-between p-1.5 rounded-lg bg-muted/70">
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
      
      {/* Middle Row: Problem, Medications, Clinical notes, Report (Details) */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {/* Problem Card */}
        <Card className="shadow-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
            <div className="flex items-center space-x-1.5">
              <Clock className="h-4 w-4 text-primary" /> {/* Or a more problem-specific icon */}
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
                    <TableCell className="text-right px-1.5 py-1 w-10">
                       <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteProblem(problem.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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

        {/* Medications History Card */}
        <Card className="shadow-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
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
                    <TableCell className="text-right px-1.5 py-1 w-10">
                       <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteMedication(med.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
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

        {/* Clinical Notes Card */}
        <Card className="shadow-lg">
            <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
              <div className="flex items-center space-x-1.5">
                <FileText className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Clinical notes</CardTitle>
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{(dynamicPageCardSampleContent["Clinical notes"] || []).length}</Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenAddItemDialog("Clinical notes")}>
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Add Clinical Note</span>
              </Button>
            </ShadcnCardHeader>
            <CardContent className="p-0 max-h-[180px] overflow-y-auto no-scrollbar">
              <Table>
                <TableBody>
                  {(dynamicPageCardSampleContent["Clinical notes"] || []).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="px-2 py-1">
                        <div className="font-medium text-xs">{item}</div>
                      </TableCell>
                      <TableCell className="text-right px-1.5 py-1 w-10">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteInfoItem("Clinical notes", index)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {(dynamicPageCardSampleContent["Clinical notes"] || []).length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground">No clinical notes.</p>
              )}
            </CardContent>
        </Card>

        {/* Report (Details) Card */}
        <Card className="shadow-lg">
            <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
              <div className="flex items-center space-x-1.5">
                <FileText className="h-4 w-4 text-primary" /> {/* Placeholder icon, same as Clinical Notes */}
                <CardTitle className="text-base">Report (Details)</CardTitle>
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{(dynamicPageCardSampleContent["Report"] || []).length}</Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenAddItemDialog("Report")}>
                <Edit3 className="h-3.5 w-3.5" />
                <span className="sr-only">Add Report Item</span>
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
                      <TableCell className="text-right px-1.5 py-1 w-10">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteInfoItem("Report", index)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
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
      </div>
      
      {/* Remaining informational cards */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {informationalCardTitles.map((title) => {
          const IconComponent = infoCardIcons[title] || Edit3; // Fallback to Edit3 if no icon defined
          return (
            <Card key={title.toLowerCase().replace(/\s+/g, '-')} className="shadow-lg">
              <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
                <div className="flex items-center space-x-1.5">
                  <IconComponent className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">{title}</CardTitle>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{(dynamicPageCardSampleContent[title] || []).length}</Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenAddItemDialog(title)}>
                  <Edit3 className="h-3.5 w-3.5" />
                  <span className="sr-only">Add to {title}</span>
                </Button>
              </ShadcnCardHeader>
              <CardContent className="p-0 max-h-[180px] overflow-y-auto no-scrollbar">
                <Table>
                  <TableBody>
                    {(dynamicPageCardSampleContent[title] || []).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="px-2 py-1">
                          <div className="font-medium text-xs">{item}</div>
                        </TableCell>
                        <TableCell className="text-right px-1.5 py-1 w-10">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteInfoItem(title, index)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {(dynamicPageCardSampleContent[title] || []).length === 0 && (
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

