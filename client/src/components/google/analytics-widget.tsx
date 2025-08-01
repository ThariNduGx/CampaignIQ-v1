import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Eye, MousePointer, DollarSign, Settings, Unplug } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AnalyticsWidgetProps {
  workspaceId: string;
  propertyId?: string;
  startDate?: string;
  endDate?: string;
  onPropertySelect?: (propertyId: string) => void;
  selectedProperty?: string;
}

export function AnalyticsWidget({ workspaceId, propertyId, startDate, endDate, onPropertySelect, selectedProperty: externalSelectedProperty }: AnalyticsWidgetProps) {
  const [selectedProperty, setSelectedProperty] = useState<string>(externalSelectedProperty || propertyId || "");
  const { toast } = useToast();

  // Disconnect mutation
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('DELETE', `/api/workspaces/${workspaceId}/connections/google`);
    },
    onSuccess: () => {
      toast({
        title: "Disconnected",
        description: "Google Analytics connection removed successfully",
      });
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['/api/google/analytics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/workspaces', workspaceId, 'connections'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to disconnect Google Analytics",
        variant: "destructive",
      });
    },
  });

  // Fetch available properties
  const { data: properties } = useQuery({
    queryKey: ['/api/google/analytics/properties', workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/google/analytics/${workspaceId}/properties`);
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    },
    enabled: !!workspaceId,
  });
  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['/api/google/analytics', workspaceId, selectedProperty, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedProperty) params.append('propertyId', selectedProperty);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await fetch(`/api/google/analytics/${workspaceId}?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Google Analytics data');
      }
      return response.json();
    },
    enabled: !!workspaceId,
  });

  if (isLoading) {
    return (
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <span>Google Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-slate-400 mt-2">Loading Analytics data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <span>Google Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-slate-400">Failed to load Analytics data</p>
            <p className="text-sm text-slate-500 mt-1">Please check your connection settings</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const summaryCards = [
    {
      title: "Sessions",
      value: analyticsData?.sessions?.toLocaleString() || "0",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Page Views",
      value: analyticsData?.pageviews?.toLocaleString() || "0",
      icon: Eye,
      color: "text-green-400"
    },
    {
      title: "Avg. Session Duration",
      value: `${Math.round(analyticsData?.avgSessionDuration || 0)}s`,
      icon: MousePointer,
      color: "text-purple-400"
    },
    {
      title: "Revenue",
      value: `$${(analyticsData?.revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-yellow-400"
    }
  ];

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <span>Google Analytics</span>
          </div>
          <div className="flex items-center space-x-2">
            {properties && properties.length > 0 && (
              <Select value={selectedProperty} onValueChange={(value) => {
                setSelectedProperty(value);
                onPropertySelect?.(value);
              }}>
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue placeholder="Property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property: string) => (
                    <SelectItem key={property} value={property}>
                      {property}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => disconnectMutation.mutate()}
              disabled={disconnectMutation.isPending}
              className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
              title="Disconnect Google Analytics"
            >
              <Unplug className="h-4 w-4" />
            </Button>
            <Settings className="h-4 w-4 text-slate-400" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, index) => (
            <div key={index} className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">{card.title}</p>
                  <p className="text-lg font-semibold text-white">{card.value}</p>
                </div>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Performance Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Bounce Rate</span>
              <span className="text-sm text-white">{(analyticsData?.bounceRate || 0).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Goal Completions</span>
              <span className="text-sm text-white">{analyticsData?.goalCompletions?.toLocaleString() || "0"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}