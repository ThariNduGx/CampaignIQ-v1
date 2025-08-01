import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, Target, Brain, Zap, CheckCircle, TrendingUp, Users, Shield, Globe } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/auth";
  };

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Unified Analytics",
      description: "Connect Google Ads, Meta Ads, Analytics, and Search Console in one dashboard"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description: "Get intelligent recommendations and anomaly detection with GPT-4o"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Real-Time Monitoring",
      description: "Track campaign performance with live updates and instant alerts"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Competitive Analysis",
      description: "Benchmark against competitors and identify growth opportunities"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Advanced Filtering",
      description: "Multi-dimensional filters with performance thresholds and custom ranges"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Cross-Platform ROI",
      description: "Compare performance across all marketing channels in unified reports"
    }
  ];

  const benefits = [
    "Save 10+ hours per week on manual reporting",
    "Increase ROAS by 25% with AI-powered optimization",
    "Get instant alerts for budget and performance changes",
    "Make data-driven decisions with competitive intelligence",
    "Export professional reports in multiple formats",
    "Scale your marketing with enterprise-level analytics"
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "TechStart Inc.",
      quote: "CampaignIQ transformed our marketing analytics. We now see 40% better ROI across all platforms."
    },
    {
      name: "Michael Rodriguez",
      role: "Digital Marketing Manager",
      company: "Growth Co.",
      quote: "The AI insights are incredible. We discovered optimization opportunities we never knew existed."
    },
    {
      name: "Emily Johnson",
      role: "Performance Marketing Lead",
      company: "Scale Labs",
      quote: "Real-time monitoring helped us catch and fix issues before they impacted our budget."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-slate-50">
      {/* Header */}
      <header className="border-b border-surface-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
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
            <Button onClick={handleLogin} className="bg-primary-600 hover:bg-primary-700">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-primary-600/20 text-primary-300 border-primary-500/30">
            Trusted by 500+ Marketing Teams
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Unified Marketing Analytics
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Powered by AI
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Connect all your marketing platforms in one dashboard. Get AI-powered insights, 
            real-time monitoring, and competitive analysis to optimize your campaigns and maximize ROI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={handleLogin} 
              size="lg" 
              className="bg-primary-600 hover:bg-primary-700 text-lg px-8 py-3"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-3 border-slate-600 hover:bg-slate-800"
            >
              Watch Demo
            </Button>
          </div>

          {/* Platform Logos */}
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <span className="text-sm text-slate-400">Google Ads</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">M</span>
              </div>
              <span className="text-sm text-slate-400">Meta Ads</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">GA</span>
              </div>
              <span className="text-sm text-slate-400">Analytics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-surface-dark">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need for Marketing Success
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Comprehensive analytics tools designed for modern marketing teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover:border-primary-500/30 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Marketing Teams Choose CampaignIQ
            </h2>
            <p className="text-xl text-slate-300">
              Join hundreds of teams already optimizing their marketing performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <p className="text-slate-300 text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-surface-dark">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Marketing Leaders
            </h2>
            <p className="text-xl text-slate-300">
              See what our customers have to say about their results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card">
                <CardContent className="p-6">
                  <p className="text-slate-300 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{testimonial.name}</p>
                      <p className="text-xs text-slate-400">{testimonial.role}</p>
                      <p className="text-xs text-slate-500">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <Card className="glass-card border-primary-500/30">
            <CardContent className="p-12">
              <Shield className="w-16 h-16 text-primary-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Transform Your Marketing Analytics?
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Join thousands of marketers who trust CampaignIQ to optimize their campaigns 
                and maximize ROI across all platforms.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleLogin}
                  size="lg" 
                  className="bg-primary-600 hover:bg-primary-700 text-lg px-8 py-3"
                >
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <div className="text-sm text-slate-400 self-center">
                  No credit card required • 14-day free trial
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-12 px-6 bg-surface-dark">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <BarChart3 className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-semibold">CampaignIQ</p>
                <p className="text-xs text-slate-400">Marketing Analytics Platform</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm">
                © 2025 CampaignIQ. All rights reserved.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Built with enterprise-grade security and privacy
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}