import { Loader2, ExternalLink, MapPin, Briefcase, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

interface JobOpeningsProps {
  companyId: number;
}

export default function JobOpenings({ companyId }: JobOpeningsProps) {
  const { data: jobs, isLoading } = trpc.jobs.getByCompany.useQuery(companyId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Open Positions</CardTitle>
          <CardDescription>No open positions currently listed</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Open Positions</CardTitle>
        <CardDescription>{jobs.length} active job openings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job: any) => (
            <div key={job.id} className="border rounded-lg p-4 hover:bg-slate-50 transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-slate-900">{job.jobTitle}</h4>
                  <p className="text-sm text-slate-600 mt-1">{job.jobType || "Full-time"}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="ml-2"
                >
                  <a href={job.externalUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Apply
                  </a>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                {job.location && (
                  <div className="flex items-center text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    {job.location}
                  </div>
                )}
                {job.jobType && (
                  <div className="flex items-center text-slate-600">
                    <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                    {job.jobType}
                  </div>
                )}
                {job.salaryMin && job.salaryMax && (
                  <div className="flex items-center text-slate-600">
                    <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                    ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                  </div>
                )}
              </div>

              {job.jobDescription && (
                <p className="text-sm text-slate-700 mb-3 line-clamp-2">{job.jobDescription}</p>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                <span className="capitalize bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {job.source || "Direct"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
