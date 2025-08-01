import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, Eye, MousePointer, DollarSign, Users, Award, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, Cell } from "recharts";

interface CompetitiveAnalysisProps {
  workspaceId: string;
  className?: string;
}

export default function CompetitiveAnalysis({ workspaceId, className }: CompetitiveAnalysisProps) {
  // Sample competitive data
  const competitorData = [
    {
      name: "Your Business",
      marketShare: 15.2,
      avgCPC: 1.25,
      impressionShare: 22.8,
      ctr: 4.2,
      qualityScore: 8.5,
      adStrength: "Excellent",
      color: "#8b5cf6"
    },
    {
      name: "Competitor A",
      marketShare: 28.5,
      avgCPC: 1.85,
      impressionShare: 35.2,
      ctr: 3.1,
      qualityScore: 7.8,
      adStrength: "Good",
      color: "#06b6d4"
    },
    {
      name: "Competitor B",
      marketShare: 18.3,
      avgCPC: 1.45,
      impressionShare: 24.6,
      ctr: 3.8,
      qualityScore: 8.1,
      adStrength: "Good",
      color: "#10b981"
    },
    {
      name: "Competitor C",
      marketShare: 12.8,
      avgCPC: 1.65,
      impressionShare: 17.4,
      ctr: 2.9,
      qualityScore: 6.9,
      adStrength: "Average",
      color: "#f59e0b"
    }
  ];

  const performanceMetrics = [
    {
      metric: "Click-Through Rate",
      yourValue: 4.2,
      industryAvg: 3.1,
      bestCompetitor: 3.8,
      unit: "%"
    },
    {
      metric: "Cost Per Click",
      yourValue: 1.25,
      industryAvg: 1.65,
      bestCompetitor: 1.45,
      unit: "$"
    },
    {
      metric: "Quality Score",
      yourValue: 8.5,
      industryAvg: 7.2,
      bestCompetitor: 8.1,
      unit: "/10"
    },
    {
      metric: "Impression Share",
      yourValue: 22.8,
      industryAvg: 18.5,
      bestCompetitor: 35.2,
      unit: "%"
    }
  ];

  const radarData = [
    { subject: 'CTR', yourBusiness: 85, competitor: 65, fullMark: 100 },
    { subject: 'Quality Score', yourBusiness: 85, competitor: 78, fullMark: 100 },
    { subject: 'Ad Strength', yourBusiness: 90, competitor: 70, fullMark: 100 },
    { subject: 'Impression Share', yourBusiness: 65, competitor: 95, fullMark: 100 },
    { subject: 'Conversion Rate', yourBusiness: 78, competitor: 82, fullMark: 100 },
    { subject: 'Market Share', yourBusiness: 55, competitor: 85, fullMark: 100 }
  ];

  const opportunities = [
    {
      title: "Increase Impression Share",
      description: "Competitor A captures 35.2% vs your 22.8%",
      impact: "High",
      difficulty: "Medium",
      priority: "high"
    },
    {
      title: "Optimize for Mobile Traffic",
      description: "63% of competitor traffic is mobile vs your 45%",
      impact: "Medium",
      difficulty: "Low",
      priority: "medium"
    },
    {
      title: "Expand to New Keywords",
      description: "Competitors bidding on 340 keywords vs your 180",
      impact: "High",
      difficulty: "High",
      priority: "high"
    },
    {
      title: "Improve Ad Copy Testing",
      description: "Competitors run 3x more ad variations",
      impact: "Medium",
      difficulty: "Low",
      priority: "medium"
    }
  ];

  const getPerformanceColor = (yourValue: number, industryAvg: number, isHigherBetter: boolean) => {
    const isGood = isHigherBetter ? yourValue > industryAvg : yourValue < industryAvg;
    return isGood ? "text-green-400" : "text-red-400";
  };

  const getPerformanceIcon = (yourValue: number, industryAvg: number, isHigherBetter: boolean) => {
    const isGood = isHigherBetter ? yourValue > industryAvg : yourValue < industryAvg;
    return isGood ? <TrendingUp className="w-4 h-4 text-green-400" /> : <TrendingDown className="w-4 h-4 text-red-400" />;
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
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Market Position */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Market Position</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={competitorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="marketShare" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Radar */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Performance Comparison</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <PolarRadiusAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <Radar name="Your Business" dataKey="yourBusiness" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                <Radar name="Top Competitor" dataKey="competitor" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics Comparison */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Key Metrics vs Competition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => {
              const isHigherBetter = !metric.metric.toLowerCase().includes('cost');
              return (
                <div key={index} className="p-4 rounded-lg bg-surface-light border border-surface-border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white">{metric.metric}</h4>
                    {getPerformanceIcon(metric.yourValue, metric.industryAvg, isHigherBetter)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">You</span>
                      <span className={`text-sm font-semibold ${getPerformanceColor(metric.yourValue, metric.industryAvg, isHigherBetter)}`}>
                        {metric.unit === '$' ? '$' : ''}{metric.yourValue}{metric.unit !== '$' ? metric.unit : ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Industry Avg</span>
                      <span className="text-sm text-slate-300">
                        {metric.unit === '$' ? '$' : ''}{metric.industryAvg}{metric.unit !== '$' ? metric.unit : ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Best Competitor</span>
                      <span className="text-sm text-orange-400">
                        {metric.unit === '$' ? '$' : ''}{metric.bestCompetitor}{metric.unit !== '$' ? metric.unit : ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Competitive Opportunities */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>Growth Opportunities</span>
          </CardTitle>
          <p className="text-sm text-slate-400">Based on competitive analysis</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="p-4 rounded-lg bg-surface-light border border-surface-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white mb-1">{opportunity.title}</h4>
                    <p className="text-xs text-slate-400">{opportunity.description}</p>
                  </div>
                  <Badge className={getPriorityColor(opportunity.priority)}>
                    {opportunity.priority.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-400">Impact:</span>
                    <span className={`font-medium ${
                      opportunity.impact === 'High' ? 'text-green-400' : 
                      opportunity.impact === 'Medium' ? 'text-yellow-400' : 'text-blue-400'
                    }`}>
                      {opportunity.impact}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-400">Difficulty:</span>
                    <span className={`font-medium ${
                      opportunity.difficulty === 'High' ? 'text-red-400' : 
                      opportunity.difficulty === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {opportunity.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}