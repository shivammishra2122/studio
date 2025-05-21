'use client';

import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader as ShadcnTableHeader, TableRow } from '@/components/ui/table';
// ScrollArea removed
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Edit3, CalendarDays, ChevronDown, ChevronUp, RefreshCw, ArrowUpDown, Settings, FileEdit, Switch as SwitchIcon } from 'lucide-react'; // Renamed Switch to SwitchIcon
import { Switch } from "@/components/ui/switch"; // Shadcn Switch
import { Badge } from '@/components/ui/badge';


const verticalNavItems = [
  "Vitals", "Intake/Output", "Problems", "Final Diagnosis", 
  "Chief-Complaints", "Allergies", "OPD/IPD Details"
];


type VitalChartDataPoint = { name: string; value?: number; systolic?: number; diastolic?: number };

const VitalsView = () => {
  const [visitDate, setVisitDate] = useState<string | undefined>();
  const [fromDate, setFromDate] = useState<string>("");
  const [toDateValue, setToDateValue] = useState<string>("");
  const [selectedVitalForGraph, setSelectedVitalForGraph] = useState<string>("B/P (mmHg)");
  const [chartData, setChartData] = useState<VitalChartDataPoint[]>([]);
  const [isEnteredInError, setIsEnteredInError] = useState<boolean>(false);

  const [isVitalsEntryMode, setIsVitalsEntryMode] = useState(false);
  const [vitalsEntryData, setVitalsEntryData] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    bloodPressureNotRecordable: false,
    bloodPressureQualifier: undefined as string | undefined,
    heightValue: '',
    heightUnit: 'cm',
    heightQualifier: undefined as string | undefined,
    painValue: undefined as string | undefined,
    pulseValue: '',
    pulseQualifier: undefined as string | undefined,
    respirationValue: '',
    respirationQualifier: undefined as string | undefined,
    temperatureValue: '',
    temperatureUnit: 'F',
    temperatureSite: undefined as string | undefined, 
    temperatureQualifier: undefined as string | undefined,
    weightValue: '',
    weightUnit: 'kg',
    weightQualifier: undefined as string | undefined,
    cvpValue: '',
    cvpUnit: 'mmHg', 
    cvpQualifier: undefined as string | undefined, 
    cgValue: '',
    cgUnit: 'cm', 
    cgQualifier: undefined as string | undefined,
    pulseOximetryValue: '',
    pulseOximetryQualifier: undefined as string | undefined,
  });

  const handleVitalsEntryChange = (field: keyof typeof vitalsEntryData, value: string | boolean | undefined) => {
    setVitalsEntryData(prev => ({ ...prev, [field]: value }));
  };

  const vitalTypes = [
    "B/P (mmHg)", "Temp (F)", "Resp (/min)", "Pulse (/min)",
    "Height (In)", "Weight (kg)", "CVP (cmH2O)", "C/G (In)",
    "Pulse Oximetry (%)", "Pain", "Early Warning Sign", "Location", "Entered By"
  ];
  
  const getMockDataForVital = (vitalName: string): VitalChartDataPoint[] => {
    if (typeof window === 'undefined') return Array(10).fill({name: '', value: 0});

    const generateRandomValue = (min: number, max: number, toFixed: number = 0) => {
      const val = Math.random() * (max - min) + min;
      return parseFloat(val.toFixed(toFixed));
    }
  
    switch (vitalName) {
      case "B/P (mmHg)":
        return Array.from({ length: 10 }, (_, i) => ({
          name: (i + 1).toString(),
          systolic: generateRandomValue(100, 140),
          diastolic: generateRandomValue(60, 90)
        }));
      case "Temp (F)":
        return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(97.0, 100.0, 1) }));
      case "Resp (/min)":
        return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(12, 20) }));
      case "Pulse (/min)":
        return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(60, 100) }));
      case "Height (In)":
         return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(60, 75) }));
      case "Weight (kg)":
        return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(50, 100, 1) }));
      case "CVP (cmH2O)":
        return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(2, 12, 1) }));
      case "C/G (In)":
         return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(28, 40) }));
      case "Pulse Oximetry (%)":
        return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(95, 100) }));
      case "Pain":
        return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(0, 10) }));
      case "Early Warning Sign":
         return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(0, 5) }));
      default:
        return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: 0 }));
    }
  };
  
  const getYAxisConfig = (vitalName: string): { label: string; domain: [number | string, number | string] } => {
    switch (vitalName) {
      case "B/P (mmHg)": return { label: "mmHg", domain: [40, 180] };
      case "Temp (F)": return { label: "°F", domain: [90, 110] };
      case "Resp (/min)": return { label: "/min", domain: [0, 40] };
      case "Pulse (/min)": return { label: "bpm", domain: [40, 140] };
      case "Height (In)": return { label: "Inches", domain: [0, 80] };
      case "Weight (kg)": return { label: "kg", domain: [0, 150] };
      case "CVP (cmH2O)": return { label: "cmH2O", domain: [0, 20] };
      case "C/G (In)": return { label: "Inches", domain: [0, 50] };
      case "Pulse Oximetry (%)": return { label: "%", domain: [70, 100] };
      case "Pain": return { label: "Scale 0-10", domain: [0, 10] };
      case "Early Warning Sign": return { label: "Score", domain: [0, 10] };
      default: return { label: "Value", domain: ['auto', 'auto'] };
    }
  };


  useEffect(() => {
    setChartData(getMockDataForVital(selectedVitalForGraph));
  }, [selectedVitalForGraph]);

  const yAxisConfig = getYAxisConfig(selectedVitalForGraph);

  return (
    <div className="flex-1 flex gap-3 overflow-hidden">
        <div className={`flex flex-col border rounded-md bg-card shadow ${isVitalsEntryMode ? 'flex-1' : 'flex-1'}`}> 
          <div className="flex items-center justify-between p-2 border-b bg-card text-foreground rounded-t-md">
            <h2 className="text-base font-semibold">{isVitalsEntryMode ? "Vitals Entry" : "Vitals"}</h2>
            {!isVitalsEntryMode && (
              <div className="flex items-center space-x-2 text-xs">
                <Checkbox id="enteredInError" checked={isEnteredInError} onCheckedChange={(checkedState) => setIsEnteredInError(Boolean(checkedState))} />
                <Label htmlFor="enteredInError" className="font-normal">Entered in Error</Label>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50" onClick={() => setIsVitalsEntryMode(!isVitalsEntryMode)}>
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isVitalsEntryMode ? (
            <>
              <div className="flex flex-wrap items-center space-x-2 p-2 border-b text-xs gap-y-2">
                <Label htmlFor="visitDateVitals" className="shrink-0">Visit Date</Label>
                <Select value={visitDate} onValueChange={setVisitDate}>
                  <SelectTrigger id="visitDateVitals" className="h-8 w-28 text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-1">
                  <Label htmlFor="fromDateVitals" className="shrink-0">From</Label>
                  <div className="relative">
                    <Input id="fromDateVitals" type="text" value={fromDate} onChange={(e) => setFromDate(e.target.value)} placeholder="DD/MM/YYYY" className="h-8 w-28 text-xs pr-8" />
                    <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Label htmlFor="toDateVitals" className="shrink-0">To</Label>
                  <div className="relative">
                    <Input id="toDateVitals" type="text" value={toDateValue} onChange={(e) => setToDateValue(e.target.value)} placeholder="DD/MM/YYYY" className="h-8 w-28 text-xs pr-8" />
                    <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end p-2 bg-accent text-foreground border-b text-xs font-medium">
                <div className="w-20 text-center">Date</div>
                <div className="w-20 text-center">Time</div>
              </div>

              <div className="flex-1 overflow-hidden min-h-0">
                <Table className="text-xs flex-1 min-h-0">
                  <TableBody>
                    {vitalTypes.map((vital, index) => (
                      <TableRow
                        key={vital}
                        className={`hover:bg-muted/30 cursor-pointer ${selectedVitalForGraph === vital ? 'bg-secondary text-primary' : ''} ${index % 2 === 0 ? 'bg-muted/30' : ''}`}
                        onClick={() => setSelectedVitalForGraph(vital)}
                      >
                        <TableCell className="font-medium py-1.5 px-3 border-r w-48 whitespace-nowrap">{vital}</TableCell>
                        <TableCell className="py-1.5 px-3 border-r w-20 text-center whitespace-nowrap">-</TableCell>
                        <TableCell className="py-1.5 px-3 w-20 text-center whitespace-nowrap">-</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-center space-x-2 p-2 border-t">
                <Button size="sm" className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground">Vitals Entry</Button>
                <Button size="sm" className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground">Multiple Vitals Graph</Button>
                <Button size="sm" className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground">ICU Flow Sheet</Button>
              </div>
            </>
          ) : (
            // Vitals Entry Form
            <div className="flex-1 overflow-hidden min-h-0">
              <Table className="text-xs flex-1 min-h-0">
                <ShadcnTableHeader className="bg-accent">
                  <TableRow>
                    <TableHead className="text-foreground font-semibold">Vitals</TableHead>
                    <TableHead className="text-foreground font-semibold">Not Recordable</TableHead>
                    <TableHead className="text-foreground font-semibold">Value</TableHead>
                    <TableHead className="text-foreground font-semibold">Unit</TableHead>
                    <TableHead className="text-foreground font-semibold">Qualifiers</TableHead>
                  </TableRow>
                </ShadcnTableHeader>
                <TableBody>
                  {/* B/P Row */}
                  <TableRow className={vitalTypes.indexOf("B/P (mmHg)") % 2 === 0 ? 'bg-muted/30' : ''}>
                    <TableCell>B/P</TableCell>
                    <TableCell><Checkbox id="bpNotRecordable" checked={vitalsEntryData.bloodPressureNotRecordable} onCheckedChange={(checked) => handleVitalsEntryChange('bloodPressureNotRecordable', Boolean(checked))} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Input type="text" placeholder="Systolic" className="h-7 text-xs w-20" value={vitalsEntryData.bloodPressureSystolic} onChange={e => handleVitalsEntryChange('bloodPressureSystolic', e.target.value)} />
                        <span>/</span>
                        <Input type="text" placeholder="Diastolic" className="h-7 text-xs w-20" value={vitalsEntryData.bloodPressureDiastolic} onChange={e => handleVitalsEntryChange('bloodPressureDiastolic', e.target.value)} />
                      </div>
                    </TableCell>
                    <TableCell>mmHg</TableCell>
                    <TableCell>
                      <Select value={vitalsEntryData.bloodPressureQualifier} onValueChange={val => handleVitalsEntryChange('bloodPressureQualifier', val)}>
                        <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent><SelectItem value="sitting">Sitting</SelectItem><SelectItem value="standing">Standing</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                   {/* Temperature Row */}
                   <TableRow className={vitalTypes.indexOf("Temp (F)") % 2 === 0 ? 'bg-muted/30' : ''}>
                    <TableCell>Temp</TableCell>
                    <TableCell></TableCell> 
                    <TableCell>
                      <Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.temperatureValue} onChange={e => handleVitalsEntryChange('temperatureValue', e.target.value)} />
                    </TableCell>
                    <TableCell>
                       <Select value={vitalsEntryData.temperatureUnit} onValueChange={val => handleVitalsEntryChange('temperatureUnit', val)}>
                          <SelectTrigger className="h-7 text-xs w-20"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="F">F</SelectItem><SelectItem value="C">C</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                     <TableCell>
                       <Select value={vitalsEntryData.temperatureSite} onValueChange={val => handleVitalsEntryChange('temperatureSite', val)}>
                          <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Site" /></SelectTrigger>
                          <SelectContent><SelectItem value="oral">Oral</SelectItem><SelectItem value="axillary">Axillary</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow className={vitalTypes.indexOf("Pain") % 2 === 0 ? 'bg-muted/30' : ''}>
                    <TableCell>Pain</TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Select value={vitalsEntryData.painValue} onValueChange={val => handleVitalsEntryChange('painValue', val)}>
                        <SelectTrigger className="h-7 text-xs w-24"><SelectValue placeholder="Scale 0-10" /></SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 11 }, (_, i) => <SelectItem key={i} value={i.toString()}>{i}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell></TableCell>
                     <TableCell>
                      <Select value={vitalsEntryData.temperatureQualifier} onValueChange={val => handleVitalsEntryChange('temperatureQualifier' , val)}>
                        <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Location" /></SelectTrigger>
                        <SelectContent><SelectItem value="head">Head</SelectItem><SelectItem value="chest">Chest</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow className={vitalTypes.indexOf("Pulse (/min)") % 2 === 0 ? 'bg-muted/30' : ''}>
                    <TableCell>Pulse</TableCell>
                    <TableCell></TableCell>
                    <TableCell><Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.pulseValue} onChange={e => handleVitalsEntryChange('pulseValue', e.target.value)} /></TableCell>
                    <TableCell>/min</TableCell>
                    <TableCell>
                      <Select value={vitalsEntryData.pulseQualifier} onValueChange={val => handleVitalsEntryChange('pulseQualifier', val)}>
                        <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent><SelectItem value="regular">Regular</SelectItem><SelectItem value="irregular">Irregular</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow className={vitalTypes.indexOf("Height (In)") % 2 === 0 ? 'bg-muted/30' : ''}>
                    <TableCell>Height</TableCell>
                    <TableCell></TableCell>
                    <TableCell><Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.heightValue} onChange={e => handleVitalsEntryChange('heightValue', e.target.value)} /></TableCell>
                    <TableCell>
                      <Select value={vitalsEntryData.heightUnit} onValueChange={val => handleVitalsEntryChange('heightUnit', val)}>
                        <SelectTrigger className="h-7 text-xs w-20"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="cm">cm</SelectItem><SelectItem value="in">in</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                       <Select value={vitalsEntryData.heightQualifier} onValueChange={val => handleVitalsEntryChange('heightQualifier', val)}>
                          <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent><SelectItem value="standing">Standing</SelectItem><SelectItem value="lying">Lying</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow className={vitalTypes.indexOf("Weight (kg)") % 2 === 0 ? 'bg-muted/30' : ''}>
                    <TableCell>Weight</TableCell>
                    <TableCell></TableCell>
                    <TableCell><Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.weightValue} onChange={e => handleVitalsEntryChange('weightValue', e.target.value)} /></TableCell>
                    <TableCell>
                      <Select value={vitalsEntryData.weightUnit} onValueChange={val => handleVitalsEntryChange('weightUnit', val)}>
                        <SelectTrigger className="h-7 text-xs w-20"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="kg">kg</SelectItem><SelectItem value="lbs">lbs</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={vitalsEntryData.weightQualifier} onValueChange={val => handleVitalsEntryChange('weightQualifier', val)}>
                        <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent><SelectItem value="with_clothes">With Clothes</SelectItem><SelectItem value="without_clothes">Without Clothes</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow className={vitalTypes.indexOf("Resp (/min)") % 2 === 0 ? 'bg-muted/30' : ''}>
                    <TableCell>Resp</TableCell>
                    <TableCell></TableCell>
                    <TableCell><Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.respirationValue} onChange={e => handleVitalsEntryChange('respirationValue', e.target.value)} /></TableCell>
                    <TableCell>/min</TableCell>
                    <TableCell>
                      <Select value={vitalsEntryData.respirationQualifier} onValueChange={val => handleVitalsEntryChange('respirationQualifier', val)}>
                          <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent><SelectItem value="normal">Normal</SelectItem><SelectItem value="labored">Labored</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow className={vitalTypes.indexOf("CVP (cmH2O)") % 2 === 0 ? 'bg-muted/30' : ''}>
                      <TableCell>CVP</TableCell>
                      <TableCell></TableCell>
                      <TableCell><Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.cvpValue} onChange={e => handleVitalsEntryChange('cvpValue', e.target.value)} /></TableCell>
                      <TableCell>
                          <Select value={vitalsEntryData.cvpUnit} onValueChange={val => handleVitalsEntryChange('cvpUnit', val)}>
                              <SelectTrigger className="h-7 text-xs w-20"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="mmHg">mmHg</SelectItem><SelectItem value="cmH2O">cmH2O</SelectItem></SelectContent>
                          </Select>
                      </TableCell>
                      <TableCell></TableCell> 
                  </TableRow>
                  <TableRow className={vitalTypes.indexOf("C/G (In)") % 2 === 0 ? 'bg-muted/30' : ''}>
                      <TableCell>C/G</TableCell>
                      <TableCell></TableCell>
                      <TableCell><Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.cgValue} onChange={e => handleVitalsEntryChange('cgValue', e.target.value)} /></TableCell>
                       <TableCell>
                          <Select value={vitalsEntryData.cgUnit} onValueChange={val => handleVitalsEntryChange('cgUnit', val)}>
                              <SelectTrigger className="h-7 text-xs w-20"><SelectValue /></SelectTrigger>
                              <SelectContent><SelectItem value="cm">cm</SelectItem><SelectItem value="in">in</SelectItem></SelectContent>
                          </Select>
                      </TableCell>
                      <TableCell>
                          <Select value={vitalsEntryData.cgQualifier} onValueChange={val => handleVitalsEntryChange('cgQualifier', val)}>
                              <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                              <SelectContent><SelectItem value="option_x">Option X</SelectItem><SelectItem value="option_y">Option Y</SelectItem></SelectContent>
                          </Select>
                      </TableCell>
                  </TableRow>
                  <TableRow className={vitalTypes.indexOf("Pulse Oximetry (%)") % 2 === 0 ? 'bg-muted/30' : ''}>
                      <TableCell>Pulse Oximetry</TableCell>
                      <TableCell></TableCell>
                      <TableCell><Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.pulseOximetryValue} onChange={e => handleVitalsEntryChange('pulseOximetryValue', e.target.value)} /></TableCell>
                      <TableCell>%</TableCell>
                       <TableCell>
                          <Select value={vitalsEntryData.pulseOximetryQualifier} onValueChange={val => handleVitalsEntryChange('pulseOximetryQualifier', val)}>
                              <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                              <SelectContent><SelectItem value="room_air">Room Air</SelectItem><SelectItem value="on_oxygen">On Oxygen</SelectItem></SelectContent>
                          </Select>
                      </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
               <div className="flex justify-end space-x-2 mt-4 p-2 border-t">
                  <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => setIsVitalsEntryMode(false)}>Cancel</Button>
                  <Button size="sm" className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => { setIsVitalsEntryMode(false); } }>Save</Button>
              </div>
            </div>
          )}
        </div>

        {!isVitalsEntryMode && (
           <div className="flex-1 flex flex-col border rounded-md bg-card shadow"> 
            <div className="flex items-center p-2 border-b bg-card text-foreground rounded-t-md">
              <h2 className="text-base font-semibold">{selectedVitalForGraph} Graph</h2>
            </div>
            <div className="flex-1 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} label={{ value: "Time/Sequence", position: 'insideBottom', offset: -10, fontSize: 10 }} />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    domain={yAxisConfig.domain as [number | string, number | string]}
                    label={{ value: yAxisConfig.label, angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, dy: 40 }}
                  />
                  <Tooltip contentStyle={{ fontSize: 10, padding: '2px 5px' }} />
                  <Legend wrapperStyle={{ fontSize: "10px" }} />
                  {selectedVitalForGraph === "B/P (mmHg)" ? (
                    <>
                      <Line type="monotone" dataKey="systolic" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Systolic" />
                      <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Diastolic" />
                    </>
                  ) : (
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name={selectedVitalForGraph} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
  );
};


const IntakeOutputView = () => {
  const [fromDate, setFromDate] = useState<string>("05/16/2025 14:5");
  const [toDateValue, setToDateValue] = useState<string>("05/17/2025 14:5"); 

  const mockIntakeOutputChartData = [
    { name: '08:00', series1: 400, series2: 240 }, { name: '10:00', series1: 300, series2: 139 },
    { name: '12:00', series1: 200, series2: 980 }, { name: '14:00', series1: 278, series2: 390 },
    { name: '16:00', series1: 189, series2: 480 }, { name: '18:00', series1: 239, series2: 380 },
    { name: '20:00', series1: 349, series2: 430 },
  ];

  const IntakeOutputTable = () => {
    const inputHeaders = ["IV FLUID", "BLOOD PRODUCT", "PO", "TUBE FEEDING", "INFUSION", "OTHER"];
    const outputHeaders = ["URINE", "N/G", "EMESIS", "DRAINAGE", "FAECES"];
  
    return (
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-accent text-foreground">
              <th colSpan={inputHeaders.length} className="p-2 border text-center font-semibold">Input</th>
              <th colSpan={outputHeaders.length} className="p-2 border text-center font-semibold">Output</th>
            </tr>
            <tr className="bg-accent text-foreground">
              {inputHeaders.map(header => (
                <th key={header} className="p-1.5 border font-medium text-center whitespace-nowrap">
                  {header.split(" ")[0]}<br/>{header.split(" ")[1] || ""}
                </th>
              ))}
              {outputHeaders.map(header => (
                <th key={header} className="p-1.5 border font-medium text-center whitespace-nowrap">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card">
            {[1,2].map((rowNum, index) => ( 
              <TableRow key={`data-row-${rowNum}`} className={index % 2 === 0 ? 'even:bg-muted/30' : ''}>
                {inputHeaders.map(header => <TableCell key={`input-data-${header}-${rowNum}`} className="p-1.5 border text-center h-8">-</TableCell>)}
                {outputHeaders.map(header => <TableCell key={`output-data-${header}-${rowNum}`} className="p-1.5 border text-center h-8">-</TableCell>)}
              </TableRow>
            ))}
            <TableRow className="bg-muted/30">
              <TableCell colSpan={inputHeaders.length} className="p-1.5 border text-left font-semibold">Total:</TableCell>
              <TableCell colSpan={outputHeaders.length} className="p-1.5 border text-left font-semibold"></TableCell>
            </TableRow>
          </tbody>
        </table>
      </div>
    );
  };


  return (
    <div className="flex-1 flex gap-3 overflow-hidden">
      <div className="flex-[7] flex flex-col border rounded-md bg-card shadow overflow-hidden">
        <div className="flex items-center justify-between p-2 border-b bg-card text-foreground rounded-t-md">
          <h2 className="text-base font-semibold">Patient Intake/Output Summary</h2>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <RefreshCw className="h-4 w-4" />
            </Button>
             <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center space-x-3 p-2 border-b text-xs gap-y-2">
          <Label htmlFor="intakeFromDate" className="shrink-0">From Date</Label>
          <div className="relative">
            <Input id="intakeFromDate" type="text" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-8 w-36 text-xs pr-8" />
            <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
            </Button>
          </div>
          <Label htmlFor="intakeToDate" className="shrink-0">To Date</Label>
           <div className="relative">
            <Input id="intakeToDate" type="text" value={toDateValue} onChange={(e) => setToDateValue(e.target.value)} className="h-8 w-36 text-xs pr-8" />
             <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <IntakeOutputTable />
        <div className="p-2 border-t text-xs space-y-1">
            <div className="flex justify-between"><span>Total Intake Measured:</span><span> ml</span></div>
            <div className="flex justify-between"><span>Total Output Measured:</span><span> ml</span></div>
            <div className="flex justify-between"><span>Total Balanced Measured:</span><span> ml</span></div>
            <div className="text-primary text-center mt-1">M-Morning(08:00-13:59) E-Evening(14:00-19:59) N-Night(20:00-07:59)</div>
        </div>
        <div className="flex items-center justify-center space-x-2 p-2 border-t">
          <Button size="sm" className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground">Add Intake</Button>
          <Button size="sm" className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground">Add Output</Button>
          <Button size="sm" className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground">Update Intake</Button>
          <Button size="sm" className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground">Update Output</Button>
        </div>
      </div>

      <div className="flex-[3] flex flex-col border rounded-md bg-card shadow">
        <div className="flex items-center p-2 border-b bg-card text-foreground rounded-t-md">
          <h2 className="text-base font-semibold">Intake/Output Graph</h2>
        </div>
        <div className="flex-1 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockIntakeOutputChartData} margin={{ top: 5, right: 20, bottom: 20, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} label={{ value: "Date/Time", position: 'insideBottom', offset: -5, fontSize: 10 }} />
              <YAxis 
                tick={{ fontSize: 10 }} 
                label={{ value: "Total Intake / Output (ml)", angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, dy: 0 }} 
              />
              <Tooltip contentStyle={{ fontSize: 10, padding: '2px 5px' }}/>
              <Legend verticalAlign="top" height={36} wrapperStyle={{fontSize: "10px"}} />
              <Line type="monotone" dataKey="series1" name="Series 1" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="series2" name="Series 2" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const ProblemsView = () => {
  const [showEntries, setShowEntries] = useState<string>("all");
  const [problemVisitDate, setProblemVisitDate] = useState<string>("10 SEP, 2024 13:10");
  const [statusToggle, setStatusToggle] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

  const tableHeaders = ["Problems", "Immediacy", "Status", "Date of OnSet", "Edit", "Remove", "Restore", "Co-Morbidity"];

  return (
    <Card className="flex-1 flex flex-col shadow text-xs">
       <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex flex-wrap items-center justify-between gap-y-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="showEntriesProblem" className="text-xs">Show</Label>
            <Select value={showEntries} onValueChange={setShowEntries}>
              <SelectTrigger id="showEntriesProblem" className="h-7 w-20 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="showEntriesProblem" className="text-xs">entries</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="visitDateProblem" className="text-xs">Visit Date</Label>
            <Select value={problemVisitDate} onValueChange={setProblemVisitDate}>
              <SelectTrigger id="visitDateProblem" className="h-7 w-40 text-xs">
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10 SEP, 2024 13:10">10 SEP, 2024 13:10</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="statusToggleProblem" className="text-xs">Status</Label>
            <Switch id="statusToggleProblem" checked={statusToggle} onCheckedChange={setStatusToggle} className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-5 w-9"/>
            <Label htmlFor="statusToggleProblem" className="text-xs ml-1">ALL</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="searchProblem" className="text-xs">Search:</Label>
            <Input id="searchProblem" type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="h-7 w-32 text-xs" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden min-h-0">
          <Table className="text-xs flex-1 min-h-0">
            <ShadcnTableHeader className="bg-accent text-foreground sticky top-0 z-10">
              <TableRow>
                {tableHeaders.map(header => (
                  <TableHead key={header} className="py-2 px-3 font-semibold h-8 whitespace-nowrap text-foreground">
                    <div className="flex items-center justify-between">
                      {header}
                      <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </ShadcnTableHeader>
            <TableBody>
              <TableRow className="even:bg-muted/30">
                <TableCell colSpan={tableHeaders.length} className="text-center py-10 text-muted-foreground">
                  No Data Found
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
      </CardContent>
      <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground">
        <div>Showing 0 to 0 of 0 entries</div>
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Previous</Button>
          <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1 bg-accent text-foreground border-border">1</Button>
          <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Next</Button>
        </div>
      </div>
       <div className="flex items-center justify-center p-2.5 border-t">
          <Button size="sm" className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground">New Problem</Button>
        </div>
    </Card>
  );
};

const FinalDiagnosisView = () => {
  const [showEntries, setShowEntries] = useState<string>("10");
  const [visitDate, setVisitDate] = useState<string>("10 SEP, 2024 13:10");
  const [searchText, setSearchText] = useState<string>("");

  const tableHeaders = ["Primary/Secondary", "Diagnosis Description", "Comment", "Entered Date", "Provider", "Primary", "Add", "Remove"];

  return (
    <Card className="flex-1 flex flex-col shadow text-xs">
      <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <CardTitle className="text-base font-semibold">Diagnosis</CardTitle>
      </CardHeader>
      <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-2 border-b gap-y-2 mb-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="showEntriesDiagnosis" className="text-xs">Show</Label>
            <Select value={showEntries} onValueChange={setShowEntries}>
              <SelectTrigger id="showEntriesDiagnosis" className="h-7 w-20 text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="showEntriesDiagnosis" className="text-xs">entries</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="visitDateDiagnosis" className="text-xs">Visit Date</Label>
            <Select value={visitDate} onValueChange={setVisitDate}>
              <SelectTrigger id="visitDateDiagnosis" className="h-7 w-40 text-xs">
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10 SEP, 2024 13:10">10 SEP, 2024 13:10</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="searchDiagnosis" className="text-xs">Search:</Label>
            <Input id="searchDiagnosis" type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="h-7 w-48 text-xs" />
          </div>
        </div>

        <div className="flex-1 overflow-hidden min-h-0">
          <Table className="text-xs flex-1 min-h-0">
            <ShadcnTableHeader className="bg-accent text-foreground sticky top-0 z-10">
              <TableRow>
                {tableHeaders.map(header => (
                  <TableHead key={header} className="py-2 px-3 font-semibold h-8 whitespace-nowrap text-foreground">
                    <div className="flex items-center justify-between">
                      {header}
                      <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </ShadcnTableHeader>
            <TableBody>
              <TableRow className="even:bg-muted/30">
                <TableCell colSpan={tableHeaders.length} className="text-center py-10 text-muted-foreground">
                  No Data Found
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
         <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
            <div>Showing 0 to 0 of 0 entries</div>
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Previous</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1 bg-accent text-foreground border-border">1</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Next</Button>
            </div>
          </div>
      </CardContent>
       <div className="flex items-center justify-center p-2.5 border-t">
          <Button size="sm" className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground">New Diagnosis</Button>
        </div>
    </Card>
  );
};

const ChiefComplaintsView = () => {
  const [showEntries, setShowEntries] = useState<string>("10");
  const [visitDate, setVisitDate] = useState<string>("10 SEP, 2024 13:10");
  const [statusActive, setStatusActive] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

  const tableHeaders = ["S.No", "Complaints", "Complaints Type", "Date", "Status", "Remark"];

  return (
    <Card className="flex-1 flex flex-col shadow text-xs">
      <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Chief-Complaints</CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-2 border-b gap-y-2 mb-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="showEntriesComplaint" className="text-xs">Show</Label>
            <Select value={showEntries} onValueChange={setShowEntries}>
              <SelectTrigger id="showEntriesComplaint" className="h-7 w-20 text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="showEntriesComplaint" className="text-xs">entries</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="visitDateComplaint" className="text-xs">Visit Date</Label>
            <Select value={visitDate} onValueChange={setVisitDate}>
              <SelectTrigger id="visitDateComplaint" className="h-7 w-40 text-xs">
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10 SEP, 2024 13:10">10 SEP, 2024 13:10</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="statusSwitchComplaint" className="text-xs">Status</Label>
            <Switch id="statusSwitchComplaint" checked={statusActive} onCheckedChange={setStatusActive}  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-5 w-9"/>
            <Label htmlFor="statusSwitchComplaint" className="text-xs ml-1">{statusActive ? "ACTIVE" : "INACTIVE"}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="searchComplaint" className="text-xs">Search:</Label>
            <Input id="searchComplaint" type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="h-7 w-48 text-xs" />
          </div>
        </div>

        <div className="flex-1 overflow-hidden min-h-0">
          <Table className="text-xs flex-1 min-h-0">
            <ShadcnTableHeader className="bg-accent text-foreground sticky top-0 z-10">
              <TableRow>
                {tableHeaders.map(header => (
                  <TableHead key={header} className="py-2 px-3 font-semibold h-8 whitespace-nowrap text-foreground">
                    <div className="flex items-center justify-between">
                      {header}
                      <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </ShadcnTableHeader>
            <TableBody>
              <TableRow className="even:bg-muted/30">
                <TableCell colSpan={tableHeaders.length} className="text-center py-10 text-muted-foreground">
                  No Data Found
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
          <div>Showing 0 to 0 of 0 entries</div>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Previous</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1 bg-accent text-foreground border-border">1</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Next</Button>
          </div>
        </div>
      </CardContent>
       <div className="flex items-center justify-center p-2.5 border-t">
          <Button size="sm" className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground">New Chief Complaints</Button>
        </div>
    </Card>
  );
};

const AllergiesView = () => {
  const [showEntries, setShowEntries] = useState<string>("10");
  const [visitDate, setVisitDate] = useState<string>("10 SEP, 2024 13:10"); 
  const [statusActive, setStatusActive] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

  const tableHeaders = ["S.No", "Allergen", "Reaction", "Severity", "Type", "Onset Date", "Status"];

  return (
    <Card className="flex-1 flex flex-col shadow text-xs">
      <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Allergies</CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-2 border-b gap-y-2 mb-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="showEntriesAllergy" className="text-xs">Show</Label>
            <Select value={showEntries} onValueChange={setShowEntries}>
              <SelectTrigger id="showEntriesAllergy" className="h-7 w-20 text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="showEntriesAllergy" className="text-xs">entries</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="visitDateAllergy" className="text-xs">Date Range</Label>
            <Select value={visitDate} onValueChange={setVisitDate}>
              <SelectTrigger id="visitDateAllergy" className="h-7 w-40 text-xs">
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10 SEP, 2024 13:10">10 SEP, 2024 13:10</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="statusSwitchAllergy" className="text-xs">Status</Label>
            <Switch id="statusSwitchAllergy" checked={statusActive} onCheckedChange={setStatusActive} className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-5 w-9"/>
            <Label htmlFor="statusSwitchAllergy" className="text-xs ml-1">{statusActive ? "ACTIVE" : "INACTIVE"}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="searchAllergy" className="text-xs">Search:</Label>
            <Input id="searchAllergy" type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="h-7 w-48 text-xs" />
          </div>
        </div>

        <div className="flex-1 overflow-hidden min-h-0">
          <Table className="text-xs flex-1 min-h-0">
            <ShadcnTableHeader className="bg-accent text-foreground sticky top-0 z-10">
              <TableRow>
                {tableHeaders.map(header => (
                  <TableHead key={header} className="py-2 px-3 font-semibold h-8 whitespace-nowrap text-foreground">
                    <div className="flex items-center justify-between">
                      {header}
                      <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </ShadcnTableHeader>
            <TableBody>
              <TableRow className="even:bg-muted/30">
                <TableCell colSpan={tableHeaders.length} className="text-center py-10 text-muted-foreground">
                  No Data Found
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
          <div>Showing 0 to 0 of 0 entries</div>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Previous</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1 bg-accent text-foreground border-border">1</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Next</Button>
          </div>
        </div>
      </CardContent>
       <div className="flex items-center justify-center p-2.5 border-t">
          <Button size="sm" className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground">New Allergy</Button>
        </div>
    </Card>
  );
};

const OpdIpdDetailsView = () => {
  const [showEntries, setShowEntries] = useState<string>("10");
  const [visitDate, setVisitDate] = useState<string>("10 SEP, 2024 13:10");
  const [statusActive, setStatusActive] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

  const tableHeaders = ["S.No", "Visit ID", "Visit Type", "Department", "Doctor", "Date", "Status"];

  return (
    <Card className="flex-1 flex flex-col shadow text-xs">
      <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">OPD/IPD Details</CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-2 border-b gap-y-2 mb-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="showEntriesOpdIpd" className="text-xs">Show</Label>
            <Select value={showEntries} onValueChange={setShowEntries}>
              <SelectTrigger id="showEntriesOpdIpd" className="h-7 w-20 text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="showEntriesOpdIpd" className="text-xs">entries</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="visitDateOpdIpd" className="text-xs">Visit Date</Label>
            <Select value={visitDate} onValueChange={setVisitDate}>
              <SelectTrigger id="visitDateOpdIpd" className="h-7 w-40 text-xs">
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10 SEP, 2024 13:10">10 SEP, 2024 13:10</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="statusSwitchOpdIpd" className="text-xs">Status</Label>
            <Switch id="statusSwitchOpdIpd" checked={statusActive} onCheckedChange={setStatusActive} className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-5 w-9"/>
            <Label htmlFor="statusSwitchOpdIpd" className="text-xs ml-1">{statusActive ? "ACTIVE" : "INACTIVE"}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="searchOpdIpd" className="text-xs">Search:</Label>
            <Input id="searchOpdIpd" type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="h-7 w-48 text-xs" />
          </div>
        </div>

        <div className="flex-1 overflow-hidden min-h-0">
          <Table className="text-xs flex-1 min-h-0">
            <ShadcnTableHeader className="bg-accent text-foreground sticky top-0 z-10">
              <TableRow>
                {tableHeaders.map(header => (
                  <TableHead key={header} className="py-2 px-3 font-semibold h-8 whitespace-nowrap text-foreground">
                    <div className="flex items-center justify-between">
                      {header}
                      <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </ShadcnTableHeader>
            <TableBody>
              <TableRow className="even:bg-muted/30">
                <TableCell colSpan={tableHeaders.length} className="text-center py-10 text-muted-foreground">
                  No Data Found
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
          <div>Showing 0 to 0 of 0 entries</div>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Previous</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1 bg-accent text-foreground border-border">1</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Next</Button>
          </div>
        </div>
      </CardContent>
       <div className="flex items-center justify-center p-2.5 border-t">
          <Button size="sm" className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground">New OPD/IPD Entry</Button>
        </div>
    </Card>
  );
};


const VitalsDashboardPage: NextPage = () => {
  const [activeVerticalTab, setActiveVerticalTab] = useState<string>("Vitals");

  return (
    <div className="flex flex-col h-[calc(100vh-var(--top-nav-height,60px))] bg-background text-sm p-3">
      {/* Horizontal Navigation Bar */}
      <div className="flex items-end space-x-1 px-1 pt-2 pb-0 mb-3 overflow-x-auto no-scrollbar border-b-2 border-border bg-card">
        {verticalNavItems.map((item) => (
          <Button
            key={item}
            onClick={() => setActiveVerticalTab(item)}
            className={`text-xs px-3 py-1.5 h-auto rounded-b-none rounded-t-md whitespace-nowrap focus-visible:ring-0 focus-visible:ring-offset-0
              ${activeVerticalTab === item
                ? 'bg-background text-primary border-x border-t border-border border-b-2 border-b-background shadow-sm relative -mb-px z-10 hover:bg-background hover:text-primary' 
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground border-x border-t border-transparent'
              }`}
          >
            {item}
          </Button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col gap-3 overflow-hidden">
        {activeVerticalTab === "Vitals" && <VitalsView />}
        {activeVerticalTab === "Intake/Output" && <IntakeOutputView />}
        {activeVerticalTab === "Problems" && <ProblemsView />}
        {activeVerticalTab === "Final Diagnosis" && <FinalDiagnosisView />}
        {activeVerticalTab === "Chief-Complaints" && <ChiefComplaintsView />}
        {activeVerticalTab === "Allergies" && <AllergiesView />}
        {activeVerticalTab === "OPD/IPD Details" && <OpdIpdDetailsView />}
        
        
        {![
            "Vitals", "Intake/Output", "Problems", "Final Diagnosis", 
            "Chief-Complaints", "Allergies", "OPD/IPD Details",
        ].includes(activeVerticalTab) && (
          <Card className="flex-1 flex items-center justify-center">
            <CardContent className="text-center">
              <CardTitle className="text-xl text-muted-foreground">
                {activeVerticalTab} View
              </CardTitle>
              <p className="text-sm text-muted-foreground">Content for this section is not yet implemented.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default VitalsDashboardPage;
