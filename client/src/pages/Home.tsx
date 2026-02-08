import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Zap, Users, TrendingUp, Heart, Compass, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { data: companies, isLoading: companiesLoading } = trpc.companies.list.useQuery();

  const featuredCompanies = companies?.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Network Background */}
      <div
        className="fixed inset-0 z-0 opacity-70"
        style={{
          backgroundImage: "url(/network-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background/50 via-background/40 to-background/60" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-md bg-background/40">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center glow">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Culture Heat Map
              </h1>
            </div>

            <nav className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/heatmap">
                    <Button variant="ghost" className="text-foreground hover:text-blue-400 transition-colors">
                      Explore
                    </Button>
                  </Link>
                  <Link href="/jobs">
                    <Button variant="ghost" className="text-foreground hover:text-cyan-400 transition-colors">
                      Jobs
                    </Button>
                  </Link>
                  <Link href="/favorites">
                    <Button variant="ghost" size="icon" className="text-foreground hover:text-pink-400 transition-colors">
                      <Heart className="w-5 h-5" />
                    </Button>
                  </Link>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold glow">
                    {user?.name?.[0] || "U"}
                  </div>
                </>
              ) : (
                <a href={getLoginUrl()}>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 glow">
                    Sign In
                  </Button>
                </a>
              )}
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-float">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-foreground/80">Discover Your Ideal Workplace</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Explore Company Cultures
              </span>
              <br />
              <span className="text-foreground">Make Informed Decisions</span>
            </h2>

            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
              Discover and compare workplace environments across 300+ leading S&P 500 companies spanning 15+ industries including technology, healthcare, finance, energy, retail, and more. Access aggregated ratings from
              Glassdoor, Indeed, and Comparably to find companies that match your values and career goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {isAuthenticated ? (
                <>
                  <Link href="/heatmap">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold glow"
                    >
                      Explore Heat Map
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/browse">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/20 text-foreground hover:bg-white/5"
                    >
                      Browse Companies
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/demo">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold glow"
                    >
                      Try Demo
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <a href={getLoginUrl()}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/20 text-foreground hover:bg-white/5"
                    >
                      Sign In
                    </Button>
                  </a>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Interactive Visualization",
                description: "See company culture scores at a glance with our color-coded heat map visualization.",
                color: "from-blue-400 to-cyan-400",
              },
              {
                icon: Users,
                title: "Multi-Source Data",
                description: "Aggregated ratings from Glassdoor, Indeed, and Comparably for comprehensive insights.",
                color: "from-purple-400 to-pink-400",
              },
              {
                icon: TrendingUp,
                title: "Trend Analysis",
                description: "Track how company cultures evolve over time with historical trend data.",
                color: "from-green-400 to-cyan-400",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                >
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-2.5 mb-4 group-hover:scale-110 transition-transform glow`}
                    >
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <CardTitle className="text-foreground">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-foreground/60">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Featured Companies */}
        {!companiesLoading && featuredCompanies.length > 0 && (
          <section className="container mx-auto px-4 py-20">
            <h3 className="text-3xl font-bold mb-8">Featured Companies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCompanies.map((company) => (
                <Link key={company.id} href={`/company/${company.id}`}>
                  <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all h-full group cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <CardTitle className="text-foreground group-hover:text-blue-400 transition-colors">
                            {company.name}
                          </CardTitle>
                          <CardDescription className="text-foreground/60">{company.industry}</CardDescription>
                        </div>
                        {company.aggregateScore && (
                          <div className="px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-400/20 to-purple-400/20 text-blue-300">
                            {company.aggregateScore.overallRating?.toFixed(1) || "N/A"}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground/60">Location:</span>
                          <span className="text-foreground font-medium">
                            {company.headquartersCity}, {company.headquartersState}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/60">Size:</span>
                          <span className="text-foreground font-medium">{company.sizeRange}</span>
                        </div>
                        {company.aggregateScore && (
                          <div className="flex justify-between">
                            <span className="text-foreground/60">Work-Life:</span>
                            <span className="text-foreground font-medium">
                              {company.aggregateScore.workLifeBalance?.toFixed(1) || "N/A"}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Companies", value: "300+" },
              { label: "Reviews", value: "10K+" },
              { label: "Data Sources", value: "3" },
              { label: "Active Users", value: "1K+" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-foreground/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />

            <div className="relative z-10 p-12 md:p-16 text-center border border-white/10 backdrop-blur-sm rounded-2xl">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Explore?</h3>
              <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
                Start discovering companies that align with your career goals and values today.
              </p>

              {!isAuthenticated ? (
                <Link href="/demo">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold glow"
                  >
                    Try Demo (No Sign-Up Required)
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link href="/heatmap">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold glow"
                  >
                    View Heat Map
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 backdrop-blur-md bg-background/40 py-8 mt-20">
          <div className="container mx-auto px-4 text-center text-foreground/60 text-sm">
            <p>© 2026 Culture Heat Map. Helping you find your ideal workplace.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
