'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { CartesianGrid, XAxis, YAxis, Line, LineChart as RechartsLineChart, Bar, BarChart as RechartsBarChart, ResponsiveContainer } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

const glucoseData = [
  { date: '2024-07-01', level: 95 },
  { date: '2024-07-02', level: 102 },
  { date: '2024-07-03', level: 98 },
  { date: '2024-07-04', level: 110 },
  { date: '2024-07-05', level: 105 },
  { date: '2024-07-06', level: 99 },
  { date: '2024-07-07', level: 108 },
];

const ecgData = [
  { time: '0s', value: 0.1 }, { time: '0.1s', value: 0.5 }, { time: '0.2s', value: -0.2 },
  { time: '0.3s', value: 1.0 }, { time: '0.4s', value: -0.3 }, { time: '0.5s', value: 0.2 },
  { time: '0.6s', value: 0.6 }, { time: '0.7s', value: -0.1 }, { time: '0.8s', value: 1.1 },
];

const ctScanReadings = [
  { organ: 'Lungs', finding: 'Clear' },
  { organ: 'Liver', finding: 'Normal' },
  { organ: 'Kidneys', finding: 'Slight calcification' },
];

const glucoseChartConfig = {
  level: {
    label: 'Glucose (mg/dL)',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const ecgChartConfig = {
  value: {
    label: 'ECG (mV)',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;


export default function HealthDataPage() {
  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <PageHeader title="Health Data" description="Visualize your health trends over time." />
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Glucose Levels Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={glucoseChartConfig} className="h-[300px] w-full">
              <RechartsLineChart data={glucoseData} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Line dataKey="level" type="monotone" stroke="var(--color-level)" strokeWidth={2} dot={true} />
              </RechartsLineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Electrocardiogram (ECG) Sample</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={ecgChartConfig} className="h-[300px] w-full">
              <RechartsLineChart data={ecgData} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} dot={false} />
              </RechartsLineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>CT Scan Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {ctScanReadings.map((reading, index) => (
                <li key={index} className="flex justify-between p-2 rounded-md bg-secondary/50">
                  <span className="font-medium text-secondary-foreground">{reading.organ}:</span>
                  <span className="text-muted-foreground">{reading.finding}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Note: This is a simplified summary. Always consult your doctor for detailed analysis.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
