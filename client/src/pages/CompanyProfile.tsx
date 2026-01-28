import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link, useRoute } from "wouter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";
import JobOpenings from "@/components/JobOpenings";
import CompanyNews from "@/components/CompanyNews";
import FavoriteButton from "@/components/FavoriteButton";

export default function CompanyProfile() {
  const [, params] = useRoute("/company/:id");
  const companyId = params?.id ? parseInt(params.id) : null;

  const { data: companyData, isLoading } = trpc.companies.getById.useQuery(companyId || 0, {
    enabled: !!companyId,
  });

    if (!companyId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Invalid company ID</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Company not found</p>
      </div>
    );
  }

  const company = companyData.company;
  const scores = companyData.scores || [];
  const trends = companyData.trends || [];
  const layoffs = companyData.layoffs || [];

  // Calculate aggregate scores
  const avgScore = (field: string) => {
    const values = scores
      .map((s: any) => parseFloat(String(s[field] || 0)))
      .filter((v: number) => !isNaN(v));
    return values.length > 0 ? (values.reduce((a: number, b: number) => a + b, 0) / values.length).toFixed(1) : "N/A";
  };

  const radarData = [
    { name: "Overall", value: parseFloat(avgScore("overallRating")) },
    { name: "Work-Life", value: parseFloat(avgScore("workLifeBalance")) },
    { name: "Compensation", value: parseFloat(avgScore("compensationBenefits")) },
    { name: "Career", value: parseFloat(avgScore("careerOpportunities")) },
    { name: "Culture", value: parseFloat(avgScore("cultureValues")) },
    { name: "Management", value: parseFloat(avgScore("seniorManagement")) },
  ];

  const getScoreBgColor = (score: number | string) => {
    const numScore = typeof score === "string" ? parseFloat(score) : score;
    if (isNaN(numScore)) return "bg-white/10 text-foreground/60";
    if (numScore >= 4.5) return "bg-green-500/20 text-green-300";
    if (numScore >= 4.0) return "bg-blue-500/20 text-blue-300";
    if (numScore >= 3.5) return "bg-yellow-500/20 text-yellow-300";
    return "bg-red-500/20 text-red-300";
  };

  const trendData = trends
    .slice(0, 6)
    .reverse()
    .map((t: any) => ({
      month: new Date(t.monthYear).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      value: parseFloat(String(t.metricValue)),
    }));

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
            Company Profile
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Company Header */}
        <Card className="mb-8 bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-2">{company.name}</h2>
                <div className="space-y-1 text-foreground/60">
                  <p>{company.industry}</p>
                  <p>{company.headquartersCity}, {company.headquartersState}, {company.headquartersCountry}</p>
                  <p>Company Size: {company.sizeRange}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-foreground/60 mb-2">Overall Rating</div>
                <div className={`text-5xl font-bold ${getScoreBgColor(avgScore("overallRating"))}`}>
                  {avgScore("overallRating")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card className="mb-8 bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Culture Score Breakdown</CardTitle>
            <CardDescription className="text-foreground/60">Aggregated metrics from multiple sources</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={90} domain={[0, 5]} />
                <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Work-Life Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getScoreBgColor(avgScore("workLifeBalance"))}`}>
                {avgScore("workLifeBalance")}
              </div>
              <p className="text-sm text-slate-600 mt-2">out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Compensation & Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getScoreBgColor(avgScore("compensationBenefits"))}`}>
                {avgScore("compensationBenefits")}
              </div>
              <p className="text-sm text-slate-600 mt-2">out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Career Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getScoreBgColor(avgScore("careerOpportunities"))}`}>
                {avgScore("careerOpportunities")}
              </div>
              <p className="text-sm text-slate-600 mt-2">out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Culture & Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getScoreBgColor(avgScore("cultureValues"))}`}>
                {avgScore("cultureValues")}
              </div>
              <p className="text-sm text-slate-600 mt-2">out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Senior Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getScoreBgColor(avgScore("seniorManagement"))}`}>
                {avgScore("seniorManagement")}
              </div>
              <p className="text-sm text-slate-600 mt-2">out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">CEO Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getScoreBgColor(avgScore("ceoApproval"))}`}>
                {avgScore("ceoApproval")}%
              </div>
              <p className="text-sm text-slate-600 mt-2">approval rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Trend Chart */}
        {trendData.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Culture Score Trend</CardTitle>
              <CardDescription>Historical data over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" name="Overall Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Layoff Events */}
        {layoffs.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Layoff Events</CardTitle>
              <CardDescription>Company restructuring information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {layoffs.map((layoff: any) => (
                  <div key={layoff.id} className="border-l-4 border-red-500 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {layoff.employeesAffected} employees affected
                        </p>
                        <p className="text-sm text-slate-600">
                          {new Date(layoff.date).toLocaleDateString()} • {layoff.percentageOfWorkforce}% of workforce
                        </p>
                      </div>
                    </div>
                    {layoff.notes && <p className="text-sm text-slate-600 mt-2">{layoff.notes}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scores by Source */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Scores by Source</CardTitle>
            <CardDescription>Ratings from different review platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scores.map((score: any) => (
                <div key={score.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-slate-900 capitalize">{score.source}</h4>
                    <span className="text-sm text-slate-600">{score.reviewCount} reviews</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Overall</p>
                      <p className="font-semibold">{score.overallRating || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Work-Life</p>
                      <p className="font-semibold">{score.workLifeBalance || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Compensation</p>
                      <p className="font-semibold">{score.compensationBenefits || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Career</p>
                      <p className="font-semibold">{score.careerOpportunities || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Culture</p>
                      <p className="font-semibold">{score.cultureValues || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Management</p>
                      <p className="font-semibold">{score.seniorManagement || "N/A"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Job Openings */}
        <div className="mb-8">
          <JobOpenings companyId={company.id} companyName={company.name} />
        </div>

        {/* Company News */}
        <div className="mb-8">
          <CompanyNews companyId={company.id} industryCategory={company.industry || undefined} />
        </div>

        {/* Review Form */}
        <div className="mb-8">
          <ReviewForm companyId={company.id} />
        </div>

        {/* Review List */}
        <ReviewList companyId={company.id} />
      </div>

      {/* Floating Favorite Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <FavoriteButton companyId={company.id} size="lg" />
      </div>
    </div>
  );
}
