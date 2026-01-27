import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ReviewFormProps {
  companyId: number;
  onSuccess?: () => void;
}

export default function ReviewForm({ companyId, onSuccess }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    rating: 3,
    title: "",
    reviewText: "",
    pros: "",
    cons: "",
    jobTitle: "",
    employmentStatus: "current" as const,
    workLifeBalance: 3,
    compensationBenefits: 3,
    careerOpportunities: 3,
    cultureValues: 3,
    seniorManagement: 3,
  });

  const submitReviewMutation = trpc.reviews.submit.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Review submitted successfully!");
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitted(false);
        setFormData({
          rating: 3,
          title: "",
          reviewText: "",
          pros: "",
          cons: "",
          jobTitle: "",
          employmentStatus: "current",
          workLifeBalance: 3,
          compensationBenefits: 3,
          careerOpportunities: 3,
          cultureValues: 3,
          seniorManagement: 3,
        });
        onSuccess?.();
      }, 2000);
    },
    onError: (error) => {
      toast.error("Failed to submit review. Please try again.");
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReviewMutation.mutate({
      companyId,
      ...formData,
    });
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="default" className="w-full">
        Share Your Experience
      </Button>
    );
  }

  if (isSubmitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="font-semibold text-green-900 mb-2">Thank You!</h3>
          <p className="text-sm text-green-700">Your anonymous review has been submitted and will help others make informed decisions.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Experience</CardTitle>
        <CardDescription>Your review will be anonymous and help others discover great workplaces</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <div className="space-y-3">
            <Label>Overall Rating: {formData.rating}/5</Label>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[formData.rating]}
              onValueChange={(value) => setFormData({ ...formData, rating: value[0] })}
              className="w-full"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title (Optional)</Label>
            <Input
              id="title"
              placeholder="e.g., Great culture, challenging work"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={255}
            />
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="reviewText">Your Review (Optional)</Label>
            <Textarea
              id="reviewText"
              placeholder="Share your experience working at this company..."
              value={formData.reviewText}
              onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
              rows={4}
            />
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pros">Pros (Optional)</Label>
              <Textarea
                id="pros"
                placeholder="What did you like?"
                value={formData.pros}
                onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cons">Cons (Optional)</Label>
              <Textarea
                id="cons"
                placeholder="What could be improved?"
                value={formData.cons}
                onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* Employment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title (Optional)</Label>
              <Input
                id="jobTitle"
                placeholder="e.g., Software Engineer"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                maxLength={255}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentStatus">Employment Status</Label>
              <Select value={formData.employmentStatus} onValueChange={(value: any) => setFormData({ ...formData, employmentStatus: value })}>
                <SelectTrigger id="employmentStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Currently Working</SelectItem>
                  <SelectItem value="former">Former Employee</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Detailed Ratings */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-slate-900">Rate These Aspects (Optional)</h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Work-Life Balance</Label>
                  <span className="text-sm font-medium">{formData.workLifeBalance}/5</span>
                </div>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[formData.workLifeBalance]}
                  onValueChange={(value) => setFormData({ ...formData, workLifeBalance: value[0] })}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Compensation & Benefits</Label>
                  <span className="text-sm font-medium">{formData.compensationBenefits}/5</span>
                </div>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[formData.compensationBenefits]}
                  onValueChange={(value) => setFormData({ ...formData, compensationBenefits: value[0] })}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Career Opportunities</Label>
                  <span className="text-sm font-medium">{formData.careerOpportunities}/5</span>
                </div>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[formData.careerOpportunities]}
                  onValueChange={(value) => setFormData({ ...formData, careerOpportunities: value[0] })}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Culture & Values</Label>
                  <span className="text-sm font-medium">{formData.cultureValues}/5</span>
                </div>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[formData.cultureValues]}
                  onValueChange={(value) => setFormData({ ...formData, cultureValues: value[0] })}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Senior Management</Label>
                  <span className="text-sm font-medium">{formData.seniorManagement}/5</span>
                </div>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[formData.seniorManagement]}
                  onValueChange={(value) => setFormData({ ...formData, seniorManagement: value[0] })}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={submitReviewMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitReviewMutation.isPending}
              className="flex-1"
            >
              {submitReviewMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>

          <p className="text-xs text-slate-500 text-center">
            Your review will be posted anonymously. We do not collect personal information.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
