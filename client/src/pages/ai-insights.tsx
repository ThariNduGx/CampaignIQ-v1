import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import { Brain, Lightbulb, TrendingUp, AlertTriangle, Target, BarChart3, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AIInsightsProps {
  workspaceId: string;
}

export default function AIInsights({ workspaceId }: AIInsightsProps) {
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

  // Sample AI insights data
  const insights = [
    {
      id: "1",
      type: "opportunity",
      priority: "high",
      title: "Optimize Ad Scheduling for Better Performance",
      content: "Analysis shows that your Meta ads perform 34% better between 7 PM - 10 PM on weekdays. Consider adjusting your ad schedule to allocate more budget during these peak engagement hours to maximize ROAS.",
      impact: "Potential 25-30% increase in conversions",
      action: "Adjust ad scheduling",
      platform: "Meta Ads",
      confidence: 92
    },
    {
      id: "2", 
      type: "warning",
      priority: "high",
      title: "High Bounce Rate Alert",
      content: "Your landing page bounce rate has increased to 73% over the past week, significantly above the industry average of 47%. This suggests a mismatch between ad content and landing page experience.",
      impact: "24% decrease in conversion rate",
      action: "Review landing page",
      platform: "Google Analytics",
      confidence: 88
    },
    {
      id: "3",
      type: "insight",
      priority: "medium", 
      title: "Audience Segment Performance Variance",
      content: "The 25-34 age demographic shows 2.3x higher engagement rates but 18% lower conversion rates compared to the 35-44 segment. Consider creating age-specific landing pages or adjusting targeting parameters.",
      impact: "15-20% improvement in targeting efficiency",
      action: "Refine audience targeting",
      platform: "Meta Ads",
      confidence: 79
    },
    {
      id: "4",
      type: "opportunity",
      priority: "medium",
      title: "Keyword Expansion Opportunity",
      content: "Search Console data reveals 47 high-impression, low-click keywords with strong relevance to your business. These represent untapped traffic opportunities with estimated CTR improvement potential.",
      impact: "12-18% increase in organic traffic",
      action: "Expand keyword targeting",
      platform: "Google Search Console", 
      confidence: 85
    },
    {
      id: "5",
      type: "insight",
      priority: "low",
      title: "Seasonal Performance Pattern Detected", 
      content: "Historical data analysis reveals a consistent 28% performance boost during the first two weeks of each month. This pattern correlates with payroll cycles and suggests budget timing optimization opportunities.",
      impact: "8-12% budget efficiency improvement",
      action: "Adjust budget allocation timing",
      platform: "Cross-Platform",
      confidence: 71
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'insight': return <Lightbulb className="w-5 h-5 text-blue-400" />;
      default: return <Brain className="w-5 h-5 text-purple-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

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
                <Brain className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AI-Powered Insights</h1>
                <p className="text-slate-400">Intelligent analysis and optimization recommendations</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Zap className="w-4 h-4 mr-2" />
              Generate New Insights
            </Button>
          </div>

          {/* Insights Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Insights</p>
                    <p className="text-2xl font-bold text-white">{insights.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Brain className="text-white w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">High Priority</p>
                    <p className="text-2xl font-bold text-red-400">
                      {insights.filter(i => i.priority === 'high').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                    <AlertTriangle className="text-white w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Avg. Confidence</p>
                    <p className="text-2xl font-bold text-green-400">
                      {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <BarChart3 className="text-white w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights List */}
          <div className="space-y-6">
            {insights.map((insight) => (
              <Card key={insight.id} className="glass-card hover:border-primary-500/30 transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getInsightIcon(insight.type)}
                      <div>
                        <CardTitle className="text-lg font-semibold text-white">{insight.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getPriorityColor(insight.priority)}>
                            {insight.priority.toUpperCase()} PRIORITY
                          </Badge>
                          <Badge variant="outline">{insight.platform}</Badge>
                          <span className="text-xs text-slate-400">Confidence: {insight.confidence}%</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Take Action
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4 leading-relaxed">{insight.content}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-surface-light border border-surface-border">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Potential Impact</p>
                      <p className="text-sm font-medium text-green-400">{insight.impact}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Recommended Action</p>
                      <p className="text-sm font-medium text-white">{insight.action}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}