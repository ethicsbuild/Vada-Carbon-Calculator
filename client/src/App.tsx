import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { Navigation } from "@/components/layout/navigation";
import { FloatingSageChat } from "@/components/sage/floating-sage-chat";
import { NatureGradientOverlay, NatureBorder } from "@/components/ui/nature-decorations";
import UserTypeSelection from "@/pages/user-type-selection";
import AttendeeComingSoon from "@/pages/attendee-coming-soon";
import Home from "@/pages/home";
import Calculator from "@/pages/calculator";
import Dashboard from "@/pages/dashboard";
import Reports from "@/pages/reports";
import Community from "@/pages/community";
import Resources from "@/pages/resources";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  
  // Hide navigation and Sage chat on user type selection and attendee coming soon pages
  const hideNavigation = location === "/" || location === "/attendee-coming-soon";
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sage-50 via-forest-50 to-sage-50 dark:from-forest-950 dark:via-sage-950 dark:to-forest-950 relative">
        <NatureGradientOverlay />
        <NatureBorder />
      {!hideNavigation && <Navigation />}
      <main className="flex-1 relative z-10">
        <Switch>
          <Route path="/" component={UserTypeSelection} />
          <Route path="/attendee-coming-soon" component={AttendeeComingSoon} />
          <Route path="/home" component={Home} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/reports" component={Reports} />
          <Route path="/community" component={Community} />
          <Route path="/resources" component={Resources} />
          <Route component={NotFound} />
        </Switch>
      </main>
      {!hideNavigation && <FloatingSageChat />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="carbon-copilot-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
