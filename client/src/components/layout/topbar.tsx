import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Bell, Menu, LogOut, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TopBarProps {
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  onDateRangeChange?: (range: { startDate: string; endDate: string }) => void;
}

export default function TopBar({ dateRange, onDateRangeChange }: TopBarProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await apiRequest('POST', '/api/auth/signout');
      toast({
        title: "Signed out successfully",
        description: "You have been logged out",
      });
      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "There was an error signing out",
        variant: "destructive",
      });
    }
  };

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Card className="glass-card px-3 py-2 flex items-center space-x-3 cursor-pointer hover:bg-slate-800/30 transition-colors">
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
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </Card>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card border-primary/20">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem 
                className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-400/10"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
