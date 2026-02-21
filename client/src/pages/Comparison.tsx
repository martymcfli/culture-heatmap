import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";

export default function Comparison() {
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults } = trpc.companies.search.useQuery(searchQuery, {
    enabled: searchQuery.length > 1,
  });

  const companiesQuery = trpc.companies.getById.useQuery(selectedCompanies[0] || 0, {
    enabled: selectedCompanies.length > 0,
  });

  const addCompany = (companyId: number) => {
    if (selectedCompanies.length < 4 && !selectedCompanies.includes(companyId)) {
      setSelectedCompanies([...selectedCompanies, companyId]);
      setSearchQuery("");
    }
  };

  const removeCompany = (companyId: number) => {
    setSelectedCompanies(selectedCompanies.filter(id => id !== companyId));
  };

  const getScoreBgColor = (score: number | null | undefined) => {
    if (!score) return "bg-white/10 text-foreground/60";
    if (score >= 4.5) return "bg-green-500/20 text-green-300";
    if (score >= 4.0) return "bg-blue-500/20 text-blue-300";
    if (score >= 3.5) return "bg-yellow-500/20 text-yellow-300";
    return "bg-red-500/20 text-red-300";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-white/5 backdrop-blur-md bg-background/40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/heatmap">
            <Button variant="ghost" size="icon" className="text-foreground hover:text-blue-400">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Compare Companies
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Selection */}
        <Card className="mb-8 bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Select Companies to Compare</CardTitle>
            <CardDescription className="text-foreground/60">Choose up to 4 companies to compare side-by-side</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Input
                  placeholder="Search for a company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={selectedCompanies.length >= 4}
                />
                {searchQuery && searchResults && (
                  <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg mt-1 z-10">
                    {searchResults.map((company: any) => (
                      <button
                        key={company.id}
                        onClick={() => addCompany(company.id)}
                        disabled={selectedCompanies.includes(company.id)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed border-b last:border-b-0"
                      >
                        <p className="font-medium">{company.name}</p>
                        <p className="text-sm text-slate-600">{company.industry}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Companies */}
              <div className="flex flex-wrap gap-2">
                {selectedCompanies.map((companyId) => (
                  <div key={companyId} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2">
                    <span>Company {selectedCompanies.indexOf(companyId) + 1}</span>
                    <button
                      onClick={() => removeCompany(companyId)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-sm text-slate-600">
                {selectedCompanies.length}/4 companies selected
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Comparison View */}
        {selectedCompanies.length > 0 && (
          <>
            {/* Metrics Table */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Metrics Comparison</CardTitle>
                <CardDescription>Side-by-side comparison of culture scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4 font-semibold">Metric</th>
                        {selectedCompanies.map((_, idx) => (
                          <th key={idx} className="text-center py-2 px-4 font-semibold">
                            Company {idx + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">Overall Rating</td>
                        {selectedCompanies.map((companyId) => (
                          <td key={companyId} className="text-center py-3 px-4">
                            <div className="inline-block">N/A</div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">Work-Life Balance</td>
                        {selectedCompanies.map((companyId) => (
                          <td key={companyId} className="text-center py-3 px-4">
                            <div className="inline-block">N/A</div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">Compensation & Benefits</td>
                        {selectedCompanies.map((companyId) => (
                          <td key={companyId} className="text-center py-3 px-4">
                            <div className="inline-block">N/A</div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">Career Opportunities</td>
                        {selectedCompanies.map((companyId) => (
                          <td key={companyId} className="text-center py-3 px-4">
                            <div className="inline-block">N/A</div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b hover:bg-slate-50">
                        <td className="py-3 px-4">Culture & Values</td>
                        {selectedCompanies.map((companyId) => (
                          <td key={companyId} className="text-center py-3 px-4">
                            <div className="inline-block">N/A</div>
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-3 px-4">Senior Management</td>
                        {selectedCompanies.map((companyId) => (
                          <td key={companyId} className="text-center py-3 px-4">
                            <div className="inline-block">N/A</div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedCompanies.map((companyId, idx) => (
                <Card key={companyId}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Company {idx + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">ID: {companyId}</p>
                    <Link href={`/company/${companyId}`}>
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {selectedCompanies.length === 0 && (
          <Card>
            <CardContent className="pt-12 text-center">
              <p className="text-slate-600 mb-4">Select companies above to start comparing</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
