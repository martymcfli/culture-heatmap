import { useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import IndustrySections from "@/components/IndustrySections";

const INDUSTRIES = ["Technology", "Finance", "Biotech", "Healthcare Tech", "Cloud Computing", "Automotive"];
const SIZE_RANGES = ["1-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"];
const LOCATIONS = ["San Antonio, TX", "New York, NY", "Cupertino, CA", "Seattle, WA", "Boston, MA"];

export default function HeatMap() {
  const [filters, setFilters] = useState({
    location: "",
    industry: "",
    sizeRange: "",
    minScore: 0,
    maxScore: 5,
  });

  const [viewMode, setViewMode] = useState<"heatmap" | "list">("heatmap");
  const { data: companies, isLoading } = trpc.companies.filter.useQuery(filters);

  const getScoreColor = (score: number | null | undefined) => {
    if (!score) return "#e5e7eb";
    if (score >= 4.5) return "#22c55e";
    if (score >= 4.0) return "#3b82f6";
    if (score >= 3.5) return "#eab308";
    return "#ef4444";
  };

  const getScoreBgColor = (score: number | null | undefined) => {
    if (!score) return "bg-white/10 text-foreground/60";
    if (score >= 4.5) return "bg-green-500/20 text-green-300";
    if (score >= 4.0) return "bg-blue-500/20 text-blue-300";
    if (score >= 3.5) return "bg-yellow-500/20 text-yellow-300";
    return "bg-red-500/20 text-red-300";
  };

  const chartData = (companies as any[])?.map((c: any) => ({
    name: c.name,
    id: c.id,
    workLifeBalance: parseFloat(String(c.aggregateScore?.workLifeBalance || 0)),
    overallRating: parseFloat(String(c.aggregateScore?.overallRating || 0)),
    compensationBenefits: parseFloat(String(c.aggregateScore?.compensationBenefits || 0)),
  })) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-white/5 backdrop-blur-md bg-background/40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-blue-400">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Culture Heat Map
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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
                    <SelectItem value="">All Locations</SelectItem>
                    {LOCATIONS.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <IndustrySections
                  selectedIndustry={filters.industry}
                  onSelectIndustry={(industry) => setFilters({ ...filters, industry })}
                />
              </div>

              <div className="space-y-2">
                <Label>Company Size</Label>
                <Select value={filters.sizeRange} onValueChange={(value) => setFilters({ ...filters, sizeRange: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sizes</SelectItem>
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
                  onClick={() => setFilters({ location: "", industry: "", sizeRange: "", minScore: 0, maxScore: 5 })}
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
          >
            Heat Map View
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
          >
            List View
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : viewMode === "heatmap" ? (
          <Card>
            <CardHeader>
              <CardTitle>Work-Life Balance vs Overall Rating</CardTitle>
              <CardDescription>
                Each bubble represents a company. Size and color indicate culture scores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="overallRating" name="Overall Rating" />
                  <YAxis dataKey="workLifeBalance" name="Work-Life Balance" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Legend />
                  <Scatter
                    name="Companies"
                    data={chartData}
                    fill="#3b82f6"
                    onClick={(data: any) => {
                      if (data && data.id) {
                        window.location.href = `/company/${data.id}`;
                      }
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
              <p className="text-sm text-slate-600 mt-4">Click on any bubble to view detailed company information</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {(companies as any[])?.map((company: any) => (
              <Link key={company.id} href={`/company/${company.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-slate-900">{company.name}</h3>
                        <p className="text-sm text-slate-600">{company.industry} • {company.headquartersCity}, {company.headquartersState}</p>
                      </div>
                      <div className="flex gap-4 items-center">
                        {company.aggregateScore && (
                          <>
                            <div className="text-right">
                              <div className="text-sm text-slate-600">Overall Rating</div>
                              <div className={`text-2xl font-bold ${getScoreBgColor(company.aggregateScore.overallRating)}`}>
                                {company.aggregateScore.overallRating.toFixed(1)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-600">Work-Life Balance</div>
                              <div className={`text-2xl font-bold ${getScoreBgColor(company.aggregateScore.workLifeBalance)}`}>
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
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-slate-600 mb-4">No companies found matching your filters.</p>
              <Button variant="outline" onClick={() => setFilters({ location: "", industry: "", sizeRange: "", minScore: 0, maxScore: 5 })}>
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
