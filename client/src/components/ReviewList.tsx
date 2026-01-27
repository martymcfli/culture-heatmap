import { Loader2, ThumbsUp, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ReviewListProps {
  companyId: number;
}

const getScoreBgColor = (score: number | string | null) => {
  const numScore = typeof score === "string" ? parseFloat(score) : score;
  if (!numScore || isNaN(numScore)) return "bg-gray-100 text-gray-700";
  if (numScore >= 4.5) return "bg-green-100 text-green-700";
  if (numScore >= 4.0) return "bg-blue-100 text-blue-700";
  if (numScore >= 3.5) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
};

const getEmploymentStatusLabel = (status: string | null) => {
  if (!status) return "";
  switch (status) {
    case "current":
      return "Currently Working";
    case "former":
      return "Former Employee";
    case "interviewing":
      return "Interviewing";
    default:
      return status;
  }
};

export default function ReviewList({ companyId }: ReviewListProps) {
  const { data: reviews, isLoading } = trpc.reviews.getByCompany.useQuery({
    companyId,
    limit: 10,
  });

  const { data: stats } = trpc.reviews.getStats.useQuery(companyId);

  const flagReviewMutation = trpc.reviews.flag.useMutation({
    onSuccess: () => {
      toast.success("Review flagged for review");
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Community Reviews</CardTitle>
            <CardDescription>{stats.totalReviews} reviews from employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Overall</div>
                <div className={`text-2xl font-bold ${getScoreBgColor(stats.averageRating)}`}>
                  {parseFloat(String(stats.averageRating)).toFixed(1)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Work-Life</div>
                <div className={`text-2xl font-bold ${getScoreBgColor(stats.averageWorkLifeBalance)}`}>
                  {parseFloat(String(stats.averageWorkLifeBalance)).toFixed(1)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Compensation</div>
                <div className={`text-2xl font-bold ${getScoreBgColor(stats.averageCompensation)}`}>
                  {parseFloat(String(stats.averageCompensation)).toFixed(1)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Career</div>
                <div className={`text-2xl font-bold ${getScoreBgColor(stats.averageCareer)}`}>
                  {parseFloat(String(stats.averageCareer)).toFixed(1)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Culture</div>
                <div className={`text-2xl font-bold ${getScoreBgColor(stats.averageCulture)}`}>
                  {parseFloat(String(stats.averageCulture)).toFixed(1)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Management</div>
                <div className={`text-2xl font-bold ${getScoreBgColor(stats.averageManagement)}`}>
                  {parseFloat(String(stats.averageManagement)).toFixed(1)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-slate-900">Recent Reviews</h3>
        {reviews && reviews.length > 0 ? (
          reviews.map((review: any) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      {review.title && (
                        <h4 className="font-semibold text-slate-900 mb-1">{review.title}</h4>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        {review.jobTitle && <span>{review.jobTitle}</span>}
                        {review.employmentStatus && (
                          <>
                            {review.jobTitle && <span>•</span>}
                            <span>{getEmploymentStatusLabel(review.employmentStatus)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreBgColor(review.rating)}`}>
                      {parseFloat(String(review.rating)).toFixed(1)}
                    </div>
                  </div>

                  {/* Review Text */}
                  {review.reviewText && (
                    <p className="text-slate-700">{review.reviewText}</p>
                  )}

                  {/* Pros and Cons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {review.pros && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-green-900 mb-1">Pros</p>
                        <p className="text-sm text-green-800">{review.pros}</p>
                      </div>
                    )}
                    {review.cons && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-red-900 mb-1">Cons</p>
                        <p className="text-sm text-red-800">{review.cons}</p>
                      </div>
                    )}
                  </div>

                  {/* Detailed Ratings */}
                  {(review.workLifeBalance || review.compensationBenefits || review.careerOpportunities || review.cultureValues || review.seniorManagement) && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                      {review.workLifeBalance && (
                        <div className="text-center">
                          <div className="text-slate-600">Work-Life</div>
                          <div className={`font-semibold ${getScoreBgColor(review.workLifeBalance)}`}>
                            {parseFloat(String(review.workLifeBalance)).toFixed(1)}
                          </div>
                        </div>
                      )}
                      {review.compensationBenefits && (
                        <div className="text-center">
                          <div className="text-slate-600">Compensation</div>
                          <div className={`font-semibold ${getScoreBgColor(review.compensationBenefits)}`}>
                            {parseFloat(String(review.compensationBenefits)).toFixed(1)}
                          </div>
                        </div>
                      )}
                      {review.careerOpportunities && (
                        <div className="text-center">
                          <div className="text-slate-600">Career</div>
                          <div className={`font-semibold ${getScoreBgColor(review.careerOpportunities)}`}>
                            {parseFloat(String(review.careerOpportunities)).toFixed(1)}
                          </div>
                        </div>
                      )}
                      {review.cultureValues && (
                        <div className="text-center">
                          <div className="text-slate-600">Culture</div>
                          <div className={`font-semibold ${getScoreBgColor(review.cultureValues)}`}>
                            {parseFloat(String(review.cultureValues)).toFixed(1)}
                          </div>
                        </div>
                      )}
                      {review.seniorManagement && (
                        <div className="text-center">
                          <div className="text-slate-600">Management</div>
                          <div className={`font-semibold ${getScoreBgColor(review.seniorManagement)}`}>
                            {parseFloat(String(review.seniorManagement)).toFixed(1)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-xs text-slate-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 hover:text-slate-900"
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Helpful
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 hover:text-red-600"
                        onClick={() => flagReviewMutation.mutate(review.id)}
                        disabled={flagReviewMutation.isPending}
                      >
                        <Flag className="w-4 h-4 mr-1" />
                        Flag
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-slate-600">No reviews yet. Be the first to share your experience!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
