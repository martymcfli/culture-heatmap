import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
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
          <Router />
          <ChatBox />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
