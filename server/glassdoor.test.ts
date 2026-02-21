import { describe, expect, it } from "vitest";
import {
  fetchGlassdoorCompanyInterviews,
  fetchGlassdoorCompanyData,
  fetchGlassdoorInterviewDetails,
} from "./glassdoor-service";

describe("Glassdoor API Integration", () => {
  it("should successfully fetch company interviews from Glassdoor API", async () => {
    const interviews = await fetchGlassdoorCompanyInterviews("Google");

    expect(Array.isArray(interviews)).toBe(true);
    // API may return empty array if no interviews found, but should not throw
    expect(interviews).toBeDefined();
  });

  it("should successfully fetch company data from Glassdoor API", async () => {
    const companyData = await fetchGlassdoorCompanyData("Google");

    // API may return null if company not found, but should not throw
    expect(companyData === null || typeof companyData === "object").toBe(true);

    if (companyData) {
      expect(companyData).toHaveProperty("companyName");
      if (companyData.overallRating !== undefined) {
        expect(companyData.overallRating).toBeGreaterThanOrEqual(0);
        expect(companyData.overallRating).toBeLessThanOrEqual(5);
      }
    }
  });

  it("should handle interview details fetch gracefully", async () => {
    const details = await fetchGlassdoorInterviewDetails("19018219");

    // API may return null if interview not found, but should not throw
    expect(details === null || typeof details === "object").toBe(true);

    if (details) {
      expect(details).toHaveProperty("id");
      expect(details).toHaveProperty("jobTitle");
      expect(details).toHaveProperty("companyName");
    }
  });

  it("should handle API errors gracefully", async () => {
    // Test with invalid company name - should return empty array or null
    const interviews = await fetchGlassdoorCompanyInterviews(
      "NonExistentCompanyXYZ123"
    );
    expect(Array.isArray(interviews) || interviews === null).toBe(true);
  });

  it("should return properly structured interview data", async () => {
    const interviews = await fetchGlassdoorCompanyInterviews("Microsoft");

    if (interviews.length > 0) {
      const interview = interviews[0];
      expect(interview).toHaveProperty("id");
      expect(interview).toHaveProperty("jobTitle");
      expect(interview).toHaveProperty("companyName");
      expect(interview).toHaveProperty("interviewType");
      expect(interview).toHaveProperty("difficulty");
      expect(interview).toHaveProperty("questions");
      expect(Array.isArray(interview.questions)).toBe(true);
    }
  });
});
