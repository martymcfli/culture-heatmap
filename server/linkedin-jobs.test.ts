import { describe, it, expect, vi } from "vitest";
import { searchLinkedInJobs } from "./linkedin-jobs-service";

vi.setConfig({ testTimeout: 15000 });

describe("LinkedIn Jobs API", () => {
  it("should have RAPIDAPI_LINKEDIN_JOBS_KEY in environment", () => {
    expect(process.env.RAPIDAPI_LINKEDIN_JOBS_KEY).toBeDefined();
    expect(process.env.RAPIDAPI_LINKEDIN_JOBS_KEY?.length).toBeGreaterThan(10);
  });

  it("should search for jobs with basic parameters", async () => {
    const result = await searchLinkedInJobs({
      title_filter: "Software Engineer",
      location_filter: "United States",
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.jobs)).toBe(true);
  });

  it("should handle empty search results gracefully", async () => {
    const result = await searchLinkedInJobs({
      title_filter: "XYZ_NONEXISTENT_JOB_TITLE_12345",
      limit: 10,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.jobs)).toBe(true);
  });

  it("should support filtering by job type", async () => {
    const result = await searchLinkedInJobs({
      type_filter: "FULL_TIME",
      location_filter: "United States",
      limit: 5,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.jobs)).toBe(true);
  });

  it("should support filtering by seniority level", async () => {
    const result = await searchLinkedInJobs({
      seniority_filter: "Entry level",
      location_filter: "United States",
      limit: 5,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.jobs)).toBe(true);
  });

  it("should support remote job filtering", async () => {
    const result = await searchLinkedInJobs({
      remote: true,
      limit: 5,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.jobs)).toBe(true);
  });

  it("should support pagination with offset", async () => {
    const result = await searchLinkedInJobs({
      title_filter: "Engineer",
      location_filter: "United States",
      limit: 10,
      offset: 0,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result.jobs)).toBe(true);
  });
});
