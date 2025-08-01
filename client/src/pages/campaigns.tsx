import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import { Target, TrendingUp, BarChart3, Calendar, DollarSign, Users, Eye, MousePointer, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CampaignsProps {
  workspaceId: string;
}

export default function Campaigns({ workspaceId }: CampaignsProps) {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Fetch real campaign data
  const { data: campaigns, isLoading: campaignsLoading, error: campaignsError } = useQuery({
    queryKey: [`/api/workspaces/${workspaceId}/campaigns`],
    enabled: !!workspaceId && isAuthenticated,
    retry: false,
  });

  // Fetch performance metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: [`/api/workspaces/${workspaceId}/metrics/summary`],
    enabled: !!workspaceId && isAuthenticated,
    retry: false,
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Handle campaign query errors
  useEffect(() => {
    if (campaignsError) {
      if (isUnauthorizedError(campaignsError as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      console.error('Campaign data error:', campaignsError);
    }
  }, [campaignsError, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        workspaces={[{ id: workspaceId, name: "My Marketing Campaigns" }]}
        connections={[]}
        selectedWorkspace={workspaceId}
        onWorkspaceChange={() => {}}
      />
      <div className="flex-1 lg:ml-64">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Target className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Campaign Management</h1>
                <p className="text-slate-400">Monitor and optimize your advertising campaigns</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Create Campaign
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Campaigns</p>
                    {metricsLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                        <span className="text-sm text-slate-400">Loading...</span>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-white">{Array.isArray(campaigns) ? campaigns.length : 0}</p>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <Target className="text-white w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Spend</p>
                    {metricsLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                        <span className="text-sm text-slate-400">Loading...</span>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-white">
                        ${((metrics as any)?.totalSpend || 0).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <DollarSign className="text-white w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Impressions</p>
                    {metricsLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                        <span className="text-sm text-slate-400">Loading...</span>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-white">
                        {((metrics as any)?.totalImpressions || 0).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <Eye className="text-white w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Avg. ROAS</p>
                    {metricsLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                        <span className="text-sm text-slate-400">Loading...</span>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-white">
                        {((metrics as any)?.avgRoas || 0).toFixed(1)}x
                      </p>
                    )}
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <TrendingUp className="text-white w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns List */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Campaign Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {campaignsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="text-slate-400">Loading campaign data...</span>
                  </div>
                </div>
              ) : Array.isArray(campaigns) && campaigns.length > 0 ? (
                <div className="space-y-4">
                  {campaigns.map((campaign: any, index: number) => (
                    <div key={campaign.id || index} className="p-6 rounded-lg bg-surface-light border border-surface-border hover:border-primary-500/30 transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-white">{campaign.name || `Campaign ${index + 1}`}</h3>
                          <Badge variant={campaign.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {campaign.status || 'Active'}
                          </Badge>
                          <Badge variant="outline">{campaign.platform || 'Meta Ads'}</Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div>
                          <p className="text-xs text-slate-400">Impressions</p>
                          <p className="text-sm font-medium text-white">{(campaign.impressions || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Clicks</p>
                          <p className="text-sm font-medium text-white">{(campaign.clicks || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Spend</p>
                          <p className="text-sm font-medium text-white">${(campaign.spend || 0).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">CTR</p>
                          <p className="text-sm font-medium text-white">{(campaign.ctr || 0).toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">CPC</p>
                          <p className="text-sm font-medium text-white">${(campaign.cpc || 0).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Reach</p>
                          <p className="text-sm font-medium text-green-400">{(campaign.reach || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No Campaign Data Available</h3>
                  <p className="text-slate-400 mb-4">Connect your advertising platforms to view campaign performance data.</p>
                  <Button variant="outline" onClick={() => window.location.href = '/connections'}>
                    Connect Platforms
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}