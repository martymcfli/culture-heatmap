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
import { AlertCircle, Zap } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function DemoHeatMap() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Fetch demo companies
  const { data: allCompanies = [] } = trpc.demo.getCompanies.useQuery();

  // Filter companies
  const filteredCompanies = useMemo(() => {
    return allCompanies.filter((company: any) => {
      if (selectedIndustry !== "all" && company.industry !== selectedIndustry) {
        return false;
      }
      if (selectedLocation !== "all" && company.headquartersState !== selectedLocation) {
        return false;
      }
      return true;
    });
  }, [allCompanies, selectedIndustry, selectedLocation]);

  // Prepare data for scatter chart
  const chartData = useMemo(() => {
    return filteredCompanies.map((company: any) => ({
      name: company.name,
      x: company.aggregateScore?.overallRating || 0,
      y: company.aggregateScore?.workLifeBalance || 0,
      compensation: company.aggregateScore?.compensationBenefits || 0,
      industry: company.industry,
    }));
  }, [filteredCompanies]);

  // Get unique industries and locations
  const industries = useMemo(() => {
    const unique = Array.from(new Set(allCompanies.map((c: any) => c.industry)));
    return unique.sort();
  }, [allCompanies]);

  const locations = useMemo(() => {
    const unique = Array.from(new Set(allCompanies.map((c: any) => c.headquartersState)));
    return unique.sort();
  }, [allCompanies]);

  // Color mapping for industries
  const getIndustryColor = (industry: string) => {
    const colors: { [key: string]: string } = {
      Technology: "#06b6d4",
      Finance: "#3b82f6",
      Healthcare: "#10b981",
      Consumer: "#f59e0b",
      Other: "#8b5cf6",
    };
    return colors[industry] || "#6366f1";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
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
              {" "}to see all 100+ companies and unlock full features.
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
            Explore company cultures across industries. Bubble position shows overall rating vs work-life balance.
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
                  {industries.map((industry) => (
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
                  {locations.map((location) => (
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
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                    }}
                    formatter={(value: any) => value.toFixed(2)}
                    labelFormatter={(label: any) => `Rating: ${label.toFixed(2)}`}
                  />
                  <Legend />
                  {industries.map((industry) => (
                    <Scatter
                      key={industry}
                      name={industry}
                      data={chartData.filter((d) => d.industry === industry)}
                      fill={getIndustryColor(industry)}
                      fillOpacity={0.7}
                      r={6}
                    />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-slate-400">
              No companies match your filters
            </div>
          )}
        </Card>

        {/* Color Legend */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">Culture Score Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm text-slate-300">Excellent (4.5-5.0)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
              <span className="text-sm text-slate-300">Very Good (4.0-4.5)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span className="text-sm text-slate-300">Good (3.5-4.0)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-500"></div>
              <span className="text-sm text-slate-300">Fair (3.0-3.5)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-sm text-slate-300">Below Avg (2.5-3.0)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm text-slate-300">Poor (&lt;2.5)</span>
            </div>
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
                  className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4 hover:border-cyan-500/50 transition-all"
                >
                  <h3 className="font-semibold text-cyan-400 text-lg mb-2">{company.name}</h3>
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
                        <span className="text-lg font-bold text-cyan-400">
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
            Sign in to explore all 100+ companies, compare salaries, view interview questions, get AI-powered recommendations, and search LinkedIn jobs.
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
