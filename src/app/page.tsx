
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardTitle, CardHeader as ShadcnCardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart'; 
import { CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart } from 'recharts';
import { 
  Droplet, HeartPulse, Activity, Thermometer, Scale, Edit3, Clock, Pill as PillIcon, Plus, MoreVertical,
  User, Hospital, CalendarDays, Phone, BedDouble, BriefcaseMedical, FileQuestion,
  FileText, Ban, ScanLine, ClipboardList, BellRing
} from 'lucide-react';
import type { HealthMetric, Problem, Medication } from '@/lib/constants'; 
import { MOCK_PROBLEMS, MOCK_MEDICATIONS, MOCK_PATIENT, pageCardSampleContent } from '@/lib/constants'; 

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogUITitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';


const keyIndicators: HealthMetric[] = [
  { name: 'Heart Rate', value: '108', unit: 'F', icon: Droplet },
  { name: 'B/P', value: '120/95', unit: '(mmHg)', icon: Activity },
  { name: 'Body Temperature', value: '36.8', unit: '°C', icon: Thermometer },
  { name: 'Weight', value: '70', unit: 'kg', icon: Scale },
  { name: 'Blood Glucose', value: '98', unit: 'mg/dL', icon: Droplet },
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

const infoCardIcons: Record<string, React.ElementType> = {
  "Allergies": Ban,
  "Radiology": ScanLine,
  "Encounter notes": ClipboardList,
  "Clinical reminder": BellRing, 
  "Clinical notes": FileText,
  "Report": FileText,
};

const thirdRowInformationalCardTitles: string[] = ["Clinical notes", "Encounter notes", "Clinical reminder"];


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
  const [detailViewTitle, setDetailViewTitle] = useState<string>('');
  const [detailViewContent, setDetailViewContent] = useState<string>('');

  const problemDialogRef = useRef<HTMLDivElement>(null);
  const problemHeaderRef = useRef<HTMLDivElement>(null);
  const isProblemDialogDragging = useRef(false);
  const problemDragStartCoords = useRef({ x: 0, y: 0 });
  const problemInitialDialogOffset = useRef({ x: 0, y: 0 });
  
  const openAddProblemDialog = () => {
    setNewProblemInput('');
    if (problemDialogRef.current) {
      problemDialogRef.current.style.transform = 'translate(-50%, -50%)'; 
    }
    setIsAddProblemDialogOpen(true);
  };
  
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

  const openAddMedicationDialog = () => {
    setNewMedicationInput('');
    setIsAddMedicationDialogOpen(true);
  };
  
  const handleAddMedication = () => {
    if (!newMedicationInput.trim()) return;
    const newMed: Medication = {
      id: Date.now().toString(),
      name: newMedicationInput,
      reason: 'General', 
      amount: 'N/A',
      timing: 'N/A',
      status: 'Pending', 
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
  
  const handleShowItemDetailInChartArea = (titlePrefix: string, itemText: string) => {
    setDetailViewTitle(`${titlePrefix}: ${itemText.substring(0, 40)}${itemText.length > 40 ? '...' : ''}`);
    
    let contentToShow = itemText;
    if (titlePrefix === "Radiology Detail" && itemText === "Chest X-Ray: Clear") {
      contentToShow = `Normal lung expansion without fluid or masses.\nHeart size within normal limits.\nClear airways and no structural abnormalities in the bones or diaphragm.`;
    }
    
    setDetailViewContent(contentToShow);
    setActiveChartTab('detail-view'); 
  };

  const handleProblemDialogMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (problemHeaderRef.current && problemDialogRef.current) {
      isProblemDialogDragging.current = true;
      problemDragStartCoords.current = { x: e.clientX, y: e.clientY };
      const style = window.getComputedStyle(problemDialogRef.current);
      const matrix = new DOMMatrixReadOnly(style.transform);
      problemInitialDialogOffset.current = { x: matrix.m41, y: matrix.m42 };

      problemHeaderRef.current.style.cursor = 'grabbing';
      document.body.style.cursor = 'grabbing'; 
      e.preventDefault(); 
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isProblemDialogDragging.current || !problemDialogRef.current) return;
      const deltaX = e.clientX - problemDragStartCoords.current.x;
      const deltaY = e.clientY - problemDragStartCoords.current.y;
      
      const newX = problemInitialDialogOffset.current.x + deltaX;
      const newY = problemInitialDialogOffset.current.y + deltaY;

      problemDialogRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
    };

    const handleMouseUp = () => {
      if (isProblemDialogDragging.current) {
        isProblemDialogDragging.current = false;
        if (problemHeaderRef.current) {
          problemHeaderRef.current.style.cursor = 'grab';
        }
        document.body.style.cursor = 'default'; 
      }
    };

    if (isAddProblemDialogOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (problemHeaderRef.current) {
        problemHeaderRef.current.style.cursor = 'grab';
      }
      document.body.style.cursor = 'default';
    };
  }, [isAddProblemDialogOpen]);
  

  return (
    <div className="flex flex-1 flex-col p-3 md:p-4 space-y-2"> 
      
      {/* Top Row: Problem, Charts, Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-2">
        <Card className="md:col-span-3 lg:col-span-3 shadow-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-0 px-3">
            <div className="flex items-center space-x-1.5">
              <Clock className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Problem</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{problems.length}</Badge>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-7 w-7 mr-0.5" onClick={openAddProblemDialog}>
                  <Edit3 className="h-3.5 w-3.5" />
              </Button>
               <Button variant="ghost" size="icon" className="h-7 w-7" onClick={openAddProblemDialog}>
                  <Plus className="h-4 w-4" />
              </Button>
            </div>
          </ShadcnCardHeader>
          <CardContent className="p-0 max-h-[180px] overflow-y-auto no-scrollbar">
            <Table>
              <TableBody>
                {problems.slice(0,5).map((problem) => (
                  <TableRow key={problem.id}>
                    <TableCell className="px-2 py-1 text-xs font-medium">
                      {problem.description}
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
        
        {/* Health Data Visualizations (Charts) Card */}
        <Card className="md:col-span-6 lg:col-span-6 shadow-lg">
          <CardContent className="pt-1 px-2 pb-2">
            <Tabs value={activeChartTab} onValueChange={setActiveChartTab} className="w-full">
              <TabsList className="hidden"> {/* TabsList is hidden */}
                  <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
                  <TabsTrigger value="blood-glucose">Blood Glucose</TabsTrigger>
                  <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
                  <TabsTrigger value="detail-view">Detail</TabsTrigger> 
              </TabsList>
              <TabsContent value="heart-rate">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-1.5 max-h-[170px] overflow-y-auto no-scrollbar">
                    <ChartContainer config={heartRateMonitorChartConfig} className="h-[160px] w-full">
                      <RechartsLineChart data={heartRateMonitorData} margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={6} fontSize={9} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={6} fontSize={9} domain={[60, 120]} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line dataKey="hr" type="monotone" stroke="var(--color-hr)" strokeWidth={1.5} dot={{r: 2}} />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="blood-glucose">
                 <Card className="border-0 shadow-none">
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
              <TabsContent value="blood-pressure">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-1.5 max-h-[170px] overflow-y-auto no-scrollbar">
                    <ChartContainer config={bloodPressureChartConfig} className="h-[160px] w-full">
                      <RechartsLineChart data={bloodPressureData} margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={6} fontSize={9} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={6} fontSize={9} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Line dataKey="systolic" type="monotone" stroke="var(--color-systolic)" strokeWidth={1.5} dot={{r: 2}} name="Systolic" />
                        <Line dataKey="diastolic" type="monotone" stroke="var(--color-diastolic)" strokeWidth={1.5} dot={{r: 2}} name="Diastolic" />
                      </RechartsLineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="detail-view">
                <Card className="border-0 shadow-none">
                  <ShadcnCardHeader className="pt-2 pb-1 px-3">
                    <CardTitle className="text-base">{detailViewTitle}</CardTitle>
                  </ShadcnCardHeader>
                  <CardContent className="p-3 text-sm text-foreground max-h-[150px] overflow-y-auto no-scrollbar">
                    {detailViewContent.split('\n').map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Vitals Card */}
        <Card className="md:col-span-3 lg:col-span-3 shadow-lg">
            <CardContent className="space-y-1.5 p-2 max-h-44 overflow-y-auto no-scrollbar">
                {keyIndicators.map((indicator) => (
                <div 
                    key={indicator.name} 
                    className="flex items-center justify-between p-1.5 rounded-lg bg-muted/70 hover:bg-muted/90 cursor-pointer"
                    onClick={() => indicator.tabValue && setActiveChartTab(indicator.tabValue)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && indicator.tabValue) setActiveChartTab(indicator.tabValue);}}
                >
                    <div className="flex items-center">
                    {indicator.icon && <indicator.icon className="h-4 w-4 text-primary mr-1.5" />}
                    <span className="text-xs font-medium text-foreground">{indicator.name}</span>
                    </div>
                    <div className="text-right">
                    <span className="text-xs font-normal text-foreground">{indicator.value}</span>
                    <span className="text-xs text-foreground/80 ml-0.5">{indicator.unit}</span>
                    </div>
                </div>
                ))}
            </CardContent>
            </Card>
      </div>

      {/* Second Row: Allergies, Medications History, Report, Radiology */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-10 gap-3 mb-2">
        {/* Allergies Card */}
        <Card className="md:col-span-2 shadow-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
            <div className="flex items-center space-x-1.5">
              <Ban className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Allergies</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{(dynamicPageCardSampleContent["Allergies"] || []).length}</Badge>
            </div>
            <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-7 w-7 mr-0.5" onClick={() => handleOpenAddItemDialog("Allergies")}>
                    <Edit3 className="h-3.5 w-3.5" />
                </Button>
                 <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenAddItemDialog("Allergies")}>
                  <Plus className="h-4 w-4" />
                </Button>
            </div>
          </ShadcnCardHeader>
          <CardContent className="p-0 max-h-32 overflow-y-auto no-scrollbar">
            <Table>
              <TableBody>
                {(dynamicPageCardSampleContent["Allergies"] || []).slice(0,5).map((item, index) => (
                  <TableRow key={index} onClick={() => handleShowItemDetailInChartArea("Allergy Detail", item)} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="px-2 py-1 text-xs font-medium">
                      {item}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             { (dynamicPageCardSampleContent["Allergies"] || []).length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground">No items listed.</p>
            )}
          </CardContent>
        </Card>
        
        {/* Medications History Card */}
        <Card className="md:col-span-3 shadow-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
            <div className="flex items-center space-x-1.5">
              <PillIcon className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Medications History</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{medications.length}</Badge>
            </div>
            <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-7 w-7 mr-0.5" onClick={openAddMedicationDialog}>
                    <Edit3 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={openAddMedicationDialog}>
                  <Plus className="h-4 w-4" />
                </Button>
            </div>
          </ShadcnCardHeader>
          <CardContent className="p-0 max-h-32 overflow-y-auto no-scrollbar">
            <Table>
              <TableBody>
                {medications.slice(0,5).map((med) => (
                  <TableRow key={med.id}>
                    <TableCell className="px-2 py-1 text-xs font-medium">
                      {med.name}
                    </TableCell>
                    <TableCell className="px-2 py-1 text-xs">{med.amount}</TableCell>
                    <TableCell className="px-2 py-1 text-xs">{med.timing}</TableCell>
                    <TableCell className="text-right px-2 py-1">
                      <Badge 
                        variant={med.status === 'Active' ? 'default' : med.status === 'Pending' ? 'secondary' : 'destructive'}
                        className={`text-xs px-1 py-0.5 ${med.status === 'Active' ? 'bg-green-100 text-green-700 border-green-300' : med.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-red-100 text-red-700 border-red-300'}`}
                      >
                        {med.status}
                      </Badge>
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

        {/* Report Card */}
        <Card className="md:col-span-3 shadow-lg">
            <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
              <div className="flex items-center space-x-1.5">
                <FileText className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Report</CardTitle>
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{(dynamicPageCardSampleContent["Report"] || []).length}</Badge>
              </div>
              <div className="flex items-center">
                  <Button variant="ghost" size="icon" className="h-7 w-7 mr-0.5" onClick={() => handleOpenAddItemDialog("Report")}>
                      <Edit3 className="h-3.5 w-3.5" />
                  </Button>
                 <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenAddItemDialog("Report")}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </ShadcnCardHeader>
            <CardContent className="p-0 max-h-32 overflow-y-auto no-scrollbar">
              <Table>
                  <TableBody>
                      {(dynamicPageCardSampleContent["Report"] || []).slice(0,5).map((item, index) => (
                      <TableRow key={index} onClick={() => handleShowItemDetailInChartArea("Report Detail", item)} className="cursor-pointer hover:bg-muted/50">
                         <TableCell className="px-2 py-1 text-xs font-medium">
                           {item}
                         </TableCell>
                      </TableRow>
                      ))}
                  </TableBody>
              </Table>
              {(dynamicPageCardSampleContent["Report"] || []).length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">No items listed.</p>
              )}
            </CardContent>
        </Card>

        {/* Radiology Card */}
        <Card className="md:col-span-2 shadow-lg">
          <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
            <div className="flex items-center space-x-1.5">
              <ScanLine className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Radiology</CardTitle>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{(dynamicPageCardSampleContent["Radiology"] || []).length}</Badge>
            </div>
             <div className="flex items-center">
                <Button variant="ghost" size="icon" className="h-7 w-7 mr-0.5" onClick={() => handleOpenAddItemDialog("Radiology")}>
                    <Edit3 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenAddItemDialog("Radiology")}>
                  <Plus className="h-4 w-4" />
                </Button>
            </div>
          </ShadcnCardHeader>
          <CardContent className="p-0 max-h-32 overflow-y-auto no-scrollbar">
            <Table>
              <TableBody>
                {(dynamicPageCardSampleContent["Radiology"] || []).slice(0,5).map((item, index) => (
                  <TableRow key={index} onClick={() => handleShowItemDetailInChartArea("Radiology Detail", item)} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="px-2 py-1 text-xs font-medium">
                      {item}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {(dynamicPageCardSampleContent["Radiology"] || []).length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">No items listed.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Third Row: Clinical notes, Encounter notes, Clinical reminder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {thirdRowInformationalCardTitles.map((title) => {
          const IconComponent = infoCardIcons[title] || FileText; 
          const items = dynamicPageCardSampleContent[title] || [];
          const itemCount = items.length;
          return (
            <Card key={title.toLowerCase().replace(/\s+/g, '-')} className="shadow-lg">
              <ShadcnCardHeader className="flex flex-row items-center justify-between pt-2 pb-1 px-3">
                <div className="flex items-center space-x-1.5">
                  <IconComponent className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">{title}</CardTitle>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">{itemCount}</Badge>
                </div>
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="h-7 w-7 mr-0.5" onClick={() => handleOpenAddItemDialog(title)}>
                        <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenAddItemDialog(title)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                </div>
              </ShadcnCardHeader>
              <CardContent className="p-0 max-h-24 overflow-y-auto no-scrollbar">
                <Table>
                  <TableBody>
                    {(items.slice(0,4) || []).map((item, index) => (
                      <TableRow key={index} onClick={() => items.length > 0 && handleShowItemDetailInChartArea(`${title} Detail`, item)} className={items.length > 0 ? "cursor-pointer hover:bg-muted/50" : ""}>
                        <TableCell className="px-2 py-1 text-xs font-medium">
                           {item}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                { items.length === 0 && (
                    <p className="py-4 text-center text-xs text-muted-foreground">No items listed.</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Common Dialog for adding items to informational cards */}
      <Dialog 
        open={isAddItemDialogOpen && !!editingInfoCardTitle} 
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setIsAddItemDialogOpen(false);
            setEditingInfoCardTitle(null);
          } else {
            setIsAddItemDialogOpen(true); 
          }
        }}
      >
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

      {/* Dialog for Adding Problem */}
       <Dialog open={isAddProblemDialogOpen} onOpenChange={(open) => { 
          setIsAddProblemDialogOpen(open);
          if (open) { 
            setNewProblemInput('');
            if (problemDialogRef.current) {
                 problemDialogRef.current.style.transform = 'translate(-50%, -50%)';
            }
          }
        }}>
          <DialogContent
            ref={problemDialogRef}
            style={{
              position: 'fixed', 
              left: '50%', 
              top: '50%',  
              transform: 'translate(-50%, -50%)', 
            }}
            className="sm:max-w-[425px]" 
            onOpenAutoFocus={(e) => e.preventDefault()} 
          >
            <DialogHeader
              ref={problemHeaderRef}
              onMouseDown={handleProblemDialogMouseDown}
              style={{ cursor: 'grab', userSelect: 'none', paddingBottom: '1rem' }} 
            >
              <DialogUITitle>Add New Problem</DialogUITitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="problemDesc" className="text-right">Description</Label>
                <Input id="problemDesc" value={newProblemInput} onChange={(e) => setNewProblemInput(e.target.value)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline" onClick={() => setIsAddProblemDialogOpen(false)}>Cancel</Button></DialogClose>
              <Button onClick={handleAddProblem}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      {/* Dialog for Adding Medication */}
      <Dialog open={isAddMedicationDialogOpen} onOpenChange={(open) => {
          setIsAddMedicationDialogOpen(open);
          if (open) {
            setNewMedicationInput('');
          }
        }}>
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
            <DialogClose asChild><Button variant="outline" onClick={() => setIsAddMedicationDialogOpen(false)}>Cancel</Button></DialogClose>
            <Button onClick={handleAddMedication}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
