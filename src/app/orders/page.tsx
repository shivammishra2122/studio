'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader as ShadcnTableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader as ShadcnCardHeader, CardTitle } from '@/components/ui/card';
import { 
  Settings, 
  FileEdit, 
  RefreshCw, 
  CalendarDays, 
  ArrowUpDown, 
  Ban, 
  FileText,
  Printer,
  Download,
  Filter,
  PenLine,
  ChevronsUpDown, 
  Check,           
  X as XIcon,      
  Save             
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogUITitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'; 
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'; 
import { cn } from '@/lib/utils'; 
import IpMedicationOrderDialog from './IpMedicationOrderDialog';

// Navigation items
const orderSubNavItems = [
  "CPOE Order List", "Write Delay Order", "IP Medication", 
  "Laboratory", "Radiology", "Visit/ADT", 
  "Procedure Order", "Nursing Care"
];

// Data Types and Mock Data

// CPOE Order List Data
type OrderDataType = {
  id: string;
  service: string;
  order: string;
  orderNote?: string;
  startDate: string;
  startTime: string;
  stopDate?: string;
  stopTime?: string;
  provider: string;
  status: "UNRELEASED" | "ACTIVE" | "Completed" | "Pending" | "Cancelled"; 
  location: string;
};

const mockOrderData: OrderDataType[] = [
  { 
    id: '1', 
    service: 'Inpt. Meds', 
    order: 'AMOXICILLIN 250MG UD CAP 250MG PO BID(08&20HRS) PRN', 
    orderNote: 'First Dose NOW *UNSIGNED*',
    startDate: '17 MAY, 2025', 
    startTime: '20:00', 
    provider: 'Sansys Doctor', 
    status: 'UNRELEASED', 
    location: 'ICU ONE' 
  },
  { 
    id: '2', 
    service: 'Inpt. Meds', 
    order: 'AEROCORT ROTACAP 1 ROTACAP INHL BID(08&20HRS)', 
    startDate: '17 MAY, 2025', 
    startTime: '20:00', 
    stopDate: '19 MAY, 2025', 
    stopTime: '20:00', 
    provider: 'Internalmed Doc', 
    status: 'ACTIVE', 
    location: 'ICU ONE' 
  },
  { 
    id: '3', 
    service: 'Inpt. Meds', 
    order: 'DIGOXIN PAED UD SYRUP 60ML BTL 10ML PO STAT(ONE TIME ONLY) STAT', 
    startDate: '17 MAY, 2025', 
    startTime: '13:00', 
    stopDate: '18 MAY, 2025', 
    stopTime: '13:00', 
    provider: 'Internalmed Doc', 
    status: 'ACTIVE', 
    location: 'ICU ONE' 
  },
  { 
    id: '4', 
    service: 'Inpt. Meds', 
    order: 'CARMICIDE PAED SYRUP 100ML BTL 10 ML PO BID(08&20HRS)', 
    startDate: '17 MAY, 2025', 
    startTime: '20:00', 
    stopDate: '22 MAY, 2025', 
    stopTime: '20:00', 
    provider: 'Internalmed Doc', 
    status: 'ACTIVE', 
    location: 'ICU ONE' 
  },
];

type VisitAdtDataType = {
  id: string;
  event: string;
  dateTime: string;
  provider: string;
  status: "COMPLETED" | "DISCONTINUED";
  location: string;
};

// Mock Visit/ADT Data
const mockVisitAdtData: VisitAdtDataType[] = [
  { 
    id: '1', 
    event: 'ADMISSION TO LAJPATNAGAR', 
    dateTime: '23 NOV, 2024 11:30', 
    provider: 'Ess User', 
    status: 'COMPLETED', 
    location: 'BLK-EMERGENCY WARD' 
  },
  { 
    id: '2', 
    event: 'TRANSFER TO ICU', 
    dateTime: '16 NOV, 2024 15:34', 
    provider: 'Dr. Sharma', 
    status: 'COMPLETED', 
    location: 'BLK-ICU WARD' 
  },
  { 
    id: '3', 
    event: 'DISCHARGE', 
    dateTime: '10 JAN, 2025 09:00', 
    provider: 'Dr. Gupta', 
    status: 'DISCONTINUED', 
    location: 'BLK-GENERAL WARD' 
  },
  { 
    id: '4', 
    event: 'ADMISSION TO OPD', 
    dateTime: '05 MAR, 2025 14:20', 
    provider: 'Ess User', 
    status: 'COMPLETED', 
    location: 'OPD WARD' 
  },
  { 
    id: '5', 
    event: 'TRANSFER TO GENERAL WARD', 
    dateTime: '15 APR, 2025 10:45', 
    provider: 'Dr. Patel', 
    status: 'COMPLETED', 
    location: 'BLK-GENERAL WARD' 
  },
];

// IP Medication Data
type IpMedicationEntryDataType = {
  id: string;
  services: string;
  medicationName: string;
  startDate?: string;
  startTime?: string;
  stopDate?: string;
  stopTime?: string;
  status: "ACTIVE" | "HOLD" | "UNRELEASED";
  orderedBy?: string;
  medicationDay?: string;
  schedule?: string;
  scheduleNote?: string;
};

const mockIpMedicationData: IpMedicationEntryDataType[] = [
  { id: '0', services: 'Inpt. Meds', medicationName: 'AMOXICILLIN 250MG UD CAP', status: 'UNRELEASED', orderedBy: 'Sansys Doctor', medicationDay: 'Day 3', schedule: 'BID(08&20HRS)', scheduleNote: 'PRN', startDate: '17 MAY, 2025', startTime: '19:00' },
  { id: '1', services: 'Inpt. Meds', medicationName: 'AEROCORT ROTACAP', startDate: '17 MAY, 2025', startTime: '20:00', stopDate: '19 MAY, 2025', stopTime: '20:00', status: 'ACTIVE', orderedBy: 'Internalmed Doc', medicationDay: 'Day 5', schedule: 'BID(08&20HRS)' },
  { id: '2', services: 'Inpt. Meds', medicationName: 'CARMICIDE PAED SYRUP 100ML BTL', startDate: '17 MAY, 2025', startTime: '20:00', stopDate: '22 MAY, 2025', stopTime: '20:00', status: 'ACTIVE', orderedBy: 'Internalmed Doc', medicationDay: 'Day 5', schedule: 'BID(08&20HRS)' },
  { id: '3', services: 'Inpt. Meds', medicationName: 'DIGOXIN PAED UD SYRUP 60ML BTL', startDate: '17 MAY, 2025', startTime: '13:00', stopDate: '18 MAY, 2025', stopTime: '13:00', status: 'ACTIVE', orderedBy: 'Internalmed Doc', medicationDay: 'Day 5', schedule: 'STAT(ONE TIME ONLY)' },
  { id: '4', services: 'Inpt. Meds', medicationName: 'AZITHROMYCIN UD 250MG TAB', startDate: '17 MAY, 2025', startTime: '12:39', stopDate: '', stopTime: '', status: 'HOLD', orderedBy: 'Internalmed Doc', medicationDay: 'Day 7', schedule: 'BID(08&20HRS)' },
  { id: '5', services: 'Inpt. Meds', medicationName: 'ACILOC 150MG TABLET (1X30)*', startDate: '15 MAY, 2025', startTime: '20:00', stopDate: '23 AUG, 2025', stopTime: '20:00', status: 'ACTIVE', orderedBy: 'Sansys Doctor', medicationDay: 'Day 7', schedule: 'BID(08&20HRS)' },
  { id: '6', services: 'Inpt. Meds', medicationName: 'PARACETAMOL ER UD 650MG TAB', startDate: '15 MAY, 2025', startTime: '20:00', stopDate: '23 AUG, 2025', stopTime: '20:00', status: 'ACTIVE', orderedBy: 'Sansys Doctor', medicationDay: 'Day 7', schedule: 'BID(08&20HRS)' },
];

const ALL_AVAILABLE_MEDICATIONS = [
  "ALBUMIN BOUND PACLITAXEL-100.000-MG",
  "AGREGATE TAB", "ALLEGRA M TAB", "ALLEGRA UD 120MG", "ALLEGRA UD 180MG",
  "ALLEGRA UD 30MG", "ALLEGRA UD 30MG SYRUP", "ARGIPREG PLUS SACHET POUCH",
  "CAPEGARD UD 500MG TAB", "DEGARELIX 80MG UD VIAL INJ", "DILTEGESIC ORGANOGEL UD 2%W/V",
  "PARACETAMOL 500MG", "IBUPROFEN 200MG", "AMOXICILLIN 250MG", "ASPIRIN 100MG", "METFORMIN 500MG"
];

// Delay Orders Data
type DelayOrderDataType = {
  id: string;
  event: string;
  order: string;
  startDate: string;
  startTime: string;
  stopDate?: string;
  stopTime?: string;
  status: "UNRELEASED" | "ACTIVE" | "Completed" | "Pending" | "Cancelled";
  orderedBy: string;
};

const mockDelayOrderData: DelayOrderDataType[] = [
  // Intentionally empty to match "No Data Found" in the screenshot
];

// Lab CPOE List Data
type LabCpoeDataType = {
  id: string;
  section: string;
  labTest: string;
  sample: string;
  orderDate: string;
  orderTime: string;
  startDate: string;
  startTime: string;
  status: "UNRELEASED" | "ACTIVE" | "Completed" | "Pending" | "Cancelled";
};

const mockLabCpoeData: LabCpoeDataType[] = [
  { id: '1', section: 'CHEMISTRY', labTest: 'VITAMIN C - ASCORBIC ACID (SERUM)', sample: 'UNKNOWN', orderDate: '26 MAR, 2025', orderTime: '10:48', startDate: '', startTime: '', status: 'UNRELEASED' },
  { id: '2', section: 'CHEMISTRY', labTest: 'AFB SENSITIVITY (12 DRUGS PANEL)', sample: 'BRONCHUS AND ALVEOLUS, CS', orderDate: '22 JAN, 2025', orderTime: '15:58', startDate: '', startTime: '', status: 'UNRELEASED' },
  { id: '3', section: 'CHEMISTRY', labTest: 'VITAMIN C - ASCORBIC ACID (SERUM)', sample: 'UNKNOWN', orderDate: '22 JAN, 2025', orderTime: '15:58', startDate: '', startTime: '', status: 'UNRELEASED' },
  { id: '4', section: 'CHEMISTRY', labTest: 'HCV IGG', sample: 'SERUM', orderDate: '22 JAN, 2025', orderTime: '15:58', startDate: '', startTime: '', status: 'UNRELEASED' },
  { id: '5', section: 'MICROBIOLOGY', labTest: 'ALBERT STAIN', sample: 'UNKNOWN', orderDate: '18 JAN, 2025', orderTime: '11:04', startDate: '', startTime: '', status: 'UNRELEASED' },
  { id: '6', section: 'CHEMISTRY', labTest: '17 HYDROXYPROGESTERONE (17 - OHP)', sample: 'UNKNOWN', orderDate: '18 JAN, 2025', orderTime: '11:00', startDate: '', startTime: '', status: 'UNRELEASED' },
  { id: '7', section: 'CHEMISTRY', labTest: 'ALLERGY 11 PANEL DRUG PANEL (M)', sample: 'SERUM', orderDate: '17 JAN, 2025', orderTime: '16:47', startDate: '', startTime: '', status: 'UNRELEASED' },
  { id: '8', section: 'CHEMISTRY', labTest: 'ALLERGY 11 PANEL DRUG PANEL (M)', sample: 'SERUM', orderDate: '17 JAN, 2025', orderTime: '16:47', startDate: '', startTime: '', status: 'UNRELEASED' },
  { id: '9', section: 'CHEMISTRY', labTest: 'ALLERGEN F13 - PEANUT', sample: 'SERUM', orderDate: '17 JAN, 2025', orderTime: '16:44', startDate: '', startTime: '', status: 'UNRELEASED' },
];

type RadiologyDataType = {
  id: string;
  testName: string;
  orderDate: string;
  orderTime: string;
  startDate?: string;
  startTime?: string;
  provider: string;
  status: "UNRELEASED" | "PENDING" | "COMPLETED";
  location: string;
};

// Mock Radiology Data
const mockRadiologyData: RadiologyDataType[] = [
  { 
    id: '1', 
    testName: 'X-RAY CHEST PA', 
    orderDate: '16 MAY, 2024', 
    orderTime: '16:22', 
    startDate: '16 MAY, 2024', 
    startTime: '16:30', 
    provider: 'Atul Prasad', 
    status: 'COMPLETED', 
    location: 'BLK-EMERGENCY WARD' 
  },
  { 
    id: '2', 
    testName: 'CT SCAN BRAIN', 
    orderDate: '09 NOV, 2024', 
    orderTime: '15:43', 
    startDate: '09 NOV, 2024', 
    startTime: '16:00', 
    provider: 'Ess User', 
    status: 'PENDING', 
    location: 'BLK-EMERGENCY WARD' 
  },
  { 
    id: '3', 
    testName: 'MRI SPINE', 
    orderDate: '20 JAN, 2025', 
    orderTime: '09:15', 
    startDate: '20 JAN, 2025', 
    startTime: '09:30', 
    provider: 'Dr. Sharma', 
    status: 'UNRELEASED', 
    location: 'RADIOLOGY DEPT' 
  },
  { 
    id: '4', 
    testName: 'ULTRASOUND ABDOMEN', 
    orderDate: '15 MAR, 2025', 
    orderTime: '11:00', 
    startDate: '15 MAR, 2025', 
    startTime: '11:15', 
    provider: 'Dr. Gupta', 
    status: 'COMPLETED', 
    location: 'BLK-EMERGENCY WARD' 
  },
  { 
    id: '5', 
    testName: 'X-RAY KNEE AP/LAT', 
    orderDate: '10 APR, 2025', 
    orderTime: '14:20', 
    provider: 'Ess User', 
    status: 'PENDING', 
    location: 'OPD RADIOLOGY' 
  },
];

// Components

// CPOE Order List View
const CpoeOrderListView = () => {
  const [visitDate, setVisitDate] = useState<string | undefined>("10 Sep 2024 - OPD");
  const [orderFromDate, setOrderFromDate] = useState<string>("10/09/2024");
  const [orderToDate, setOrderToDate] = useState<string>("10/09/2024");
  const [serviceFilter, setServiceFilter] = useState<string | undefined>("All");
  const [statusFilter, setStatusFilter] = useState<string | undefined>("All");
  const [showEntries, setShowEntries] = useState<string>("10");
  const [searchText, setSearchText] = useState<string>("");

  const filteredOrders = mockOrderData;

  return (
    <Card className="flex-1 flex flex-col shadow overflow-hidden">
      <ShadcnCardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">All Services</CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <FileEdit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ShadcnCardHeader>
      
      <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
        {/* Filter Bars */}
        <div className="space-y-2 mb-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Label htmlFor="orderVisitDate" className="shrink-0">Visit Date</Label>
            <Select value={visitDate} onValueChange={setVisitDate}>
              <SelectTrigger id="orderVisitDate" className="h-7 w-40 text-xs">
                <SelectValue placeholder="Select Visit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10 Sep 2024 - OPD">10 Sep 2024 - OPD</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="orderService" className="shrink-0">Service</Label>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger id="orderService" className="h-7 w-32 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="UNIT DOSE MEDICATIONS">UNIT DOSE MEDICATIONS</SelectItem>
                <SelectItem value="Inpt. Meds">Inpt. Meds</SelectItem> 
                <SelectItem value="Lab">Laboratory</SelectItem>
                <SelectItem value="Radiology">Radiology</SelectItem>
                <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                <SelectItem value="Dietary">Dietary</SelectItem>
                <SelectItem value="Consult">Consult</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="orderStatus" className="shrink-0">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="orderStatus" className="h-7 w-28 text-xs">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="UNRELEASED">UNRELEASED</SelectItem>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="orderFromDate" className="shrink-0">Order From</Label>
            <div className="relative">
              <Input id="orderFromDate" type="text" value={orderFromDate} onChange={e => setOrderFromDate(e.target.value)} className="h-7 w-28 text-xs pr-7" />
              <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Label htmlFor="orderToDate" className="shrink-0">Order To</Label>
            <div className="relative">
              <Input id="orderToDate" type="text" value={orderToDate} onChange={e => setOrderToDate(e.target.value)} className="h-7 w-28 text-xs pr-7" />
              <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="flex items-center space-x-1 ml-auto"> 
              <Label htmlFor="orderShowEntries" className="text-xs shrink-0">Show</Label>
              <Select value={showEntries} onValueChange={setShowEntries}>
                <SelectTrigger id="orderShowEntries" className="h-7 w-16 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="orderShowEntries" className="text-xs shrink-0">entries</Label>
            </div>
            <Label htmlFor="orderSearch" className="shrink-0">Search:</Label>
            <Input id="orderSearch" type="text" value={searchText} onChange={e => setSearchText(e.target.value)} className="h-7 w-40 text-xs" />
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <Table className="text-xs w-full"> 
            <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
              <TableRow>
                {["Service", "Order", "Start/Stop Date", "Provider", "Status", "Location"].map(header => (
                  <TableHead key={header} className="py-1 px-3 text-xs h-auto">
                    <div className="flex items-center justify-between">
                      {header}
                      <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </ShadcnTableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? filteredOrders.map((order, index) => (
                <TableRow key={order.id} className={`${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                  <TableCell className="py-1.5 px-3">{order.service}</TableCell>
                  <TableCell className="py-1.5 px-3"> 
                    <div>{order.order}</div>
                    {order.orderNote && <div className="text-green-600 italic text-xs">{order.orderNote}</div>}
                  </TableCell>
                  <TableCell className="py-1.5 px-3">
                    <div>Start: {order.startDate} {order.startTime}</div>
                    {order.stopDate && <div>Stop: {order.stopDate} {order.stopTime}</div>}
                  </TableCell>
                  <TableCell className="py-1.5 px-3">{order.provider}</TableCell>
                  <TableCell className="py-1.5 px-3 text-xs">{order.status}</TableCell>
                  <TableCell className="py-1.5 px-3">{order.location}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
          <div>Showing {filteredOrders.length > 0 ? 1 : 0} to {filteredOrders.length} of {filteredOrders.length} entries</div>
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

// IP Medication View
const IpMedicationView = () => {
  const [ipMedicationList, setIpMedicationList] = useState<IpMedicationEntryDataType[]>(mockIpMedicationData);
  const [isAddIpMedicationDialogOpen, setIsAddIpMedicationDialogOpen] = useState(false);
  const [visitDate, setVisitDate] = useState<string | undefined>("15 MAY, 2025 19:4");
  const [scheduleType, setScheduleType] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [orderFrom, setOrderFrom] = useState<string>("");
  const [orderTo, setOrderTo] = useState<string>("");
  const [showEntries, setShowEntries] = useState<string>("All");
  const [searchText, setSearchText] = useState<string>("");

  const openOrderMedicinesDialog = () => {
    setIsAddIpMedicationDialogOpen(true);
  };

  const handleConfirmOrder = (rows: any[]) => {
    const newMedications = rows.map(row => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
      services: 'Inpt. Meds',
      medicationName: row.medicationName,
      status: 'UNRELEASED' as const,
      startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      stopDate: '',
      stopTime: '',
      orderedBy: 'System (Dialog)',
      medicationDay: 'Day 1',
      schedule: row.schedule === 'SELECT' ? 'Pending' : row.schedule,
      scheduleNote: row.prn ? 'PRN' : row.comment || undefined,
    }));

    setIpMedicationList(prev => [...newMedications, ...prev]);
    setIsAddIpMedicationDialogOpen(false);
  };

  const ipMedTableHeaders = ["Services", "Medication Name", "Start/Stop Date", "Status", "Ordered By", "Sign", "Discontinue", "Actions", "Medication Day", "Schedule"];

  return (
    <Card className="flex-1 flex flex-col shadow overflow-hidden">
      <ShadcnCardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">IPD Medication List</CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50" onClick={openOrderMedicinesDialog}><FileEdit className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50"><RefreshCw className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50"><Settings className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50"><Printer className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50"><Download className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50"><Filter className="h-4 w-4" /></Button>
          </div>
        </div>
      </ShadcnCardHeader>
      <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
        <div className="space-y-2 mb-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Label htmlFor="ipVisitDate" className="shrink-0">Visit Date</Label>
            <Select value={visitDate} onValueChange={setVisitDate}>
              <SelectTrigger id="ipVisitDate" className="h-7 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15 MAY, 2025 19:4">15 MAY, 2025 19:4</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="ipScheduleType" className="shrink-0">Schedule Type</Label>
            <Select value={scheduleType} onValueChange={setScheduleType}>
              <SelectTrigger id="ipScheduleType" className="h-7 w-24 text-xs">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="bid">BID</SelectItem>
                <SelectItem value="stat">STAT</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="ipStatus" className="shrink-0">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="ipStatus" className="h-7 w-24 text-xs">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="HOLD">HOLD</SelectItem>
                <SelectItem value="UNRELEASED">UNRELEASED</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="ipOrderFrom" className="shrink-0">Order From</Label>
            <div className="relative">
              <Input id="ipOrderFrom" type="text" value={orderFrom} onChange={e => setOrderFrom(e.target.value)} className="h-7 w-24 text-xs pr-7" />
              <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Label htmlFor="ipOrderTo" className="shrink-0">Order To</Label>
            <div className="relative">
              <Input id="ipOrderTo" type="text" value={orderTo} onChange={e => setOrderTo(e.target.value)} className="h-7 w-24 text-xs pr-7" />
              <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex items-center space-x-1">
              <Label htmlFor="ipShowEntries" className="text-xs shrink-0">Show</Label>
              <Select value={showEntries} onValueChange={setShowEntries}>
                <SelectTrigger id="ipShowEntries" className="h-7 w-20 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="ipShowEntries" className="text-xs shrink-0">entries</Label>
            </div>
            <div className="flex-grow"></div>
            <Label htmlFor="ipSearch" className="shrink-0">Search:</Label>
            <Input id="ipSearch" type="text" value={searchText} onChange={e => setSearchText(e.target.value)} className="h-7 w-40 text-xs" />
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <Table className="text-xs w-full">
            <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
              <TableRow>
                {ipMedTableHeaders.map(header => (
                  <TableHead key={header} className="py-1 px-3 text-xs h-auto">
                    <div className="flex items-center justify-between">
                      {header}
                      <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </ShadcnTableHeader>
            <TableBody>
              {ipMedicationList.length > 0 ? ipMedicationList.map((med, index) => (
                <TableRow key={med.id} className={`${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                  <TableCell className="py-1.5 px-3">{med.services}</TableCell>
                  <TableCell className="py-1.5 px-3">{med.medicationName}</TableCell>
                  <TableCell className="py-1.5 px-3">
                    {med.startDate && med.startTime && <div>Start: {med.startDate} {med.startTime}</div>}
                    {med.stopDate && med.stopTime && <div className="text-green-600">Stop: {med.stopDate} {med.stopTime}</div>}
                  </TableCell>
                  <TableCell className="py-1.5 px-3 text-xs">{med.status}</TableCell>
                  <TableCell className="py-1.5 px-3">{med.orderedBy}</TableCell>
                  <TableCell className="py-1.5 px-3 text-center"><Button variant="ghost" size="icon" className="h-6 w-6"><PenLine className="h-3.5 w-3.5 text-blue-600" /></Button></TableCell>
                  <TableCell className="py-1.5 px-3 text-center"><Button variant="ghost" size="icon" className="h-6 w-6"><Ban className="h-3.5 w-3.5 text-red-500" /></Button></TableCell>
                  <TableCell className="py-1.5 px-3 text-center"><Button variant="ghost" size="icon" className="h-6 w-6"><FileText className="h-3.5 w-3.5 text-blue-600" /></Button></TableCell>
                  <TableCell className="py-1.5 px-3">{med.medicationDay}</TableCell>
                  <TableCell className="py-1.5 px-3">{med.schedule}{med.scheduleNote && <span className="italic text-muted-foreground ml-1">({med.scheduleNote})</span>}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={ipMedTableHeaders.length} className="text-center py-10 text-muted-foreground">
                    No IPD medications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
          <div>Showing {ipMedicationList.length > 0 ? 1 : 0} to {ipMedicationList.length} of {ipMedicationList.length} entries</div>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Previous</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1 bg-accent text-foreground border-border">1</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2 py-1">Next</Button>
          </div>
        </div>
      </CardContent>

      <IpMedicationOrderDialog
        open={isAddIpMedicationDialogOpen}
        onOpenChange={setIsAddIpMedicationDialogOpen}
        // Pass handleConfirmOrder to the dialog
        // handleConfirmOrder={handleConfirmOrder}
      />
    </Card>
  );
};

// Delay Orders View
const DelayOrdersView = () => {
  const [delayOrderView, setDelayOrderView] = useState<string>("Delay Order List");
  const [eventFilter, setEventFilter] = useState<string>("ADMISSION TO LAJPATNAGAR");
  const [showEntries, setShowEntries] = useState<string>("10");
  const [searchText, setSearchText] = useState<string>("");

  const filteredDelayOrders = mockDelayOrderData;

  const delayOrderTableHeaders = ["S.No.", "Event", "Order", "Start/Stop Date", "Status", "Ordered By", "Sign", "Discontinue", "Change Event", "Release Order", "Order View"];

  return (
    <Card className="flex-1 flex flex-col shadow overflow-hidden">
      <ShadcnCardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Delay Orders - List/Events</CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ShadcnCardHeader>
      <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
        <div className="space-y-2 mb-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="delayOrderList"
                name="delayOrderView"
                value="Delay Order List"
                checked={delayOrderView === "Delay Order List"}
                onChange={() => setDelayOrderView("Delay Order List")}
                className="h-4 w-4 text-blue-600"
              />
              <Label htmlFor="delayOrderList" className="text-xs">Delay Order List</Label>
              <input
                type="radio"
                id="delayOrderEvents"
                name="delayOrderView"
                value="Delay Order Events"
                checked={delayOrderView === "Delay Order Events"}
                onChange={() => setDelayOrderView("Delay Order Events")}
                className="h-4 w-4 text-blue-600"
              />
              <Label htmlFor="delayOrderEvents" className="text-xs">Delay Order Events</Label>
            </div>
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="h-7 w-48 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMISSION TO LAJPATNAGAR">ADMISSION TO LAJPATNAGAR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex items-center space-x-1">
              <Label htmlFor="delayShowEntries" className="text-xs shrink-0">Show</Label>
              <Select value={showEntries} onValueChange={setShowEntries}>
                <SelectTrigger id="delayShowEntries" className="h-7 w-16 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="delayShowEntries" className="text-xs shrink-0">entries</Label>
            </div>
            <div className="flex-grow"></div>
            <Label htmlFor="delaySearch" className="shrink-0">Search:</Label>
            <Input id="delaySearch" type="text" value={searchText} onChange={e => setSearchText(e.target.value)} className="h-7 w-40 text-xs" />
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <Table className="text-xs w-full">
            <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
              <TableRow>
                {delayOrderTableHeaders.map(header => (
                  <TableHead key={header} className="py-1 px-3 text-xs h-auto">
                    <div className="flex items-center justify-between">
                      {header}
                      <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </ShadcnTableHeader>
            <TableBody>
              {filteredDelayOrders.length > 0 ? filteredDelayOrders.map((order, index) => (
                <TableRow key={order.id} className={`${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                  <TableCell className="py-1.5 px-3">{index + 1}</TableCell>
                  <TableCell className="py-1.5 px-3">{order.event}</TableCell>
                  <TableCell className="py-1.5 px-3">{order.order}</TableCell>
                  <TableCell className="py-1.5 px-3">
                    <div>Start: {order.startDate} {order.startTime}</div>
                    {order.stopDate && <div>Stop: {order.stopDate} {order.stopTime}</div>}
                  </TableCell>
                  <TableCell className="py-1.5 px-3 text-xs">{order.status}</TableCell>
                  <TableCell className="py-1.5 px-3">{order.orderedBy}</TableCell>
                  <TableCell className="py-1.5 px-3 text-center"><Button variant="ghost" size="icon" className="h-6 w-6"><PenLine className="h-3.5 w-3.5 text-blue-600" /></Button></TableCell>
                  <TableCell className="py-1.5 px-3 text-center"><Button variant="ghost" size="icon" className="h-6 w-6"><Ban className="h-3.5 w-3.5 text-red-500" /></Button></TableCell>
                  <TableCell className="py-1.5 px-3 text-center"><Button variant="ghost" size="icon" className="h-6 w-6"><FileText className="h-3.5 w-3.5 text-blue-600" /></Button></TableCell>
                  <TableCell className="py-1.5 px-3 text-center"><Button variant="ghost" size="icon" className="h-6 w-6"><FileText className="h-3.5 w-3.5 text-blue-600" /></Button></TableCell>
                  <TableCell className="py-1.5 px-3 text-center"><Button variant="ghost" size="icon" className="h-6 w-6"><FileText className="h-3.5 w-3.5 text-blue-600" /></Button></TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={delayOrderTableHeaders.length} className="text-center py-10 text-muted-foreground">
                    No Data Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
          <div>Showing {filteredDelayOrders.length > 0 ? 1 : 0} to {filteredDelayOrders.length} of {filteredDelayOrders.length} entries</div>
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

const RadiologyView = () => {
  const [visitDate, setVisitDate] = useState<string | undefined>("16 MAY, 2024 16:22");
  const [statusFilter, setStatusFilter] = useState<string | undefined>("All");
  const [orderFromDate, setOrderFromDate] = useState<string>("");
  const [orderToDate, setOrderToDate] = useState<string>("");
  const [showEntries, setShowEntries] = useState<string>("All");
  const [searchText, setSearchText] = useState<string>("");

  const filteredRadiologyOrders = mockRadiologyData;

  const radiologyTableHeaders = ["Test Name", "Order Date:Time", "Start Date:Time", "Provider", "Status", "Sign", "Discontinue", "Result", "Location"];

  return (
    <Card className="flex-1 flex flex-col shadow overflow-hidden">
      <ShadcnCardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Radiology Orders</CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ShadcnCardHeader>
      <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
        <div className="space-y-2 mb-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Label htmlFor="radiologyVisitDate" className="shrink-0">Visit Date</Label>
            <Select value={visitDate} onValueChange={setVisitDate}>
              <SelectTrigger id="radiologyVisitDate" className="h-7 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16 MAY, 2024 16:22">16 MAY, 2024 16:22</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="radiologyStatus" className="shrink-0">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="radiologyStatus" className="h-7 w-24 text-xs">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="UNRELEASED">UNRELEASED</SelectItem>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="radiologyOrderFrom" className="shrink-0">Order From</Label>
            <div className="relative">
              <Input id="radiologyOrderFrom" type="text" value={orderFromDate} onChange={e => setOrderFromDate(e.target.value)} className="h-7 w-24 text-xs pr-7" />
              <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Label htmlFor="radiologyOrderTo" className="shrink-0">Order To</Label>
            <div className="relative">
              <Input id="radiologyOrderTo" type="text" value={orderToDate} onChange={e => setOrderToDate(e.target.value)} className="h-7 w-24 text-xs pr-7" />
              <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex items-center space-x-1">
              <Label htmlFor="radiologyShowEntries" className="text-xs shrink-0">Show</Label>
              <Select value={showEntries} onValueChange={setShowEntries}>
                <SelectTrigger id="radiologyShowEntries" className="h-7 w-20 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="radiologyShowEntries" className="text-xs shrink-0">entries</Label>
            </div>
            <div className="flex-grow"></div>
            <Label htmlFor="radiologySearch" className="shrink-0">Search:</Label>
            <Input id="radiologySearch" type="text" value={searchText} onChange={e => setSearchText(e.target.value)} className="h-7 w-40 text-xs" />
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <Table className="text-xs w-full">
            <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
              <TableRow>
                {radiologyTableHeaders.map(header => (
                  <TableHead key={header} className="py-1 px-3 text-xs h-auto">
                    <div className="flex items-center justify-between">
                      {header}
                      <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </ShadcnTableHeader>
            <TableBody>
              {filteredRadiologyOrders.length > 0 ? filteredRadiologyOrders.map((order, index) => (
                <TableRow key={order.id} className={`${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                  <TableCell className="py-1.5 px-3">{order.testName}</TableCell>
                  <TableCell className="py-1.5 px-3">{order.orderDate} {order.orderTime}</TableCell>
                  <TableCell className="py-1.5 px-3">{order.startDate} {order.startTime}</TableCell>
                  <TableCell className="py-1.5 px-3">{order.provider}</TableCell>
                  <TableCell className="py-1.5 px-3 text-xs">{order.status}</TableCell>
                  <TableCell className="py-1.5 px-3 text-center"><Button variant="ghost" size="icon" className="h-6 w-6"><PenLine className="h-3.5 w-3.5 text-blue-600" /></Button></TableCell>
                  <TableCell className="py-1.5 px-3 text-center"><Button variant="ghost" size="icon" className="h-6 w-6"><Ban className="h-3.5 w-3.5 text-red-500" /></Button></TableCell>
                  <TableCell className="py-1.5 px-3 text-center"><Button variant="ghost" size="icon" className="h-6 w-6"><FileText className="h-3.5 w-3.5 text-blue-600" /></Button></TableCell>
                  <TableCell className="py-1.5 px-3">{order.location}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={radiologyTableHeaders.length} className="text-center py-10 text-muted-foreground">
                    No radiology orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
          <div>Showing {filteredRadiologyOrders.length > 0 ? 1 : 0} to {filteredRadiologyOrders.length} of {filteredRadiologyOrders.length} entries</div>
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


// Lab CPOE List View
const LabCpoeListView = () => {
  const [visitDate, setVisitDate] = useState<string | undefined>("16 MAY, 2024 16:22");
  const [statusFilter, setStatusFilter] = useState<string | undefined>("All");
  const [orderFromDate, setOrderFromDate] = useState<string>("");
  const [orderToDate, setOrderToDate] = useState<string>("");
  const [showEntries, setShowEntries] = useState<string>("All");
  const [searchText, setSearchText] = useState<string>("");

  const filteredLabOrders = mockLabCpoeData;

  const labCpoeTableHeaders = ["Section", "Lab Test", "Sample", "Order Date and Time", "Start Date and Time", "Status", "Order Sign", "Discontinue"];

  return (
    <Card className="flex-1 flex flex-col shadow overflow-hidden">
      <ShadcnCardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Lab CPOE List</CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ShadcnCardHeader>
      <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
        <div className="space-y-2 mb-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Label htmlFor="labVisitDate" className="shrink-0">Visit Date</Label>
            <Select value={visitDate} onValueChange={setVisitDate}>
              <SelectTrigger id="labVisitDate" className="h-7 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="16 MAY, 2024 16:22">16 MAY, 2024 16:22</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="labStatus" className="shrink-0">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="labStatus" className="h-7 w-24 text-xs">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="UNRELEASED">UNRELEASED</SelectItem>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="labOrderFrom" className="shrink-0">Order From</Label>
            <div className="relative">
              <Input id="labOrderFrom" type="text" value={orderFromDate} onChange={e => setOrderFromDate(e.target.value)} className="h-7 w-24 text-xs pr-7" />
              <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Label htmlFor="labOrderTo" className="shrink-0">Order To</Label>
            <div className="relative">
              <Input id="labOrderTo" type="text" value={orderToDate} onChange={e => setOrderToDate(e.target.value)} className="h-7 w-24 text-xs pr-7" />
              <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex items-center space-x-1">
              <Label htmlFor="labShowEntries" className="text-xs shrink-0">Show</Label>
              <Select value={showEntries} onValueChange={setShowEntries}>
                <SelectTrigger id="labShowEntries" className="h-7 w-20 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="labShowEntries" className="text-xs shrink-0">entries</Label>
            </div>
            <div className="flex-grow"></div>
            <Label htmlFor="labSearch" className="shrink-0">Search:</Label>
            <Input id="labSearch" type="text" value={searchText} onChange={e => setSearchText(e.target.value)} className="h-7 w-40 text-xs" />
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <Table className="text-xs w-full">
            <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
              <TableRow>
                {labCpoeTableHeaders.map(header => (
                  <TableHead key={header} className="py-1 px-3 text-xs h-auto">
                    <div className="flex items-center justify-between">
                      {header}
                      <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </ShadcnTableHeader>
            <TableBody>
              {filteredLabOrders.length > 0 ? filteredLabOrders.map((lab, index) => (
                <TableRow key={lab.id} className={`${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                  <TableCell className="py-1.5 px-3">{lab.section}</TableCell>
                  <TableCell className="py-1.5 px-3">{lab.labTest}</TableCell>
                  <TableCell className="py-1.5 px-3">{lab.sample}</TableCell>
                  <TableCell className="py-1.5 px-3">{lab.orderDate} {lab.orderTime}</TableCell>
                  <TableCell className="py-1.5 px-3">{lab.startDate} {lab.startTime}</TableCell>
                  <TableCell className="py-1.5 px-3 text-xs">{lab.status}</TableCell>
                  <TableCell className="py-1.5 px-3 text-center"><Button variant="ghost" size="icon" className="h-6 w-6"><PenLine className="h-3.5 w-3.5 text-blue-600" /></Button></TableCell>
                  <TableCell className="py-1.5 px-3 text-center"><Button variant="ghost" size="icon" className="h-6 w-6"><Ban className="h-3.5 w-3.5 text-red-500" /></Button></TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={labCpoeTableHeaders.length} className="text-center py-10 text-muted-foreground">
                    No lab orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
          <div>Showing {filteredLabOrders.length > 0 ? 1 : 0} to {filteredLabOrders.length} of {filteredLabOrders.length} entries</div>
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

// Main Orders Page
const OrdersPage = () => {
  const [activeOrderSubNav, setActiveOrderSubNav] = useState<string>(orderSubNavItems[0]);

  return (
    <div className="flex flex-col h-[calc(100vh-var(--top-nav-height,40px))] bg-background text-sm p-3">
      {/* Horizontal Navigation Bar */}
      <div className="flex items-end space-x-1 px-1 pb-0 mb-3 overflow-x-auto no-scrollbar border-b-2 border-border bg-card">
        {orderSubNavItems.map((item) => (
          <Button
            key={item}
            onClick={() => setActiveOrderSubNav(item)}
            className={`text-xs px-3 py-1.5 h-auto rounded-b-none rounded-t-md whitespace-nowrap focus-visible:ring-0 focus-visible:ring-offset-0
              ${activeOrderSubNav === item
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
        {activeOrderSubNav === "CPOE Order List" && <CpoeOrderListView />}
        {activeOrderSubNav === "IP Medication" && <IpMedicationView />}
        {activeOrderSubNav === "Write Delay Order" && <DelayOrdersView />}
        {activeOrderSubNav === "Laboratory" && <LabCpoeListView />}
        {activeOrderSubNav === "Radiology" && <RadiologyView />}
        {activeOrderSubNav === "Visit/ADT" && <VisitAdtView />}
        {activeOrderSubNav === "Procedure Order" && <ProcedureOrderView />}
        {activeOrderSubNav === "Nursing Care" && <NursingCareView />}
        
        
      
      </main>
    </div>
  );
};
const VisitAdtView = () => {
  const [visitDate, setVisitDate] = useState<string | undefined>("23 NOV, 2024 11:30");
  const [statusFilter, setStatusFilter] = useState<string | undefined>("All");
  const [showEntries, setShowEntries] = useState<string>("All");
  const [searchText, setSearchText] = useState<string>("");

  const filteredVisitAdtData = mockVisitAdtData;

  const visitAdtTableHeaders = ["Event", "Date:Time", "Provider", "Status", "Location"];

  return (
    <Card className="flex-1 flex flex-col shadow overflow-hidden">
      <ShadcnCardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Visit/ADT Events</CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ShadcnCardHeader>
      <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
        <div className="space-y-2 mb-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Label htmlFor="visitAdtDate" className="shrink-0">Visit Date</Label>
            <Select value={visitDate} onValueChange={setVisitDate}>
              <SelectTrigger id="visitAdtDate" className="h-7 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="23 NOV, 2024 11:30">23 NOV, 2024 11:30</SelectItem>
                <SelectItem value="16 NOV, 2024 15:34">16 NOV, 2024 15:34</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="visitAdtStatus" className="shrink-0">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="visitAdtStatus" className="h-7 w-24 text-xs">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                <SelectItem value="DISCONTINUED">DISCONTINUED</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex items-center space-x-1">
              <Label htmlFor="visitAdtShowEntries" className="text-xs shrink-0">Show</Label>
              <Select value={showEntries} onValueChange={setShowEntries}>
                <SelectTrigger id="visitAdtShowEntries" className="h-7 w-20 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="visitAdtShowEntries" className="text-xs shrink-0">entries</Label>
            </div>
            <div className="flex-grow"></div>
            <Label htmlFor="visitAdtSearch" className="shrink-0">Search:</Label>
            <Input id="visitAdtSearch" type="text" value={searchText} onChange={e => setSearchText(e.target.value)} className="h-7 w-40 text-xs" />
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <Table className="text-xs w-full">
            <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
              <TableRow>
                {visitAdtTableHeaders.map(header => (
                  <TableHead key={header} className="py-1 px-3 text-xs h-auto">
                    <div className="flex items-center justify-between">
                      {header}
                      <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </ShadcnTableHeader>
            <TableBody>
              {filteredVisitAdtData.length > 0 ? filteredVisitAdtData.map((visit, index) => (
                <TableRow key={visit.id} className={`${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                  <TableCell className="py-1.5 px-3">{visit.event}</TableCell>
                  <TableCell className="py-1.5 px-3">{visit.dateTime}</TableCell>
                  <TableCell className="py-1.5 px-3">{visit.provider}</TableCell>
                  <TableCell className="py-1.5 px-3 text-xs">{visit.status}</TableCell>
                  <TableCell className="py-1.5 px-3">{visit.location}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={visitAdtTableHeaders.length} className="text-center py-10 text-muted-foreground">
                    No Visit/ADT events found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
          <div>Showing {filteredVisitAdtData.length > 0 ? 1 : 0} to {filteredVisitAdtData.length} of {filteredVisitAdtData.length} entries</div>
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

type ProcedureOrderDataType = {
  id: string;
  order: string;
  startDate?: string;
  startTime?: string;
  stopDate?: string;
  stopTime?: string;
  provider: string;
  status: "UNRELEASED" | "PENDING" | "DISCONTINUED";
  location: string;
};

// Mock Procedure Order Data
const mockProcedureOrderData: ProcedureOrderDataType[] = [
  { 
    id: '1', 
    order: 'ENDOSCOPY', 
    startDate: '23 NOV, 2024', 
    startTime: '09:00', 
    stopDate: '23 NOV, 2024', 
    stopTime: '10:30', 
    provider: 'Dr. Sharma', 
    status: 'DISCONTINUED', 
    location: 'BLK-ENDOSCOPY UNIT' 
  },
  { 
    id: '2', 
    order: 'COLONOSCOPY', 
    startDate: '15 JAN, 2025', 
    startTime: '14:00', 
    provider: 'Ess User', 
    status: 'PENDING', 
    location: 'BLK-PROCEDURE ROOM' 
  },
  { 
    id: '3', 
    order: 'BRONCHOSCOPY', 
    startDate: '10 FEB, 2025', 
    startTime: '11:30', 
    provider: 'Dr. Gupta', 
    status: 'UNRELEASED', 
    location: 'BLK-ICU WARD' 
  },
  { 
    id: '4', 
    order: 'BIOPSY - LIVER', 
    startDate: '05 MAR, 2025', 
    startTime: '08:45', 
    stopDate: '05 MAR, 2025', 
    stopTime: '09:15', 
    provider: 'Dr. Patel', 
    status: 'DISCONTINUED', 
    location: 'BLK-DAYCARE UNIT' 
  },
  { 
    id: '5', 
    order: 'ANGIOGRAPHY', 
    startDate: '20 APR, 2025', 
    startTime: '13:20', 
    provider: 'Ess User', 
    status: 'PENDING', 
    location: 'BLK-CATH LAB' 
  },
];

const ProcedureOrderView = () => {
  const [statusFilter, setStatusFilter] = useState<string | undefined>("All");
  const [orderFromDate, setOrderFromDate] = useState<string>("");
  const [orderToDate, setOrderToDate] = useState<string>("");
  const [showEntries, setShowEntries] = useState<string>("All");
  const [searchText, setSearchText] = useState<string>("");

  const filteredProcedureOrders = mockProcedureOrderData;

  const procedureOrderTableHeaders = ["Order", "Start/Stop Date", "Provider", "Status", "Sign", "Discontinue", "Location"];

  return (
    <Card className="flex-1 flex flex-col shadow overflow-hidden">
      <ShadcnCardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Procedure Orders</CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ShadcnCardHeader>
      <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
        <div className="space-y-2 mb-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Label htmlFor="procedureStatus" className="shrink-0">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="procedureStatus" className="h-7 w-24 text-xs">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="UNRELEASED">UNRELEASED</SelectItem>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="DISCONTINUED">DISCONTINUED</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="procedureOrderFrom" className="shrink-0">Order From</Label>
            <div className="relative">
              <Input id="procedureOrderFrom" type="text" value={orderFromDate} onChange={e => setOrderFromDate(e.target.value)} className="h-7 w-24 text-xs pr-7" />
              <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Label htmlFor="procedureOrderTo" className="shrink-0">Order To</Label>
            <div className="relative">
              <Input id="procedureOrderTo" type="text" value={orderToDate} onChange={e => setOrderToDate(e.target.value)} className="h-7 w-24 text-xs pr-7" />
              <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex items-center space-x-1">
              <Label htmlFor="procedureShowEntries" className="text-xs shrink-0">Show</Label>
              <Select value={showEntries} onValueChange={setShowEntries}>
                <SelectTrigger id="procedureShowEntries" className="h-7 w-20 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="procedureShowEntries" className="text-xs shrink-0">entries</Label>
            </div>
            <div className="flex-grow"></div>
            <Label htmlFor="procedureSearch" className="shrink-0">Search:</Label>
            <Input id="procedureSearch" type="text" value={searchText} onChange={e => setSearchText(e.target.value)} className="h-7 w-40 text-xs" />
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <Table className="text-xs w-full">
            <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
              <TableRow>
                {procedureOrderTableHeaders.map(header => (
                  <TableHead key={header} className="py-1 px-3 text-xs h-auto">
                    <div className="flex items-center justify-between">
                      {header}
                      <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </ShadcnTableHeader>
            <TableBody>
              {filteredProcedureOrders.length > 0 ? filteredProcedureOrders.map((order, index) => (
                <TableRow key={order.id} className={`${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                  <TableCell className="py-1.5 px-3">{order.order}</TableCell>
                  <TableCell className="py-1.5 px-3">
                    {order.startDate && <div>Start: {order.startDate} {order.startTime}</div>}
                    {order.stopDate && <div>Stop: {order.stopDate} {order.stopTime}</div>}
                  </TableCell>
                  <TableCell className="py-1.5 px-3">{order.provider}</TableCell>
                  <TableCell className="py-1.5 px-3 text-xs">{order.status}</TableCell>
                  <TableCell className="py-1.5 px-3 text-center"><Button variant="ghost" size="icon" className="h-6 w-6"><PenLine className="h-3.5 w-3.5 text-blue-600" /></Button></TableCell>
                  <TableCell className="py-1.5 px-3 text-center"><Button variant="ghost" size="icon" className="h-6 w-6"><Ban className="h-3.5 w-3.5 text-red-500" /></Button></TableCell>
                  <TableCell className="py-1.5 px-3">{order.location}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={procedureOrderTableHeaders.length} className="text-center py-10 text-muted-foreground">
                    No procedure orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
          <div>Showing {filteredProcedureOrders.length > 0 ? 1 : 0} to {filteredProcedureOrders.length} of {filteredProcedureOrders.length} entries</div>
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

type NursingCareDataType = {
  id: string;
  order: string;
  startDate?: string;
  startTime?: string;
  stopDate?: string;
  stopTime?: string;
  provider: string;
  status: "ACTIVE" | "DISCONTINUED";
  admissionAdvice?: string;
  location: string;
};

// Mock Nursing Care Data
const mockNursingCareData: NursingCareDataType[] = [
  { 
    id: '1', 
    order: 'VITAL SIGNS MONITORING Q4H', 
    startDate: '20 MAY, 2025', 
    startTime: '08:00', 
    stopDate: '24 MAY, 2025', 
    stopTime: '08:00', 
    provider: 'Nurse Patel', 
    status: 'ACTIVE', 
    admissionAdvice: 'Monitor BP, HR, Temp', 
    location: 'BLK-GENERAL WARD' 
  },
  { 
    id: '2', 
    order: 'WOUND DRESSING DAILY', 
    startDate: '22 MAY, 2025', 
    startTime: '09:00', 
    provider: 'Nurse Sharma', 
    status: 'ACTIVE', 
    admissionAdvice: 'Change dressing, check for infection', 
    location: 'BLK-SURGICAL WARD' 
  },
  { 
    id: '3', 
    order: 'IV FLUID ADMINISTRATION', 
    startDate: '15 MAY, 2025', 
    startTime: '10:30', 
    stopDate: '20 MAY, 2025', 
    stopTime: '10:30', 
    provider: 'Nurse Gupta', 
    status: 'DISCONTINUED', 
    admissionAdvice: 'NS 500ml over 4 hours', 
    location: 'BLK-ICU WARD' 
  },
  { 
    id: '4', 
    order: 'PATIENT POSITIONING Q2H', 
    startDate: '23 MAY, 2025', 
    startTime: '07:00', 
    provider: 'Nurse Singh', 
    status: 'ACTIVE', 
    admissionAdvice: 'Prevent pressure ulcers', 
    location: 'BLK-DAYCARE UNIT' 
  },
  { 
    id: '5', 
    order: 'ORAL CARE Q8H', 
    startDate: '18 MAY, 2025', 
    startTime: '06:00', 
    stopDate: '22 MAY, 2025', 
    stopTime: '06:00', 
    provider: 'Nurse Verma', 
    status: 'DISCONTINUED', 
    location: 'BLK-GENERAL WARD' 
  },
];

const NursingCareView = () => {
  const [statusFilter, setStatusFilter] = useState<string | undefined>("All");
  const [orderFromDate, setOrderFromDate] = useState<string>("");
  const [orderToDate, setOrderToDate] = useState<string>("");
  const [showEntries, setShowEntries] = useState<string>("All");
  const [searchText, setSearchText] = useState<string>("");

  const filteredNursingCareData = mockNursingCareData;

  const nursingCareTableHeaders = ["Order", "Start/Stop Date", "Provider", "Status", "Admission Advice", "Location"];

  return (
    <Card className="flex-1 flex flex-col shadow overflow-hidden">
      <ShadcnCardHeader className="p-2.5 border-b bg-card text-foreground rounded-t-md">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Nursing Care Orders</CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-muted/50">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ShadcnCardHeader>
      <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
        <div className="space-y-2 mb-2 text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Label htmlFor="nursingStatus" className="shrink-0">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="nursingStatus" className="h-7 w-24 text-xs">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="DISCONTINUED">DISCONTINUED</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="nursingOrderFrom" className="shrink-0">Order From</Label>
            <div className="relative">
              <Input id="nursingOrderFrom" type="text" value={orderFromDate} onChange={e => setOrderFromDate(e.target.value)} className="h-7 w-24 text-xs pr-7" />
              <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
            <Label htmlFor="nursingOrderTo" className="shrink-0">Order To</Label>
            <div className="relative">
              <Input id="nursingOrderTo" type="text" value={orderToDate} onChange={e => setOrderToDate(e.target.value)} className="h-7 w-24 text-xs pr-7" />
              <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <div className="flex items-center space-x-1">
              <Label htmlFor="nursingShowEntries" className="text-xs shrink-0">Show</Label>
              <Select value={showEntries} onValueChange={setShowEntries}>
                <SelectTrigger id="nursingShowEntries" className="h-7 w-20 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                </SelectContent>
              </Select>
              <Label htmlFor="nursingShowEntries" className="text-xs shrink-0">entries</Label>
            </div>
            <div className="flex-grow"></div>
            <Label htmlFor="nursingSearch" className="shrink-0">Search:</Label>
            <Input id="nursingSearch" type="text" value={searchText} onChange={e => setSearchText(e.target.value)} className="h-7 w-40 text-xs" />
          </div>
        </div>

        <div className="flex-1 overflow-auto min-h-0">
          <Table className="text-xs w-full">
            <ShadcnTableHeader className="bg-accent sticky top-0 z-10">
              <TableRow>
                {nursingCareTableHeaders.map(header => (
                  <TableHead key={header} className="py-1 px-3 text-xs h-auto">
                    <div className="flex items-center justify-between">
                      {header}
                      <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </ShadcnTableHeader>
            <TableBody>
              {filteredNursingCareData.length > 0 ? filteredNursingCareData.map((care, index) => (
                <TableRow key={care.id} className={`${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                  <TableCell className="py-1.5 px-3">{care.order}</TableCell>
                  <TableCell className="py-1.5 px-3">
                    {care.startDate && <div>Start: {care.startDate} {care.startTime}</div>}
                    {care.stopDate && <div>Stop: {care.stopDate} {care.stopTime}</div>}
                  </TableCell>
                  <TableCell className="py-1.5 px-3">{care.provider}</TableCell>
                  <TableCell className="py-1.5 px-3 text-xs">{care.status}</TableCell>
                  <TableCell className="py-1.5 px-3">{care.admissionAdvice || 'N/A'}</TableCell>
                  <TableCell className="py-1.5 px-3">{care.location}</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={nursingCareTableHeaders.length} className="text-center py-10 text-muted-foreground">
                    No nursing care orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between p-2.5 border-t text-xs text-muted-foreground mt-auto">
          <div>Showing {filteredNursingCareData.length > 0 ? 1 : 0} to {filteredNursingCareData.length} of {filteredNursingCareData.length} entries</div>
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

export default OrdersPage;