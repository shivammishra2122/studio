
'use client';

import type { NextPage } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LabPage: NextPage = () => {
  return (
    <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden h-[calc(100vh-var(--top-nav-height,60px))] items-center justify-center">
      <Card className="w-full max-w-md shadow">
        <CardHeader>
          <CardTitle className="text-center text-xl">Lab</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Content for this section is not yet implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabPage;
    