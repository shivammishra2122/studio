import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MOCK_MEDICATIONS, type Medication } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { FilePlus2 } from 'lucide-react';

export default function MedicationsPage() {
  const medications: Medication[] = MOCK_MEDICATIONS;

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <PageHeader 
        title="Medication List" 
        description="Keep track of your current and past medications."
        action={
          <Button>
            <FilePlus2 className="mr-2 h-4 w-4" />
            Add Medication
          </Button>
        }
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Medications</CardTitle>
          <CardDescription>
            You are currently taking {medications.length} medication{medications.length === 1 ? '' : 's'}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead className="hidden md:table-cell">Reason</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medications.map((med) => (
                <TableRow key={med.id}>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>{med.frequency}</TableCell>
                  <TableCell className="hidden md:table-cell">{med.reason}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {medications.length === 0 && (
            <p className="py-10 text-center text-muted-foreground">No medications listed.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
