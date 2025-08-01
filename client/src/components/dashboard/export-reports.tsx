import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Download, TrendingUp, BarChart3, PieChart, FileText, Calendar } from "lucide-react";

interface ExportReportsProps {
  workspaceId: string;
}

export default function ExportReports({ workspaceId }: ExportReportsProps) {
  const { toast } = useToast();
  const [reportType, setReportType] = useState("performance-summary");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [format, setFormat] = useState("pdf");

  const exportMutation = useMutation({
    mutationFn: async (params: {
      reportType: string;
      format: string;
      startDate: string;
      endDate: string;
    }) => {
      // Use the apiRequest function to handle authentication properly
      const response = await apiRequest("POST", `/api/workspaces/${workspaceId}/export`, params);
      
      // Get the text content from the response
      const content = await response.text();
      
      // Create blob with proper content type
      const contentType = params.format === 'csv' ? 'text/csv' : 'text/html';
      const blob = new Blob([content], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const filename = `campaigniq-${params.reportType}-${params.startDate}-to-${params.endDate}.${params.format}`;
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      return { success: true, filename };
    },
    onSuccess: () => {
      toast({
        title: "Export Complete",
        description: `Your ${reportTypes.find(r => r.value === reportType)?.label} report has been downloaded successfully.`,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
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
      toast({
        title: "Export Failed", 
        description: error instanceof Error ? error.message : "Failed to generate report",
        variant: "destructive",
      });
    },
  });

  const reportTypes = [
    {
      value: "performance-summary",
      label: "Performance Summary",
      description: "Overall campaign performance metrics and KPIs",
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      value: "platform-comparison",
      label: "Platform Comparison",
      description: "Side-by-side analysis of Google vs Meta performance",
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      value: "campaign-details",
      label: "Campaign Details",
      description: "Detailed breakdown of individual campaigns",
      icon: <PieChart className="w-4 h-4" />
    },
    {
      value: "ai-insights",
      label: "AI Insights Report",
      description: "Comprehensive AI-generated analysis and recommendations",
      icon: <FileText className="w-4 h-4" />
    },
    {
      value: "executive-summary",
      label: "Executive Summary",
      description: "High-level overview for stakeholders and decision makers",
      icon: <Calendar className="w-4 h-4" />
    }
  ];

  const formatOptions = [
    { value: "pdf", label: "PDF Document", description: "Professional formatted report" },
    { value: "csv", label: "CSV Data", description: "Raw data for analysis" },
    { value: "xlsx", label: "Excel Spreadsheet", description: "Formatted spreadsheet with charts" }
  ];

  const dateRangePresets = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 90 days", days: 90 },
    { label: "Last 6 months", days: 180 },
    { label: "Last year", days: 365 }
  ];

  const handlePresetSelect = (days: number) => {
    const endDate = new Date();
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  };

  const handleExport = () => {
    exportMutation.mutate({
      reportType,
      format,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    });
  };

  const selectedReportType = reportTypes.find(r => r.value === reportType);
  const selectedFormat = formatOptions.find(f => f.value === format);

  return (
    <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.8s' }}>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
            <Download className="text-white w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Export Reports</CardTitle>
            <p className="text-sm text-slate-400">Generate comprehensive reports for your campaigns</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Type Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Report Type</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center space-x-2">
                    {type.icon}
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedReportType && (
            <p className="text-xs text-slate-400">{selectedReportType.description}</p>
          )}
        </div>

        {/* Date Range Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Time Period</Label>
          
          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2">
            {dateRangePresets.map((preset) => (
              <Button
                key={preset.days}
                variant="outline"
                size="sm"
                onClick={() => handlePresetSelect(preset.days)}
                className="text-xs"
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Custom Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">Start Date</Label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">End Date</Label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Export Format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formatOptions.map((fmt) => (
                <SelectItem key={fmt.value} value={fmt.value}>
                  <div className="flex flex-col">
                    <span>{fmt.label}</span>
                    <span className="text-xs text-slate-400">{fmt.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedFormat && (
            <p className="text-xs text-slate-400">{selectedFormat.description}</p>
          )}
        </div>

        {/* Report Preview */}
        <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Report Preview</span>
            <Badge variant="outline" className="text-xs">
              {Math.abs(new Date(dateRange.endDate).getTime() - new Date(dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24)} days
            </Badge>
          </div>
          <div className="space-y-1 text-xs text-slate-400">
            <p>Type: {selectedReportType?.label}</p>
            <p>Period: {dateRange.startDate} to {dateRange.endDate}</p>
            <p>Format: {selectedFormat?.label}</p>
          </div>
        </div>

        {/* Export Button */}
        <Button 
          onClick={handleExport}
          disabled={exportMutation.isPending || !workspaceId}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg hover:shadow-green-500/25 transition-all duration-200"
          size="lg"
        >
          {exportMutation.isPending ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating Report...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Generate & Download Report</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}