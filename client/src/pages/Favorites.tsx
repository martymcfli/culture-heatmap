import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Favorites() {
  const { user, isAuthenticated, loading } = useAuth();
  const { data: favorites, isLoading } = trpc.favorites.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to view your favorite companies</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">My Favorites</h1>
            <p className="text-foreground/60 mt-1">Companies you've saved for later</p>
          </div>
        </div>

        {!favorites || favorites.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Favorites Yet</h3>
              <p className="text-slate-600 mb-6">
                Start adding companies to your favorites to keep track of your top choices
              </p>
              <Link href="/heatmap">
                <Button>Browse Companies</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((company: any) => (
              <Link key={company.id} href={`/company/${company.id}`}>
                <Card className="h-full hover:shadow-lg transition cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <CardDescription>{company.industry}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p><span className="font-medium">Size:</span> {company.sizeRange}</p>
                      <p><span className="font-medium">Location:</span> {company.headquartersCity}, {company.headquartersState}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
