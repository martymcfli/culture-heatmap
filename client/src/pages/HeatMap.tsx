import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, ArrowLeft, Zap, Search, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import IndustrySections from "@/components/IndustrySections";
import SearchBar from "@/components/SearchBar";
import { Bubble3DChart, type Company } from "@/components/Bubble3DChart";
import { CompanyModal } from "@/components/CompanyModal";

const INDUSTRIES = ["Technology", "Finance", "Biotech", "Healthcare Tech", "Cloud Computing", "Automotive"];
const SIZE_RANGES = ["1-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"];
const LOCATIONS = ["San Antonio, TX", "New York, NY", "Cupertino, CA", "Seattle, WA", "Boston, MA"];

// Get color based on overall rating score
const getColorByScore = (score: number | null | undefined) => {
  if (!score) return "#64748b";
  if (score >= 4.7) return "#10b981"; // Emerald - Excellent
  if (score >= 4.4) return "#06b6d4"; // Cyan - Very Good
  if (score >= 4.1) return "#3b82f6"; // Blue - Good
  if (score >= 3.8) return "#f59e0b"; // Amber - Fair
  if (score >= 3.5) return "#f97316"; // Orange - Below Average
  return "#ef4444"; // Red - Poor
};

const getScoreLabel = (score: number | null | undefined) => {
  if (!score) return "No Data";
  if (score >= 4.7) return "Excellent";
  if (score >= 4.4) return "Very Good";
  if (score >= 4.1) return "Good";
  if (score >= 3.8) return "Fair";
  if (score >= 3.5) return "Below Average";
  return "Poor";
};

export default function HeatMap() {
  const [filters, setFilters] = useState({
    location: "",
    industries: [] as string[],
    sizeRange: "",
    minScore: 0,
    maxScore: 5,
  });

  const [viewMode, setViewMode] = useState<"heatmap" | "list" | "3d">("heatmap");
  const [hoveredCompany, setHoveredCompany] = useState<number | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusCompanyId, setFocusCompanyId] = useState<string | undefined>(undefined);
  const [pinnedCompany, setPinnedCompany] = useState<Company | null>(null);
  const { data: companies, isLoading } = trpc.companies.filter.useQuery({
    ...filters,
    industry: filters.industries.length > 0 ? filters.industries[0] : "",
  });

  // Filter companies by search query
  const filteredBySearch = (companies as any[])?.filter((c: any) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const chartData = filteredBySearch.map((c: any) => ({
    name: c.name,
    id: c.id,
    industry: c.industry,
    size: c.sizeRange,
    logoUrl: c.logoUrl,
    workLifeBalance: parseFloat(String(c.aggregateScore?.workLifeBalance || 0)),
    overallRating: parseFloat(String(c.aggregateScore?.overallRating || 0)),
    compensationBenefits: parseFloat(String(c.aggregateScore?.compensationBenefits || 0)),
    turnoverRate: c.turnoverRate,
    color: getColorByScore(parseFloat(String(c.aggregateScore?.overallRating || 0))),
  })) || [];

  useEffect(() => {
    if (searchQuery && filteredBySearch.length > 0 && viewMode === "3d") {
      const matchedCompany = filteredBySearch[0];
      setFocusCompanyId(matchedCompany.id);
    } else {
      setFocusCompanyId(undefined);
    }
  }, [searchQuery, filteredBySearch, viewMode]);

  const CustomTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-cyan-500/50 rounded-lg p-3 shadow-xl">
          {data.logoUrl && (
            <img src={data.logoUrl} alt={data.name} className="w-10 h-10 rounded mb-2 object-contain" />
          )}
          <p className="font-bold text-cyan-300">{data.name}</p>
          <p className="text-sm text-gray-300">{data.industry}</p>
          <p className="text-sm text-gray-400 mt-2">
            Overall Rating: <span className="font-semibold text-white">{data.overallRating.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-400">
            Work-Life Balance: <span className="font-semibold text-white">{data.workLifeBalance.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-400">
            Compensation: <span className="font-semibold text-white">{data.compensationBenefits.toFixed(2)}</span>
          </p>
          {data.turnoverRate !== undefined && data.turnoverRate !== null && (
            <p className="text-sm text-gray-400">
              Turnover Rate: <span className="font-semibold text-amber-300">{parseFloat(String(data.turnoverRate)).toFixed(1)}%</span>
            </p>
          )}
          <p className="text-xs text-cyan-400 mt-2">Click to view full profile</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="min-h-screen bg-background text-foreground"
      onClick={(e) => {
        // Close selection if clicking outside the chart
        if ((e.target as HTMLElement).closest('.recharts-wrapper') === null) {
          setSelectedCompany(null);
        }
      }}
    >
      {/* Header */}
      <div className="border-b border-white/5 backdrop-blur-md bg-background/40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-blue-400">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-cyan-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Culture Heat Map
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Company Name Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
            <input
              type="text"
              placeholder="Search companies by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-white/10 border border-white/20 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:border-cyan-500/50 focus:bg-white/15 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-foreground/50 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Filters</CardTitle>
            <CardDescription className="text-foreground/60">Customize your search to find companies that match your criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Location</Label>
                <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {LOCATIONS.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <IndustrySections
                  selectedIndustries={filters.industries}
                  onSelectIndustry={(industries) => setFilters({ ...filters, industries })}
                />
              </div>

              <div className="space-y-2">
                <Label>Company Size</Label>
                <Select value={filters.sizeRange} onValueChange={(value) => setFilters({ ...filters, sizeRange: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    {SIZE_RANGES.map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 lg:col-span-3">
                <Label>Culture Score Range: {filters.minScore.toFixed(1)} - {filters.maxScore.toFixed(1)}</Label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Slider
                      min={0}
                      max={5}
                      step={0.1}
                      value={[filters.minScore, filters.maxScore]}
                      onValueChange={(value) => setFilters({ ...filters, minScore: value[0], maxScore: value[1] })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ location: "", industries: [], sizeRange: "", minScore: 0, maxScore: 5 })}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={viewMode === "heatmap" ? "default" : "outline"}
            onClick={() => setViewMode("heatmap")}
            className={viewMode === "heatmap" ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600" : ""}
          >
            Heat Map View
          </Button>
          <Button
            variant={viewMode === "3d" ? "default" : "outline"}
            onClick={() => setViewMode("3d")}
            className={viewMode === "3d" ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" : ""}
          >
            3D Bubble View
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600" : ""}
          >
            List View
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : viewMode === "3d" ? (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden h-[800px]">
            <CardHeader>
              <CardTitle className="text-foreground">3D Bubble Chart</CardTitle>
              <CardDescription className="text-foreground/60">
                Explore companies in 3D space. Hover to highlight, click to select.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full p-0">
              <Bubble3DChart 
                companies={(companies as any[])?.map((c: any) => ({
                  id: c.id,
                  name: c.name,
                  industry: c.industry,
                  overallScore: c.aggregateScore?.overallRating || 3,
                  workLifeBalance: c.aggregateScore?.workLifeBalance || 3,
                  turnoverRate: c.turnoverRate || 20,
                })) || []}
                focusCompanyId={focusCompanyId}
                onClick={(company: Company) => {
                  setPinnedCompany(company);
                }}
                onHover={(company) => {
                  if (!pinnedCompany) {
                    setPinnedCompany(company);
                  }
                }}
              />
            </CardContent>
          </Card>
        ) : viewMode === "heatmap" ? (
          <>
            {/* Color Legend */}
            <Card className="mb-6 bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {[
                    { score: 4.7, label: "Excellent", color: "#10b981" },
                    { score: 4.4, label: "Very Good", color: "#06b6d4" },
                    { score: 4.1, label: "Good", color: "#3b82f6" },
                    { score: 3.8, label: "Fair", color: "#f59e0b" },
                    { score: 3.5, label: "Below Avg", color: "#f97316" },
                    { score: 3.0, label: "Poor", color: "#ef4444" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full shadow-lg" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-foreground/70">{item.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Heat Map Chart */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="text-foreground">Work-Life Balance vs Overall Rating</CardTitle>
                <CardDescription className="text-foreground/60">
                  Bubble color represents overall company rating. Hover over bubbles for details or click to lock tooltip in place.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={600}>
                  <ScatterChart 
                    margin={{ top: 20, right: 20, bottom: 80, left: 80 }} 
                    data={chartData}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="rgba(255,255,255,0.1)" 
                      vertical={true}
                      horizontal={true}
                    />
                    <XAxis 
                      dataKey="overallRating" 
                      name="Overall Rating" 
                      type="number"
                      domain={[0, 5]}
                      label={{ 
                        value: 'Overall Company Rating', 
                        position: 'insideBottomRight', 
                        offset: -10,
                        fill: '#9ca3af',
                        fontSize: 14,
                        fontWeight: 600
                      }}
                      stroke="#6b7280"
                      tick={{ fill: '#9ca3af' }}
                    />
                    <YAxis 
                      dataKey="workLifeBalance" 
                      name="Work-Life Balance"
                      type="number"
                      domain={[0, 5]}
                      label={{ 
                        value: 'Work-Life Balance Score', 
                        angle: -90, 
                        position: 'insideLeft',
                        fill: '#9ca3af',
                        fontSize: 14,
                        fontWeight: 600
                      }}
                      stroke="#6b7280"
                      tick={{ fill: '#9ca3af' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ color: '#9ca3af', paddingTop: '20px' }}
                      verticalAlign="bottom"
                      height={36}
                    />
                    <Scatter
                      name="Companies"
                      data={chartData}
                      shape="circle"
                      onClick={(data: any) => {
                        if (data && data.id) {
                          setSelectedCompany(selectedCompany === data.id ? null : data.id);
                        }
                      }}
                      onMouseEnter={(data: any) => {
                        if (!selectedCompany) setHoveredCompany(data.id);
                      }}
                      onMouseLeave={() => {
                        if (!selectedCompany) setHoveredCompany(null);
                      }}
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          fillOpacity={selectedCompany === entry.id || hoveredCompany === entry.id ? 1 : 0.6}
                          style={{
                            cursor: 'pointer',
                            filter: selectedCompany === entry.id 
                              ? 'drop-shadow(0 0 16px rgba(6, 182, 212, 1))' 
                              : hoveredCompany === entry.id 
                              ? 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.8))' 
                              : 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.3))',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
                <p className="text-sm text-foreground/60 mt-8 text-center">
                  ✨ Click on any bubble to lock tooltip. Click elsewhere to deselect.
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="space-y-4">
            {(companies as any[])?.map((company: any) => (
              <Link key={company.id} href={`/company/${company.id}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer border-white/10 hover:border-cyan-500/50 bg-white/5 hover:bg-white/10">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground">{company.name}</h3>
                        <p className="text-sm text-foreground/60">{company.industry} • {company.headquartersCity}, {company.headquartersState}</p>
                      </div>
                      <div className="flex gap-6 items-center">
                        {company.aggregateScore && (
                          <>
                            <div className="text-right">
                              <div className="text-sm text-foreground/60">Overall Rating</div>
                              <div 
                                className="text-3xl font-bold rounded-lg px-3 py-1"
                                style={{
                                  color: getColorByScore(company.aggregateScore.overallRating),
                                  textShadow: `0 0 10px ${getColorByScore(company.aggregateScore.overallRating)}40`
                                }}
                              >
                                {company.aggregateScore.overallRating.toFixed(1)}
                              </div>
                              <div className="text-xs text-foreground/50 mt-1">
                                {getScoreLabel(company.aggregateScore.overallRating)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-foreground/60">Work-Life</div>
                              <div 
                                className="text-3xl font-bold rounded-lg px-3 py-1"
                                style={{
                                  color: getColorByScore(company.aggregateScore.workLifeBalance),
                                  textShadow: `0 0 10px ${getColorByScore(company.aggregateScore.workLifeBalance)}40`
                                }}
                              >
                                {company.aggregateScore.workLifeBalance.toFixed(1)}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && companies?.length === 0 && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="pt-12 text-center">
              <p className="text-foreground/60 mb-4">No companies found matching your filters.</p>
              <Button 
                variant="outline" 
                onClick={() => setFilters({ location: "", industries: [], sizeRange: "", minScore: 0, maxScore: 5 })}
                className="hover:bg-cyan-500/20 hover:border-cyan-500"
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <CompanyModal 
        company={pinnedCompany} 
        isOpen={pinnedCompany !== null}
        onClose={() => setPinnedCompany(null)}
      />
    </div>
  );
}
