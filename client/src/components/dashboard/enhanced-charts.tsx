import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, RadialBarChart, RadialBar } from "recharts";
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Maximize2, Download, Calendar, Target, DollarSign, Eye, MousePointer, Users } from "lucide-react";
import { useState } from "react";

interface EnhancedChartsProps {
  data: any[];
  metricsSummary?: any;
  className?: string;
}

export default function EnhancedCharts({ data, metricsSummary, className }: EnhancedChartsProps) {
  const [activeChart, setActiveChart] = useState('performance-trends');
  const [timeframe, setTimeframe] = useState('7d');

  // Sample enhanced data for demonstration
  const performanceTrends = [
    { date: '2025-01-25', impressions: 12500, clicks: 450, spend: 125.50, ctr: 3.6, roas: 4.2 },
    { date: '2025-01-26', impressions: 13200, clicks: 485, spend: 132.75, ctr: 3.7, roas: 4.5 },
    { date: '2025-01-27', impressions: 11800, clicks: 425, spend: 118.25, ctr: 3.6, roas: 4.1 },
    { date: '2025-01-28', impressions: 14500, clicks: 520, spend: 145.00, ctr: 3.6, roas: 4.3 },
    { date: '2025-01-29', impressions: 13800, clicks: 495, spend: 138.50, ctr: 3.6, roas: 4.4 },
    { date: '2025-01-30', impressions: 15200, clicks: 580, spend: 152.75, ctr: 3.8, roas: 4.6 },
    { date: '2025-01-31', impressions: 16100, clicks: 625, spend: 161.25, ctr: 3.9, roas: 4.8 }
  ];

  const platformComparison = [
    { platform: 'Meta Ads', impressions: 45000, clicks: 1800, spend: 450, ctr: 4.0, roas: 4.2 },
    { platform: 'Google Ads', impressions: 32000, clicks: 1280, spend: 320, ctr: 4.0, roas: 3.8 },
    { platform: 'Display', impressions: 28000, clicks: 840, spend: 280, ctr: 3.0, roas: 2.5 }
  ];

  const audienceBreakdown = [
    { segment: '18-24', value: 15, fill: '#8b5cf6' },
    { segment: '25-34', value: 35, fill: '#06b6d4' },
    { segment: '35-44', value: 28, fill: '#10b981' },
    { segment: '45-54', value: 15, fill: '#f59e0b' },
    { segment: '55+', value: 7, fill: '#ef4444' }
  ];

  const devicePerformance = [
    { device: 'Mobile', impressions: 58000, clicks: 2320, ctr: 4.0, spend: 580 },
    { device: 'Desktop', impressions: 32000, clicks: 1280, ctr: 4.0, spend: 320 },
    { device: 'Tablet', impressions: 15000, clicks: 450, ctr: 3.0, spend: 150 }
  ];

  const hourlyPerformance = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    impressions: Math.floor(Math.random() * 2000) + 500,
    clicks: Math.floor(Math.random() * 80) + 20,
    ctr: (Math.random() * 2 + 2).toFixed(1)
  }));

  const conversionFunnel = [
    { stage: 'Impressions', value: 100000, color: '#8b5cf6' },
    { stage: 'Clicks', value: 4000, color: '#06b6d4' },
    { stage: 'Visits', value: 3800, color: '#10b981' },
    { stage: 'Leads', value: 380, color: '#f59e0b' },
    { stage: 'Sales', value: 76, color: '#ef4444' }
  ];

  const chartOptions = [
    { value: 'performance-trends', label: 'Performance Trends', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'platform-comparison', label: 'Platform Comparison', icon: <BarChart3 className="w-4 h-4" /> },
    { value: 'audience-breakdown', label: 'Audience Breakdown', icon: <PieChartIcon className="w-4 h-4" /> },
    { value: 'device-performance', label: 'Device Performance', icon: <Target className="w-4 h-4" /> },
    { value: 'hourly-performance', label: 'Hourly Performance', icon: <Calendar className="w-4 h-4" /> },
    { value: 'conversion-funnel', label: 'Conversion Funnel', icon: <Target className="w-4 h-4" /> }
  ];

  const renderChart = () => {
    switch (activeChart) {
      case 'performance-trends':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={performanceTrends}>
              <defs>
                <linearGradient id="impressionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Area type="monotone" dataKey="impressions" stroke="#8b5cf6" fillOpacity={1} fill="url(#impressionsGradient)" />
              <Area type="monotone" dataKey="clicks" stroke="#06b6d4" fillOpacity={1} fill="url(#clicksGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'platform-comparison':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={platformComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="platform" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Bar dataKey="impressions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="clicks" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spend" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'audience-breakdown':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={audienceBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ segment, percent }) => `${segment} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {audienceBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'device-performance':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={devicePerformance}>
              <RadialBar label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="impressions" />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        );

      case 'hourly-performance':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={hourlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Legend />
              <Line type="monotone" dataKey="impressions" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} />
              <Line type="monotone" dataKey="clicks" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'conversion-funnel':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart layout="horizontal" data={conversionFunnel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="stage" type="category" stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="flex items-center justify-center h-96 text-slate-400">Select a chart type</div>;
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Performance Overview Cards */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Total Impressions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">2.4M</p>
                <p className="text-sm text-green-400">+12.5% vs last period</p>
              </div>
              <div className="w-16 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrends.slice(-7)}>
                    <Line type="monotone" dataKey="impressions" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center space-x-2">
              <MousePointer className="w-5 h-5" />
              <span>Total Clicks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">96.2K</p>
                <p className="text-sm text-green-400">+8.3% vs last period</p>
              </div>
              <div className="w-16 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrends.slice(-7)}>
                    <Line type="monotone" dataKey="clicks" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart Area */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <BarChart3 className="text-white w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-white">Advanced Analytics</CardTitle>
                <p className="text-sm text-slate-400">Interactive data visualization and insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7D</SelectItem>
                  <SelectItem value="30d">30D</SelectItem>
                  <SelectItem value="90d">90D</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Chart Type Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {chartOptions.map((option) => (
              <Badge
                key={option.value}
                variant={activeChart === option.value ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary-600/20 transition-colors px-3 py-2"
                onClick={() => setActiveChart(option.value)}
              >
                {option.icon}
                <span className="ml-2">{option.label}</span>
              </Badge>
            ))}
          </div>

          {/* Chart Rendering Area */}
          <div className="w-full">
            {renderChart()}
          </div>

          {/* Chart Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-surface-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">4.2%</p>
              <p className="text-xs text-slate-400">Avg CTR</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">$1.25</p>
              <p className="text-xs text-slate-400">Avg CPC</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">4.5x</p>
              <p className="text-xs text-slate-400">Avg ROAS</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">$25.6K</p>
              <p className="text-xs text-slate-400">Total Spend</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}