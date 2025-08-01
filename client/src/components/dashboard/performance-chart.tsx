import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceChartProps {
  workspaceId: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export default function PerformanceChart({ workspaceId, dateRange }: PerformanceChartProps) {
  const [activeMetric, setActiveMetric] = useState('spend');

  // Mock data - in real app this would come from API
  const data = [
    { name: 'Week 1', spend: 5200, revenue: 18200, roas: 3.5 },
    { name: 'Week 2', spend: 6800, revenue: 24800, roas: 3.6 },
    { name: 'Week 3', spend: 5900, revenue: 21900, roas: 3.7 },
    { name: 'Week 4', spend: 7200, revenue: 28200, roas: 3.9 },
  ];

  const getMetricKey = () => {
    switch (activeMetric) {
      case 'spend': return 'spend';
      case 'revenue': return 'revenue';
      case 'roas': return 'roas';
      default: return 'spend';
    }
  };

  return (
    <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Performance Trends</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant={activeMetric === 'spend' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveMetric('spend')}
              className={activeMetric === 'spend' ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30' : ''}
            >
              Spend
            </Button>
            <Button
              variant={activeMetric === 'revenue' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveMetric('revenue')}
              className={activeMetric === 'revenue' ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30' : ''}
            >
              Revenue
            </Button>
            <Button
              variant={activeMetric === 'roas' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveMetric('roas')}
              className={activeMetric === 'roas' ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30' : ''}
            >
              ROAS
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(99, 102, 241, 0.1)' }}
              />
              <YAxis 
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(99, 102, 241, 0.1)' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(30, 27, 75, 0.9)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line
                type="monotone"
                dataKey={getMetricKey()}
                stroke="#6366F1"
                strokeWidth={2}
                dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#8B5CF6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
