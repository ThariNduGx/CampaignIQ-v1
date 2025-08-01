import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Percent, MousePointer } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryCardsProps {
  data?: {
    totalSpend: number;
    totalConversions: number;
    totalRevenue: number;
    avgRoas: number;
    avgCtr: number;
  };
  isLoading: boolean;
}

export default function SummaryCards({ data, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card">
            <CardContent className="p-6">
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const formatNumber = (value: number) => 
    new Intl.NumberFormat('en-US').format(value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="glass-card animate-slide-up">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
              <DollarSign className="text-white w-6 h-6" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-400 text-sm">
              <i className="fas fa-arrow-up"></i>
              <span>+12.5%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold font-mono">
            {data?.totalSpend ? formatCurrency(data.totalSpend) : '$0'}
          </h3>
          <p className="text-slate-400 text-sm">Total Ad Spend</p>
        </CardContent>
      </Card>

      <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-400 text-sm">
              <i className="fas fa-arrow-up"></i>
              <span>+8.3%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold font-mono">
            {data?.totalConversions ? formatNumber(data.totalConversions) : '0'}
          </h3>
          <p className="text-slate-400 text-sm">Total Conversions</p>
        </CardContent>
      </Card>

      <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <Percent className="text-white w-6 h-6" />
            </div>
            <div className="flex items-center space-x-1 text-red-400 text-sm">
              <i className="fas fa-arrow-down"></i>
              <span>-2.1%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold font-mono">
            {data?.avgRoas ? `${data.avgRoas.toFixed(1)}x` : '0x'}
          </h3>
          <p className="text-slate-400 text-sm">Average ROAS</p>
        </CardContent>
      </Card>

      <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <MousePointer className="text-white w-6 h-6" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-400 text-sm">
              <i className="fas fa-arrow-up"></i>
              <span>+5.7%</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold font-mono">
            {data?.avgCtr ? `${(data.avgCtr * 100).toFixed(1)}%` : '0%'}
          </h3>
          <p className="text-slate-400 text-sm">Average CTR</p>
        </CardContent>
      </Card>
    </div>
  );
}
