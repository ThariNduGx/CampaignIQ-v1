import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChartLine, 
  Zap, 
  Shield, 
  BarChart3, 
  Target, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="relative">
          <div className="container mx-auto px-6 py-20">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <ChartLine className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                CampaignIQ
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 mb-4 leading-relaxed">
                Unified Marketing Analytics Dashboard
              </p>
              
              <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Eliminate manual reporting by automatically aggregating performance data from Google and Meta into a single, AI-powered dashboard.
              </p>
              
              <Button 
                onClick={() => window.location.href = '/api/login'}
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Everything you need to optimize your campaigns
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Built for digital marketers who want actionable insights without the complexity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="glass-card border-primary/20 hover:border-primary/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Unified Dashboard</h3>
              <p className="text-slate-400 leading-relaxed">
                See all your Google and Meta campaign performance in one place. No more switching between platforms.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20 hover:border-primary/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">AI-Powered Insights</h3>
              <p className="text-slate-400 leading-relaxed">
                Get intelligent recommendations and anomaly detection powered by OpenAI to optimize your campaigns.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20 hover:border-primary/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Advanced Analytics</h3>
              <p className="text-slate-400 leading-relaxed">
                Track ROAS, CPA, CTR, and other key metrics with beautiful charts and trend analysis.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20 hover:border-primary/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Real-time Updates</h3>
              <p className="text-slate-400 leading-relaxed">
                Automatic data sync and token refresh keep your dashboard always up-to-date.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20 hover:border-primary/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Secure OAuth</h3>
              <p className="text-slate-400 leading-relaxed">
                Enterprise-grade security with OAuth 2.0 for safe connection to your advertising accounts.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-primary/20 hover:border-primary/40 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <ChartLine className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Cross-Platform Comparison</h3>
              <p className="text-slate-400 leading-relaxed">
                Compare performance between Google and Meta to optimize budget allocation and strategy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <Card className="glass-card border-primary/20 overflow-hidden">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to transform your marketing analytics?
            </h2>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Join digital marketers who save hours every week with automated reporting and AI insights.
            </p>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
