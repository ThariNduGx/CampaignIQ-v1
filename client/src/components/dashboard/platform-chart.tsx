import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PlatformChartProps {
  workspaceId: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export default function PlatformChart({ workspaceId, dateRange }: PlatformChartProps) {
  const { data, isLoading } = useQuery({
    queryKey: [`/api/workspaces/${workspaceId}/platform-performance`, dateRange],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}/platform-performance?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
      if (!response.ok) throw new Error('Failed to fetch platform data');
      return response.json();
    },
    enabled: !!workspaceId,
  });

  const platformData = data || [];

  return (
    <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Platform Performance</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-slate-400">Google</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-xs text-slate-400">Meta</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.1)" />
                <XAxis 
                  dataKey="metric" 
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
                <Legend />
                <Bar 
                  dataKey="google" 
                  fill="#3B82F6" 
                  name="Google Ads"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="meta" 
                  fill="#8B5CF6" 
                  name="Meta Ads"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
