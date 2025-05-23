'use client';

import { useState, useEffect, useRef } from 'react'; // Added React import and hooks
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
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle as DialogUITitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'; 
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'; 
import { cn } from '@/lib/utils'; 
import { ScrollArea } from '@/components/ui/scroll-area'; 
// Checkbox is removed as it's not used in the new dialog

const orderSubNavItems = [
  "CPOE Order List", "Write Delay Order", "IP Medication", 
  "Laboratory", "Radiology", "Visit/ ADT", 
  "Procedure Order", "Nursing Care"
];

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

const IpMedicationView = () => {
  const [ipMedicationList, setIpMedicationList] = useState<IpMedicationEntryDataType[]>(mockIpMedicationData);
  
  const [isAddIpMedicationDialogOpen, setIsAddIpMedicationDialogOpen] = useState(false);
  const [orderMedicationName, setOrderMedicationName] = useState('');
  const [orderQuickOrder, setOrderQuickOrder] = useState('');
  const [isMedicationPopoverOpen, setIsMedicationPopoverOpen] = useState(false);
  
  const [visitDate, setVisitDate] = useState<string | undefined>("15 MAY, 2025 19:4");
  const [scheduleType, setScheduleType] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [orderFrom, setOrderFrom] = useState<string>("");
  const [orderTo, setOrderTo] = useState<string>("");
  const [showEntries, setShowEntries] = useState<string>("All");
  const [searchText, setSearchText] = useState<string>("");

  const openOrderMedicinesDialog = () => {
    setOrderMedicationName(''); 
    setOrderQuickOrder('');
    setIsAddIpMedicationDialogOpen(true);
  };

  const handleConfirmOrder = () => {
    // This is a placeholder. In a real app, you'd submit the order.
    console.log("Order Confirmed:", { medicationName: orderMedicationName, quickOrder: orderQuickOrder });
    if (orderMedicationName.trim()) {
        const newMed: IpMedicationEntryDataType = {
            id: Date.now().toString(),
            services: 'Inpt. Meds', // Default or could be part of the form
            medicationName: orderMedicationName,
            status: 'UNRELEASED', // Default status for new entries
            // Other fields can be defaulted or added to the dialog form later
            startDate: new Date().toLocaleDateString('en-CA'), // Example: YYYY-MM-DD
            startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            stopDate: '',
            stopTime: '',
            orderedBy: 'System (Dialog)',
            medicationDay: 'Day 1',  // Placeholder
            schedule: 'Pending',   // Placeholder
          };
          setIpMedicationList(prev => [newMed, ...prev]);
    }
    setIsAddIpMedicationDialogOpen(false);
  };

  const handleResetOrderForm = () => {
    setOrderMedicationName('');
    setOrderQuickOrder('');
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

      <Dialog open={isAddIpMedicationDialogOpen} onOpenChange={setIsAddIpMedicationDialogOpen}>
        <DialogContent className="sm:max-w-2xl p-0"> {/* Adjusted max-width, removed padding */}
          {/* Dialog Header Bar */}
          <div className="bg-sky-100 p-3">
            <DialogUITitle className="text-lg font-semibold text-sky-800">Order Medicines</DialogUITitle>
          </div>
          {/* Patient Info Bar */}
          <div className="bg-sky-100 p-3 text-xs text-sky-700 flex flex-wrap items-center gap-x-6 gap-y-1">
            <span>Patient ID : 80000035</span>
            <span>Name : Anonymous Two</span>
            <span>Age : 69 Years</span>
            <span>Sex : MALE</span>
            <span>Patient Type : In Patient</span>
          </div>
          
          {/* Main Form Area */}
          <div className="p-6 space-y-4"> {/* Added padding here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-1">
                  <Label htmlFor="orderMedicationNameBtn" className="text-sm font-medium">Medication Name</Label>
                  <Popover open={isMedicationPopoverOpen} onOpenChange={setIsMedicationPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="orderMedicationNameBtn"
                        variant="outline"
                        role="combobox"
                        aria-expanded={isMedicationPopoverOpen}
                        className="w-full justify-between h-9 font-normal text-left"
                      >
                        {orderMedicationName || "Select medication..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search medication..." />
                        <CommandList className="max-h-[300px] overflow-y-auto">
                          <CommandEmpty>No medication found.</CommandEmpty>
                          <CommandGroup>
                            {ALL_AVAILABLE_MEDICATIONS.map((medication) => (
                              <CommandItem
                                key={medication}
                                value={medication}
                                onSelect={(currentValue) => {
                                  setOrderMedicationName(currentValue.toUpperCase() === orderMedicationName.toUpperCase() ? "" : currentValue);
                                  setIsMedicationPopoverOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    orderMedicationName.toUpperCase() === medication.toUpperCase() ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {medication}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-end space-x-2">
                  <div className="flex-grow space-y-1">
                    <Label htmlFor="orderQuickOrder" className="text-sm font-medium">Quick Order</Label>
                    <Input 
                      id="orderQuickOrder" 
                      value={orderQuickOrder} 
                      onChange={(e) => setOrderQuickOrder(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <Button type="button" className="bg-yellow-500 hover:bg-yellow-600 text-white h-9 text-xs">Edit Quick List</Button>
                </div>
            </div>
          </div>

          {/* Dialog Action Buttons Area */}
          <div className="flex justify-center space-x-4 p-4 pt-2 border-t border-gray-200">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white h-9 text-xs px-6" onClick={handleConfirmOrder}>Confirm Order</Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white h-9 text-xs px-6" onClick={handleResetOrderForm}>Reset</Button>
            <DialogClose asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white h-9 text-xs px-6">Close</Button>
            </DialogClose>
          </div>
          {/* Dialog Footer Bar */}
          <div className="bg-sky-100 p-2 text-center">
            <p className="text-xs text-sky-700">Copyright © 2015 Sansys Informatics Pvt. Ltd</p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};


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
        
        {activeOrderSubNav !== "CPOE Order List" && activeOrderSubNav !== "IP Medication" && (
          <Card className="flex-1 flex items-center justify-center">
            <CardContent className="text-center">
              <CardTitle className="text-xl text-muted-foreground">
                {activeOrderSubNav} View
              </CardTitle>
              <p className="text-sm text-muted-foreground">Content for this section is not yet implemented.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default OrdersPage; 