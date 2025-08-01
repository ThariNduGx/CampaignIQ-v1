import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Zap, Target, DollarSign, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface RealTimeInsightsProps {
  workspaceId: string;
  className?: string;
}

export default function RealTimeInsights({ workspaceId, className }: RealTimeInsightsProps) {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Fetch real-time metrics
  const { data: realTimeData, isLoading } = useQuery({
    queryKey: [`/api/workspaces/${workspaceId}/real-time-metrics`],
    enabled: !!workspaceId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sample real-time data structure
  const sampleData = {
    activeUsers: 1247,
    currentImpressions: 2850,
    clicksLastHour: 134,
    spendToday: 285.50,
    conversionRate: 3.2,
    topPerformingAd: "Summer Sale - 40% Off",
    alerts: [
      {
        id: 1,
        type: "warning",
        title: "High CPC Alert",
        message: "Google Ads CPC increased by 15% in the last hour",
        timestamp: "2 minutes ago",
        priority: "high"
      },
      {
        id: 2,
        type: "success",
        title: "Campaign Milestone",
        message: "Meta campaign reached 10K impressions",
        timestamp: "5 minutes ago",
        priority: "medium"
      },
      {
        id: 3,
        type: "info",
        title: "Budget Alert",
        message: "Daily budget 75% utilized",
        timestamp: "12 minutes ago",
        priority: "low"
      }
    ],
    performanceMetrics: [
      { label: "CTR", value: 4.2, change: 0.3, trend: "up" },
      { label: "CPC", value: 1.25, change: -0.05, trend: "down" },
      { label: "ROAS", value: 4.8, change: 0.2, trend: "up" },
      { label: "CVR", value: 3.2, change: -0.1, trend: "down" }
    ],
    campaignStatus: [
      { name: "Summer Sale", status: "active", performance: 95, spend: 120.50 },
      { name: "Brand Awareness", status: "active", performance: 87, spend: 85.25 },
      { name: "Retargeting", status: "paused", performance: 72, spend: 45.75 },
      { name: "New Products", status: "active", performance: 91, spend: 110.00 }
    ]
  };

  const data = (realTimeData as any) || sampleData;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'info': return <Activity className="w-4 h-4 text-blue-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-blue-500';
      default: return 'border-l-slate-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="w-4 h-4 text-green-400" /> : 
      <TrendingDown className="w-4 h-4 text-red-400" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'ended': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-Time Metrics */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                  <Activity className="text-white w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-white">Real-Time Performance</CardTitle>
                  <p className="text-sm text-slate-400">Live campaign metrics and updates</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-400">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-surface-light border border-surface-border">
                <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{data.activeUsers?.toLocaleString()}</p>
                <p className="text-xs text-slate-400">Active Users</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-surface-light border border-surface-border">
                <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{data.currentImpressions?.toLocaleString()}</p>
                <p className="text-xs text-slate-400">Impressions</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-surface-light border border-surface-border">
                <Zap className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{data.clicksLastHour}</p>
                <p className="text-xs text-slate-400">Clicks/Hour</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-surface-light border border-surface-border">
                <DollarSign className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">${data.spendToday?.toFixed(2)}</p>
                <p className="text-xs text-slate-400">Spend Today</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white">Performance Indicators</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.performanceMetrics?.map((metric: any, index: number) => (
                  <div key={index} className="p-3 rounded-lg bg-surface-light border border-surface-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">{metric.label}</span>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-white">
                        {metric.label === 'CPC' ? `$${metric.value}` : 
                         metric.label === 'ROAS' ? `${metric.value}x` : 
                         `${metric.value}%`}
                      </span>
                      <span className={`text-xs ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {metric.trend === 'up' ? '+' : ''}{metric.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Status */}
            <Separator className="my-6" />
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-white">Active Campaigns</h4>
              <div className="space-y-3">
                {data.campaignStatus?.map((campaign: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface-light border border-surface-border">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(campaign.status)}`}></div>
                      <div>
                        <p className="text-sm font-medium text-white">{campaign.name}</p>
                        <p className="text-xs text-slate-400">Spend: ${campaign.spend}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16">
                        <Progress value={campaign.performance} className="h-2" />
                      </div>
                      <span className="text-xs text-slate-400 w-8">{campaign.performance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-white">Live Alerts</CardTitle>
              <Badge variant="secondary" className="bg-red-500/20 text-red-300">
                {data.alerts?.length || 0}
              </Badge>
            </div>
            <p className="text-sm text-slate-400">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.alerts?.map((alert: any) => (
                <div key={alert.id} className={`p-4 rounded-lg bg-surface-light border-l-4 ${getAlertColor(alert.priority)}`}>
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white">{alert.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{alert.message}</p>
                      <p className="text-xs text-slate-500 mt-2">{alert.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="w-full">
                  Pause All
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Optimize
                </Button>
                <Button variant="outline" size="sm" className="w-full col-span-2">
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}