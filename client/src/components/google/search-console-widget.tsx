import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, MousePointer, TrendingUp, Hash, Settings, Unplug } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SearchConsoleWidgetProps {
  workspaceId: string;
  siteUrl?: string;
  startDate?: string;
  endDate?: string;
}

export function SearchConsoleWidget({ workspaceId, siteUrl, startDate, endDate }: SearchConsoleWidgetProps) {
  const [selectedSite, setSelectedSite] = useState<string>(siteUrl || "");
  const { toast } = useToast();

  // Auto-select first site if none selected
  const { data: sites } = useQuery({
    queryKey: ['/api/google/search-console/sites', workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/google/search-console/${workspaceId}/sites`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch sites');
      return response.json();
    },
    enabled: !!workspaceId,
    onSuccess: (sitesData) => {
      // Auto-select first site if none selected
      if (!selectedSite && sitesData && sitesData.length > 0) {
        setSelectedSite(sitesData[0]);
      }
    }
  });

  // Disconnect mutation
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('DELETE', `/api/workspaces/${workspaceId}/connections/google`);
    },
    onSuccess: () => {
      toast({
        title: "Disconnected",
        description: "Google Search Console connection removed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/google/search-console'] });
      queryClient.invalidateQueries({ queryKey: ['/api/workspaces', workspaceId, 'connections'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to disconnect Google Search Console",
        variant: "destructive",
      });
    },
  });


  const { data: searchData, isLoading, error } = useQuery({
    queryKey: ['/api/google/search-console', workspaceId, selectedSite, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedSite) params.append('siteUrl', selectedSite);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await fetch(`/api/google/search-console/${workspaceId}?${params}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Search Console data');
      }
      const data = await response.json();
      console.log('Search Console data received for site:', selectedSite, data);
      return data;
    },
    enabled: !!workspaceId && !!selectedSite,
  });

  if (isLoading) {
    return (
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Search className="h-5 w-5 text-green-400" />
            <span>Google Search Console</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-slate-400 mt-2">Loading Search Console data...</p>
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
            <Search className="h-5 w-5 text-green-400" />
            <span>Google Search Console</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-slate-400">Failed to load Search Console data</p>
            <p className="text-sm text-slate-500 mt-1">Please check your connection settings</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const summaryCards = [
    {
      title: "Total Clicks",
      value: searchData?.clicks?.toLocaleString() || "0",
      icon: MousePointer,
      color: "text-blue-400"
    },
    {
      title: "Impressions",
      value: searchData?.impressions?.toLocaleString() || "0",
      icon: TrendingUp,
      color: "text-green-400"
    },
    {
      title: "Average CTR",
      value: `${(searchData?.ctr || 0).toFixed(2)}%`,
      icon: Hash,
      color: "text-purple-400"
    },
    {
      title: "Average Position",
      value: (searchData?.position || 0).toFixed(1),
      icon: Search,
      color: "text-yellow-400"
    }
  ];

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-green-400" />
            <span>Google Search Console</span>
          </div>
          <div className="flex items-center space-x-2">
            {sites && sites.length > 0 && (
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger className="w-48 h-8 text-xs">
                  <SelectValue placeholder="Select Site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site: string) => (
                    <SelectItem key={site} value={site}>
                      {site.replace('https://', '').replace('http://', '')}
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
              title="Disconnect Google Search Console"
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

        {/* Top Queries */}
        {searchData?.queries && searchData.queries.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white">Top Search Queries</h4>
            <div className="space-y-2">
              {searchData.queries.slice(0, 5).map((query: any, index: number) => (
                <div key={index} className="flex justify-between items-center bg-slate-800/30 rounded-lg p-3">
                  <div className="flex-1">
                    <p className="text-sm text-white truncate">{query.query}</p>
                    <p className="text-xs text-slate-400">
                      {query.clicks} clicks • {query.impressions} impressions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-400">{query.ctr.toFixed(1)}%</p>
                    <p className="text-xs text-slate-400">#{query.position.toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}