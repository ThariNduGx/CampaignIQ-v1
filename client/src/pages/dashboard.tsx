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
import ExportReports from "@/components/dashboard/export-reports";
import AdvancedFilters, { type FilterState } from "@/components/dashboard/advanced-filters";
import EnhancedCharts from "@/components/dashboard/enhanced-charts";
import RealTimeInsights from "@/components/dashboard/real-time-insights";
import CompetitiveAnalysis from "@/components/dashboard/competitive-analysis";
import { AnalyticsWidget } from "@/components/google/analytics-widget";
import { SearchConsoleWidget } from "@/components/google/search-console-widget";
import MetaAdsWidget from "@/components/meta/meta-ads-widget";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const [selectedAnalyticsProperty, setSelectedAnalyticsProperty] = useState<string>("");
  const [selectedSearchConsoleDomain, setSelectedSearchConsoleDomain] = useState<string>("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [filters, setFilters] = useState<FilterState | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'realtime' | 'competitive'>('overview');

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
          {/* View Mode Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode('overview')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'overview' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-surface-light text-slate-300 hover:bg-surface-border'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'detailed' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-surface-light text-slate-300 hover:bg-surface-border'
                }`}
              >
                Detailed Analysis
              </button>
              <button
                onClick={() => setViewMode('realtime')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'realtime' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-surface-light text-slate-300 hover:bg-surface-border'
                }`}
              >
                Real-Time
              </button>
              <button
                onClick={() => setViewMode('competitive')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === 'competitive' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-surface-light text-slate-300 hover:bg-surface-border'
                }`}
              >
                Competitive
              </button>
            </div>
          </div>

          {viewMode === 'overview' && (
            <>
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
            </>
          )}

          {viewMode === 'detailed' && (
            <>
              <AdvancedFilters 
                onFiltersChange={setFilters}
                className="mb-6"
              />
              <EnhancedCharts 
                data={campaigns || []}
                metricsSummary={metricsSummary}
                className="mb-6"
              />
            </>
          )}

          {viewMode === 'realtime' && (
            <RealTimeInsights 
              workspaceId={selectedWorkspace}
              className="mb-6"
            />
          )}

          {viewMode === 'competitive' && (
            <CompetitiveAnalysis 
              workspaceId={selectedWorkspace}
              className="mb-6"
            />
          )}
          
          {/* Marketing Platform Widgets */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Marketing Platform Insights</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnalyticsWidget 
                workspaceId={selectedWorkspace}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onPropertySelect={setSelectedAnalyticsProperty}
                selectedProperty={selectedAnalyticsProperty}
              />
              <SearchConsoleWidget 
                workspaceId={selectedWorkspace}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onDomainSelect={setSelectedSearchConsoleDomain}
                selectedDomain={selectedSearchConsoleDomain}
              />
              <MetaAdsWidget 
                workspaceId={selectedWorkspace}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <AiInsights 
                workspaceId={selectedWorkspace}
                dateRange={dateRange}
                selectedAnalyticsProperty={selectedAnalyticsProperty}
                selectedSearchConsoleDomain={selectedSearchConsoleDomain}
              />
            </div>
            <div className="xl:col-span-1">
              <ExportReports workspaceId={selectedWorkspace} />
            </div>
          </div>
          
          <CampaignTable workspaceId={selectedWorkspace} />
        </main>
      </div>
    </div>
  );
}
