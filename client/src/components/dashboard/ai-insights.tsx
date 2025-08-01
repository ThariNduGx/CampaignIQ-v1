import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface AiInsightsProps {
  workspaceId: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export default function AiInsights({ workspaceId, dateRange }: AiInsightsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: insights, isLoading, error } = useQuery({
    queryKey: ["/api/workspaces", workspaceId, "ai-insights"],
    enabled: !!workspaceId,
  });

  const generateInsightsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/workspaces/${workspaceId}/ai-insights`, {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      return response;
    },
    onSuccess: (newInsights) => {
      // Update the query cache with the new insights
      queryClient.setQueryData(["/api/workspaces", workspaceId, "ai-insights"], newInsights);
      toast({
        title: "Success",
        description: "AI insights generated successfully",
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
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate insights",
        variant: "destructive",
      });
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-emerald-400 w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="text-amber-400 w-5 h-5" />;
      case 'info':
        return <Lightbulb className="text-blue-400 w-5 h-5" />;
      default:
        return <Lightbulb className="text-blue-400 w-5 h-5" />;
    }
  };

  const getBackgroundClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-emerald-500/20';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500/10 to-amber-600/10 border-amber-500/20';
      case 'info':
        return 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20';
      default:
        return 'bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20';
    }
  };

  const getTitleClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-emerald-100';
      case 'warning':
        return 'text-amber-100';
      case 'info':
        return 'text-blue-100';
      default:
        return 'text-blue-100';
    }
  };

  return (
    <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.6s' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="text-white w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">AI Performance Insights</CardTitle>
              <p className="text-sm text-slate-400">Generated insights based on your campaign data</p>
            </div>
          </div>
          <Button
            onClick={() => generateInsightsMutation.mutate()}
            disabled={generateInsightsMutation.isPending || !workspaceId}
            className="bg-gradient-to-r from-primary to-violet-500 hover:from-primary/90 hover:to-violet-500/90 font-medium transform hover:scale-105 transition-all"
          >
            {generateInsightsMutation.isPending && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            <Brain className="mr-2 w-4 h-4" />
            Generate Insights
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-slate-400 mt-2">Loading insights...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <p className="text-slate-400 mb-2">Error loading insights</p>
              <p className="text-slate-500 text-sm">
                {error instanceof Error ? error.message : 'Unknown error occurred'}
              </p>
            </div>
          ) : insights && Array.isArray(insights) && insights.length > 0 ? (
            insights.map((insight: any) => (
              <div 
                key={insight.id} 
                className={`p-4 rounded-lg border ${getBackgroundClass(insight.type)}`}
              >
                <div className="flex items-start space-x-3">
                  {getIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className={`font-medium mb-1 ${getTitleClass(insight.type)}`}>
                      {insight.title}
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {insight.content}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        insight.priority === 'high' 
                          ? 'bg-red-500/20 text-red-400' 
                          : insight.priority === 'medium' 
                          ? 'bg-amber-500/20 text-amber-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {insight.priority || 'medium'} priority
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(insight.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No insights available yet</p>
              <p className="text-sm text-slate-500">Click "Generate Insights" to analyze your campaign performance</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
