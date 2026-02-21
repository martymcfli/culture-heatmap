import { Loader2, ExternalLink, MapPin, Briefcase, DollarSign, MessageSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";

interface JobOpeningsProps {
  companyId: number;
  companyName: string;
}

export default function JobOpenings({ companyId, companyName }: JobOpeningsProps) {
  const [activeTab, setActiveTab] = useState("interviews");
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch traditional job openings
  const { data: jobs, isLoading: jobsLoading } = trpc.jobs.getByCompany.useQuery(companyId);

  // Fetch Glassdoor interviews
  const { data: interviews, isLoading: interviewsLoading, refetch: refetchInterviews } = trpc.glassdoor.getCompanyInterviews.useQuery(companyId);

  // Fetch and cache Glassdoor data
  const syncGlassdoor = trpc.glassdoor.fetchAndCache.useMutation({
    onSuccess: () => {
      refetchInterviews();
      setIsSyncing(false);
    },
    onError: () => {
      setIsSyncing(false);
    },
  });

  // Auto-sync Glassdoor data on component mount
  useEffect(() => {
    if (!interviews || interviews.length === 0) {
      setIsSyncing(true);
      syncGlassdoor.mutate({ companyId, companyName });
    }
  }, [companyId, companyName]);

  const isLoading = jobsLoading || interviewsLoading || isSyncing;

  if (isLoading && !jobs && !interviews) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
        </CardContent>
      </Card>
    );
  }

  const hasJobs = jobs && jobs.length > 0;
  const hasInterviews = interviews && interviews.length > 0;

  if (!hasJobs && !hasInterviews) {
    return (
      <Card className="border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white">Open Positions & Interviews</CardTitle>
          <CardDescription className="text-slate-400">No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              setIsSyncing(true);
              syncGlassdoor.mutate({ companyId, companyName });
            }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
          >
            Fetch Glassdoor Data
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Open Positions & Interviews</CardTitle>
            <CardDescription className="text-slate-400">
              {hasJobs && `${jobs.length} job openings`}
              {hasJobs && hasInterviews && " • "}
              {hasInterviews && `${interviews.length} interview experiences`}
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setIsSyncing(true);
              syncGlassdoor.mutate({ companyId, companyName });
            }}
            disabled={isSyncing}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TrendingUp className="w-4 h-4 mr-2" />}
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {hasJobs && hasInterviews ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-white/10">
              <TabsTrigger value="interviews" className="text-slate-300 data-[state=active]:text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Interviews
              </TabsTrigger>
              <TabsTrigger value="jobs" className="text-slate-300 data-[state=active]:text-white">
                <Briefcase className="w-4 h-4 mr-2" />
                Jobs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="interviews" className="space-y-4 mt-4">
              {interviews && interviews.length > 0 ? (
                interviews.map((interview: any) => (
                  <div
                    key={interview.id}
                    className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition bg-gradient-to-br from-slate-800/30 to-slate-900/30"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{interview.jobTitle}</h4>
                        <p className="text-sm text-slate-400 mt-1">{interview.interviewType || "Interview"}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        interview.difficulty === "Easy"
                          ? "bg-green-500/20 text-green-300"
                          : interview.difficulty === "Medium"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-red-500/20 text-red-300"
                      }`}>
                        {interview.difficulty || "Unknown"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                      {interview.duration && (
                        <div className="flex items-center text-slate-300">
                          <Briefcase className="w-4 h-4 mr-2 text-cyan-400" />
                          Duration: {interview.duration}
                        </div>
                      )}
                      {interview.outcome && (
                        <div className="flex items-center text-slate-300">
                          <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
                          Outcome: {interview.outcome}
                        </div>
                      )}
                    </div>

                    {interview.questions && interview.questions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-slate-300 mb-2">Sample Questions:</p>
                        <ul className="text-xs text-slate-400 space-y-1">
                          {(typeof interview.questions === "string"
                            ? JSON.parse(interview.questions)
                            : interview.questions
                          )
                            .slice(0, 2)
                            .map((q: string, i: number) => (
                              <li key={i} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span className="line-clamp-1">{q}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                    <div className="text-xs text-slate-500">
                      {interview.interviewDate
                        ? `Shared: ${new Date(interview.interviewDate).toLocaleDateString()}`
                        : "Date not specified"}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-6">No interview experiences shared yet</p>
              )}
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4 mt-4">
              {jobs && jobs.length > 0 ? (
                jobs.map((job: any) => (
                  <div
                    key={job.id}
                    className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition bg-gradient-to-br from-slate-800/30 to-slate-900/30"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{job.jobTitle}</h4>
                        <p className="text-sm text-slate-400 mt-1">{job.jobType || "Full-time"}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="ml-2 border-white/20 text-cyan-300 hover:bg-cyan-500/10"
                      >
                        <a href={job.externalUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Apply
                        </a>
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                      {job.location && (
                        <div className="flex items-center text-slate-300">
                          <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                          {job.location}
                        </div>
                      )}
                      {job.jobType && (
                        <div className="flex items-center text-slate-300">
                          <Briefcase className="w-4 h-4 mr-2 text-blue-400" />
                          {job.jobType}
                        </div>
                      )}
                      {job.salaryMin && job.salaryMax && (
                        <div className="flex items-center text-slate-300">
                          <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                          ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {job.jobDescription && (
                      <p className="text-sm text-slate-400 mb-3 line-clamp-2">{job.jobDescription}</p>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                      <span className="capitalize bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        {job.source || "Direct"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-6">No job openings currently listed</p>
              )}
            </TabsContent>
          </Tabs>
        ) : hasInterviews ? (
          <div className="space-y-4">
            {interviews && interviews.map((interview: any) => (
              <div
                key={interview.id}
                className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition bg-gradient-to-br from-slate-800/30 to-slate-900/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{interview.jobTitle}</h4>
                    <p className="text-sm text-slate-400 mt-1">{interview.interviewType || "Interview"}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    interview.difficulty === "Easy"
                      ? "bg-green-500/20 text-green-300"
                      : interview.difficulty === "Medium"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-red-500/20 text-red-300"
                  }`}>
                    {interview.difficulty || "Unknown"}
                  </span>
                </div>

                {interview.questions && interview.questions.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-300 mb-2">Sample Questions:</p>
                    <ul className="text-xs text-slate-400 space-y-1">
                      {(typeof interview.questions === "string"
                        ? JSON.parse(interview.questions)
                        : interview.questions
                      )
                        .slice(0, 3)
                        .map((q: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span className="line-clamp-1">{q}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {jobs && jobs.map((job: any) => (
              <div
                key={job.id}
                className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition bg-gradient-to-br from-slate-800/30 to-slate-900/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{job.jobTitle}</h4>
                    <p className="text-sm text-slate-400 mt-1">{job.jobType || "Full-time"}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="ml-2 border-white/20 text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <a href={job.externalUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Apply
                    </a>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  {job.location && (
                    <div className="flex items-center text-slate-300">
                      <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                      {job.location}
                    </div>
                  )}
                  {job.salaryMin && job.salaryMax && (
                    <div className="flex items-center text-slate-300">
                      <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                      ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
