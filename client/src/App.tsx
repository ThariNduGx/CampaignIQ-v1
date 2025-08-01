import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Connections from "@/pages/connections";
import Settings from "@/pages/settings";
import Campaigns from "@/pages/campaigns";
import AIInsights from "@/pages/ai-insights";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Auth} />
          <Route path="/auth" component={Auth} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/connections" component={Connections} />
          <Route path="/campaigns">
            {(params) => <Campaigns workspaceId="a3705cc8-cbfd-4758-8402-4d6b8657860e" />}
          </Route>
          <Route path="/ai-insights">
            {(params) => <AIInsights workspaceId="a3705cc8-cbfd-4758-8402-4d6b8657860e" />}
          </Route>
          <Route path="/settings">
            {(params) => <Settings workspaceId="a3705cc8-cbfd-4758-8402-4d6b8657860e" />}
          </Route>
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
