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
import { 
  Edit3, CalendarDays, RefreshCw, ArrowUpDown, ChevronDown, ChevronUp, 
  Settings, FileEdit, Printer, Download, Filter, Ban,Plus, FileText, PenLine 
} from 'lucide-react';

import { Switch } from "@/components/ui/switch";
import { fetchClinicalNotes, Patient } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { usePatientProblems } from '@/hooks/usePatientProblems';
import { usePatientDiagnosis } from '@/hooks/usePatientDiagnosis';
import { usePatientAllergies } from '@/hooks/usePatientAllergies';
import { usePatientComplaints } from '@/hooks/usePatientComplaints';
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
  const [vitalsData, setVitalsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEntries, setShowEntries] = useState<string>("10");

  const yAxisConfig = getYAxisConfig(selectedVitalForGraph);

  const handleVitalsEntryChange = (field: keyof typeof vitalsEntryData, value: string | boolean | undefined) => {
    setVitalsEntryData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchVitalsData = async () => {
      setLoading(true);
      setError(null);

      // Patient data comes from the wrapper component
      // We need to access the patient prop passed to VitalsDashboardPage
      // However, VitalsView doesn't directly receive it.
      // We need to modify VitalsDashboardPage to pass the patient prop to VitalsView.
      // For now, we will use a placeholder SSN for testing.
      const testSSN = "671106286"; // Use the provided test SSN

      const requestBody = {
        UserName: "CPRS-UAT",
        Password: "UAT@123",
        PatientSSN: testSSN,
        DUZ: "115"
      };

      try {
        const response = await fetch('http://3.6.230.54:4003/api/apiVitalView.sh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Vitals API response:', data);

        if (!data || Object.keys(data).length === 0 || data.errors) {
          setVitalsData([]);
          setError('No vitals data found');
        } else {
          // Assuming data is an object where values are the vital entries
          const vitalsArray = Object.values(data).map((item: any) => ({
            // Map API response fields to a consistent structure
            id: item['Vital IEN']?.toString() || Date.now().toString() + Math.random().toString(36).slice(2, 9), // Unique ID
            date: item['Date'] || 'N/A',
            time: item['Time'] || 'N/A',
            bloodPressure: item['Blood Pressure'] || '',
            temperature: item['Temperature'] || '',
            respiration: item['Respiration'] || '',
            pulse: item['Pulse'] || '',
            height: item['Height'] || '',
            weight: item['Weight'] || '',
            cvp: item['CVP'] || '',
            cg: item['C/G'] || '',
            pulseOximetry: item['Pulse Oximetry'] || '',
            pain: item['Pain'] || '',
            earlyWarningSign: item['Early Warning Sign'] || '',
            location: item['Location'] || 'N/A',
            enteredBy: item['Entered By'] || 'N/A',
            // Add other relevant fields as needed
          }));
          setVitalsData(vitalsArray);
          // Update chart data based on the fetched vitals
          // This part needs refinement based on how vital types map to data fields
          // For now, we'll keep the mock data for the chart until mapping is clear.
          setChartData(getMockDataForVital(selectedVitalForGraph));
        }
      } catch (err: any) {
        console.error('Error fetching vitals data:', err);
        setError('Failed to fetch vitals data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVitalsData();
  }, [selectedVitalForGraph]); // Depend on selected vital for graph for now

  return (
    <div className="flex-1 flex gap-3 overflow-auto">
      <div className="basis-1/2 flex flex-col border rounded-md bg-card shadow">
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
                    <TableHead className="table-header-3d text-foreground font-semibold py-2 px-3 h-8">Vitals</TableHead>
                    <TableHead className="table-header-3d text-foreground font-semibold py-2 px-3 h-8">Not Recordable</TableHead>
                    <TableHead className="table-header-3d text-foreground font-semibold py-2 px-3 h-8">Value</TableHead>
                    <TableHead className="table-header-3d text-foreground font-semibold py-2 px-3 h-8">Unit</TableHead>
                    <TableHead className="table-header-3d text-foreground font-semibold py-2 px-3 h-8">Qualifiers</TableHead>
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
                          <SelectItem value="actual" className="text-xs">Actual</SelectItem>
                          <SelectItem value="estimated" className="text-xs">Estimated</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/30">
                    <TableCell className="py-1.5 px-3">CVP</TableCell>
                    <TableCell className="py-1.5 px-3"></TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.cvpValue} onChange={e => handleVitalsEntryChange('cvpValue', e.target.value)} />
                    </TableCell>
                    <TableCell className="py-1.5 px-3">cmH2O</TableCell>
                    <TableCell className="py-1.5 px-3"></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1.5 px-3">C/G</TableCell>
                    <TableCell className="py-1.5 px-3"></TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.cgValue} onChange={e => handleVitalsEntryChange('cgValue', e.target.value)} />
                    </TableCell>
                    <TableCell className="py-1.5 px-3">cm</TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Select value={vitalsEntryData.cgQualifier} onValueChange={val => handleVitalsEntryChange('cgQualifier', val)}>
                        <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="head" className="text-xs">Head</SelectItem>
                          <SelectItem value="chest" className="text-xs">Chest</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/30">
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
                          <SelectItem value="room-air" className="text-xs">Room Air</SelectItem>
                          <SelectItem value="oxygen" className="text-xs">Oxygen</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="py-1.5 px-3">Respiration</TableCell>
                    <TableCell className="py-1.5 px-3"></TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Input type="text" className="h-7 text-xs w-20" value={vitalsEntryData.respirationValue} onChange={e => handleVitalsEntryChange('respirationValue', e.target.value)} />
                    </TableCell>
                    <TableCell className="py-1.5 px-3">/min</TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Select value={vitalsEntryData.respirationQualifier} onValueChange={val => handleVitalsEntryChange('respirationQualifier', val)}>
                        <SelectTrigger className="h-7 text-xs w-28"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regular" className="text-xs">Regular</SelectItem>
                          <SelectItem value="irregular" className="text-xs">Irregular</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/30">
                    <TableCell className="py-1.5 px-3">Entered in Error</TableCell>
                    <TableCell className="py-1.5 px-3">
                      <Switch checked={isEnteredInError} onCheckedChange={setIsEnteredInError} />
                    </TableCell>
                    <TableCell className="py-1.5 px-3" colSpan={3}>Mark this vital as entered in error.</TableCell>
                  </TableRow>

                </TableBody>
              </Table>
            </ScrollArea>
            <div className="p-3 border-t flex justify-end space-x-2">
              <Button variant="secondary" className="text-xs">Cancel</Button>
              <Button className="text-xs">Save Vitals</Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 flex flex-col overflow-hidden p-3 pt-0">
              <div className="mb-2 text-xs">
                <div className="flex flex-wrap items-center justify-between w-full gap-3">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="visitDate" className="text-xs whitespace-nowrap">Visit Date</Label>
                    <Select value={visitDateState} onValueChange={setVisitDateState}>
                      <SelectTrigger id="visitDate" className="h-7 w-40 text-xs">
                        <SelectValue placeholder="Select Date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="last24">Last 24 Hours</SelectItem>
                        <SelectItem value="last48">Last 48 Hours</SelectItem>
                        <SelectItem value="range">Date Range</SelectItem>
                      </SelectContent>
                    </Select>
                    {visitDateState === "range" && (
                      <>
                        <Label htmlFor="fromDate" className="text-xs whitespace-nowrap">From</Label>
                        <div className="relative">
                          <Input
                            id="fromDate"
                            type="text"
                            className="h-7 w-28 text-xs pr-6"
                            value={fromDateValue}
                            onChange={(e) => setFromDateValue(e.target.value)}
                            aria-label="From Date"
                            placeholder="DD/MM/YYYY"
                          />
                          <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                        <Label htmlFor="toDate" className="text-xs whitespace-nowrap">To</Label>
                        <div className="relative">
                          <Input
                            id="toDate"
                            type="text"
                            className="h-7 w-28 text-xs pr-6"
                            value={toDateValueState}
                            onChange={(e) => setToDateValueState(e.target.value)}
                            aria-label="To Date"
                            placeholder="DD/MM/YYYY"
                          />
                          <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="showEntries" className="text-xs whitespace-nowrap">Show</Label>
                    <Select value={showEntries} onValueChange={setShowEntries}>
                      <SelectTrigger id="showEntries" className="h-7 w-16 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <Label htmlFor="showEntries" className="text-xs whitespace-nowrap">entries</Label>
                  </div>
                </div>
              </div>

              {/* Vitals Chart */}
              {/* Vitals Chart */}


              {/* Vitals Table */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <Table className="text-xs w-full">
                  <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="py-1 px-3 text-xs h-auto w-1/3">Vital Type</TableHead>
                      <TableHead className="py-1 px-3 text-xs h-auto w-1/3">Date</TableHead>
                      <TableHead className="py-1 px-3 text-xs h-auto w-1/3">Time</TableHead>
                    </TableRow>
                  </ShadcnTableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          <p className="text-muted-foreground">Loading vitals...</p>
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          <p className="text-destructive">{error}</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      vitalTypes.map((vitalType, index) => (
                        <TableRow 
                          key={vitalType} 
                          className={`${index % 2 === 0 ? 'bg-muted/30' : ''} cursor-pointer hover:bg-accent/50 transition-colors ${selectedVitalForGraph === vitalType ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => setSelectedVitalForGraph(vitalType)}
                        >
                          <TableCell className="py-1.5 px-3">{vitalType}</TableCell>
                          <TableCell className="py-1.5 px-3">-</TableCell>
                          <TableCell className="py-1.5 px-3">-</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end space-x-2 mt-auto p-2 border-t">
                <Button size="sm" className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground h-8" onClick={() => setIsVitalsEntryMode(true)}>Vitals Entry</Button>
                <Button size="sm" className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground h-8">Multiple Vitals Graph</Button>
                <Button size="sm" className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground h-8">ICU Flow Sheet</Button>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="basis-1/2 flex flex-col border rounded-md bg-card shadow min-h-0">
        <div className="flex items-center p-2 border-b bg-card text-foreground rounded-t-md flex-shrink-0">
          <h2 className="text-base font-semibold">{selectedVitalForGraph} Graph</h2>
        </div>
        <div className="flex-1 p-2">
          <ResponsiveContainer width="100%" height="100%">
            {selectedVitalForGraph === "B/P (mmHg)" ? (
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis label={{ value: yAxisConfig.label, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 10 } }} domain={yAxisConfig.domain} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="systolic" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="diastolic" stroke="#82ca9d" />
              </LineChart>
            ) : (
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis label={{ value: yAxisConfig.label, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 10 } }} domain={yAxisConfig.domain} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            )}
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
            <input
              type="range"
              min="1"
              max="12"
              value="1"
              className="w-20"
              title="Select number of months"
              aria-label="Select number of months"
            />
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
      <div className="basis-1/2 flex flex-col border rounded-md bg-card shadow overflow-hidden">
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
      <div className="basis-1/2 flex flex-col border rounded-md bg-card shadow">
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

interface Problem {
  id: string;
  problem: string;
  dateOfOnset: string;
  status: string;
  immediacy: string;
  orderIen: number;
  editUrl: string;
  removeUrl: string;
  viewUrl: string;
}

const ProblemsView = () => {
  const [showEntriesValue, setShowEntriesValueState] = useState<string>("10");
  const [searchValue, setSearchValueState] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>('A'); // 'A' for active, 'I' for inactive
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  
  // Use the patient's SSN or a default one
  const { problems, loading, error } = usePatientProblems('670230065');
  
  const tableHeaders = ["S.No", "Problem", "Type", "Date", "Status", "Actions"];
  
  const filteredProblems = problems.filter((problem: Problem) => {
    const matchesSearch = problem.problem.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || problem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM, yyyy');
    } catch (e) {
      return dateString; // Return as is if date parsing fails
    }
  };

  if (loading) {
    return (
      <Card className="flex-1 flex flex-col shadow text-xs overflow-hidden">
        <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
          <CardTitle className="text-xs">Problems</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex-1 flex flex-col shadow text-xs overflow-hidden">
        <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
          <CardTitle className="text-xs">Problems</CardTitle>
        </CardHeader>
        <CardContent className="p-4 text-red-500">
          Error loading problems. Please try again.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1 flex flex-col shadow text-xs overflow-hidden">
      <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <CardTitle className="text-xs">Problems</CardTitle>
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
            <Label htmlFor="statusFilter" className="text-xs">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="statusFilter" className="h-7 w-32 text-xs">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">All Status</SelectItem>
                <SelectItem value="A" className="text-xs">Active</SelectItem>
                <SelectItem value="I" className="text-xs">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="searchProblem" className="text-xs">Search:</Label>
            <Input 
              id="searchProblem" 
              type="text" 
              value={searchValue} 
              onChange={(e) => setSearchValueState(e.target.value)} 
              className="h-7 w-48 text-xs" 
              placeholder="Search problems..."
            />
          </div>
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          <div className="flex-1 overflow-auto">
            <Table>
              <ShadcnTableHeader>
                <TableRow>
                  {tableHeaders.map((header, index) => (
                    <TableHead key={index} className="text-xs font-medium text-foreground">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </ShadcnTableHeader>
              <TableBody>
                {filteredProblems.length > 0 ? (
                  filteredProblems.map((problem: Problem, index: number) => (
                    <TableRow key={problem.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Button 
                          variant="link" 
                          className="h-auto p-0 text-xs text-left"
                          onClick={() => {
                            setSelectedProblem(problem);
                            setIsViewOpen(true);
                          }}
                        >
                          {problem.problem.split(' (')[0]}
                        </Button>
                      </TableCell>
                      <TableCell>{problem.immediacy || 'N/A'}</TableCell>
                      <TableCell>{formatDate(problem.dateOfOnset)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          problem.status === 'A' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {problem.status === 'A' ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => window.open(problem.editUrl, '_blank')}
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-red-500 hover:text-red-600"
                          onClick={() => window.open(problem.removeUrl, '_blank')}
                        >
                          <Ban className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={tableHeaders.length} className="text-center py-4 text-muted-foreground">
                      No problems found
                    </TableCell>
                  </TableRow>
                )}
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
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Record<string, string>>({});
  
  // Use the patient's SSN or a default one
  const { diagnosis, loading, error, refresh } = usePatientDiagnosis('670768354');
  
  // Debug logs
  useEffect(() => {
    console.log('Diagnosis data in component:', diagnosis);
    console.log('Loading state:', loading);
    console.log('Error state:', error);
  }, [diagnosis, loading, error]);
  
  const tableHeaders = ["S.No", "Type", "Diagnosis Description", "Comment", "Entered Date", "Provider", "Actions"];
  
  const handleDiagnosisAction = (diagnosisId: string, action: 'add' | 'remove') => {
    setSelectedDiagnosis(prev => ({
      ...prev,
      [diagnosisId]: action
    }));
    
    // In a real app, you would make an API call here to update the diagnosis
    console.log(`${action === 'add' ? 'Adding' : 'Removing'} diagnosis:`, diagnosisId);
  };

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
            <Input 
              id="searchDiagnosis" 
              type="text" 
              value={searchValue} 
              onChange={(e) => setSearchValueState(e.target.value)} 
              className="h-7 w-48 text-xs" 
            />
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span>Loading diagnosis data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-red-500">
                      Error loading diagnosis data. <Button variant="link" className="h-auto p-0 text-red-500" onClick={refresh}>Retry</Button>
                    </TableCell>
                  </TableRow>
                ) : Object.keys(diagnosis).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No diagnosis data found
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.entries(diagnosis).map(([id, diag]: [string, any]) => (
                    <TableRow key={id} className="even:bg-muted/30">
                      <TableCell>{id}</TableCell>
                      <TableCell className="capitalize">{diag.Type || 'N/A'}</TableCell>
                      <TableCell>{diag["Diagnosis Description"] || 'N/A'}</TableCell>
                      <TableCell>{diag.Comment || 'N/A'}</TableCell>
                      <TableCell>{diag["Entered Date"] || 'N/A'}</TableCell>
                      <TableCell>{diag.Provider || 'N/A'}</TableCell>
                      <TableCell className="space-x-1">
                        {selectedDiagnosis[id] === 'add' ? (
                          <Button variant="outline" size="sm" className="h-7 text-xs" disabled>
                            Added
                          </Button>
                        ) : selectedDiagnosis[id] === 'remove' ? (
                          <Button variant="outline" size="sm" className="h-7 text-xs" disabled>
                            Removed
                          </Button>
                        ) : (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={() => handleDiagnosisAction(id, 'add')}
                            >
                              Add
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs text-red-500 hover:text-red-600"
                              onClick={() => handleDiagnosisAction(id, 'remove')}
                            >
                              Remove
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
          <div>Showing {Object.keys(diagnosis).length > 0 ? 1 : 0} to {Object.keys(diagnosis).length} of {Object.keys(diagnosis).length} entries</div>
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
  const [searchValue, setSearchValueState] = useState<string>("");
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const { complaints, loading, error, refresh } = usePatientComplaints('670768354');
  
  const tableHeaders = ["S.No", "Complaint", "Type", "Date/Time", "Status", "Remarks"];

  // Debug logs
  useEffect(() => {
    console.log('Complaints data:', complaints);
  }, [complaints]);

  return (
    <Card className="flex-1 flex flex-col shadow text-xs overflow-hidden">
      <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Chief Complaints</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-primary hover:bg-muted/50"
              onClick={refresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-primary hover:bg-muted/50"
              onClick={() => setIsPopupOpen(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-1 flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between p-2 border-b gap-y-2 mb-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="showEntries" className="text-xs">Show</Label>
            <Select value={showEntriesValue} onValueChange={setShowEntriesValueState}>
              <SelectTrigger id="showEntries" className="h-7 w-20 text-xs">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10" className="text-xs">10</SelectItem>
                <SelectItem value="25" className="text-xs">25</SelectItem>
                <SelectItem value="50" className="text-xs">50</SelectItem>
                <SelectItem value="all" className="text-xs">All</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="showEntries" className="text-xs">entries</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="search" className="text-xs">Search:</Label>
            <Input 
              id="search" 
              type="text" 
              value={searchValue} 
              onChange={(e) => setSearchValueState(e.target.value)} 
              className="h-7 w-48 text-xs" 
              placeholder="Search complaints..." 
            />
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={tableHeaders.length} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span>Loading complaints data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={tableHeaders.length} className="text-center py-10 text-red-500">
                      Error loading complaints. <Button variant="link" className="h-auto p-0 text-red-500" onClick={refresh}>Retry</Button>
                    </TableCell>
                  </TableRow>
                ) : Object.keys(complaints).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={tableHeaders.length} className="text-center py-10 text-muted-foreground">
                      No complaints found
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.entries(complaints).map(([id, complaint]) => (
                    <TableRow key={id} className="even:bg-muted/30">
                      <TableCell>{id}</TableCell>
                      <TableCell className="font-medium">{complaint.CompName}</TableCell>
                      <TableCell>{complaint.CmpType}</TableCell>
                      <TableCell>{complaint.DateTime}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          complaint.Status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {complaint.Status}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={complaint.Remark}>
                        {complaint.Remark || '-'}
                      </TableCell>
                      
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
          <div>Showing {Object.keys(complaints).length > 0 ? 1 : 0} to {Object.keys(complaints).length} of {Object.keys(complaints).length} entries</div>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Previous</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1 bg-accent text-foreground border-border">1</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Next</Button>
          </div>
        </div>
      </CardContent>

      {/* Add Complaint Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-[500px] p-5 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setIsPopupOpen(false)}
            >
              ✖
            </button>
            <h2 className="text-base font-semibold mb-4">Add Chief Complaint</h2>
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
                <label className="block text-sm font-medium text-gray-700" htmlFor="complaintType">Type</label>
                <select id="complaintType" className="mt-1 block w-full px-3 py-2 border rounded text-sm">
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
  const [searchValue, setSearchValueState] = useState<string>("");
  const [selectedAllergies, setSelectedAllergies] = useState<Record<string, boolean>>({});
  const { allergies, loading, error, refresh } = usePatientAllergies('670768354');

  // Debug logs
  useEffect(() => {
    console.log('Allergies data in component:', allergies);
  }, [allergies]);

  const tableHeaders = ["S.No", "Allergies", "Date", "Nature of Reaction", "Observed/Historical", "Originator", "Symptoms", "Actions"];

  const handleAllergyAction = (allergyId: string, action: 'add' | 'remove') => {
    setSelectedAllergies(prev => ({
      ...prev,
      [allergyId]: action === 'add'
    }));
    // In a real app, you would make an API call here to update the allergy status
    console.log(`${action === 'add' ? 'Adding' : 'Removing'} allergy:`, allergyId);
  };

  return (
    <Card className="flex-1 flex flex-col shadow text-xs overflow-hidden">
      <CardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Allergies</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-primary hover:bg-muted/50"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
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
            <Label htmlFor="searchAllergy" className="text-xs">Search:</Label>
            <Input 
              id="searchAllergy" 
              type="text" 
              value={searchValue} 
              onChange={(e) => setSearchValueState(e.target.value)} 
              className="h-7 w-48 text-xs" 
              placeholder="Search allergies..." 
            />
          </div>
        </div>
        <div className="flex-1 overflow-hidden min-h-0">
          <div className="flex-1 overflow-auto">
            <Table className="text-xs min-h-0">
              <ShadcnTableHeader className="bg-accent text-foreground sticky top-0 z-10">
                <TableRow>
                  {tableHeaders.map(header => (
                    <TableHead 
                      key={header} 
                      className={`py-2 px-3 font-semibold h-8 whitespace-nowrap text-foreground ${
                        header === 'Actions' ? 'text-center' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {header}
                        {header !== 'Actions' && (
                          <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </ShadcnTableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={tableHeaders.length} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span>Loading allergies data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={tableHeaders.length} className="text-center py-10 text-red-500">
                      Error loading allergies data. <Button variant="link" className="h-auto p-0 text-red-500" onClick={refresh}>Retry</Button>
                    </TableCell>
                  </TableRow>
                ) : Object.keys(allergies).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={tableHeaders.length} className="text-center py-10 text-muted-foreground">
                      No allergies found
                    </TableCell>
                  </TableRow>
                ) : (
                  Object.entries(allergies).map(([id, allergy], index) => (
                    <TableRow key={id} className="even:bg-muted/30">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{allergy.Allergies}</TableCell>
                      <TableCell>{allergy.Date}</TableCell>
                      <TableCell>
                        {allergy["Nature of Reaction"] && (
                          <span className="capitalize">{allergy["Nature of Reaction"]}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {allergy["Observed/Historical"] && (
                          <span className="capitalize">{allergy["Observed/Historical"]}</span>
                        )}
                      </TableCell>
                      <TableCell>{allergy.Originator}</TableCell>
                      <TableCell>{allergy.Symptoms}</TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`h-7 text-xs ${
                            selectedAllergies[id] 
                              ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                          onClick={() => handleAllergyAction(id, selectedAllergies[id] ? 'remove' : 'add')}
                        >
                          {selectedAllergies[id] ? 'Remove' : 'Add'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
          <div>Showing {Object.keys(allergies).length > 0 ? 1 : 0} to {Object.keys(allergies).length} of {Object.keys(allergies).length} entries</div>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Previous</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1 bg-accent text-foreground border-border">1</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Next</Button>
          </div>
        </div>
      </CardContent>
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

const VitalsDashboardPage: NextPage<{ patient?: Patient }> = ({ patient }) => {
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