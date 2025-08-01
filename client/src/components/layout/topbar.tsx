import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Bell, Menu } from "lucide-react";

interface TopBarProps {
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  onDateRangeChange?: (range: { startDate: string; endDate: string }) => void;
}

export default function TopBar({ dateRange, onDateRangeChange }: TopBarProps) {
  const { user } = useAuth();

  return (
    <header className="bg-surface/80 backdrop-blur-lg border-b border-primary-900/20 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="lg:hidden p-2 rounded-md hover:bg-primary-900/30 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">Analytics Dashboard</h2>
            <p className="text-sm text-slate-400">Monitor your campaign performance across all platforms</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Date Range Picker */}
          {dateRange && (
            <Card className="glass-card px-4 py-2 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium">Last 30 Days</span>
              <i className="fas fa-chevron-down text-slate-400 text-xs"></i>
            </Card>
          )}
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative p-2 rounded-lg hover:bg-surface-light transition-colors">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Button>
          
          {/* User Menu */}
          <Card className="glass-card px-3 py-2 flex items-center space-x-3">
            <img 
              src={(user as any)?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"} 
              alt="User profile" 
              className="w-8 h-8 rounded-full object-cover" 
            />
            <span className="text-sm font-medium">
              {(user as any)?.firstName && (user as any)?.lastName 
                ? `${(user as any).firstName} ${(user as any).lastName}` 
                : (user as any)?.email?.split('@')[0] || 'User'}
            </span>
            <i className="fas fa-chevron-down text-slate-400 text-xs"></i>
          </Card>
        </div>
      </div>
    </header>
  );
}
