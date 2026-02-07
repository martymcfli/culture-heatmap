import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, MapPin, Briefcase, Calendar, ExternalLink } from "lucide-react";

export default function JobSearch() {
  const [searchParams, setSearchParams] = useState({
    query: "",
    date_posted: "all",
    limit: 20,
    offset: 0,
  });

  const [hasSearched, setHasSearched] = useState(false);

  // Build the full params object for the API call
  const apiParams = useMemo(() => {
    return {
      query: searchParams.query || 'software engineer jobs',
      page: Math.floor(searchParams.offset / searchParams.limit) + 1,
      num_pages: 1,
      country: 'us',
      date_posted: searchParams.date_posted || 'all',
    };
  }, [searchParams]);

  // Only fetch when user has searched
  const { data: jobsData, isLoading, error } = trpc.linkedinJobs.search.useQuery(
    apiParams,
    {
      enabled: hasSearched,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    }
  );

  const handleSearch = () => {
    setSearchParams((prev) => ({ ...prev, offset: 0 }));
    setHasSearched(true);
  };

  const handleNextPage = () => {
    setSearchParams((prev) => ({
      ...prev,
      offset: prev.offset + prev.limit,
    }));
  };

  const handlePreviousPage = () => {
    setSearchParams((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }));
  };

  const jobTypeOptions = [
    { value: "FULL_TIME", label: "Full Time" },
    { value: "PART_TIME", label: "Part Time" },
    { value: "CONTRACTOR", label: "Contractor" },
    { value: "INTERN", label: "Internship" },
    { value: "TEMPORARY", label: "Temporary" },
    { value: "VOLUNTEER", label: "Volunteer" },
  ];

  const seniorityOptions = [
    { value: "Entry level", label: "Entry Level" },
    { value: "Associate", label: "Associate" },
    { value: "Mid-Senior level", label: "Mid-Senior Level" },
    { value: "Director", label: "Director" },
    { value: "Executive", label: "Executive" },
  ];

  const remoteOptions = [
    { value: "all", label: "All" },
    { value: "true", label: "Remote Only" },
    { value: "false", label: "On-Site Only" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            LinkedIn Job Search
          </h1>
          <p className="text-slate-400 mt-2">
            Search and filter jobs across LinkedIn with advanced parameters
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Filters */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-cyan-400">Search Filters</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Search Query */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Search Query
              </label>
              <Input
                placeholder="e.g., software engineer in san francisco"
                value={searchParams.query}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    query: e.target.value,
                  }))
                }
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            {/* Date Posted */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Date Posted
              </label>
              <Select
                value={searchParams.date_posted}
                onValueChange={(value) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    date_posted: value,
                  }))
                }
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="day">Last Day</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Per Page */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Results Per Page
              </label>
              <Select
                value={String(searchParams.limit)}
                onValueChange={(value) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    limit: parseInt(value),
                    offset: 0,
                  }))
                }
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 rounded-lg transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search Jobs"
            )}
          </Button>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="bg-red-900/20 border-red-700/50 p-4 mb-8">
            <p className="text-red-400">
              {error instanceof Error
                ? error.message
                : "Failed to search jobs. Please check your API key configuration."}
            </p>
          </Card>
        )}

        {/* Results */}
        {hasSearched && !isLoading && jobsData && (
          <>
            <div className="mb-6">
              <p className="text-slate-400">
                {jobsData.data.length === 0
                  ? "No jobs found matching your criteria"
                  : `Found ${jobsData.data.length} jobs`}
              </p>
            </div>

            {jobsData.data.length > 0 && (
              <>
                <div className="space-y-4 mb-8">
                  {jobsData.data.map((job) => (
                    <Card
                      key={job.job_id}
                      className="bg-slate-800/50 border-slate-700/50 hover:border-cyan-500/50 transition-all p-6 group"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                            {job.job_title}
                          </h3>
                          <p className="text-lg text-slate-300 mt-1">
                            {job.employer_name}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.job_city && (
                              <Badge
                                variant="outline"
                                className="bg-slate-700/50 border-slate-600 text-slate-300"
                              >
                                <MapPin className="w-3 h-3 mr-1" />
                                {job.job_city}
                              </Badge>
                            )}
                            {job.job_employment_type && (
                              <Badge
                                variant="outline"
                                className="bg-slate-700/50 border-slate-600 text-slate-300"
                              >
                                <Briefcase className="w-3 h-3 mr-1" />
                                {job.job_employment_type}
                              </Badge>
                            )}
                            {job.job_required_experience?.required_experience_in_months && (
                              <Badge
                                variant="outline"
                                className="bg-blue-900/50 border-blue-700 text-blue-300"
                              >
                                {job.job_required_experience?.required_experience_in_months}
                              </Badge>
                            )}
                            {job.job_is_remote && (
                              <Badge className="bg-green-900/50 border-green-700 text-green-300">
                                Remote
                              </Badge>
                            )}
                            {job.job_posted_at_datetime_utc && (
                              <Badge
                                variant="outline"
                                className="bg-slate-700/50 border-slate-600 text-slate-300"
                              >
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {job.job_apply_link && (
                          <a
                            href={job.job_apply_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all whitespace-nowrap"
                          >
                            Apply Now
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-8">
                  <Button
                    onClick={handlePreviousPage}
                    disabled={searchParams.offset === 0 || isLoading}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  >
                    ← Previous
                  </Button>

                  <span className="text-slate-400">
                    Page {Math.floor(searchParams.offset / searchParams.limit) + 1}
                  </span>

                  <Button
                    onClick={handleNextPage}
                    disabled={
                      jobsData.data.length < searchParams.limit || isLoading
                    }
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  >
                    Next →
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        {/* Empty State */}
        {!hasSearched && (
          <Card className="bg-slate-800/30 border-slate-700/30 p-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">
              Start Your Job Search
            </h3>
            <p className="text-slate-500">
              Use the filters above to search for jobs on LinkedIn. You can filter by job
              title, location, job type, seniority level, and work arrangement.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
