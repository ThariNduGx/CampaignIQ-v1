import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import PlatformConnection from "@/components/connections/platform-connection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Connections() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");

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

  const { data: workspaces } = useQuery({
    queryKey: ["/api/workspaces"],
    enabled: isAuthenticated,
  });

  // Set default workspace
  useEffect(() => {
    if (workspaces && Array.isArray(workspaces) && workspaces.length > 0 && !selectedWorkspace) {
      setSelectedWorkspace(workspaces[0].id);
    }
  }, [workspaces, selectedWorkspace]);

  const { data: connections, refetch: refetchConnections } = useQuery({
    queryKey: ["/api/workspaces", selectedWorkspace, "connections"],
    enabled: !!selectedWorkspace,
  });

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

  return (
    <div className="min-h-screen bg-background text-slate-50">
      <Sidebar 
        workspaces={Array.isArray(workspaces) ? workspaces : []}
        selectedWorkspace={selectedWorkspace}
        onWorkspaceChange={setSelectedWorkspace}
        connections={Array.isArray(connections) ? connections : []}
      />
      
      <div className="lg:ml-64 min-h-screen">
        <TopBar />
        
        <main className="p-6 space-y-6 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <Card className="glass-card border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">
                  Platform Connections
                </CardTitle>
                <p className="text-slate-400">
                  Connect your advertising platforms to start analyzing your campaign performance
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <PlatformConnection
                  platform="google"
                  platformName="Google Ads & Analytics"
                  icon="fab fa-google"
                  description="Connect your Google Ads and Analytics accounts to track search and display campaigns"
                  workspaceId={selectedWorkspace}
                  connections={Array.isArray(connections) ? connections : []}
                  onConnectionUpdate={refetchConnections}
                />
                
                <PlatformConnection
                  platform="meta"
                  platformName="Meta Ads"
                  icon="fab fa-meta"
                  description="Connect your Facebook and Instagram advertising accounts"
                  workspaceId={selectedWorkspace}
                  connections={Array.isArray(connections) ? connections : []}
                  onConnectionUpdate={refetchConnections}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
