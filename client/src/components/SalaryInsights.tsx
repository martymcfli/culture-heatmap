import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, DollarSign } from "lucide-react";

export default function SalaryInsights() {
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>();
  const [selectedRole, setSelectedRole] = useState<string | undefined>();

  // Fetch salary trends
  const { data: salaryData, isLoading } = trpc.salary.trends.useQuery({
    level: selectedLevel,
    jobTitle: selectedRole,
  });

  const trends = salaryData?.trends || [];
  const stats = salaryData?.overallStats;
  const jobTitles = salaryData?.jobTitlesList || [];
  const levels = salaryData?.levelsList || [];

  // Prepare chart data
  const chartData = useMemo(() => {
    return trends.slice(0, 10).map((trend) => ({
      name: `${trend.jobTitle} (${trend.role})`,
      baseSalary: Math.round(trend.avgBaseSalary),
      totalComp: Math.round(trend.avgTotalCompensation),
    }));
  }, [trends]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 border-emerald-700/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <div>
              <CardTitle className="text-2xl text-emerald-400">Salary Insights</CardTitle>
              <CardDescription>Explore compensation trends across roles and experience levels</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-lg">Filter Salaries</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Job Title</label>
              <Select value={selectedRole || ""} onValueChange={(val) => setSelectedRole(val || undefined)}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="">All Roles</SelectItem>
                  {jobTitles.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Experience Level</label>
              <Select value={selectedLevel || ""} onValueChange={(val) => setSelectedLevel(val || undefined)}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="">All Levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={() => {
              setSelectedRole(undefined);
              setSelectedLevel(undefined);
            }}
            variant="outline"
            className="w-full"
          >
            Clear Filters
          </Button>
        </CardContent>
      </Card>

      {/* Overall Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-2">Average Base Salary</p>
                <p className="text-2xl font-bold text-cyan-400">{formatCurrency(stats.avgBaseSalary)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-2">Average Total Comp</p>
                <p className="text-2xl font-bold text-blue-400">{formatCurrency(stats.avgTotalCompensation)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-2">Median Base Salary</p>
                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(stats.medianBaseSalary)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-2">Highest Paying Role</p>
                <p className="text-lg font-bold text-purple-400 truncate">{stats.highestPayingRole}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Salary Chart */}
      {chartData.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Top Paying Roles
            </CardTitle>
            <CardDescription>Average base salary vs total compensation</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={120} />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar dataKey="baseSalary" fill="#06b6d4" name="Base Salary" />
                <Bar dataKey="totalComp" fill="#8b5cf6" name="Total Compensation" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Salary Table */}
      {trends.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle>Salary Breakdown by Role & Level</CardTitle>
            <CardDescription>Showing {trends.length} salary data points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Job Title</th>
                    <th className="text-left py-3 px-4 text-slate-300 font-semibold">Level</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-semibold">Avg Base</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-semibold">Avg Total Comp</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-semibold">Range</th>
                    <th className="text-right py-3 px-4 text-slate-300 font-semibold">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {trends.map((trend, idx) => (
                    <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="py-3 px-4 text-cyan-400">{trend.jobTitle}</td>
                      <td className="py-3 px-4 text-slate-300">{trend.role}</td>
                      <td className="py-3 px-4 text-right text-emerald-400">
                        {formatCurrency(trend.avgBaseSalary)}
                      </td>
                      <td className="py-3 px-4 text-right text-blue-400">
                        {formatCurrency(trend.avgTotalCompensation)}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400 text-xs">
                        {formatCurrency(trend.minBaseSalary)} - {formatCurrency(trend.maxBaseSalary)}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400">{trend.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && trends.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="pt-6">
            <div className="text-center text-slate-400">
              <p>No salary data available for the selected filters.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
