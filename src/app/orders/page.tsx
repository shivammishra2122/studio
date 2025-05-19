
'use client';

import type { NextPage } from 'next';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, FileEdit, RefreshCw, CalendarDays, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const orderSubNavItems = [
  "CPOE Order List", "Write Delay Order", "IP Medication", 
  "Laboratory", "Radiology", "Visit/ ADT", 
  "Procedure Order", "Nursing Care"
];

type OrderDataType = {
  id: string;
  service: string;
  order: string;
  startDate: string;
  startTime: string;
  stopDate?: string;
  stopTime?: string;
  provider: string;
  status: "Completed" | "Pending" | "Cancelled";
  location: string;
};

const mockOrderData: OrderDataType[] = [
  { id: '1', service: 'Lab', order: 'CBC with Differential', startDate: '10 Sep 2024', startTime: '09:00', provider: 'Dr. Smith', status: 'Completed', location: 'Main Lab' },
  { id: '2', service: 'Radiology', order: 'Chest X-Ray, PA and Lateral', startDate: '10 Sep 2024', startTime: '10:30', stopDate: '10 Sep 2024', stopTime: '11:00', provider: 'Dr. Jones', status: 'Pending', location: 'Radiology Dept.' },
  { id: '3', service: 'Pharmacy', order: 'Amoxicillin 500mg Cap', startDate: '11 Sep 2024', startTime: '08:00', provider: 'Dr. Brown', status: 'Completed', location: 'Inpatient Pharmacy' },
  { id: '4', service: 'Dietary', order: 'NPO after midnight', startDate: '11 Sep 2024', startTime: '00:01', provider: 'Dr. White', status: 'Pending', location: 'Patient Room' },
  { id: '5', service: 'Consult', order: 'Cardiology Consult', startDate: '12 Sep 2024', startTime: '14:00', provider: 'Dr. Green', status: 'Cancelled', location: 'Cardiology Clinic' },
];


const OrdersPage: NextPage = () => {
  const [activeOrderSubNav, setActiveOrderSubNav] = useState<string>(orderSubNavItems[0]);
  const [visitDate, setVisitDate] = useState<string | undefined>();
  const [orderFromDate, setOrderFromDate] = useState<string>("10/09/2024");
  const [orderToDate, setOrderToDate] = useState<string>("10/09/2024");
  const [serviceFilter, setServiceFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [showEntries, setShowEntries] = useState<string>("10");
  const [searchText, setSearchText] = useState<string>("");

  // Placeholder for filtered orders
  const filteredOrders = mockOrderData;


  return (
    <div className="flex h-[calc(100vh-var(--top-nav-height,60px))] bg-background text-sm">
      {/* Left Sub-Navigation Panel */}
      <aside className="w-48 bg-card border-r p-2 flex flex-col space-y-1">
        {orderSubNavItems.map((item) => (
          <Button
            key={item}
            variant={activeOrderSubNav === item ? "secondary" : "ghost"}
            className={`w-full justify-start text-left h-9 px-2.5 text-xs ${activeOrderSubNav === item ? 'bg-blue-700 text-white border-l-4 border-sky-400 hover:bg-blue-700 hover:text-white' : 'hover:bg-muted/50 hover:text-foreground'}`}
            onClick={() => setActiveOrderSubNav(item)}
          >
            {item}
          </Button>
        ))}
      </aside>

      {/* Right Content Panel */}
      <main className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
        {activeOrderSubNav === "CPOE Order List" && (
           <Card className="flex-1 flex flex-col shadow">
            <CardHeader className="p-2.5 border-b bg-accent text-foreground rounded-t-md">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">All Services</CardTitle>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground hover:bg-muted/50">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground hover:bg-muted/50">
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-foreground hover:bg-muted/50">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-2.5 flex-1 flex flex-col overflow-hidden">
              {/* Filter Bars */}
              <div className="space-y-2 mb-2">
                <div className="flex items-center space-x-2 text-xs">
                  <Label htmlFor="orderVisitDate" className="shrink-0">Visit Date</Label>
                  <Select value={visitDate} onValueChange={setVisitDate}>
                    <SelectTrigger id="orderVisitDate" className="h-7 w-36 text-xs">
                      <SelectValue placeholder="Select Visit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visit1">10 Sep 2024 - OPD</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label htmlFor="orderService" className="shrink-0">Service</Label>
                   <Select value={serviceFilter} onValueChange={setServiceFilter}>
                    <SelectTrigger id="orderService" className="h-7 w-32 text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="lab">Laboratory</SelectItem>
                      <SelectItem value="radiology">Radiology</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label htmlFor="orderStatus" className="shrink-0">Status</Label>
                   <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="orderStatus" className="h-7 w-28 text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label htmlFor="orderFromDate" className="shrink-0">Order From</Label>
                  <div className="relative">
                    <Input id="orderFromDate" type="text" value={orderFromDate} onChange={e => setOrderFromDate(e.target.value)} className="h-7 w-28 text-xs pr-7" />
                    <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Label htmlFor="orderToDate" className="shrink-0">Order To</Label>
                  <div className="relative">
                    <Input id="orderToDate" type="text" value={orderToDate} onChange={e => setOrderToDate(e.target.value)} className="h-7 w-28 text-xs pr-7" />
                    <CalendarDays className="h-3.5 w-3.5 absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                   <div className="flex items-center space-x-1 ml-auto"> {/* Pushes to right */}
                    <Label htmlFor="orderShowEntries" className="text-xs">Show</Label>
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
                    <Label htmlFor="orderShowEntries" className="text-xs">entries</Label>
                    </div>
                  <Label htmlFor="orderSearch" className="shrink-0">Search:</Label>
                  <Input id="orderSearch" type="text" value={searchText} onChange={e => setSearchText(e.target.value)} className="h-7 w-40 text-xs" />
                </div>
              </div>

              {/* Table */}
              <ScrollArea className="flex-1">
                <Table className="text-xs">
                  <TableHeader className="bg-accent sticky top-0 z-10">
                    <TableRow>
                      {["Service", "Order", "Start/Stop Date", "Provider", "Status", "Location"].map(header => (
                        <TableHead key={header} className="py-2 px-3 text-foreground font-semibold h-8">
                          <div className="flex items-center justify-between">
                            {header}
                            <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? filteredOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="py-1.5 px-3">{order.service}</TableCell>
                        <TableCell className="py-1.5 px-3">{order.order}</TableCell>
                        <TableCell className="py-1.5 px-3">
                          <div>Start: {order.startDate} {order.startTime}</div>
                          {order.stopDate && <div>Stop: {order.stopDate} {order.stopTime}</div>}
                        </TableCell>
                        <TableCell className="py-1.5 px-3">{order.provider}</TableCell>
                        <TableCell className="py-1.5 px-3">
                          <Badge 
                            variant={order.status === 'Completed' ? 'default' : order.status === 'Pending' ? 'secondary' : 'destructive'}
                            className={`text-xs px-1.5 py-0.5 ${order.status === 'Completed' ? 'bg-green-100 text-green-800 border-green-300' : order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-red-100 text-red-800 border-red-300'}`}
                           >
                            {order.status}
                          </Badge>
                        </TableCell>
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
              </ScrollArea>

              {/* Footer */}
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
        )}
         {/* Placeholder for other Order sub-views */}
         {activeOrderSubNav !== "CPOE Order List" && (
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

    