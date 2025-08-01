import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Eye, Phone, Navigation, Globe, Users } from "lucide-react";

interface MyBusinessWidgetProps {
  workspaceId: string;
  accountId?: string;
  locationId?: string;
  startDate?: string;
  endDate?: string;
}

export function MyBusinessWidget({ workspaceId, accountId, locationId, startDate, endDate }: MyBusinessWidgetProps) {
  const { data: businessData, isLoading, error } = useQuery({
    queryKey: ['/api/google/my-business', workspaceId, accountId, locationId, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (accountId) params.append('accountId', accountId);
      if (locationId) params.append('locationId', locationId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await fetch(`/api/google/my-business/${workspaceId}?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch My Business data');
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
            <Store className="h-5 w-5 text-orange-400" />
            <span>Google My Business</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-slate-400 mt-2">Loading My Business data...</p>
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
            <Store className="h-5 w-5 text-orange-400" />
            <span>Google My Business</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-slate-400">My Business API integration coming soon</p>
            <p className="text-sm text-slate-500 mt-1">Google has migrated to Business Profile API</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const summaryCards = [
    {
      title: "Profile Views",
      value: businessData?.views?.toLocaleString() || "0",
      icon: Eye,
      color: "text-blue-400"
    },
    {
      title: "Searches",
      value: businessData?.searches?.toLocaleString() || "0",
      icon: Users,
      color: "text-green-400"
    },
    {
      title: "Call Clicks",
      value: businessData?.callClicks?.toLocaleString() || "0",
      icon: Phone,
      color: "text-purple-400"
    },
    {
      title: "Direction Requests",
      value: businessData?.directionRequests?.toLocaleString() || "0",
      icon: Navigation,
      color: "text-yellow-400"
    }
  ];

  return (
    <Card className="glass-card border-primary/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Store className="h-5 w-5 text-orange-400" />
            <span>Google My Business</span>
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            View Details
          </Button>
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

        {/* Additional Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">Customer Actions</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400 flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Website Clicks</span>
              </span>
              <span className="text-sm text-white">{businessData?.websiteClicks?.toLocaleString() || "0"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400 flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Total Actions</span>
              </span>
              <span className="text-sm text-white">{businessData?.actions?.toLocaleString() || "0"}</span>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-orange-900/20 border border-orange-400/20 rounded-lg p-3">
          <p className="text-xs text-orange-300">
            <strong>Note:</strong> Google My Business API has been deprecated. 
            Integration with the new Business Profile API is in development.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}