import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, ExternalLink, Unplug } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface PlatformConnectionProps {
  platform: string;
  platformName: string;
  icon: string;
  description: string;
  workspaceId: string;
  connections: any[];
  onConnectionUpdate: () => void;
}

export default function PlatformConnection({
  platform,
  platformName,
  icon,
  description,
  workspaceId,
  connections,
  onConnectionUpdate
}: PlatformConnectionProps) {
  const { toast } = useToast();
  
  const existingConnection = connections.find(
    conn => conn.platform === platform && conn.isActive
  );

  const connectMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/oauth/${platform}/init`, {
        workspaceId
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to OAuth URL
      window.location.href = data.authUrl;
    },
    onError: (error) => {
      console.error('Connect error:', error);
      
      let errorMessage = "Failed to initiate connection";
      if (platform === 'meta') {
        errorMessage = "Meta connection setup required. Please ensure your redirect URI is configured in Meta for Developers.";
      }
      
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : errorMessage,
        variant: "destructive",
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('DELETE', `/api/workspaces/${workspaceId}/connections/${platform}`);
    },
    onSuccess: () => {
      toast({
        title: "Disconnected",
        description: `${platformName} connection removed successfully`,
      });
      // Invalidate connections cache
      queryClient.invalidateQueries({ queryKey: ['/api/workspaces', workspaceId, 'connections'] });
      onConnectionUpdate();
    },
    onError: (error) => {
      console.error('Disconnect error:', error);
      toast({
        title: "Error",
        description: `Failed to disconnect ${platformName}`,
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="glass-card border-primary/20 hover:border-primary/40 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
              <i className={`${icon} text-2xl`}></i>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-white">{platformName}</h3>
                {existingConnection ? (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Not Connected
                  </Badge>
                )}
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                {description}
              </p>
              {existingConnection && (
                <div className="text-sm text-slate-300">
                  <p><span className="text-slate-400">Account:</span> {existingConnection.accountName}</p>
                  <p><span className="text-slate-400">Connected:</span> {new Date(existingConnection.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            {existingConnection ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                  disabled
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Connected
                </Button>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => connectMutation.mutate()}
                    disabled={connectMutation.isPending}
                    className="text-slate-400 hover:text-white flex-1"
                  >
                    {connectMutation.isPending && (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                    )}
                    Reconnect
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => disconnectMutation.mutate()}
                    disabled={disconnectMutation.isPending}
                    className="text-slate-400 hover:text-red-400 px-2"
                    title="Disconnect"
                  >
                    {disconnectMutation.isPending ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-400"></div>
                    ) : (
                      <Unplug className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-right">
                {platform === 'meta' && (
                  <div className="text-xs text-muted-foreground mb-2 text-right max-w-xs">
                    <div className="font-mono text-slate-500">
                      Redirect URI:<br/>
                      https://4fd03766-586b-4c74-baba-e4fd4970b110-00-3128ajre72gcp.riker.replit.dev/api/oauth/callback
                    </div>
                    <div className="text-yellow-400 mt-1">
                      ⚠ Add this URI to your Meta app settings
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => connectMutation.mutate()}
                  disabled={connectMutation.isPending || !workspaceId}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  {connectMutation.isPending && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  )}
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Connect
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
