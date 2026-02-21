import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
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
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, Zap, Search, X } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

// Custom tooltip component with company logo
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 border border-cyan-500/50 rounded-lg p-4 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-3">
          {data.logoUrl && (
            <img
              src={data.logoUrl}
              alt={data.name}
              className="w-10 h-10 object-contain bg-white rounded p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <div>
            <p className="font-bold text-cyan-300 text-sm">{data.name}</p>
            <p className="text-xs text-slate-400">{data.industry}</p>
          </div>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Overall Rating:</span>
            <span className="text-cyan-300 font-semibold">{data.x.toFixed(2)}/5</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Work-Life Balance:</span>
            <span className="text-cyan-300 font-semibold">{data.y.toFixed(2)}/5</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Compensation:</span>
            <span className="text-cyan-300 font-semibold">{data.compensation.toFixed(2)}/5</span>
          </div>
          {data.turnoverRate !== undefined && (
            <div className="flex justify-between gap-4 pt-2 border-t border-slate-700">
              <span className="text-slate-400">Turnover Rate:</span>
              <span className="text-amber-300 font-semibold">{data.turnoverRate.toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function DemoHeatMap() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch demo companies
  const { data: allCompanies = [] } = trpc.demo.getCompanies.useQuery();

  // Filter companies by industry, location, and search query
  const filteredCompanies = useMemo(() => {
    return allCompanies.filter((company: any) => {
      if (selectedIndustry !== "all" && company.industry !== selectedIndustry) {
        return false;
      }
      if (selectedLocation !== "all" && company.headquartersState !== selectedLocation) {
        return false;
      }
      if (searchQuery && !company.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [allCompanies, selectedIndustry, selectedLocation, searchQuery]);

  // Prepare data for scatter chart
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

  // Get unique industries and locations from demo data
  const industries = useMemo(() => {
    return ["Technology", "Finance", "Healthcare"];
  }, []);

  const locations = useMemo(() => {
    return ["CA", "MA", "NC", "NJ", "NY", "ON", "TX", "WA"];
  }, []);

  // Get color based on overall rating with gradient
  const getColorByRating = (rating: number) => {
    if (rating >= 4.5) return "#10b981"; // Emerald - Excellent
    if (rating >= 4.2) return "#06b6d4"; // Cyan - Very Good
    if (rating >= 3.9) return "#3b82f6"; // Blue - Good
    if (rating >= 3.6) return "#8b5cf6"; // Purple - Fair
    if (rating >= 3.3) return "#f59e0b"; // Amber - Below Average
    return "#ef4444"; // Red - Poor
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Company Search Bar */}
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

      {/* Demo Banner */}
      <div className="bg-amber-900/30 border-b border-amber-700/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <p className="text-sm text-amber-200">
              <span className="font-semibold">Demo Mode:</span> Viewing sample data with 28 companies. 
              <a href={getLoginUrl()} className="ml-2 underline hover:text-amber-100">
                Sign in
              </a>
              {" "}to see all 300+ companies and unlock full features.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Company Culture Heat Map
          </h1>
          <p className="text-slate-400 mt-2">
            Explore company cultures across 15+ industries. Click bubbles to lock tooltips. Hover or click to see company logos, ratings, and employee turnover metrics.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-cyan-400">Filters</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Industry Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Industry
              </label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((industry: string) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Location
              </label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location: string) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-slate-400 text-sm mt-4">
            Showing {filteredCompanies.length} of {allCompanies.length} companies
          </p>
        </Card>

        {/* Heat Map Chart */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-cyan-400">Culture Score Distribution</h2>
          <p className="text-slate-400 text-sm mb-4">Hover over bubbles to see company logos and detailed metrics</p>

          {chartData.length > 0 ? (
            <div className="w-full h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Overall Rating"
                    domain={[0, 5]}
                    stroke="#94a3b8"
                    label={{ value: "Overall Rating →", position: "insideBottomRight", offset: -10 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Work-Life Balance"
                    domain={[0, 5]}
                    stroke="#94a3b8"
                    label={{ value: "Work-Life Balance →", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
                  <Legend />
                  <Scatter
                    name="Companies"
                    data={chartData}
                    fill="#06b6d4"
                    fillOpacity={0.8}
                    r={12}
                    shape="circle"
                    isAnimationActive={true}
                    animationDuration={300}
                  >
                    {chartData.map((entry, index) => (
                      <Scatter
                        key={`scatter-${index}`}
                        dataKey="y"
                        fill={getColorByRating(entry.x)}
                        fillOpacity={0.75}
                        r={12}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-slate-400">
              No companies match your filters
            </div>
          )}
        </Card>

        {/* Color Legend with Gradient */}
        <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-700/50 backdrop-blur-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">Culture Score Legend</h3>
          <div className="space-y-3">
            {[
              { color: "#10b981", range: "4.5 - 5.0", label: "Excellent", desc: "Outstanding culture and work environment" },
              { color: "#06b6d4", range: "4.2 - 4.5", label: "Very Good", desc: "Strong culture with minor areas for improvement" },
              { color: "#3b82f6", range: "3.9 - 4.2", label: "Good", desc: "Solid culture and employee satisfaction" },
              { color: "#8b5cf6", range: "3.6 - 3.9", label: "Fair", desc: "Acceptable culture with mixed reviews" },
              { color: "#f59e0b", range: "3.3 - 3.6", label: "Below Average", desc: "Some concerns about work environment" },
              { color: "#ef4444", range: "< 3.3", label: "Poor", desc: "Significant culture and satisfaction issues" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full shadow-lg"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{item.label}</span>
                    <span className="text-xs text-slate-400">({item.range})</span>
                  </div>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Companies Grid */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-cyan-400">Companies</h2>

          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompanies.map((company: any) => (
                <div
                  key={company.id}
                  className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:border-cyan-500/50 transition-all group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {company.logoUrl && (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="w-10 h-10 object-contain bg-white rounded p-1 flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <h3 className="font-semibold text-cyan-400 text-lg group-hover:text-cyan-300 transition-colors">
                      {company.name}
                    </h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Industry:</span>
                      <Badge variant="outline" className="bg-slate-600/50 border-slate-500">
                        {company.industry}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span className="text-slate-300">
                        {company.headquartersCity}, {company.headquartersState}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Size:</span>
                      <span className="text-slate-300">{company.sizeRange}</span>
                    </div>
                    <div className="border-t border-slate-600/50 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Overall Rating:</span>
                        <span
                          className="text-lg font-bold rounded px-2 py-1"
                          style={{
                            color: getColorByRating(company.aggregateScore?.overallRating || 0),
                            textShadow: `0 0 8px ${getColorByRating(company.aggregateScore?.overallRating || 0)}40`,
                          }}
                        >
                          {company.aggregateScore?.overallRating?.toFixed(1) || "N/A"}/5
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400 mt-2">
                        <span>Work-Life: {company.aggregateScore?.workLifeBalance?.toFixed(1) || "N/A"}</span>
                        <span>Comp: {company.aggregateScore?.compensationBenefits?.toFixed(1) || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              No companies match your filters
            </div>
          )}
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700/50 backdrop-blur-sm p-8 text-center">
          <Zap className="w-12 h-12 mx-auto text-blue-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">Unlock Full Access</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Sign in to explore all 300+ companies, compare salaries, view interview questions, get AI-powered recommendations, and search LinkedIn jobs.
          </p>
          <a href={getLoginUrl()}>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-3">
              Sign In to Explore Full Platform
            </Button>
          </a>
        </Card>
      </div>
    </div>
  );
}
