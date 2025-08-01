import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import SummaryCards from "@/components/dashboard/summary-cards";
import PerformanceChart from "@/components/dashboard/performance-chart";
import PlatformChart from "@/components/dashboard/platform-chart";
import AiInsights from "@/components/dashboard/ai-insights";
import CampaignTable from "@/components/dashboard/campaign-table";
import { AnalyticsWidget } from "@/components/google/analytics-widget";
import { SearchConsoleWidget } from "@/components/google/search-console-widget";
import { MyBusinessWidget } from "@/components/google/my-business-widget";
import MetaAdsWidget from "@/components/meta/meta-ads-widget";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
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

  const { data: workspaces } = useQuery({
    queryKey: ["/api/workspaces"],
    enabled: isAuthenticated,
  });

  // Set default workspace
  useEffect(() => {
    if (workspaces && Array.isArray(workspaces) && workspaces.length > 0 && !selectedWorkspace) {
      setSelectedWorkspace(workspaces[0].id);
    }
  }, [workspaces, selectedWorkspace]);

  const { data: metricsSummary, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["/api/workspaces", selectedWorkspace, "metrics/summary"],
    enabled: !!selectedWorkspace,
  });

  const { data: campaigns } = useQuery({
    queryKey: ["/api/workspaces", selectedWorkspace, "campaigns"],
    enabled: !!selectedWorkspace,
  });

  const { data: connections } = useQuery({
    queryKey: ["/api/workspaces", selectedWorkspace, "connections"],
    enabled: !!selectedWorkspace,
  });

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
    <div className="min-h-screen bg-background text-slate-50">
      <Sidebar 
        workspaces={Array.isArray(workspaces) ? workspaces : []}
        selectedWorkspace={selectedWorkspace}
        onWorkspaceChange={setSelectedWorkspace}
        connections={Array.isArray(connections) ? connections : []}
      />
      
      <div className="lg:ml-64 min-h-screen">
        <TopBar 
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        
        <main className="p-6 space-y-6 animate-fade-in">
          <SummaryCards 
            data={metricsSummary as any}
            isLoading={isLoadingMetrics}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceChart 
              workspaceId={selectedWorkspace}
              dateRange={dateRange}
            />
            <PlatformChart 
              workspaceId={selectedWorkspace}
              dateRange={dateRange}
            />
          </div>
          
          {/* Marketing Platform Widgets */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Marketing Platform Insights</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              <AnalyticsWidget 
                workspaceId={selectedWorkspace}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
              />
              <SearchConsoleWidget 
                workspaceId={selectedWorkspace}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
              />
              <MyBusinessWidget 
                workspaceId={selectedWorkspace}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
              />
              <MetaAdsWidget 
                workspaceId={selectedWorkspace}
              />
            </div>
          </div>
          
          <AiInsights 
            workspaceId={selectedWorkspace}
            dateRange={dateRange}
          />
          
          <CampaignTable 
            campaigns={Array.isArray(campaigns) ? campaigns : []}
            connections={Array.isArray(connections) ? connections : []}
          />
        </main>
      </div>
    </div>
  );
}
