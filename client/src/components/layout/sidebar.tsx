import { Link, useLocation } from "wouter";
import { 
  ChartPie, 
  Target, 
  Brain, 
  Link as LinkIcon, 
  Settings,
  ChartLine 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SidebarProps {
  workspaces: any[];
  selectedWorkspace: string;
  onWorkspaceChange: (workspaceId: string) => void;
  connections: any[];
}

export default function Sidebar({ workspaces, selectedWorkspace, onWorkspaceChange, connections }: SidebarProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const currentWorkspace = workspaces.find(w => w.id === selectedWorkspace);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getConnectionStatus = (platform: string) => {
    return connections.some(conn => conn.platform === platform && conn.isActive);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-40 bg-black/50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={toggleSidebar}></div>
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-primary-900/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-primary-900/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
              <ChartLine className="text-white text-sm" />
            </div>
            <h1 className="text-xl font-bold gradient-text">CampaignIQ</h1>
          </div>
          <button className="lg:hidden p-2 rounded-md hover:bg-primary-900/30 transition-colors" onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Workspace Selector */}
        <div className="p-4 border-b border-primary-900/20">
          <Card className="glass-card p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Workspace</span>
              <i className="fas fa-chevron-down text-slate-400 text-xs"></i>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {currentWorkspace?.name?.substring(0, 2).toUpperCase() || 'WS'}
                </span>
              </div>
              <span className="font-medium">{currentWorkspace?.name || 'Default Workspace'}</span>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <Link href="/">
            <Button
              variant="ghost"
              className={`w-full justify-start space-x-3 ${
                location === '/' 
                  ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30' 
                  : 'text-slate-300 hover:bg-surface-light hover:text-white'
              }`}
            >
              <ChartPie className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3 text-slate-300 hover:bg-surface-light hover:text-white"
          >
            <Target className="w-5 h-5" />
            <span className="font-medium">Campaigns</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3 text-slate-300 hover:bg-surface-light hover:text-white"
          >
            <Brain className="w-5 h-5" />
            <span className="font-medium">AI Insights</span>
          </Button>
          
          <Link href="/connections">
            <Button
              variant="ghost"
              className={`w-full justify-start space-x-3 ${
                location === '/connections' 
                  ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30' 
                  : 'text-slate-300 hover:bg-surface-light hover:text-white'
              }`}
            >
              <LinkIcon className="w-5 h-5" />
              <span className="font-medium">Connections</span>
            </Button>
          </Link>
          
          <Button
            variant="ghost"
            className="w-full justify-start space-x-3 text-slate-300 hover:bg-surface-light hover:text-white"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Button>
        </nav>

        {/* Platform Connections Status */}
        <div className="p-4 border-t border-primary-900/20 mt-auto">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Connected Platforms</h3>
            
            <div className="flex items-center justify-between p-2 rounded-lg glass-card">
              <div className="flex items-center space-x-2">
                <i className="fab fa-google text-blue-400"></i>
                <span className="text-sm">Google Ads</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${getConnectionStatus('google') ? 'bg-emerald-400 animate-pulse-slow' : 'bg-slate-500'}`}></div>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded-lg glass-card">
              <div className="flex items-center space-x-2">
                <i className="fab fa-meta text-blue-500"></i>
                <span className="text-sm">Meta Ads</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${getConnectionStatus('meta') ? 'bg-emerald-400 animate-pulse-slow' : 'bg-slate-500'}`}></div>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded-lg glass-card">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-sm">OpenAI</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse-slow"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
