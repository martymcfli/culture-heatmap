// Using built-in fetch (Node 18+)

interface JSearchJob {
  job_id: string;
  job_title: string;
  job_description: string;
  job_apply_link: string;
  job_apply_is_direct: boolean;
  job_apply_quality_score: number;
  employer_name: string;
  employer_logo: string;
  employer_website: string;
  employer_company_type: string;
  job_country: string;
  job_state: string;
  job_city: string;
  job_posted_at_timestamp: number;
  job_posted_at_datetime_utc: string;
  job_posted_at_datetime_local: string;
  job_salary_currency: string;
  job_salary_period: string;
  job_salary_min: number;
  job_salary_max: number;
  job_salary_raw: string;
  job_highlights: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
  job_job_title: string;
  job_employment_type: string;
  job_required_experience: {
    no_experience_required: boolean;
    required_experience_in_months: number;
  };
  job_required_skills: string[];
  job_is_remote: boolean;
  job_offer_expiration_datetime_utc: string;
  job_offer_expiration_timestamp: number;
  job_google_apply_link: string;
  job_posting_language: string;
  job_search_score: number;
}

interface JSearchResponse {
  status: string;
  request_id: string;
  parameters: {
    query: string;
    page: number;
    num_pages: number;
    country: string;
    date_posted: string;
  };
  data: JSearchJob[];
  job_count: number;
}

export async function searchJSearchJobs(input: {
  query?: string;
  page?: number;
  num_pages?: number;
  country?: string;
  date_posted?: string;
}): Promise<JSearchResponse> {
  const {
    query = 'software engineer jobs',
    page = 1,
    num_pages = 1,
    country = 'us',
    date_posted = 'all',
  } = input;

  const apiKey = process.env.RAPIDAPI_JSEARCH_KEY;
  const apiHost = process.env.RAPIDAPI_JSEARCH_HOST || 'jsearch.p.rapidapi.com';

  if (!apiKey) {
    throw new Error('RAPIDAPI_JSEARCH_KEY environment variable is not set');
  }

  try {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      num_pages: num_pages.toString(),
      country,
      date_posted,
    });

    const url = `https://jsearch.p.rapidapi.com/search?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': apiHost,
        'x-rapidapi-key': apiKey,
      },
    });

    if (!response.ok) {
      console.error(`[JSearch Jobs] API error: ${response.status} ${response.statusText}`);
      throw new Error(`JSearch API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as JSearchResponse;
    return data;
  } catch (error) {
    console.error('[JSearch Jobs] Search error:', error);
    throw error;
  }
}
