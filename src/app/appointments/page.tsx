import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MOCK_APPOINTMENTS, type Appointment } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { CalendarPlus } from 'lucide-react';

export default function AppointmentsPage() {
  const appointments: Appointment[] = MOCK_APPOINTMENTS;

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <PageHeader 
        title="Upcoming Appointments" 
        description="Manage your medical appointments."
        action={
          <Button>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Schedule New
          </Button>
        }
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Schedule</CardTitle>
          <CardDescription>
            You have {appointments.length} upcoming appointment{appointments.length === 1 ? '' : 's'}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell className="font-medium">{appt.doctor}</TableCell>
                  <TableCell>{appt.specialty}</TableCell>
                  <TableCell>{new Date(appt.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                  <TableCell>{appt.time}</TableCell>
                  <TableCell className="hidden md:table-cell">{appt.location}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {appointments.length === 0 && (
            <p className="py-10 text-center text-muted-foreground">No upcoming appointments.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
