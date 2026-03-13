import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useClerk, useUser, useAuth as useClerkAuth } from "@clerk/react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

// ─── Clerk sync (null-render, only mounted inside ClerkProvider) ───────────────
const ClerkSignIn = ({
  triggerRef,
}: {
  triggerRef: React.MutableRefObject<(() => void) | null>;
}) => {
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();
  const { getToken } = useClerkAuth();

  triggerRef.current = () => openSignIn();

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
        if (r.ok && active) window.location.href = "/heatmap";
      });
    });
    return () => { active = false; };
  }, [isSignedIn, getToken]);

  return null;
};

// ─── Bookmark button (save for later) ────────────────────────────────────────
const BookmarkButton = ({
  companyId,
  isAuthenticated,
  onSignIn,
}: {
  companyId: number;
  isAuthenticated: boolean;
  onSignIn: () => void;
}) => {
  const utils = trpc.useUtils();
  const { data: isSaved, isLoading } = trpc.favorites.check.useQuery(companyId, {
    enabled: isAuthenticated && companyId > 0,
  });
  const addMutation = trpc.favorites.add.useMutation({
    onSuccess: () => utils.favorites.check.invalidate(companyId),
  });
  const removeMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => utils.favorites.check.invalidate(companyId),
  });

  if (!isAuthenticated) {
    return (
      <button
        onClick={onSignIn}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        Save for later
      </button>
    );
  }

  const toggle = () => {
    if (isSaved) {
      removeMutation.mutate(companyId);
    } else {
      addMutation.mutate(companyId);
    }
  };

  const busy = isLoading || addMutation.isPending || removeMutation.isPending;

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`flex items-center gap-2 text-sm font-medium transition-colors ${isSaved ? "text-cyan-400 hover:text-red-400" : "text-slate-400 hover:text-cyan-400"}`}
    >
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {isSaved ? "Saved" : "Save for later"}
    </button>
  );
};

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AlertCircle,
  Zap,
  Search,
  X,
  Briefcase,
  Star,
  TrendingUp,
  Users,
  ChevronRight,
  Lock,
  Award,
  Mail,
  Linkedin,
} from "lucide-react";

// ─── Request-demo modal (replaces broken OAuth sign-in) ───────────────────────
const SignInModal = ({ onClose }: { onClose: () => void }) => (
  <>
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]" onClick={onClose} />
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-[60] p-8">
      <button onClick={onClose} className="absolute right-4 top-4 text-slate-500 hover:text-white">
        <X className="w-5 h-5" />
      </button>
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
          <Zap className="w-7 h-7 text-blue-400" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Full Platform Demo</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          This is a live portfolio project. The full platform — including 300+ companies,
          job search, salary benchmarks, and AI recommendations — is operational.
          Reach out to see it in action.
        </p>
      </div>
      <div className="space-y-3">
        <a
          href="mailto:mcmcowen@gmail.com?subject=Culture Heat Map Demo Request"
          className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all"
        >
          <Mail className="w-4 h-4" />
          Request a Live Demo
        </a>
        <a
          href="https://www.linkedin.com/in/owen-p-mccormick/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
        >
          <Linkedin className="w-4 h-4 text-blue-400" />
          Connect on LinkedIn
        </a>
      </div>
      <p className="text-center text-xs text-slate-600 mt-4">
        Built with React, tRPC, PostgreSQL & OpenAI
      </p>
    </div>
  </>
);

// ─── Color helpers ────────────────────────────────────────────────────────────
const getColorByRating = (rating: number) => {
  if (rating >= 4.5) return "#10b981";
  if (rating >= 4.2) return "#06b6d4";
  if (rating >= 3.9) return "#3b82f6";
  if (rating >= 3.6) return "#8b5cf6";
  if (rating >= 3.3) return "#f59e0b";
  return "#ef4444";
};

const getRatingLabel = (rating: number) => {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.2) return "Very Good";
  if (rating >= 3.9) return "Good";
  if (rating >= 3.6) return "Fair";
  if (rating >= 3.3) return "Below Average";
  return "Poor";
};

// ─── Score bar ────────────────────────────────────────────────────────────────
const ScoreBar = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold" style={{ color }}>
        {value.toFixed(1)}/5
      </span>
    </div>
    <div className="h-2 bg-slate-700/80 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${(value / 5) * 100}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

// ─── Custom bubble shape ──────────────────────────────────────────────────────
const BubbleShape = (props: any) => {
  const { cx, cy, payload, onClick } = props;
  if (!cx || !cy || !payload?.x) return null;
  const color = getColorByRating(payload.x);
  const r = 20;
  return (
    <g onClick={() => onClick?.(payload)} style={{ cursor: "pointer" }}>
      {/* Outer glow ring */}
      <circle cx={cx} cy={cy} r={r + 8} fill={color} fillOpacity={0.12} />
      {/* Mid glow */}
      <circle cx={cx} cy={cy} r={r + 3} fill={color} fillOpacity={0.2} />
      {/* Main bubble */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        fillOpacity={0.88}
        stroke="white"
        strokeWidth={1}
        strokeOpacity={0.2}
      />
      {/* Rating label inside */}
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize={9}
        fontWeight="bold"
        style={{ pointerEvents: "none" }}
      >
        {payload.x.toFixed(1)}
      </text>
    </g>
  );
};

// ─── Custom chart tooltip ─────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  const color = getColorByRating(data.x);
  return (
    <div
      className="bg-slate-900/98 border rounded-xl p-4 shadow-2xl backdrop-blur-sm min-w-[200px]"
      style={{ borderColor: color + "55" }}
    >
      <div className="flex items-center gap-3 mb-3">
        {data.logoUrl && (
          <img
            src={data.logoUrl}
            alt={data.name}
            className="w-9 h-9 object-contain bg-white rounded-lg p-1 flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div>
          <p className="font-bold text-white text-sm leading-tight">{data.name}</p>
          <p className="text-xs text-slate-400">{data.industry}</p>
        </div>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between gap-6">
          <span className="text-slate-400">Overall Rating:</span>
          <span className="font-semibold" style={{ color }}>
            {data.x.toFixed(2)}/5
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-slate-400">Work-Life Balance:</span>
          <span className="text-cyan-300 font-semibold">{data.y.toFixed(2)}/5</span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-slate-400">Compensation:</span>
          <span className="text-blue-300 font-semibold">
            {data.compensation.toFixed(2)}/5
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-3 text-center border-t border-slate-700/50 pt-2">
        Click bubble to expand ↗
      </p>
    </div>
  );
};

// ─── Company slide-in panel ───────────────────────────────────────────────────
const CompanyModal = ({
  company,
  onClose,
  onSignIn,
  isAuthenticated,
}: {
  company: any;
  onClose: () => void;
  onSignIn: () => void;
  isAuthenticated: boolean;
}) => {
  if (!company) return null;
  const score = company.aggregateScore;
  const overall = score?.overallRating || 0;
  const color = getColorByRating(overall);
  const label = getRatingLabel(overall);

  const scoreBars = [
    { label: "Overall Rating", value: score?.overallRating || 0, color },
    { label: "Work-Life Balance", value: score?.workLifeBalance || 0, color: "#06b6d4" },
    { label: "Compensation & Benefits", value: score?.compensationBenefits || 0, color: "#3b82f6" },
    { label: "Career Opportunities", value: score?.careerOpportunities || 0, color: "#10b981" },
    { label: "Culture & Values", value: score?.cultureValues || 0, color: "#8b5cf6" },
    { label: "Senior Management", value: score?.seniorManagement || 0, color: "#f59e0b" },
  ].filter((b) => b.value > 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      {/* Slide-in panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-slate-900 border-l border-slate-700/80 z-50 overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3 min-w-0">
            {company.logoUrl && (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="w-12 h-12 object-contain bg-white rounded-xl p-1.5 flex-shrink-0 shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <div className="min-w-0">
              <h2 className="font-bold text-white text-lg leading-tight truncate">
                {company.name}
              </h2>
              <p className="text-slate-400 text-sm">{company.industry}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <BookmarkButton
              companyId={company.id}
              isAuthenticated={isAuthenticated}
              onSignIn={onSignIn}
            />
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-700/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Score hero */}
          <div
            className="flex items-center justify-between rounded-xl p-4 border"
            style={{
              background: color + "10",
              borderColor: color + "30",
            }}
          >
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">
                Culture Score
              </p>
              <p className="text-5xl font-black" style={{ color }}>
                {overall.toFixed(1)}
                <span className="text-2xl text-slate-500">/5</span>
              </p>
              <span
                className="text-sm font-bold mt-1 block uppercase tracking-wider"
                style={{ color }}
              >
                {label}
              </span>
            </div>
            <div
              className="w-20 h-20 rounded-full border-4 flex items-center justify-center"
              style={{ borderColor: color + "40", background: color + "15" }}
            >
              <Award className="w-9 h-9" style={{ color }} />
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Location",
                value: `${company.headquartersCity}, ${company.headquartersState}`,
              },
              { label: "Company Size", value: company.sizeRange },
              { label: "Industry", value: company.industry },
              {
                label: "Avg Turnover",
                value: company.turnoverRate
                  ? `${parseFloat(company.turnoverRate).toFixed(1)}%`
                  : "N/A",
              },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-800/60 rounded-xl p-3">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  {label}
                </p>
                <p className="text-white text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>

          {/* Score bars */}
          <div className="bg-slate-800/60 rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Culture Breakdown
            </h3>
            {scoreBars.map((bar) => (
              <ScoreBar key={bar.label} {...bar} />
            ))}
          </div>

          {/* Locked features CTA */}
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/40 border border-blue-700/40 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 font-semibold text-sm">
                Full Profile — Free to Unlock
              </span>
            </div>
            <ul className="space-y-2 mb-5">
              {[
                {
                  icon: Briefcase,
                  text: `Live job openings at ${company.name}`,
                  color: "text-blue-400",
                },
                {
                  icon: TrendingUp,
                  text: "Salary benchmarks by role & seniority",
                  color: "text-cyan-400",
                },
                {
                  icon: Users,
                  text: "Anonymous employee interview Q&A",
                  color: "text-purple-400",
                },
                {
                  icon: Star,
                  text: "AI culture-fit score for your profile",
                  color: "text-emerald-400",
                },
              ].map(({ icon: Icon, text, color: ic }) => (
                <li key={text} className="flex items-center gap-2 text-sm text-slate-300">
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${ic}`} />
                  {text}
                </li>
              ))}
            </ul>
            <button
              onClick={onSignIn}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-1 transition-all"
            >
              Sign In Free — No Credit Card
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            <p className="text-center text-xs text-slate-500 mt-2">
              Takes 30 seconds. No trial. No paywall.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DemoHeatMap() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const clerkSignInRef = useRef<(() => void) | null>(null);
  const { isAuthenticated } = useAuth();

  const handleSignIn = useCallback(() => {
    if (clerkSignInRef.current) {
      clerkSignInRef.current();
    } else {
      setShowSignIn(true);
    }
  }, []);

  const { data: allCompanies = [] } = trpc.demo.getCompanies.useQuery();

  const filteredCompanies = useMemo(() => {
    return allCompanies.filter((company: any) => {
      if (selectedIndustry !== "all" && company.industry !== selectedIndustry)
        return false;
      if (
        selectedLocation !== "all" &&
        company.headquartersState !== selectedLocation
      )
        return false;
      if (
        searchQuery &&
        !company.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [allCompanies, selectedIndustry, selectedLocation, searchQuery]);

  const chartData = useMemo(() => {
    return filteredCompanies.map((company: any) => ({
      name: company.name,
      x: company.aggregateScore?.overallRating || 0,
      y: company.aggregateScore?.workLifeBalance || 0,
      compensation: company.aggregateScore?.compensationBenefits || 0,
      industry: company.industry,
      logoUrl: company.logoUrl,
      turnoverRate: company.turnoverRate,
    }));
  }, [filteredCompanies]);

  const industries = useMemo(() => ["Technology", "Finance", "Healthcare"], []);
  const locations = useMemo(
    () => ["CA", "MA", "NC", "NJ", "NY", "ON", "TX", "WA"],
    []
  );

  const computeAxisConfig = useCallback(
    (values: number[], step: number = 0.2) => {
      const valid = values.filter((v) => v > 0);
      if (!valid.length)
        return { domain: [0, 5] as [number, number], ticks: [] as number[] };
      const rawMin = Math.min(...valid);
      const rawMax = Math.max(...valid);
      const paddedMin = Math.max(0, Math.floor(rawMin / step) * step - step);
      const paddedMax = Math.min(5, Math.ceil(rawMax / step) * step + step);
      const ticks: number[] = [];
      for (
        let v = paddedMin;
        v <= paddedMax + 0.001;
        v = Math.round((v + step) * 100) / 100
      ) {
        ticks.push(Math.round(v * 100) / 100);
      }
      return { domain: [paddedMin, paddedMax] as [number, number], ticks };
    },
    []
  );

  const xConfig = useMemo(
    () => computeAxisConfig(chartData.map((d) => d.x)),
    [chartData, computeAxisConfig]
  );
  const yConfig = useMemo(
    () => computeAxisConfig(chartData.map((d) => d.y)),
    [chartData, computeAxisConfig]
  );

  const handleBubbleClick = useCallback(
    (payload: any) => {
      const company = filteredCompanies.find(
        (c: any) => c.name === payload.name
      );
      if (company) setSelectedCompany(company);
    },
    [filteredCompanies]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Clerk integration — mounts Clerk hooks when Clerk is configured */}
      {CLERK_KEY && <ClerkSignIn triggerRef={clerkSignInRef} />}
      {/* Sign-in / demo request modal (fallback when Clerk not configured) */}
      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}

      {/* Company panel */}
      {selectedCompany && (
        <CompanyModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onSignIn={handleSignIn}
          isAuthenticated={isAuthenticated}
        />
      )}

      {/* Search bar */}
      <div className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Search companies by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-500/50 focus:bg-white/15 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Demo banner */}
      <div className="bg-amber-900/30 border-b border-amber-700/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-200">
              <span className="font-semibold">Demo Mode:</span> Showing 28 of 300+ companies.{" "}
              Job search, salary data & AI recommendations are locked.
            </p>
          </div>
          <a href="#" onClick={(e) => { e.preventDefault(); handleSignIn(); }} className="flex-shrink-0">
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs px-5"
            >
              Sign In Free — It's Quick →
            </Button>
          </a>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Company Culture Heat Map
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Click any bubble or card to see the full culture breakdown.{" "}
            <a
              href="#" onClick={(e) => { e.preventDefault(); handleSignIn(); }}
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
            >
              Sign in free
            </a>{" "}
            to unlock job search, salary benchmarks & AI recommendations.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Industry
              </label>
              <Select
                value={selectedIndustry}
                onValueChange={setSelectedIndustry}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Location (State)
              </label>
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-4">
            Showing{" "}
            <span className="text-slate-300 font-medium">
              {filteredCompanies.length}
            </span>{" "}
            of {allCompanies.length} demo companies
          </p>
        </Card>

        {/* Bubble chart */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6 mb-8">
          <div className="flex items-start justify-between mb-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-cyan-400">
                Culture Score Distribution
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Bubble color = overall rating · Y-axis = work-life balance
              </p>
            </div>
            <span className="text-xs text-slate-500 bg-slate-700/60 px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0">
              Click any bubble ↗
            </span>
          </div>

          {chartData.length > 0 ? (
            <div className="w-full h-[620px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 50, bottom: 50, left: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Overall Rating"
                    domain={xConfig.domain}
                    ticks={xConfig.ticks}
                    tickFormatter={(v: number) => v.toFixed(1)}
                    stroke="#334155"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    label={{
                      value: "Overall Rating →",
                      position: "insideBottomRight",
                      offset: -10,
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Work-Life Balance"
                    domain={yConfig.domain}
                    ticks={yConfig.ticks}
                    tickFormatter={(v: number) => v.toFixed(1)}
                    stroke="#334155"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    label={{
                      value: "Work-Life Balance →",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: "#334155", strokeDasharray: "4 4" }}
                  />
                  <Scatter
                    name="Companies"
                    data={chartData}
                    shape={(props: any) => (
                      <BubbleShape {...props} onClick={handleBubbleClick} />
                    )}
                    isAnimationActive={true}
                    animationDuration={500}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-slate-400">
              No companies match your filters
            </div>
          )}
        </Card>

        {/* Legend + axis guide */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-5 mb-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Color legend */}
            <div className="flex-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Bubble Color — Culture Score
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { color: "#10b981", range: "4.5–5.0", label: "Excellent" },
                  { color: "#06b6d4", range: "4.2–4.5", label: "Very Good" },
                  { color: "#3b82f6", range: "3.9–4.2", label: "Good" },
                  { color: "#8b5cf6", range: "3.6–3.9", label: "Fair" },
                  { color: "#f59e0b", range: "3.3–3.6", label: "Below Avg" },
                  { color: "#ef4444", range: "< 3.3", label: "Poor" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}60` }}
                    />
                    <div>
                      <span className="text-white text-sm font-medium">{item.label}</span>
                      <span className="text-slate-500 text-xs ml-1.5">{item.range}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Axis guide */}
            <div className="sm:w-56 border-t sm:border-t-0 sm:border-l border-slate-700/60 sm:pl-6 pt-4 sm:pt-0">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Axis Guide
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">X-axis (horizontal)</p>
                  <p className="text-sm text-white font-medium">Overall Culture Rating</p>
                  <p className="text-xs text-slate-400 mt-0.5">Composite employee satisfaction score across all dimensions (1–5).</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Y-axis (vertical)</p>
                  <p className="text-sm text-white font-medium">Work-Life Balance</p>
                  <p className="text-xs text-slate-400 mt-0.5">Employee-reported balance between work demands and personal time (1–5).</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Bubble number</p>
                  <p className="text-xs text-slate-400">The rating shown inside each bubble is its overall culture score.</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Job search locked banner */}
        <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/70 border border-slate-600/50 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-white">
                Job Search — Locked in Demo Mode
              </p>
              <p className="text-slate-400 text-sm">
                Search live job openings at any of these companies. Totally free — takes 30 seconds to unlock.
              </p>
            </div>
          </div>
          <a href="#" onClick={(e) => { e.preventDefault(); handleSignIn(); }} className="flex-shrink-0">
            <Button className="bg-blue-500 hover:bg-blue-400 text-white font-bold whitespace-nowrap px-6">
              Unlock Job Search →
            </Button>
          </a>
        </div>

        {/* Companies grid */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-cyan-400">Companies</h2>
            <span className="text-xs text-slate-500 bg-slate-700/50 px-3 py-1 rounded-full">
              Click any card to expand
            </span>
          </div>

          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((company: any) => {
                const overall = company.aggregateScore?.overallRating || 0;
                const color = getColorByRating(overall);
                return (
                  <button
                    key={company.id}
                    onClick={() => setSelectedCompany(company)}
                    className="text-left bg-slate-700/50 border border-slate-600/50 rounded-xl p-4 hover:border-cyan-500/60 hover:bg-slate-700/80 transition-all group cursor-pointer w-full"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {company.logoUrl && (
                        <img
                          src={company.logoUrl}
                          alt={company.name}
                          className="w-10 h-10 object-contain bg-white rounded-lg p-1 flex-shrink-0 shadow"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors truncate leading-tight">
                          {company.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {company.headquartersCity}, {company.headquartersState}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 flex-shrink-0 transition-colors mt-0.5" />
                    </div>

                    {/* Score */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">
                          Overall Rating
                        </span>
                        <span
                          className="text-base font-bold"
                          style={{ color }}
                        >
                          {overall.toFixed(1)}/5
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-600/60 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${(overall / 5) * 100}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-500">
                          WLB: {company.aggregateScore?.workLifeBalance?.toFixed(1) || "N/A"}
                          {" · "}
                          Comp: {company.aggregateScore?.compensationBenefits?.toFixed(1) || "N/A"}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 border-slate-600 text-slate-400 h-4 ml-2"
                        >
                          {company.industry}
                        </Badge>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              No companies match your filters
            </div>
          )}
        </Card>

        {/* Final CTA */}
        <Card className="bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-slate-900/50 border-blue-700/40 backdrop-blur-sm p-10 text-center">
          <Zap className="w-11 h-11 mx-auto text-blue-400 mb-4" />
          <h3 className="text-3xl font-black text-white mb-2">
            Everything Here Is Free
          </h3>
          <p className="text-slate-300 mb-2 max-w-xl mx-auto text-base">
            Sign in to unlock 300+ companies, live job search, salary
            benchmarking, anonymous interview Q&A, and AI-powered culture fit
            scoring.
          </p>
          <p className="text-slate-500 text-sm mb-7">
            No credit card. No trial period. Just sign in.
          </p>
          <a href="#" onClick={(e) => { e.preventDefault(); handleSignIn(); }}>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold px-12 py-3 text-base rounded-xl shadow-lg shadow-blue-900/40">
              Sign In Free — Unlock Everything →
            </Button>
          </a>
        </Card>
      </div>
    </div>
  );
}
