import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
      if (isUnauthorizedError(error as Error)) {
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
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to initiate connection",
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  Reconnect
                </Button>
              </>
            ) : (
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
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
