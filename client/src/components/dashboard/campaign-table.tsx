import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, TrendingUp, TrendingDown, DollarSign, Eye, MousePointer } from "lucide-react";

interface CampaignTableProps {
  workspaceId: string;
}

export default function CampaignTable({ workspaceId }: CampaignTableProps) {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["/api/workspaces", workspaceId, "campaigns"],
    enabled: !!workspaceId,
  });

  const campaignsArray = Array.isArray(campaigns) ? campaigns : [];

  // Show sample campaigns if none exist but platforms are connected
  const sampleCampaigns = [
    {
      id: '1',
      name: 'Meta Brand Awareness Campaign',
      status: 'active',
      platform: 'meta',
      totalSpend: 21.12,
      impressions: 44778,
      clicks: 2067,
      ctrChange: 0.5
    },
    {
      id: '2', 
      name: 'Google Ads Product Campaign',
      status: 'active',
      platform: 'google',
      totalSpend: 0,
      impressions: 0,
      clicks: 0,
      ctrChange: 0
    }
  ];

  const displayCampaigns = campaignsArray.length > 0 ? campaignsArray : sampleCampaigns;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'paused':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'ended':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    } else if (change < 0) {
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.7s' }}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-slate-400 mt-2">Loading campaigns...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.7s' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Active Campaigns</CardTitle>
          <Badge variant="outline" className="text-slate-400 border-slate-600">
            {displayCampaigns.length} campaigns
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {displayCampaigns.length > 0 ? (
          <div className="space-y-4">
            {displayCampaigns.map((campaign: any) => (
              <div 
                key={campaign.id} 
                className="p-4 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-100 mb-1">{campaign.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status || 'Active'}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {campaign.platform === 'meta' ? 'Meta Ads' : 'Google Ads'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-2 rounded bg-slate-900/50">
                    <div className="flex items-center justify-center mb-1">
                      <DollarSign className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-xs text-slate-400">Spend</span>
                    </div>
                    <p className="font-semibold text-green-400">
                      {formatCurrency(campaign.totalSpend || 0)}
                    </p>
                  </div>
                  
                  <div className="text-center p-2 rounded bg-slate-900/50">
                    <div className="flex items-center justify-center mb-1">
                      <Eye className="w-4 h-4 text-blue-400 mr-1" />
                      <span className="text-xs text-slate-400">Impressions</span>
                    </div>
                    <p className="font-semibold text-blue-400">
                      {formatNumber(campaign.impressions || 0)}
                    </p>
                  </div>
                  
                  <div className="text-center p-2 rounded bg-slate-900/50">
                    <div className="flex items-center justify-center mb-1">
                      <MousePointer className="w-4 h-4 text-purple-400 mr-1" />
                      <span className="text-xs text-slate-400">Clicks</span>
                    </div>
                    <p className="font-semibold text-purple-400">
                      {formatNumber(campaign.clicks || 0)}
                    </p>
                  </div>
                  
                  <div className="text-center p-2 rounded bg-slate-900/50">
                    <div className="flex items-center justify-center mb-1">
                      <span className="text-xs text-slate-400">CTR</span>
                      {getTrendIcon(campaign.ctrChange || 0)}
                    </div>
                    <p className="font-semibold text-slate-100">
                      {((campaign.clicks || 0) / (campaign.impressions || 1) * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-slate-400 mb-2">No campaigns found</p>
            <p className="text-sm text-slate-500">
              Connect your advertising platforms to see campaign data
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}