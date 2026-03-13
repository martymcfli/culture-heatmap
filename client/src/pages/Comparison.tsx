import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, X, Search, TrendingUp, Users, Award, Briefcase } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const RADAR_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const getScoreColor = (score: number | null | undefined) => {
  if (!score) return "text-slate-500";
  if (score >= 4.5) return "text-emerald-400";
  if (score >= 4.0) return "text-blue-400";
  if (score >= 3.5) return "text-yellow-400";
  return "text-red-400";
};

const getScoreBg = (score: number | null | undefined) => {
  if (!score) return "bg-slate-700/40 text-slate-500";
  if (score >= 4.5) return "bg-emerald-500/20 text-emerald-300";
  if (score >= 4.0) return "bg-blue-500/20 text-blue-300";
  if (score >= 3.5) return "bg-yellow-500/20 text-yellow-300";
  return "bg-red-500/20 text-red-300";
};

const METRICS = [
  { key: "overallRating", label: "Overall Rating" },
  { key: "workLifeBalance", label: "Work-Life Balance" },
  { key: "compensationBenefits", label: "Compensation & Benefits" },
  { key: "careerOpportunities", label: "Career Opportunities" },
  { key: "cultureValues", label: "Culture & Values" },
  { key: "seniorManagement", label: "Senior Management" },
];

export default function Comparison() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [nameCache, setNameCache] = useState<Record<number, string>>({});

  const { data: searchResults } = trpc.companies.search.useQuery(searchQuery, {
    enabled: searchQuery.length > 1,
  });

  const { data: comparisonData, isLoading } = trpc.comparison.getComparisonData.useQuery(
    selectedIds,
    { enabled: selectedIds.length > 0 }
  );

  const addCompany = (id: number, name: string) => {
    if (selectedIds.length >= 4 || selectedIds.includes(id)) return;
    setSelectedIds((prev) => [...prev, id]);
    setNameCache((prev) => ({ ...prev, [id]: name }));
    setSearchQuery("");
  };

  const removeCompany = (id: number) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  };

  const radarData = useMemo(() => {
    if (!comparisonData?.length) return [];
    return METRICS.map(({ key, label }) => {
      const point: Record<string, any> = { metric: label };
      comparisonData.forEach((d: any) => {
        const score = d.aggregateScore?.[key];
        point[d.company.name] = score ? parseFloat(parseFloat(score).toFixed(2)) : null;
      });
      return point;
    });
  }, [comparisonData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/heatmap">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-cyan-400">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Compare Companies
            </h1>
            <p className="text-slate-500 text-sm">Side-by-side culture & compensation analysis</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="mb-6 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-cyan-400 text-lg">Select Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder={selectedIds.length >= 4 ? "Maximum 4 companies selected" : "Search for a company..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={selectedIds.length >= 4}
                  className="pl-9 bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-cyan-500/50"
                />
                {searchQuery && searchResults && (
                  <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl mt-1 z-20 overflow-hidden">
                    {searchResults.length === 0 ? (
                      <p className="px-4 py-3 text-slate-400 text-sm">No results found</p>
                    ) : (
                      searchResults.slice(0, 8).map((company: any) => (
                        <button
                          key={company.id}
                          onClick={() => addCompany(company.id, company.name)}
                          disabled={selectedIds.includes(company.id)}
                          className="w-full text-left px-4 py-3 hover:bg-slate-700/70 disabled:opacity-40 disabled:cursor-not-allowed border-b border-slate-700/50 last:border-b-0 transition-colors"
                        >
                          <p className="font-medium text-white text-sm">{company.name}</p>
                          <p className="text-xs text-slate-400">{company.industry}</p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {selectedIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedIds.map((id, idx) => (
                    <div
                      key={id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{ backgroundColor: RADAR_COLORS[idx] + "25", border: `1px solid ${RADAR_COLORS[idx]}50`, color: RADAR_COLORS[idx] }}
                    >
                      <span>{nameCache[id] ?? `Company ${idx + 1}`}</span>
                      <button onClick={() => removeCompany(id)} className="hover:opacity-70 transition-opacity">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-slate-500">{selectedIds.length}/4 companies selected</p>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        )}

        {selectedIds.length === 0 && !isLoading && (
          <Card className="bg-slate-800/30 border-slate-700/40">
            <CardContent className="py-16 text-center">
              <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg font-medium">Search and select companies above</p>
              <p className="text-slate-600 text-sm mt-1">Compare up to 4 companies side-by-side</p>
            </CardContent>
          </Card>
        )}

        {comparisonData && comparisonData.length > 0 && (
          <>
            <div className={`grid gap-4 mb-8 grid-cols-1 ${comparisonData.length === 2 ? "md:grid-cols-2" : comparisonData.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"}`}>
              {comparisonData.map((d: any, idx: number) => {
                const score = d.aggregateScore?.overallRating;
                const color = RADAR_COLORS[idx];
                return (
                  <Card key={d.company.id} className="bg-slate-800/50 border-slate-700/50 overflow-hidden">
                    <div className="h-1" style={{ backgroundColor: color }} />
                    <CardContent className="pt-4 pb-5">
                      <div className="flex items-start gap-3 mb-3">
                        {d.company.logoUrl && (
                          <img
                            src={d.company.logoUrl}
                            alt={d.company.name}
                            className="w-10 h-10 object-contain bg-white rounded-lg p-1 flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        )}
                        <div className="min-w-0">
                          <h3 className="font-bold text-white text-sm leading-tight truncate">{d.company.name}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">{d.company.industry}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">Overall Score</span>
                        <span className={`text-xl font-black ${getScoreColor(score ? parseFloat(score) : null)}`}>
                          {score ? parseFloat(score).toFixed(1) : "N/A"}
                          {score && <span className="text-sm text-slate-500">/5</span>}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {d.company.sizeRange && (
                          <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">{d.company.sizeRange}</Badge>
                        )}
                        {d.company.headquartersCity && (
                          <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">
                            {d.company.headquartersCity}, {d.company.headquartersState}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{d.jobOpenings?.length ?? 0} jobs</span>
                      </div>
                      <Link href={`/company/${d.company.id}`}>
                        <Button variant="outline" size="sm" className="mt-3 w-full border-slate-600 text-slate-300 hover:text-white hover:border-cyan-500/50 text-xs">
                          Full Profile →
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {radarData.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700/50 mb-8">
                <CardHeader className="pb-2">
                  <CardTitle className="text-cyan-400 text-lg flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Culture Score Radar
                  </CardTitle>
                  <p className="text-slate-400 text-sm">All six culture dimensions compared visually</p>
                </CardHeader>
                <CardContent>
                  <div className="h-[380px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: "#64748b", fontSize: 10 }} tickCount={6} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }}
                          labelStyle={{ color: "#94a3b8", fontSize: 12 }}
                          itemStyle={{ fontSize: 12 }}
                        />
                        <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12 }} />
                        {comparisonData.map((d: any, idx: number) => (
                          <Radar
                            key={d.company.id}
                            name={d.company.name}
                            dataKey={d.company.name}
                            stroke={RADAR_COLORS[idx]}
                            fill={RADAR_COLORS[idx]}
                            fillOpacity={0.12}
                            strokeWidth={2}
                          />
                        ))}
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-cyan-400 text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Side-by-Side Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium w-52">Metric</th>
                        {comparisonData.map((d: any, idx: number) => (
                          <th key={d.company.id} className="text-center py-3 px-4 font-semibold" style={{ color: RADAR_COLORS[idx] }}>
                            {d.company.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {METRICS.map(({ key, label }) => (
                        <tr key={key} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                          <td className="py-3 px-4 text-slate-300 font-medium">{label}</td>
                          {comparisonData.map((d: any) => {
                            const val = d.aggregateScore?.[key];
                            const num = val ? parseFloat(val) : null;
                            return (
                              <td key={d.company.id} className="text-center py-3 px-4">
                                {num ? (
                                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${getScoreBg(num)}`}>
                                    {num.toFixed(1)}/5
                                  </span>
                                ) : (
                                  <span className="text-slate-600 text-xs">N/A</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
