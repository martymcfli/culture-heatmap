/**
 * LinkedIn Job Searcher Service using RapidAPI
 * Handles all job search queries with customizable parameters
 */

export interface LinkedInJobSearchParams {
  title_filter?: string;
  location_filter?: string;
  description_filter?: string;
  organization_description_filter?: string;
  organization_specialties_filter?: string;
  organization_slug_filter?: string;
  type_filter?: string; // CONTRACTOR, FULL_TIME, INTERN, OTHER, PART_TIME, TEMPORARY, VOLUNTEER
  description_type?: string; // 'text' to include full descriptions
  remote?: boolean;
  industry_filter?: string;
  seniority_filter?: string;
  agency?: boolean;
  limit?: number; // 1-100, default 20
  offset?: number; // For pagination
  date_filter?: string; // ISO date format
  directapply?: boolean;
  employees_gte?: number;
  employees_lte?: number;
  order?: string; // 'asc' or 'desc' (default)
  advanced_title_filter?: string;
  include_ai?: boolean;
  ai_work_arrangement_filter?: string;
  ai_experience_level_filter?: string;
  ai_visa_sponsorship_filter?: boolean;
  organization_filter?: string;
}

export interface LinkedInJob {
  job_id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  seniority_level?: string;
  posted_date?: string;
  description?: string;
  apply_url?: string;
  company_logo_url?: string;
  remote?: boolean;
  ai_work_arrangement?: string;
  ai_experience_level?: string;
  ai_visa_sponsorship?: boolean;
}

export interface LinkedInJobSearchResponse {
  jobs: LinkedInJob[];
  total_count?: number;
  has_more?: boolean;
}

/**
 * Search for jobs on LinkedIn using RapidAPI
 */
export async function searchLinkedInJobs(
  params: LinkedInJobSearchParams
): Promise<LinkedInJobSearchResponse> {
  const apiKey = process.env.RAPIDAPI_LINKEDIN_JOBS_KEY;
  const apiHost = "linkedin-job-search-api.p.rapidapi.com";

  if (!apiKey) {
    console.warn("[LinkedIn Jobs] API key not configured. Please set RAPIDAPI_LINKEDIN_JOBS_KEY environment variable.");
    return { jobs: [] };
  }

  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();

    // Add all optional parameters if they exist
    if (params.title_filter) queryParams.append("title_filter", params.title_filter);
    if (params.location_filter) queryParams.append("location_filter", params.location_filter);
    if (params.description_filter) queryParams.append("description_filter", params.description_filter);
    if (params.organization_description_filter)
      queryParams.append("organization_description_filter", params.organization_description_filter);
    if (params.organization_specialties_filter)
      queryParams.append("organization_specialties_filter", params.organization_specialties_filter);
    if (params.organization_slug_filter)
      queryParams.append("organization_slug_filter", params.organization_slug_filter);
    if (params.type_filter) queryParams.append("type_filter", params.type_filter);
    if (params.description_type) queryParams.append("description_type", params.description_type);
    if (params.remote !== undefined) queryParams.append("remote", String(params.remote));
    if (params.industry_filter) queryParams.append("industry_filter", params.industry_filter);
    if (params.seniority_filter) queryParams.append("seniority_filter", params.seniority_filter);
    if (params.agency !== undefined) queryParams.append("agency", String(params.agency));
    if (params.limit) queryParams.append("limit", String(Math.min(params.limit, 100)));
    if (params.offset) queryParams.append("offset", String(params.offset));
    if (params.date_filter) queryParams.append("date_filter", params.date_filter);
    if (params.directapply !== undefined) queryParams.append("directapply", String(params.directapply));
    if (params.employees_gte) queryParams.append("employees_gte", String(params.employees_gte));
    if (params.employees_lte) queryParams.append("employees_lte", String(params.employees_lte));
    if (params.order) queryParams.append("order", params.order);
    if (params.advanced_title_filter)
      queryParams.append("advanced_title_filter", params.advanced_title_filter);
    if (params.include_ai) queryParams.append("include_ai", String(params.include_ai));
    if (params.ai_work_arrangement_filter)
      queryParams.append("ai_work_arrangement_filter", params.ai_work_arrangement_filter);
    if (params.ai_experience_level_filter)
      queryParams.append("ai_experience_level_filter", params.ai_experience_level_filter);
    if (params.ai_visa_sponsorship_filter)
      queryParams.append("ai_visa_sponsorship_filter", String(params.ai_visa_sponsorship_filter));
    if (params.organization_filter) queryParams.append("organization_filter", params.organization_filter);

    const url = `https://${apiHost}/search?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
      },
    });

    if (!response.ok) {
      console.error(`[LinkedIn Jobs] API error: ${response.status} ${response.statusText}`);
      return { jobs: [] };
    }

    const data = await response.json();

    // Transform API response to our format
    const jobs: LinkedInJob[] = (data.data || []).map((job: any) => ({
      job_id: job.job_id || job.id,
      title: job.job_title || job.title,
      company: job.company_name || job.company,
      location: job.job_location || job.location,
      job_type: job.job_employment_type || job.type,
      seniority_level: job.seniority_level,
      posted_date: job.job_posted_date,
      description: job.job_description,
      apply_url: job.job_apply_link || job.apply_url,
      company_logo_url: job.company_logo_url,
      remote: job.job_is_remote,
      ai_work_arrangement: job.ai_work_arrangement,
      ai_experience_level: job.ai_experience_level,
      ai_visa_sponsorship: job.ai_visa_sponsorship,
    }));

    return {
      jobs,
      total_count: data.total_count,
      has_more: data.has_more,
    };
  } catch (error) {
    console.error("[LinkedIn Jobs] Error searching jobs:", error);
    return { jobs: [] };
  }
}

/**
 * Get job details for a specific job
 */
export async function getLinkedInJobDetails(jobId: string): Promise<LinkedInJob | null> {
  const apiKey = process.env.RAPIDAPI_LINKEDIN_JOBS_KEY;
  const apiHost = "linkedin-job-search-api.p.rapidapi.com";

  if (!apiKey) {
    console.warn("[LinkedIn Jobs] API key not configured");
    return null;
  }

  try {
    const url = `https://${apiHost}/job/${jobId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      job_id: data.job_id || data.id,
      title: data.job_title || data.title,
      company: data.company_name || data.company,
      location: data.job_location || data.location,
      job_type: data.job_employment_type || data.type,
      seniority_level: data.seniority_level,
      posted_date: data.job_posted_date,
      description: data.job_description,
      apply_url: data.job_apply_link || data.apply_url,
      company_logo_url: data.company_logo_url,
      remote: data.job_is_remote,
      ai_work_arrangement: data.ai_work_arrangement,
      ai_experience_level: data.ai_experience_level,
      ai_visa_sponsorship: data.ai_visa_sponsorship,
    };
  } catch (error) {
    console.error("[LinkedIn Jobs] Error fetching job details:", error);
    return null;
  }
}
