import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Target, Brain, TrendingUp, Settings, LogOut, ArrowRight, Users, Zap, Globe } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to access the dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

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

  const quickActions = [
    {
      title: "View Dashboard",
      description: "Access your marketing analytics dashboard",
      icon: <BarChart3 className="w-6 h-6" />,
      href: "/dashboard",
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Campaign Management",
      description: "Monitor and optimize your campaigns",
      icon: <Target className="w-6 h-6" />,
      href: "/campaigns",
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "AI Insights",
      description: "Get intelligent recommendations",
      icon: <Brain className="w-6 h-6" />,
      href: "/ai-insights",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Platform Connections",
      description: "Manage your marketing platform integrations",
      icon: <Globe className="w-6 h-6" />,
      href: "/connections",
      color: "from-orange-500 to-red-600"
    }
  ];

  const recentActivities = [
    {
      type: "campaign",
      title: "New campaign created",
      description: "Summer Sale Campaign is now active",
      time: "2 hours ago",
      status: "success"
    },
    {
      type: "insight",
      title: "AI recommendation available",
      description: "Optimize ad scheduling for better performance",
      time: "4 hours ago",
      status: "info"
    },
    {
      type: "alert",
      title: "Budget threshold reached",
      description: "Google Ads campaign reached 80% of daily budget",
      time: "6 hours ago",
      status: "warning"
    },
    {
      type: "performance",
      title: "Performance improvement detected",
      description: "Meta Ads CTR increased by 15%",
      time: "1 day ago",
      status: "success"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'campaign': return <Target className="w-4 h-4" />;
      case 'insight': return <Brain className="w-4 h-4" />;
      case 'alert': return <Zap className="w-4 h-4" />;
      case 'performance': return <TrendingUp className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-50">
      {/* Header */}
      <header className="border-b border-surface-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <BarChart3 className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CampaignIQ</h1>
                <p className="text-xs text-slate-400">Marketing Analytics Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {user?.profileImageUrl && (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.email || 'User'}
                </p>
                <p className="text-xs text-slate-400">
                  {user?.email}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, {user?.firstName || 'there'}! 👋
          </h1>
          <p className="text-xl text-slate-300">
            Ready to optimize your marketing campaigns? Here's your dashboard overview.
          </p>
        </div>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="glass-card hover:border-primary-500/30 transition-all duration-300 cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <CardTitle className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">
                      {action.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 mb-4">{action.description}</p>
                    <div className="flex items-center text-primary-400 text-sm font-medium">
                      <span>Get started</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Dashboard Overview */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Summary */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Performance Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-surface-light border border-surface-border">
                    <p className="text-2xl font-bold text-green-400">+24%</p>
                    <p className="text-sm text-slate-400">CTR This Month</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-surface-light border border-surface-border">
                    <p className="text-2xl font-bold text-blue-400">4.2x</p>
                    <p className="text-sm text-slate-400">Average ROAS</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-surface-light border border-surface-border">
                    <p className="text-2xl font-bold text-purple-400">$12.5K</p>
                    <p className="text-sm text-slate-400">Total Spend</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-surface-light border border-surface-border">
                    <p className="text-2xl font-bold text-orange-400">2.4M</p>
                    <p className="text-sm text-slate-400">Impressions</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/dashboard">
                    <Button className="w-full bg-primary-600 hover:bg-primary-700">
                      View Full Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-surface-light border border-surface-border">
                      <div className={`flex-shrink-0 ${getActivityColor(activity.status)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{activity.title}</p>
                        <p className="text-xs text-slate-400">{activity.description}</p>
                        <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href="/ai-insights">
                    <Button variant="outline" className="w-full">
                      View All Insights
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Platform Status */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6">Platform Connections</h2>
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-light border border-surface-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <span className="text-sm text-white">Google Ads</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-light border border-surface-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                    <span className="text-sm text-white">Meta Ads</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-light border border-surface-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">GA</span>
                    </div>
                    <span className="text-sm text-white">Analytics</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-light border border-surface-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">SC</span>
                    </div>
                    <span className="text-sm text-white">Search Console</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link href="/connections">
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Connections
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}