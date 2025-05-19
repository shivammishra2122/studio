'use client';

import type { NextPage } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ClinicalNotesPage: NextPage = () => {
  return (
    <div className="flex flex-1 items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">Clinical Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Content for the Clinical Notes page is not yet implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClinicalNotesPage;