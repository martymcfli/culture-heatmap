import { ENV } from "./_core/env";

export interface GlassdoorInterviewDetail {
  id: string;
  jobTitle: string;
  companyName: string;
  interviewDate: string;
  interviewType: string;
  difficulty: string;
  duration: string;
  questions: string[];
  experience: string;
  outcome: string;
}

export interface GlassdoorCompanyData {
  companyId: number;
  companyName: string;
  overallRating: number;
  ceoApproval: number;
  recommendToFriend: number;
  salaryEstimate?: {
    min: number;
    max: number;
    currency: string;
  };
  interviews: GlassdoorInterviewDetail[];
  reviews: Array<{
    title: string;
    rating: number;
    summary: string;
    pros: string;
    cons: string;
  }>;
}

/**
 * Fetch company interviews from Glassdoor API
 */
export async function fetchGlassdoorCompanyInterviews(
  companyName: string
): Promise<GlassdoorInterviewDetail[]> {
  if (!ENV.glassdoorApiKey || !ENV.glassdoorApiHost) {
    console.warn("[Glassdoor] API credentials not configured");
    return [];
  }

  try {
    const url = `https://${ENV.glassdoorApiHost}/companies/interviews`;
    const params = new URLSearchParams({
      companyName: companyName,
    });

    const response = await fetch(`${url}?${params}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": ENV.glassdoorApiKey,
        "x-rapidapi-host": ENV.glassdoorApiHost,
      },
    });

    if (!response.ok) {
      console.warn(
        `[Glassdoor] API returned status ${response.status} for ${companyName}`
      );
      return [];
    }

    const data = await response.json();

    // Extract interviews from the response
    const interviews: GlassdoorInterviewDetail[] = [];

    if (
      data.data &&
      data.data.employerInterviews &&
      data.data.employerInterviews.interviews
    ) {
      data.data.employerInterviews.interviews.forEach((interview: any) => {
        interviews.push({
          id: interview.id?.toString() || "",
          jobTitle: interview.jobTitle || "Unknown",
          companyName: companyName,
          interviewDate: interview.interviewDate || "",
          interviewType: interview.interviewType || "Unknown",
          difficulty: interview.difficulty || "Not specified",
          duration: interview.duration || "Unknown",
          questions: interview.questions || [],
          experience: interview.experience || "",
          outcome: interview.outcome || "Not specified",
        });
      });
    }

    return interviews;
  } catch (error) {
    console.error(
      `[Glassdoor] Error fetching interviews for ${companyName}:`,
      error
    );
    return [];
  }
}

/**
 * Fetch interview details from Glassdoor API
 */
export async function fetchGlassdoorInterviewDetails(
  interviewId: string
): Promise<GlassdoorInterviewDetail | null> {
  if (!ENV.glassdoorApiKey || !ENV.glassdoorApiHost) {
    console.warn("[Glassdoor] API credentials not configured");
    return null;
  }

  try {
    const url = `https://${ENV.glassdoorApiHost}/companies/interview-details`;
    const params = new URLSearchParams({
      interviewId: interviewId,
    });

    const response = await fetch(`${url}?${params}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": ENV.glassdoorApiKey,
        "x-rapidapi-host": ENV.glassdoorApiHost,
      },
    });

    if (!response.ok) {
      console.warn(
        `[Glassdoor] API returned status ${response.status} for interview ${interviewId}`
      );
      return null;
    }

    const data = await response.json();

    if (data.data) {
      return {
        id: data.data.id?.toString() || interviewId,
        jobTitle: data.data.jobTitle || "Unknown",
        companyName: data.data.companyName || "Unknown",
        interviewDate: data.data.interviewDate || "",
        interviewType: data.data.interviewType || "Unknown",
        difficulty: data.data.difficulty || "Not specified",
        duration: data.data.duration || "Unknown",
        questions: data.data.questions || [],
        experience: data.data.experience || "",
        outcome: data.data.outcome || "Not specified",
      };
    }

    return null;
  } catch (error) {
    console.error(
      `[Glassdoor] Error fetching interview details for ${interviewId}:`,
      error
    );
    return null;
  }
}

/**
 * Fetch company reviews and ratings from Glassdoor API
 */
export async function fetchGlassdoorCompanyData(
  companyName: string
): Promise<Partial<GlassdoorCompanyData> | null> {
  if (!ENV.glassdoorApiKey || !ENV.glassdoorApiHost) {
    console.warn("[Glassdoor] API credentials not configured");
    return null;
  }

  try {
    const url = `https://${ENV.glassdoorApiHost}/companies`;
    const params = new URLSearchParams({
      companyName: companyName,
    });

    const response = await fetch(`${url}?${params}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": ENV.glassdoorApiKey,
        "x-rapidapi-host": ENV.glassdoorApiHost,
      },
    });

    if (!response.ok) {
      console.warn(
        `[Glassdoor] API returned status ${response.status} for ${companyName}`
      );
      return null;
    }

    const data = await response.json();

    if (data.data && data.data[0]) {
      const company = data.data[0];
      return {
        companyName: company.name || companyName,
        overallRating: parseFloat(company.overallRating) || 0,
        ceoApproval: parseFloat(company.ceoApproval) || 0,
        recommendToFriend: parseFloat(company.recommendToFriend) || 0,
        salaryEstimate: company.salaryEstimate
          ? {
              min: company.salaryEstimate.min || 0,
              max: company.salaryEstimate.max || 0,
              currency: company.salaryEstimate.currency || "USD",
            }
          : undefined,
      };
    }

    return null;
  } catch (error) {
    console.error(
      `[Glassdoor] Error fetching company data for ${companyName}:`,
      error
    );
    return null;
  }
}
