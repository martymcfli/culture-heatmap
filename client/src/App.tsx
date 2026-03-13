import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { useEffect } from "react";
import { useClerk, useUser, useAuth as useClerkAuth } from "@clerk/react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import HeatMap from "./pages/HeatMap";
import CompanyProfile from "./pages/CompanyProfile";
import Comparison from "./pages/Comparison";
import Favorites from "./pages/Favorites";
import SavedComparisons from "./pages/SavedComparisons";
import SalaryBenchmark from "./pages/SalaryBenchmark";
import JobSearch from "./pages/JobSearch";
import DemoHeatMap from "./pages/DemoHeatMap";
import ChatBox from "./components/ChatBox";

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

// Handles Clerk sign-in globally: listens for the auth-error event and syncs session after sign-in.
// Only rendered when ClerkProvider is in the tree (CLERK_KEY is set).
function ClerkAuthManager() {
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();
  const { getToken } = useClerkAuth();

  // Open Clerk modal when an unauthorized tRPC error fires anywhere in the app
  useEffect(() => {
    const handler = () => openSignIn();
    window.addEventListener("clerk:open-sign-in", handler);
    return () => window.removeEventListener("clerk:open-sign-in", handler);
  }, [openSignIn]);

  // After Clerk sign-in: sync to our backend cookie session
  useEffect(() => {
    if (!isSignedIn) return;
    let active = true;
    getToken().then((token) => {
      if (!token || !active) return;
      fetch("/api/auth/clerk-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      }).then((r) => {
        // Only redirect to /heatmap if we're currently on the /demo page
        if (r.ok && active && window.location.pathname === "/demo") {
          window.location.href = "/heatmap";
        }
      });
    });
    return () => { active = false; };
  }, [isSignedIn, getToken]);

  return null;
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/heatmap"} component={HeatMap} />
      <Route path={"/browse"} component={HeatMap} />
      <Route path={"/company/:id"} component={CompanyProfile} />
      <Route path={"/compare"} component={Comparison} />
      <Route path={"/favorites"} component={Favorites} />
      <Route path={"/saved-comparisons"} component={SavedComparisons} />
      <Route path={"/salary-benchmark"} component={SalaryBenchmark} />
      <Route path={"/jobs"} component={JobSearch} />
      <Route path={"/demo"} component={DemoHeatMap} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          {CLERK_KEY && <ClerkAuthManager />}
          <Router />
          <ChatBox />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
