import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import { Target, TrendingUp, BarChart3, Calendar, DollarSign, Users, Eye, MousePointer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CampaignsProps {
  workspaceId: string;
}

export default function Campaigns({ workspaceId }: CampaignsProps) {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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

  // Mock campaign data for demonstration
  const campaigns = [
    {
      id: "1",
      name: "Summer Sale Campaign",
      platform: "Meta Ads",
      status: "Active",
      budget: 5000,
      spent: 3245.67,
      impressions: 125430,
      clicks: 2453,
      conversions: 89,
      ctr: 1.96,
      cpc: 1.32,
      roas: 4.2
    },
    {
      id: "2", 
      name: "Brand Awareness Drive",
      platform: "Google Ads",
      status: "Active",
      budget: 3000,
      spent: 2890.45,
      impressions: 89234,
      clicks: 1876,
      conversions: 56,
      ctr: 2.1,
      cpc: 1.54,
      roas: 3.8
    },
    {
      id: "3",
      name: "Holiday Collection Launch",
      platform: "Meta Ads", 
      status: "Paused",
      budget: 8000,
      spent: 4567.23,
      impressions: 200145,
      clicks: 3421,
      conversions: 124,
      ctr: 1.71,
      cpc: 1.33,
      roas: 5.1
    }
  ];

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
                    <p className="text-2xl font-bold text-white">{campaigns.length}</p>
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
                    <p className="text-2xl font-bold text-white">
                      ${campaigns.reduce((sum, c) => sum + c.spent, 0).toLocaleString()}
                    </p>
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
                    <p className="text-2xl font-bold text-white">
                      {campaigns.reduce((sum, c) => sum + c.impressions, 0).toLocaleString()}
                    </p>
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
                    <p className="text-2xl font-bold text-white">
                      {(campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length).toFixed(1)}x
                    </p>
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
                <span>Active Campaigns</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="p-6 rounded-lg bg-surface-light border border-surface-border hover:border-primary-500/30 transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-white">{campaign.name}</h3>
                        <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                        <Badge variant="outline">{campaign.platform}</Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                      <div>
                        <p className="text-xs text-slate-400">Budget</p>
                        <p className="text-sm font-medium text-white">${campaign.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Spent</p>
                        <p className="text-sm font-medium text-white">${campaign.spent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Impressions</p>
                        <p className="text-sm font-medium text-white">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Clicks</p>
                        <p className="text-sm font-medium text-white">{campaign.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">CTR</p>
                        <p className="text-sm font-medium text-white">{campaign.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">CPC</p>
                        <p className="text-sm font-medium text-white">${campaign.cpc}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">ROAS</p>
                        <p className="text-sm font-medium text-green-400">{campaign.roas}x</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}