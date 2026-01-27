import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Trash2, Edit2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";

export default function SavedComparisons() {
  const { user, isAuthenticated, loading } = useAuth();
  const { data: comparisons, isLoading, refetch } = trpc.comparisons.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const deleteComparison = trpc.comparisons.delete.useMutation({
    onSuccess: () => {
      toast.success("Comparison deleted");
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete comparison");
    },
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to view your saved comparisons</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Saved Comparisons</h1>
            <p className="text-slate-600 mt-1">Your company comparison sets</p>
          </div>
        </div>

        {!comparisons || comparisons.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center">
              <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">⚖️</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Saved Comparisons</h3>
              <p className="text-slate-600 mb-6">
                Create a comparison to analyze multiple companies side by side
              </p>
              <Link href="/comparison">
                <Button>Create Comparison</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {comparisons.map((comparison: any) => (
              <Card key={comparison.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{comparison.comparisonName}</CardTitle>
                      <CardDescription>
                        {JSON.parse(comparison.companyIds || "[]").length} companies compared
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/comparison?ids=${comparison.companyIds}`}>
                        <Button variant="outline" size="sm">
                          <Edit2 className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteComparison.mutate(comparison.id)}
                        disabled={deleteComparison.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {comparison.notes && (
                    <p className="text-sm text-slate-600">{comparison.notes}</p>
                  )}
                  <div className="mt-3 text-xs text-slate-500">
                    Saved {new Date(comparison.savedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
