import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Users, Zap } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Home() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { data: companies, isLoading: companiesLoading } = trpc.companies.list.useQuery();

  const featuredCompanies = companies?.slice(0, 6) || [];

  const getScoreColor = (score: number | null | undefined) => {
    if (!score) return "bg-gray-100 text-gray-700";
    if (score >= 4.5) return "bg-green-100 text-green-700";
    if (score >= 4.0) return "bg-blue-100 text-blue-700";
    if (score >= 3.5) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Culture Heat Map</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/heatmap" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Explore
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600">{user?.name || user?.email}</span>
                <Link href="/profile" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Profile
                </Link>
              </div>
            ) : (
              <a href={getLoginUrl()} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Sign In
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Discover Your Ideal Workplace
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Explore and compare company cultures across 50+ leading tech companies. Make informed decisions about where you want to work.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/heatmap">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Explore Heat Map
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline">
                Browse Companies
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Interactive Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                See company culture scores at a glance with our color-coded heat map visualization.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Multi-Source Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Aggregated ratings from Glassdoor, Indeed, and Comparably for comprehensive insights.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Track how company cultures evolve over time with historical trend data.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-slate-900 mb-8">Featured Companies</h3>
        
        {companiesLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCompanies.map((company) => (
              <Link key={company.id} href={`/company/${company.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="text-lg">{company.name}</CardTitle>
                        <CardDescription>{company.industry}</CardDescription>
                      </div>
                      {company.aggregateScore && (
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(company.aggregateScore.overallRating)}`}>
                          {company.aggregateScore.overallRating.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Location:</span>
                        <span className="font-medium">{company.headquartersCity}, {company.headquartersState}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Size:</span>
                        <span className="font-medium">{company.sizeRange}</span>
                      </div>
                      {company.aggregateScore && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Work-Life Balance:</span>
                          <span className="font-medium">{company.aggregateScore.workLifeBalance.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to explore?</h3>
          <p className="text-lg mb-6 opacity-90">
            Start comparing company cultures and find your perfect workplace fit.
          </p>
          <Link href="/heatmap">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
              View Heat Map
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-8">
        <div className="container mx-auto px-4 text-center text-slate-600 text-sm">
          <p>Culture Heat Map © 2026. Helping job seekers find their ideal workplace.</p>
        </div>
      </footer>
    </div>
  );
}
