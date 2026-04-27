import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Lazy imports for code splitting
import { lazy, Suspense } from "react";

// Public pages
const Home = lazy(() => import("./pages/Home"));

// Onboarding
const Onboarding = lazy(() => import("./pages/Onboarding"));

// Command Center (user-facing workspace)
const CCDashboard = lazy(() => import("./pages/cc/Dashboard"));
const CCTasks = lazy(() => import("./pages/cc/Tasks"));
const CCAgents = lazy(() => import("./pages/cc/Agents"));
const CCSettings = lazy(() => import("./pages/cc/Settings"));
const CCNewRequest = lazy(() => import("./pages/cc/NewRequest"));

// Admin
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminWorkspaces = lazy(() => import("./pages/admin/Workspaces"));
const AdminMonitoring = lazy(() => import("./pages/admin/Monitoring"));

// Documentation
const SaaSDocs = lazy(() => import("./pages/docs/SaaSDocs"));
const SelfHostDocs = lazy(() => import("./pages/docs/SelfHostDocs"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Public landing */}
        <Route path="/" component={Home} />

        {/* Onboarding wizard */}
        <Route path="/onboarding" component={Onboarding} />

        {/* Command Center — user workspace */}
        <Route path="/cc" component={CCDashboard} />
        <Route path="/cc/tasks" component={CCTasks} />
        <Route path="/cc/agents" component={CCAgents} />
        <Route path="/cc/settings" component={CCSettings} />
        <Route path="/cc/new-request" component={CCNewRequest} />

        {/* Admin panel */}
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/workspaces" component={AdminWorkspaces} />
        <Route path="/admin/monitoring" component={AdminMonitoring} />

        {/* Documentation */}
        <Route path="/docs" component={SaaSDocs} />
        <Route path="/docs/self-host" component={SelfHostDocs} />

        {/* Fallback */}
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
