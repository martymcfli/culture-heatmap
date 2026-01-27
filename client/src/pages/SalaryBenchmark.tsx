import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from "recharts";

export default function SalaryBenchmark() {
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);

  // Fetch available job titles and levels
  const { data: jobTitles, isLoading: loadingTitles } = trpc.salary.jobTitles.useQuery();
  const { data: levels, isLoading: loadingLevels } = trpc.salary.levels.useQuery();
  const { data: companies } = trpc.companies.list.useQuery();

  // Fetch salary comparison data
  const { data: salaryData, isLoading: loadingData } = trpc.salary.compare.useQuery(
    {
      jobTitle: selectedJobTitle,
      level: selectedLevel,
      companyIds: selectedCompanies.length > 0 ? selectedCompanies : undefined,
    },
    {
      enabled: !!(selectedJobTitle && selectedLevel),
    }
  );

  // Fetch salary statistics
  const { data: stats } = trpc.salary.stats.useQuery(
    {
      jobTitle: selectedJobTitle,
      level: selectedLevel,
    },
    {
      enabled: !!(selectedJobTitle && selectedLevel),
    }
  );

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!salaryData) return [];
    
    return salaryData.map((salary: any) => ({
      company: companies?.find((c: any) => c.id === salary.companyId)?.name || `Company ${salary.companyId}`,
      baseSalary: parseFloat(String(salary.baseSalary || 0)),
      bonus: parseFloat(String(salary.bonus || 0)),
      equity: parseFloat(String(salary.equity || 0)),
      total: parseFloat(String(salary.totalCompensation || 0)),
    }));
  }, [salaryData, companies]);

  const isLoading = loadingTitles || loadingLevels || loadingData;

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
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Salary Benchmarking
            </h1>
            <p className="text-foreground/60 text-sm">Compare compensation across companies by role and level</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8 bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Filters</CardTitle>
            <CardDescription className="text-foreground/60">Select a job title and level to compare salaries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Select value={selectedJobTitle} onValueChange={setSelectedJobTitle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job title" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTitles?.map((title: string) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Level</Label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels?.map((level: string) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Companies (Optional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by companies" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies?.map((company: any) => (
                      <SelectItem key={company.id} value={String(company.id)}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        {stats && selectedJobTitle && selectedLevel && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-sm text-foreground/60 mb-2">Average</div>
                <div className="text-2xl font-bold text-green-400">
                  ${(stats.average / 1000).toFixed(0)}K
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-sm text-foreground/60 mb-2">Median</div>
                <div className="text-2xl font-bold text-blue-400">
                  ${(stats.median / 1000).toFixed(0)}K
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-sm text-foreground/60 mb-2">Range</div>
                <div className="text-sm font-semibold text-purple-400">
                  ${(stats.min / 1000).toFixed(0)}K - ${(stats.max / 1000).toFixed(0)}K
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-sm text-foreground/60 mb-2">Companies</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {stats.count}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          </div>
        ) : chartData.length > 0 ? (
          <div className="space-y-8">
            {/* Total Compensation Chart */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Total Compensation Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="company" stroke="rgba(255,255,255,0.5)" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                      formatter={(value: any) => `$${(value / 1000).toFixed(0)}K`}
                    />
                    <Legend />
                    <Bar dataKey="total" fill="#10b981" name="Total Compensation" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Compensation Breakdown */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Compensation Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="company" stroke="rgba(255,255,255,0.5)" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                      formatter={(value: any) => `$${(value / 1000).toFixed(0)}K`}
                    />
                    <Legend />
                    <Bar dataKey="baseSalary" fill="#3b82f6" name="Base Salary" />
                    <Bar dataKey="bonus" fill="#f59e0b" name="Bonus" />
                    <Bar dataKey="equity" fill="#8b5cf6" name="Equity" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Data Table */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Detailed Salary Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-foreground/60">Company</th>
                        <th className="text-right py-3 px-4 text-foreground/60">Base Salary</th>
                        <th className="text-right py-3 px-4 text-foreground/60">Bonus</th>
                        <th className="text-right py-3 px-4 text-foreground/60">Equity</th>
                        <th className="text-right py-3 px-4 text-foreground/60">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.map((row: any, idx: number) => (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="py-3 px-4 text-foreground">{row.company}</td>
                          <td className="py-3 px-4 text-right text-blue-300">${(row.baseSalary / 1000).toFixed(0)}K</td>
                          <td className="py-3 px-4 text-right text-amber-300">${(row.bonus / 1000).toFixed(0)}K</td>
                          <td className="py-3 px-4 text-right text-purple-300">${(row.equity / 1000).toFixed(0)}K</td>
                          <td className="py-3 px-4 text-right font-semibold text-green-300">${(row.total / 1000).toFixed(0)}K</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedJobTitle && selectedLevel ? (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="pt-12 text-center">
              <p className="text-foreground/60 mb-4">No salary data available for this combination</p>
              <p className="text-sm text-foreground/40">Try selecting a different job title or level</p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
