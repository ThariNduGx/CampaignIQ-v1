import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Key, Brain, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";

interface SettingsProps {
  workspaceId: string;
}

export default function SettingsPage({ workspaceId }: SettingsProps) {
  const { toast } = useToast();
  const [openaiKey, setOpenaiKey] = useState("");

  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/user/settings"],
    enabled: true,
  });

  // Load existing OpenAI key from settings
  useEffect(() => {
    if (settings?.openaiApiKey) {
      setOpenaiKey(settings.openaiApiKey);
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: { openaiApiKey?: string }) => {
      const response = await apiRequest("POST", "/api/user/settings", data);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/settings"] });
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
        description: error instanceof Error ? error.message : "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleSaveOpenAI = () => {
    if (!openaiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid OpenAI API key",
        variant: "destructive",
      });
      return;
    }
    updateSettingsMutation.mutate({ openaiApiKey: openaiKey });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar 
          workspaces={[{ id: workspaceId || "", name: "My Marketing Campaigns" }]}
          connections={[]}
          selectedWorkspace={workspaceId || ""}
          onWorkspaceChange={() => {}}
        />
        <div className="flex-1 lg:ml-64">
          <div className="container mx-auto p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Settings className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-white">Settings</h1>
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        workspaces={[{ id: workspaceId || "", name: "My Marketing Campaigns" }]}
        connections={[]}
        selectedWorkspace={workspaceId || ""}
        onWorkspaceChange={() => {}}
      />
      <div className="flex-1 lg:ml-64">
        <div className="container mx-auto p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-white">Settings</h1>
          </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="api-keys" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span>API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="ai-config" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>AI Configuration</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Data & Privacy</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys">
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-white">API Keys</CardTitle>
              <p className="text-slate-400">
                Manage your API keys for external service integrations
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="openai-key" className="text-white">
                    OpenAI API Key
                  </Label>
                  <p className="text-sm text-slate-400 mb-2">
                    Required for AI-powered insights and campaign analysis
                  </p>
                  <div className="flex space-x-2">
                    <Input
                      id="openai-key"
                      type="password"
                      placeholder="sk-..."
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSaveOpenAI}
                      disabled={updateSettingsMutation.isPending}
                    >
                      {updateSettingsMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Your API key is stored securely and encrypted
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-config">
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-white">AI Configuration</CardTitle>
              <p className="text-slate-400">
                Configure AI-powered features and insights
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h3 className="text-blue-400 font-medium mb-2">AI Insights</h3>
                <p className="text-slate-300 text-sm">
                  AI insights analyze your campaign performance data to provide
                  actionable recommendations for optimization.
                </p>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <h3 className="text-green-400 font-medium mb-2">Smart Recommendations</h3>
                <p className="text-slate-300 text-sm">
                  Get intelligent budget allocation and targeting suggestions
                  based on your campaign performance patterns.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-white">Data & Privacy</CardTitle>
              <p className="text-slate-400">
                Manage how your data is processed and stored
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h3 className="text-white font-medium mb-2">Data Processing</h3>
                <p className="text-slate-300 text-sm mb-3">
                  Your marketing data is processed securely to generate insights.
                  We never store your sensitive campaign data permanently.
                </p>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• Campaign metrics are processed in real-time</li>
                  <li>• API credentials are encrypted at rest</li>
                  <li>• No data is shared with third parties</li>
                  <li>• You can disconnect platforms anytime</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </div>
  );
}