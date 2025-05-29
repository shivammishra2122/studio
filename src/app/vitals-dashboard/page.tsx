
'use client';

import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader as ShadcnTableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Edit3, CalendarDays, RefreshCw, ArrowUpDown, ChevronDown, ChevronUp, Settings, FileEdit, Printer, Download, Filter, Ban, FileText, PenLine } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

const verticalNavItems = [
  "Vitals", "Intake/Output", "Problems", "Final Diagnosis",
  "Chief-Complaints", "Allergies", "OPD/IPD Details"]

const vitalTypes = [
  "B/P (mmHg)", "Temp (F)", "Resp (/min)", "Pulse (/min)",
  "Height (In)", "Weight (kg)", "CVP (cmH2O)", "C/G (In)",
  "Pulse Oximetry (%)", "Pain", "Early Warning Sign", "Location", "Entered By"
];

type VitalChartDataPoint = { name: string; value?: number; systolic?: number; diastolic?: number };

const generateRandomValue = (min: number, max: number, toFixed: number = 0): number => {
  if (typeof window === 'undefined') return parseFloat(min.toFixed(toFixed));
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(toFixed));
};

const getMockDataForVital = (vitalName: string): VitalChartDataPoint[] => {
  if (typeof window === 'undefined') {
    const defaultData = Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString() }));
    if (vitalName === "B/P (mmHg)") {
      return defaultData.map(d => ({ ...d, systolic: 0, diastolic: 0 }));
    }
    return defaultData.map(d => ({ ...d, value: 0 }));
  }

  switch (vitalName) {
    case "B/P (mmHg)":
      return Array.from({ length: 10 }, (_, i) => ({
        name: (i + 1).toString(),
        systolic: generateRandomValue(110, 140),
        diastolic: generateRandomValue(70, 90)
      }));
    case "Temp (F)":
      return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(97.0, 102.0, 1) }));
    case "Resp (/min)":
      return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(12, 22) }));
    case "Pulse (/min)":
      return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(60, 100) }));
    case "Height (In)":
      return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(60, 75, 1) }));
    case "Weight (kg)":
      return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(50, 100, 1) }));
    case "CVP (cmH2O)":
      return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(2, 8, 1) }));
    case "C/G (In)":
      return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(20, 40, 1) }));
    case "Pulse Oximetry (%)":
      return Array.from({ length: 10 }, (_, i) => ({ name: (i + 1).toString(), value: generateRandomValue(94, 99) }));
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
    case "B/P (mmHg)": return { label: "mmHg", domain: [40, 200] };
    case "Temp (F)": return { label: "°F", domain: [95, 105] };
    case "Resp (/min)": return { label: "/min", domain: [0, 40] };
    case "Pulse (/min)": return { label: "bpm", domain: [40, 160] };
    case "Height (In)": return { label: "Inches", domain: [48, 84] };
    case "Weight (kg)": return { label: "kg", domain: [30, 150] };
    case "CVP (cmH2O)": return { label: "cmH2O", domain: [0, 15] };
    case "C/G (In)": return { label: "Inches", domain: [15, 45] };
    case "Pulse Oximetry (%)": return { label: "%", domain: [80, 100] };
    case "Pain": return { label: "Scale 0-10", domain: [0, 10] };
    case "Early Warning Sign": return { label: "Score", domain: [0, 10] };
    default: return { label: "Value", domain: ['auto', 'auto'] };
  }
};

const VitalsView = () => {
  const [visitDateState, setVisitDateState] = useState<string | undefined>("today");
  const [fromDateValue, setFromDateValue] = useState<string>("");
  const [toDateValueState, setToDateValueState] = useState<string>("");
  const [selectedVitalForGraph, setSelectedVitalForGraph] = useState<string>(vitalTypes[0]);
  const [chartData, setChartData] = useState<VitalChartDataPoint[]>([]);
  const [isEnteredInError, setIsEnteredInError] = useState<boolean>(false);
  const [isVitalsEntryMode, setIsVitalsEntryMode] = useState<boolean>(false);
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
    cgValue: '',
    cgUnit: 'cm',
    cgQualifier: undefined as string | undefined,
    pulseOximetryValue: '',
    pulseOximetryQualifier: undefined as string | undefined,
  });

  const handleVitalsEntryChange = (field: keyof typeof vitalsEntryData, value: string | boolean | undefined) => {
    setVitalsEntryData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setChartData(getMockDataForVital(selectedVitalForGraph));
  }, [selectedVitalForGraph]);

  const yAxisConfig = getYAxisConfig(selectedVitalForGraph);

  return (
    <div className="flex-1 flex gap-3 overflow-auto">
      <div className="flex-1 flex flex-col border rounded-md bg-card shadow">
        <div className="flex items-center justify-between p-2 border-b bg-card text-foreground rounded-t-md">
          <h2 className="text-base font-semibold">{isVitalsEntryMode ? "Vitals Entry" : "Vitals"}</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50" onClick={() => setIsVitalsEntryMode(!isVitalsEntryMode)}>
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isVitalsEntryMode ? (
          <>
            <ScrollArea className="flex-1 min-h-0">
              <Table className="text-xs">
                <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="text-foreground font-semibold py-2 px-3 h-8">Vitals</TableHead>
                    <TableHead className="text-foreground font-semibold py-2 px-3 h-8">Not Recordable</TableHead>
                    <TableHead className="text-foreground font-semibold py-2 px-3 h-8">Value</TableHead>
                    <TableHead className="text-foreground font-semibold py-2 px-3 h-8">Unit</TableHead>
                    <TableHead className="text-foreground font-semibold py-2 px-3 h-8">Qualifiers</TableHead>
                  </TableRow>
                </ShadcnTableHeader>
                <TableBody>
                  <TableRow className="bg-muted/30">
                    <TableCell className="py-1.5 px-3">B/P</TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Checkbox id="bpNotRecordable" checked={vitalsEntryData.bloodPressureNotRecordable} onCheckedChange={(checked) => handleVitalsEntryChange('bloodPressureNotRecordable', Boolean(checked))} className="h-3.5 w-3.5" />
                    </TableCell>
                    <TableCell className="py-1.5 px-3">
                      <div className="flex items-center gap-1">
                        <Input type="text" placeholder="Systolic" className="h-7 text-xs w-20" value={vitalsEntryData.bloodPressureSystolic} onChange={e => handleVitalsEntryChange('bloodPressureSystolic', e.target.value)} />
                        <span>/</span>
                        <Input type="text" placeholder="Diastolic" className="h-7 text-xs w-20" value={vitalsEntryData.bloodPressureDiastolic} onChange={e => handleVitalsEntryChange('bloodPressureDiastolic', e.target.value)} />
                      </div>
                    </TableCell>
                    <TableCell className="py-1.5 px-3">mmHg</TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Select value={vitalsEntryData.bloodPressureQualifier} onValueChange={val => handleVitalsEntryChange('bloodPressureQualifier', val)}>
                        <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sitting" className="text-xs">Sitting</SelectItem>
                          <SelectItem value="standing" className="text-xs">Standing</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1.5 px-3">Temp</TableCell>
                    <TableCell className="py-1.5 px-3"></TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.temperatureValue} onChange={e => handleVitalsEntryChange('temperatureValue', e.target.value)} />
                    </TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Select value={vitalsEntryData.temperatureUnit} onValueChange={val => handleVitalsEntryChange('temperatureUnit', val)}>
                        <SelectTrigger className="h-7 text-xs w-20"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="F" className="text-xs">F</SelectItem>
                          <SelectItem value="C" className="text-xs">C</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Select value={vitalsEntryData.temperatureQualifier} onValueChange={val => handleVitalsEntryChange('temperatureQualifier', val)}>
                        <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Site" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oral" className="text-xs">Oral</SelectItem>
                          <SelectItem value="axillary" className="text-xs">Axillary</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/30">
                    <TableCell className="py-1.5 px-3">Pain</TableCell>
                    <TableCell className="py-1.5 px-3"></TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Select value={vitalsEntryData.painValue} onValueChange={val => handleVitalsEntryChange('painValue', val)}>
                        <SelectTrigger className="h-7 text-xs w-24"><SelectValue placeholder="Scale 0-10" /></SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 11 }, (_, i) => <SelectItem key={i} value={i.toString()} className="text-xs">{i}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-1.5 px-3"></TableCell>
                    <TableCell className="py-1.5 px-3"></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1.5 px-3">Pulse</TableCell>
                    <TableCell className="py-1.5 px-3"></TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.pulseValue} onChange={e => handleVitalsEntryChange('pulseValue', e.target.value)} />
                    </TableCell>
                    <TableCell className="py-1.5 px-3">/min</TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Select value={vitalsEntryData.pulseQualifier} onValueChange={val => handleVitalsEntryChange('pulseQualifier', val)}>
                        <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regular" className="text-xs">Regular</SelectItem>
                          <SelectItem value="irregular" className="text-xs">Irregular</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/30">
                    <TableCell className="py-1.5 px-3">Height</TableCell>
                    <TableCell className="py-1.5 px-3"></TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.heightValue} onChange={e => handleVitalsEntryChange('heightValue', e.target.value)} />
                    </TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Select value={vitalsEntryData.heightUnit} onValueChange={val => handleVitalsEntryChange('heightUnit', val)}>
                        <SelectTrigger className="h-7 text-xs w-20"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm" className="text-xs">cm</SelectItem>
                          <SelectItem value="in" className="text-xs">in</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Select value={vitalsEntryData.heightQualifier} onValueChange={val => handleVitalsEntryChange('heightQualifier', val)}>
                        <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standing" className="text-xs">Standing</SelectItem>
                          <SelectItem value="lying" className="text-xs">Lying</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1.5 px-3">Weight</TableCell>
                    <TableCell className="py-1.5 px-3"></TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.weightValue} onChange={e => handleVitalsEntryChange('weightValue', e.target.value)} />
                    </TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Select value={vitalsEntryData.weightUnit} onValueChange={val => handleVitalsEntryChange('weightUnit', val)}>
                        <SelectTrigger className="h-7 text-xs w-20"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg" className="text-xs">kg</SelectItem>
                          <SelectItem value="lbs" className="text-xs">lbs</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Select value={vitalsEntryData.weightQualifier} onValueChange={val => handleVitalsEntryChange('weightQualifier', val)}>
                        <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="with_clothes" className="text-xs">With Clothes</SelectItem>
                          <SelectItem value="without_clothes" className="text-xs">Without Clothes</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/30">
                    <TableCell className="py-1.5 px-3">Resp</TableCell>
                    <TableCell className="py-1.5 px-3"></TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.respirationValue} onChange={e => handleVitalsEntryChange('respirationValue', e.target.value)} />
                    </TableCell>
                    <TableCell className="py-1.5 px-3">/min</TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Select value={vitalsEntryData.respirationQualifier} onValueChange={val => handleVitalsEntryChange('respirationQualifier', val)}>
                        <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal" className="text-xs">Normal</SelectItem>
                          <SelectItem value="labored" className="text-xs">Labored</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1.5 px-3">CVP</TableCell>
                    <TableCell className="py-1.5 px-3"></TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.cvpValue} onChange={e => handleVitalsEntryChange('cvpValue', e.target.value)} />
                    </TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Select value={vitalsEntryData.cvpUnit} onValueChange={val => handleVitalsEntryChange('cvpUnit', val)}>
                        <SelectTrigger className="h-7 text-xs w-20"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mmHg" className="text-xs">mmHg</SelectItem>
                          <SelectItem value="cmH2O" className="text-xs">cmH2O</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-1.5 px-3"></TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/30">
                    <TableCell className="py-1.5 px-3">C/G</TableCell>
                    <TableCell className="py-1.5 px-3"></TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.cgValue} onChange={e => handleVitalsEntryChange('cgValue', e.target.value)} />
                    </TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Select value={vitalsEntryData.cgUnit} onValueChange={val => handleVitalsEntryChange('cgUnit', val)}>
                        <SelectTrigger className="h-7 text-xs w-20"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm" className="text-xs">cm</SelectItem>
                          <SelectItem value="in" className="text-xs">in</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Select value={vitalsEntryData.cgQualifier} onValueChange={val => handleVitalsEntryChange('cgQualifier', val)}>
                        <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option_x" className="text-xs">Option X</SelectItem>
                          <SelectItem value="option_y" className="text-xs">Option Y</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1.5 px-3">Pulse Oximetry</TableCell>
                    <TableCell className="py-1.5 px-3"></TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.pulseOximetryValue} onChange={e => handleVitalsEntryChange('pulseOximetryValue', e.target.value)} />
                    </TableCell>
                    <TableCell className="py-1.5 px-3">%</TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Select value={vitalsEntryData.pulseOximetryQualifier} onValueChange={val => handleVitalsEntryChange('pulseOximetryQualifier', val)}>
                        <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="room_air" className="text-xs">Room Air</SelectItem>
                          <SelectItem value="on_oxygen" className="text-xs">On Oxygen</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ScrollArea>
            <div className="flex justify-end space-x-2 mt-auto p-2 border-t">
              <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => setIsVitalsEntryMode(false)}>Cancel</Button>
              <Button size="sm" className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => { setIsVitalsEntryMode(false); /* TODO: Save logic */ }}>Save</Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center space-x-2 p-2 border-b text-xs gap-y-2">
              <Label htmlFor="visitDateVitals " className="shrink-0 text-xs">Visit Date</Label>
              <Select value={visitDateState} onValueChange={setVisitDateState}>
                <SelectTrigger id="visitDateVitals" className="h-8 w-28 text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today" className="text-xs">Today</SelectItem>
                  <SelectItem value="yesterday" className="text-xs">Yesterday</SelectItem>
                  <SelectItem value="custom" className="text-xs">Custom</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-1">
                <Label htmlFor="fromDateVitals" className="shrink-0 text-xs">From</Label>
                <div className="relative">
                  <Input id="fromDateVitals" type="text" value={fromDateValue} onChange={(e) => setFromDateValue(e.target.value)} placeholder="DD/MM/YYYY" className="h-8 w-32 text-xs pr-8 text-xs" />
                  <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Label htmlFor="toDateVitals" className="shrink-0 text-xs">To</Label>
                <div className="relative">
                  <Input id="toDateVitals" type="text" value={toDateValueState} onChange={(e) => setToDateValueState(e.target.value)} placeholder="DD/MM/YYYY" className="h-8 w-32 text-xs pr-8" />
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
            <ScrollArea className="flex-1 min-h-0">
              <Table className="text-xs">
                <TableBody>
                  {vitalTypes.map((vital, index) => (
                    <TableRow
                      key={vital}
                      className={`hover:bg-muted/30 cursor-pointer ${selectedVitalForGraph === vital ? 'bg-secondary text-primary hover:bg-secondary hover:text-primary' : ''} ${index % 2 === 0 ? 'bg-muted/30' : ''}`}
                      onClick={() => setSelectedVitalForGraph(vital)}
                    >
                      <TableCell className="font-medium py-1.5 px-3 border-r w-48 whitespace-nowrap">{vital}</TableCell>
                      <TableCell className="py-1.5 px-3 border-r w-20 text-center whitespace-nowrap">-</TableCell>
                      <TableCell className="py-1.5 px-3 w-20 text-center whitespace-nowrap">-</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            <div className="flex items-center justify-center space-x-2 p-2 border-t">
              <Button size="sm" className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground h-8" onClick={() => setIsVitalsEntryMode(true)}>Vitals Entry</Button>
              <Button size="sm" className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground h-8">Multiple Vitals Graph</Button>
              <Button size="sm" className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground h-8">ICU Flow Sheet</Button>
            </div>
          </>
        )}
      </div>
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
    </div>
  );
};

const IntakeOutputView = () => {
  const [fromDateValue, setFromDateValue] = useState<string>("05/16/2025 14:05");
  const [toDateValueState, setToDateValueState] = useState<string>("05/17/2025 14:05");
  const [isIntakeOutputEntryMode, setIsIntakeOutputEntryMode] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>('summary');

  // Define a type for the intake/output data
  type IntakeOutputData = {
    ivfluid: string;
    bloodproduct: string;
    po: string;
    tubefeeding: string;
    infusion: string;
    other: string;
    urine: string;
    ng: string;
    emesis: string;
    drainage: string;
    faeces: string;
    [key: string]: string; // Index signature to allow string indexing
  };

  const [intakeOutputEntryData, setIntakeOutputEntryData] = useState<IntakeOutputData>({
    ivfluid: '',
    bloodproduct: '',
    po: '',
    tubefeeding: '',
    infusion: '',
    other: '',
    urine: '',
    ng: '',
    emesis: '',
    drainage: '',
    faeces: ''
  });

  const inputHeaders = ["IV FLUID", "BLOOD PRODUCT", "PO", "TUBE FEEDING", "INFUSION", "OTHER"];
  const outputHeaders = ["URINE", "N/G", "EMESIS", "DRAINAGE", "FAECES"];

  const mockIntakeOutputChartData = [
    { name: '08:00', series1: 400, series2: 240 },
    { name: '10:00', series1: 300, series2: 139 },
    { name: '12:00', series1: 200, series2: 980 },
    { name: '14:00', series1: 278, series2: 390 },
    { name: '16:00', series1: 189, series2: 480 },
    { name: '18:00', series1: 239, series2: 380 },
    { name: '20:00', series1: 349, series2: 430 },
  ];

  const handleIntakeOutputEntryChange = (key: keyof IntakeOutputData, value: string) => {
    setIntakeOutputEntryData(prev => ({ ...prev, [key]: value }));
  };

  const IntakeOutputForm = ({ title, isIntake, isUpdate }: { title: string; isIntake: boolean; isUpdate: boolean }) => {
    const [date, setDate] = useState('05/29/2025');
    const [hour, setHour] = useState('10');
    const [minute, setMinute] = useState('32');
    const [second, setSecond] = useState('00');
    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = () => {
      console.log(`${isUpdate ? 'Update' : 'Add'} ${isIntake ? 'Intake' : 'Output'}`, { date, time: `${hour}:${minute}:${second}`, type, amount });
      setCurrentView('summary');
    };

    const handleReset = () => {
      setDate('05/29/2025');
      setHour('10');
      setMinute('32');
      setSecond('00');
      setType('');
      setAmount('');
    };

    return (
      <div className="flex-1 flex flex-col">
        <div className="p-2 border-b bg-card text-foreground">
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        <div className="p-4 flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Label className="text-sm w-24">
              {isIntake ? 'Intake Date' : 'Output Date'} <span className="text-red-500">*</span>
            </Label>
            <div className="relative flex-1">
              <Input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-8 text-sm"
                placeholder="MM/DD/YYYY"
              />
              <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Label className="text-sm w-24">
              {isIntake ? 'Intake Time' : 'Output Time'}
            </Label>
            <div className="flex gap-2">
              <Select value={hour} onValueChange={setHour}>
                <SelectTrigger className="w-16 h-8 text-sm">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(24)].map((_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={minute} onValueChange={setMinute}>
                <SelectTrigger className="w-16 h-8 text-sm">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(60)].map((_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={second} onValueChange={setSecond}>
                <SelectTrigger className="w-16 h-8 text-sm">
                  <SelectValue placeholder="SS" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(60)].map((_, i) => (
                    <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Label className="text-sm w-24">
              {isIntake ? 'Intake Type' : 'Output Type'} <span className="text-red-500">*</span>
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-8 text-sm flex-1">
                <SelectValue placeholder="SELECT" />
              </SelectTrigger>
              <SelectContent>
                {(isIntake ? inputHeaders : outputHeaders).map((header) => (
                  <SelectItem key={header} value={header.toLowerCase().replace(' ', '')}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <Label className="text-sm w-24">
              Amount <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2 flex-1">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-8 text-sm"
                placeholder="Enter amount"
              />
              <span className="text-sm">ml</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2 p-2 border-t">
          <Button
            size="sm"
            className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleSubmit}
          >
            {isIntake ? (isUpdate ? 'Update Intake' : 'Add Intake') : (isUpdate ? 'Update Output' : 'Output Add')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8"
            onClick={() => setCurrentView('summary')}
          >
            Back
          </Button>
        </div>
      </div>
    );
  };

  const IntakeOutputList = ({ title, isIntake }: { title: string; isIntake: boolean }) => {
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-2 border-b bg-card text-foreground">
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
        <div className="flex flex-wrap items-center space-x-3 p-2 border-b text-xs gap-y-2">
          <div className="flex items-center gap-2">
            <input type="range" min="1" max="12" value="1" className="w-20" />
            <span>1 Month</span>
          </div>
          <Label htmlFor="listFromDate" className="shrink-0 text-xs">From Date</Label>
          <div className="relative">
            <Input
              id="listFromDate"
              type="text"
              value={fromDateValue}
              onChange={(e) => setFromDateValue(e.target.value)}
              className="h-8 w-36 text-xs pr-8"
            />
            <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
            </Button>
          </div>
          <Label htmlFor="listToDate" className="shrink-0 text-xs">To Date</Label>
          <div className="relative">
            <Input
              id="listToDate"
              type="text"
              value={toDateValueState}
              onChange={(e) => setToDateValueState(e.target.value)}
              className="h-8 w-36 text-xs pr-8"
            />
            <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs">Show</Label>
            <Select defaultValue="10">
              <SelectTrigger className="w-16 h-8 text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs">entries</span>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs">Search:</Label>
            <Input className="h-8 w-36 text-xs" placeholder="Search..." />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-accent text-foreground">
                <th className="p-1.5 border font-xs text-center">UPDATE</th>
                <th className="p-1.5 border font-xs text-center">{isIntake ? 'INTAKE DATE/TIME' : 'OUTPUT DATE/TIME'}</th>
                <th className="p-1.5 border font-xs text-center">{isIntake ? 'INTAKE TYPE' : 'OUTPUT TYPE'}</th>
                <th className="p-1.5 border font-xs text-center">HOSPITAL LOCATION</th>
                <th className="p-1.5 border font-xs text-center">AMOUNT</th>
                <th className="p-1.5 border font-xs text-center">ENTER BY</th>
              </tr>
            </thead>
            <tbody className="bg-card">
              <tr>
                <td colSpan={6} className="p-4 text-center">No Data Found</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-2 border-t text-xs">
          <span>Showing 0 to 0 of 0 entries</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-xs h-8">Previous</Button>
            <Button size="sm" variant="outline" className="text-xs h-8">Next</Button>
          </div>
        </div>
        <div className="flex justify-center p-2 border-t">
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8"
            onClick={() => setCurrentView('summary')}
          >
            Back
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 w-[95%] flex justify-between gap-3 overflow-auto">
      <div className="flex-[6] flex flex-col border rounded-md bg-card shadow overflow-hidden">
        {currentView === 'summary' ? (
          <>
            <div className="flex items-center justify-between p-2 border-b bg-card text-foreground rounded-t-md">
              <h2 className="text-base font-semibold">Patient Intake/Output Summary</h2>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-primary hover:bg-muted/50"
                  onClick={() => setIsIntakeOutputEntryMode(!isIntakeOutputEntryMode)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {isIntakeOutputEntryMode ? (
              <>
                <ScrollArea className="flex-1 min-h-0">
                  <Table className="text-xs">
                    <thead className="bg-accent sticky top-0 z-10">
                      <tr>
                        <TableHead className="text-foreground font-semibold py-2 px-3 h-8">Category</TableHead>
                        <TableHead className="text-foreground font-semibold py-2 px-3 h-8">Value (ml)</TableHead>
                      </tr>
                    </thead>
                    <TableBody>
                      {inputHeaders.map((header, index) => (
                        <TableRow key={header} className={index % 2 === 0 ? 'bg-muted/30' : ''}>
                          <TableCell className="py-1.5 px-3">{header}</TableCell>
                          <TableCell className="py-1.5 px-3">
                            <Input
                              type="text"
                              className="h-7 text-xs w-20"
                              value={intakeOutputEntryData[header.toLowerCase().replace(' ', '') as keyof IntakeOutputData]}
                              onChange={e => handleIntakeOutputEntryChange(header.toLowerCase().replace(' ', '') as keyof IntakeOutputData, e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      {outputHeaders.map((header, index) => (
                        <TableRow key={header} className={(index + inputHeaders.length) % 2 === 0 ? 'bg-muted/30' : ''}>
                          <TableCell className="py-1.5 px-3">{header}</TableCell>
                          <TableCell className="py-1.5 px-3">
                            <Input
                              type="text"
                              className="h-7 text-xs w-20"
                              value={intakeOutputEntryData[header.toLowerCase().replace('/', '') as keyof IntakeOutputData]}
                              onChange={e => handleIntakeOutputEntryChange(header.toLowerCase().replace('/', '') as keyof IntakeOutputData, e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <div className="flex justify-end space-x-2 mt-auto p-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => setIsIntakeOutputEntryMode(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => {
                      setIsIntakeOutputEntryMode(false);
                      // TODO: Save logic
                    }}
                  >
                    Save
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center space-x-3 p-2 border-b text-xs gap-y-2">
                  <Label htmlFor="intakeFromDate" className="shrink-0 text-xs">From Date</Label>
                  <div className="relative">
                    <Input
                      id="intakeFromDate"
                      type="text"
                      value={fromDateValue}
                      onChange={(e) => setFromDateValue(e.target.value)}
                      className="h-8 w-36 text-xs pr-8"
                    />
                    <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                    </Button>
                  </div>
                  <Label htmlFor="intakeToDate" className="shrink-0 text-xs">To Date</Label>
                  <div className="relative">
                    <Input
                      id="intakeToDate"
                      type="text"
                      value={toDateValueState}
                      onChange={(e) => setToDateValueState(e.target.value)}
                      className="h-8 w-36 text-xs pr-8"
                    />
                    <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-xs border-collapse min-w-[60rem]">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-accent text-foreground">
                        <th colSpan={inputHeaders.length} className="p-2 border text-center font-semibold">Input</th>
                        <th colSpan={outputHeaders.length} className="p-2 border text-center font-semibold">Output</th>
                      </tr>
                      <tr className="bg-accent text-foreground">
                        {inputHeaders.map(header => (
                          <th
                            key={header}
                            className="p-1.5 border font-xs text-center whitespace-nowrap sticky top-8 z-10 bg-accent"
                          >
                            {header.split(" ")[0]}<br />{header.split(" ")[1] || ""}
                          </th>
                        ))}
                        {outputHeaders.map(header => (
                          <th
                            key={header}
                            className="p-1.5 border font-xs text-center whitespace-nowrap sticky top-8 z-10 bg-accent"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-card">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rowNum, index) => (
                        <TableRow key={`data-row-${rowNum}`} className={`${index % 2 === 0 ? 'bg-muted/30' : ''} hover:bg-muted/50`}>
                          {inputHeaders.map(header => (
                            <TableCell key={`input-data-${header}-${rowNum}`} className="p-1.5 border text-center font-xs h-8">-</TableCell>
                          ))}
                          {outputHeaders.map(header => (
                            <TableCell key={`output-data-${header}-${rowNum}`} className="p-1.5 border text-center h-8">-</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-2 border-t text-xs space-y-1">
                  <div className="flex justify-between"><span>Total Intake Measured:</span><span> ml</span></div>
                  <div className="flex justify-between"><span>Total Output Measured:</span><span> ml</span></div>
                  <div className="flex justify-between"><span>Total Balanced Measured:</span><span> ml</span></div>
                  <div className="text-primary text-center mt-1">M-Morning(08:00-13:59) E-Evening(14:00-19:59) N-Night(20:00-07:59)</div>
                </div>
                <div className="flex items-center justify-center space-x-2 p-2 border-t">
                  <Button
                    size="sm"
                    className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground h-8"
                    onClick={() => setCurrentView('addIntake')}
                  >
                    Add Intake
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground h-8"
                    onClick={() => setCurrentView('addOutput')}
                  >
                    Add Output
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground h-8"
                    onClick={() => setCurrentView('updateIntake')}
                  >
                    Update Intake
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground h-8"
                    onClick={() => setCurrentView('updateOutput')}
                  >
                    Update Output
                  </Button>
                </div>
              </>
            )}
          </>
        ) : currentView === 'addIntake' ? (
          <IntakeOutputForm title="Add Intake" isIntake={true} isUpdate={false} />
        ) : currentView === 'addOutput' ? (
          <IntakeOutputForm title="Add Output" isIntake={false} isUpdate={false} />
        ) : currentView === 'updateIntake' ? (
          <IntakeOutputList title="Intake List" isIntake={true} />
        ) : currentView === 'updateOutput' ? (
          <IntakeOutputList title="Output List" isIntake={false} />
        ) : null}
      </div>
      <div className="flex-[4] flex flex-col border rounded-md bg-card shadow">
        <div className="flex items-center p-2 border-b bg-card text-foreground rounded-t-md">
          <h2 className="text-base font-semibold">Intake/Output Graph</h2>
        </div>
        <div className="flex-1 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockIntakeOutputChartData} margin={{ top: 5, right: 20, bottom: 20, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 7 }} label={{ value: "Date/Time", position: 'insideBottom', offset: -5, fontSize: 7 }} />
              <YAxis
                tick={{ fontSize: 10 }}
                label={{ value: "Total Intake / Output (ml)", angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, dy: 0, dx: -5 }}
              />
              <Tooltip contentStyle={{ fontSize: 5, padding: '2px 5px' }} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "10px" }} />
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
  const [showEntriesValue, setShowEntriesValueState] = useState<string>("10");
  const [visitDateValue, setVisitDateValueState] = useState<string>("10 SEP, 2024 13:10");
  const [statusSwitchChecked, setStatusSwitchCheckedState] = useState<boolean>(true);
  const [searchValue, setSearchValueState] = useState<string>("");
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false); // State for popup visibility

  const tableHeaders = ["S.No", "Problem", "Type", "Date", "Remark", "Status", "Edit", "Remove"];

  return (
    <Card className="flex-1 flex flex-col shadow text-xs overflow-hidden">
      <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <CardTitle className="text-xs">Diagnosis</CardTitle>
      </CardHeader>
      <CardContent className="p-1 flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-2 border-b gap-y-2 mb-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="showEntriesProblem" className="text-xs">Show</Label>
            <Select value={showEntriesValue} onValueChange={setShowEntriesValueState}>
              <SelectTrigger id="showEntriesProblem" className="h-7 w-20 text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10" className="text-xs">10</SelectItem>
                <SelectItem value="25" className="text-xs">25</SelectItem>
                <SelectItem value="50" className="text-xs">50</SelectItem>
                <SelectItem value="all" className="text-xs">All</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="showEntriesProblem" className="text-xs">entries</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="visitDateProblem" className="text-xs">Visit Date</Label>
            <Select value={visitDateValue} onValueChange={setVisitDateValueState}>
              <SelectTrigger id="visitDateProblem" className="h-7 w-40 text-xs">
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10 SEP, 2024 13:10" className="text-xs">10 SEP, 2024 13:10</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="statusSwitchProblem" className="text-xs">Status</Label>
            <Switch id="statusSwitchProblem" checked={statusSwitchChecked} onCheckedChange={setStatusSwitchCheckedState} className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-5 w-9" />
            <Label htmlFor="statusSwitchProblem" className="text-xs ml-1">{statusSwitchChecked ? "ACTIVE" : "INACTIVE"}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="searchProblem" className="text-xs">Search:</Label>
            <Input id="searchProblem" type="text" value={searchValue} onChange={(e) => setSearchValueState(e.target.value)} className="h-7 w-48 text-xs" />
          </div>
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          <div className="flex-1 overflow-auto">
            <Table className="text-xs min-h-0">
              <ShadcnTableHeader className="bg-accent text-foreground sticky top-0 z-10">
                <TableRow>
                  {tableHeaders.map(header => (
                    <TableHead key={header} className="py-2 px-3 h-8 whitespace-nowrap text-foreground">
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
        <Button
          size="sm"
          className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setIsPopupOpen(true)}
        >
          New Problem
        </Button>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-card rounded-lg shadow-lg p-4 w-[32rem] max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h3 className="text-xs">Add New Problem</h3>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsPopupOpen(false)}>
                <Ban className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Label className="text-xs w-24">Problem <span className="text-red-500">*</span></Label>
                <Input className="h-8 text-xs flex-1" placeholder="Enter problem" />
              </div>
              <div className="flex items-center gap-4">
                <Label className="text-xs w-24">Type <span className="text-red-500">*</span></Label>
                <Select>
                  <SelectTrigger className="h-8 text-xs flex-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acute">Acute</SelectItem>
                    <SelectItem value="chronic">Chronic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <Label className="text-xs w-24">Date <span className="text-red-500">*</span></Label>
                <div className="relative flex-1">
                  <Input className="h-8 text-xs pr-8" placeholder="MM/DD/YYYY" defaultValue="05/29/2025" />
                  <Button variant="ghost" size="icon" className="h-7 w-7 absolute right-0.5 top-0.5 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Label className="text-xs w-24">Remark</Label>
                <Input className="h-8 text-xs flex-1" placeholder="Enter remark" />
              </div>
              <div className="flex items-center gap-4">
                <Label className="text-xs w-24">Status</Label>
                <Switch defaultChecked className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-5 w-9" />
                <span className="text-xs">ACTIVE</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => setIsPopupOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

const FinalDiagnosisView = () => {
  const [showEntriesValue, setShowEntriesValueState] = useState<string>("10");
  const [visitDateValue, setVisitDateValueState] = useState<string>("10 SEP, 2024 13:10");
  const [searchValue, setSearchValueState] = useState<string>("");

  const tableHeaders = ["Primary/Secondary", "Diagnosis Description", "Comment", "Entered Date", "Provider", "Primary", "Add", "Remove"];

  return (
    <Card className="flex-1 flex flex-col shadow text-xs overflow-hidden">
      <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <CardTitle className="text-base font-semibold">Diagnosis</CardTitle>
      </CardHeader>
      <CardContent className="p-1 flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-2 border-b gap-y-2 mb-2">
          <div className="flex items-center space-x-1">
            <Label htmlFor="showEntriesDiagnosis" className="text-xs">Show</Label>
            <Select value={showEntriesValue} onValueChange={setShowEntriesValueState}>
              <SelectTrigger id="showEntriesDiagnosis" className="h-7 w-20 text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10" className="text-xs">10</SelectItem>
                <SelectItem value="25" className="text-xs">25</SelectItem>
                <SelectItem value="50" className="text-xs">50</SelectItem>
                <SelectItem value="all" className="text-xs">All</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="showEntriesDiagnosis" className="text-xs">entries</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="visitDateDiagnosis" className="text-xs">Visit Date</Label>
            <Select value={visitDateValue} onValueChange={setVisitDateValueState}>
              <SelectTrigger id="visitDateDiagnosis" className="h-7 w-40 text-xs">
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10 SEP, 2024 13:10" className="text-xs">10 SEP, 2024 13:10</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="searchDiagnosis" className="text-xs">Search:</Label>
            <Input id="searchDiagnosis" type="text" value={searchValue} onChange={(e) => setSearchValueState(e.target.value)} className="h-7 w-48 text-xs" />
          </div>
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          <div className="flex-1 overflow-auto">
            <Table className="text-xs min-h-0">
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
  const [showEntriesValue, setShowEntriesValueState] = useState<string>("10");
  const [visitDateValue, setVisitDateValueState] = useState<string>("10 SEP, 2024 13:10");
  const [statusSwitchChecked, setStatusSwitchCheckedState] = useState<boolean>(true);
  const [searchValue, setSearchValueState] = useState<string>("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  const tableHeaders = ["S.No", "Complaints", "Complaints Type", "Date", "Status", "Remark"];

  return (
    <Card className="flex-1 flex flex-col shadow text-xs overflow-hidden">
      <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Chief-Complaints</CardTitle>
          <Button
  variant="ghost"
  size="icon"
  className="h-7 w-7 text-primary hover:bg-muted/50"
  onClick={() => setIsPopupOpen(true)}
>
  <Edit3 className="h-4 w-4" />
</Button>

        </div>
      </CardHeader>
      <CardContent className="p-1 flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-2 border-b gap-y-2 mb-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="showEntriesComplaint" className="text-xs">Show</Label>
            <Select value={showEntriesValue} onValueChange={setShowEntriesValueState}>
              <SelectTrigger id="showEntriesComplaint" className="h-7 w-20 text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10" className="text-xs">10</SelectItem>
                <SelectItem value="25" className="text-xs">25</SelectItem>
                <SelectItem value="50" className="text-xs">50</SelectItem>
                <SelectItem value="all" className="text-xs">All</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="showEntriesComplaint" className="text-xs">entries</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="visitDateComplaint" className="text-xs">Visit Date</Label>
            <Select value={visitDateValue} onValueChange={setVisitDateValueState}>
              <SelectTrigger id="visitDateComplaint" className="h-7 w-40 text-xs">
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10 SEP, 2024 13:10" className="text-xs">10 SEP, 2024 13:10</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="statusSwitchComplaint" className="text-xs">Status</Label>
            <Switch id="statusSwitchComplaint" checked={statusSwitchChecked} onCheckedChange={setStatusSwitchCheckedState} className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-5 w-9" />
            <Label htmlFor="statusSwitchComplaint" className="text-xs ml-1">{statusSwitchChecked ? "ACTIVE" : "INACTIVE"}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="searchComplaint" className="text-xs">Search:</Label>
            <Input id="searchComplaint" type="text" value={searchValue} onChange={(e) => setSearchValueState(e.target.value)} className="h-7 w-48 text-xs" />
          </div>
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          <div className="flex-1 overflow-auto">
            <Table className="text-xs min-h-0">
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
      {isPopupOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-lg shadow-xl w-[500px] p-5 relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
        onClick={() => setIsPopupOpen(false)}
      >
        ✖
      </button>
      <h2 className="text-base font-semibold mb-4">Edit Chief Complaint</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Complaint</label>
          <input
            type="text"
            placeholder="E.g. Headache"
            className="mt-1 block w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select className="mt-1 block w-full px-3 py-2 border rounded text-sm">
            <option>New</option>
            <option>Follow-up</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Remark</label>
          <textarea
            placeholder="Optional remarks"
            className="mt-1 block w-full px-3 py-2 border rounded text-sm"
            rows={3}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => setIsPopupOpen(false)}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  </div>
)}

    </Card>
  );
};

const AllergiesView = () => {
  const [showEntriesValue, setShowEntriesValueState] = useState<string>("10");
  const [visitDateValue, setVisitDateValueState] = useState<string>("10 SEP, 2024 13:10");
  const [statusSwitchChecked, setStatusSwitchCheckedState] = useState<boolean>(true);
  const [searchValue, setSearchValueState] = useState<string>("");

  const tableHeaders = ["S.No", "Allergen", "Reaction", "Severity", "Type", "Onset Date", "Status"];

  return (
    <Card className="flex-1 flex flex-col shadow text-xs overflow-hidden">
      <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Allergies</CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-1 flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-2 border-b gap-y-2 mb-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="showEntriesAllergy" className="text-xs">Show</Label>
            <Select value={showEntriesValue} onValueChange={setShowEntriesValueState}>
              <SelectTrigger id="showEntriesAllergy" className="h-7 w-20 text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10" className="text-xs">10</SelectItem>
                <SelectItem value="25" className="text-xs">25</SelectItem>
                <SelectItem value="50" className="text-xs">50</SelectItem>
                <SelectItem value="all" className="text-xs">All</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="showEntriesAllergy" className="text-xs">entries</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="visitDateAllergy" className="text-xs">Date Range</Label>
            <Select value={visitDateValue} onValueChange={setVisitDateValueState}>
              <SelectTrigger id="visitDateAllergy" className="h-7 w-40 text-xs">
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10 SEP, 2024 13:10" className="text-xs">10 SEP, 2024 13:10</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="statusSwitchAllergy" className="text-xs">Status</Label>
            <Switch id="statusSwitchAllergy" checked={statusSwitchChecked} onCheckedChange={setStatusSwitchCheckedState} className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-5 w-9" />
            <Label htmlFor="statusSwitchAllergy" className="text-xs ml-1">{statusSwitchChecked ? "ACTIVE" : "INACTIVE"}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="searchAllergy" className="text-xs">Search:</Label>
            <Input id="searchAllergy" type="text" value={searchValue} onChange={(e) => setSearchValueState(e.target.value)} className="h-7 w-48 text-xs" />
          </div>
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          <div className="flex-1 overflow-auto">
            <Table className="text-xs min-h-0">
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
  const [showEntriesValue, setShowEntriesValueState] = useState<string>("10");
  const [visitDateValue, setVisitDateValueState] = useState<string>("10 SEP, 2024 13:10");
  const [statusSwitchChecked, setStatusSwitchCheckedState] = useState<boolean>(true);
  const [searchValue, setSearchValueState] = useState<string>("");

  const tableHeaders = ["S.No", "Visit ID", "Visit Type", "Department", "Doctor", "Date", "Status"];

  return (
    <Card className="flex-1 flex flex-col shadow text-xs overflow-hidden">
      <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">OPD/IPD Details</CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-1 flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-2 border-b gap-y-2 mb-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="showEntriesOpdIpd" className="text-xs">Show</Label>
            <Select value={showEntriesValue} onValueChange={setShowEntriesValueState}>
              <SelectTrigger id="showEntriesOpdIpd" className="h-7 w-20 text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10" className="text-xs">10</SelectItem>
                <SelectItem value="25" className="text-xs">25</SelectItem>
                <SelectItem value="50" className="text-xs">50</SelectItem>
                <SelectItem value="all" className="text-xs">All</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="showEntriesOpdIpd" className="text-xs">entries</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="visitDateOpdIpd" className="text-xs">Visit Date</Label>
            <Select value={visitDateValue} onValueChange={setVisitDateValueState}>
              <SelectTrigger id="visitDateOpdIpd" className="h-7 w-40 text-xs">
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10 SEP, 2024 13:10" className="text-xs">10 SEP, 2024 13:10</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="statusSwitchOpdIpd" className="text-xs">Status</Label>
            <Switch id="statusSwitchOpdIpd" checked={statusSwitchChecked} onCheckedChange={setStatusSwitchCheckedState} className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-5 w-9" />
            <Label htmlFor="statusSwitchOpdIpd" className="text-xs ml-1">{statusSwitchChecked ? "ACTIVE" : "INACTIVE"}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="searchOpdIpd" className="text-xs">Search:</Label>
            <Input id="searchOpdIpd" type="text" value={searchValue} onChange={(e) => setSearchValueState(e.target.value)} className="h-7 w-48 text-xs" />
          </div>
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          <div className="flex-1 overflow-auto">
            <Table className="text-xs min-h-0">
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
  const [activeVerticalTab, setActiveVerticalTab] = useState<string>(verticalNavItems[0]);

  return (
    <div className="flex flex-col h-[calc(100vh-var(--top-nav-height,60px))] bg-background text-sm p-3">
      <div className="flex items-end space-x-1 px-1 pt-2 pb-0 mb-3 overflow-x-auto no-scrollbar border-b-2 border-border bg-card">
        {verticalNavItems.map((item) => (
          <Button
            key={item}
            onClick={() => setActiveVerticalTab(item)}
            className={`text-xs px-3 py-1.5 h-auto rounded-b-none rounded-t-md whitespace-nowrap focus-visible:ring-0 focus-visible:ring-offset-0
              ${activeVerticalTab === item
                ? 'bg-background text-primary border-x border-t border-border border-b-2 border-b-background shadow-sm relative -mb-px z-10 hover:bg-background hover:text-primary'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground border-x border-t border-transparent hover:text-foreground'
              }`}
          >
            {item}
          </Button>
        ))}
      </div>
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
          "Chief-Complaints", "Allergies", "OPD/IPD Details"
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