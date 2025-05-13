import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet, HeartPulse, Activity, Thermometer, Scale } from 'lucide-react';
import type { HealthMetric } from '@/lib/constants';
import Image from 'next/image';

const keyIndicators: HealthMetric[] = [
  { name: 'Blood Glucose', value: '98', unit: 'mg/dL', trend: 'stable', icon: Droplet },
  { name: 'Heart Rate', value: '72', unit: 'bpm', trend: 'stable', icon: HeartPulse },
  { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', trend: 'stable', icon: Activity },
  { name: 'Body Temperature', value: '36.8', unit: '°C', trend: 'stable', icon: Thermometer },
  { name: 'Weight', value: '70', unit: 'kg', trend: 'down', icon: Scale },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <PageHeader title="Dashboard" description="Overview of your current health status." />
      
      <div className="mb-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Welcome Back!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Here's a summary of your health. Stay proactive and healthy!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {keyIndicators.map((indicator) => (
          <Card key={indicator.name} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {indicator.name}
              </CardTitle>
              {indicator.icon && <indicator.icon className="h-5 w-5 text-primary" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {indicator.value} <span className="text-xs text-muted-foreground">{indicator.unit}</span>
              </div>
              {indicator.trend && (
                <p className={`text-xs ${indicator.trend === 'up' ? 'text-red-500' : indicator.trend === 'down' ? 'text-green-500' : 'text-muted-foreground'} mt-1`}>
                  {indicator.trend === 'up' ? '▲ Increased' : indicator.trend === 'down' ? '▼ Decreased' : '● Stable'}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Image 
                src="https://picsum.photos/150/150" 
                alt="Fitness Activity" 
                width={100} 
                height={100} 
                className="rounded-lg"
                data-ai-hint="fitness activity" 
              />
              <div>
                <h3 className="font-semibold">Morning Run</h3>
                <p className="text-sm text-muted-foreground">Completed 5km in 30 minutes.</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Health Tip of the Day</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="flex items-center space-x-4">
              <Image 
                src="https://picsum.photos/150/150" 
                alt="Healthy Food" 
                width={100} 
                height={100} 
                className="rounded-lg"
                data-ai-hint="healthy food"
              />
              <div>
                <h3 className="font-semibold">Stay Hydrated</h3>
                <p className="text-sm text-muted-foreground">Remember to drink at least 8 glasses of water today for optimal health and energy levels.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
