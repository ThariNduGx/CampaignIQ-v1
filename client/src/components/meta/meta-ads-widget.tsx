import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Eye, MousePointer, DollarSign, Users, Percent, Unlink } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface MetaAdsWidgetProps {
  workspaceId: string;
}

interface MetaInsights {
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  ctr: number;
  cpc: number;
  cpm: number;
  frequency: number;
}

export default function MetaAdsWidget({ workspaceId }: MetaAdsWidgetProps) {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('30');

  const { data: metaData, isLoading, error } = useQuery<MetaInsights>({
    queryKey: [`/api/meta/${workspaceId}`, dateRange],
    queryFn: async () => {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await fetch(`/api/meta/${workspaceId}?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    retry: false,
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/connections/${workspaceId}/meta`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to disconnect Meta platform');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Platform Disconnected",
        description: "Meta (Facebook/Instagram) connection has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/workspaces/${workspaceId}/connections`] });
      queryClient.invalidateQueries({ queryKey: [`/api/meta/${workspaceId}`] });
    },
    onError: (error) => {
      toast({
        title: "Disconnect Failed",
        description: error instanceof Error ? error.message : "Could not disconnect Meta platform. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const formatPercentage = (num: number) => {
    return num.toFixed(2) + '%';
  };

  if (error) {
    return (
      <Card className="h-fit">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base font-medium">Meta Ads</CardTitle>
            <CardDescription>Facebook & Instagram advertising performance</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => disconnectMutation.mutate()}
            disabled={disconnectMutation.isPending}
            className="text-muted-foreground hover:text-destructive"
          >
            <Unlink className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-destructive/10 p-3 mb-4">
              <TrendingUp className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="font-medium text-sm mb-2">Connection Error</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Unable to fetch Meta advertising data. Please check your connection.
            </p>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">Meta Ads</CardTitle>
          <CardDescription>Facebook & Instagram advertising performance</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs border rounded px-2 py-1 bg-background"
            disabled={isLoading}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => disconnectMutation.mutate()}
            disabled={disconnectMutation.isPending}
            className="text-muted-foreground hover:text-destructive"
          >
            <Unlink className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-3 w-16 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Impressions</span>
              </div>
              <span className="text-sm font-bold">
                {formatNumber(metaData?.impressions || 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MousePointer className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Clicks</span>
              </div>
              <span className="text-sm font-bold">
                {formatNumber(metaData?.clicks || 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Spend</span>
              </div>
              <span className="text-sm font-bold">
                {formatCurrency(metaData?.spend || 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Reach</span>
              </div>
              <span className="text-sm font-bold">
                {formatNumber(metaData?.reach || 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Percent className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">CTR</span>
              </div>
              <span className="text-sm font-bold">
                {formatPercentage(metaData?.ctr || 0)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-cyan-500" />
                <span className="text-sm font-medium">CPC</span>
              </div>
              <span className="text-sm font-bold">
                {formatCurrency(metaData?.cpc || 0)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}