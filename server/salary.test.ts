import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user context
function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("salary router", () => {
  it("should return available job titles", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const jobTitles = await caller.salary.jobTitles();

    expect(Array.isArray(jobTitles)).toBe(true);
    expect(jobTitles.length).toBeGreaterThan(0);
    expect(jobTitles).toContain("Software Engineer");
  });

  it("should return available levels", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const levels = await caller.salary.levels();

    expect(Array.isArray(levels)).toBe(true);
    expect(levels.length).toBeGreaterThan(0);
    expect(levels).toContain("Entry");
    expect(levels).toContain("Mid");
    expect(levels).toContain("Senior");
  });

  it("should return salary statistics for a job title and level", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.salary.stats({
      jobTitle: "Software Engineer",
      level: "Mid",
    });

    expect(stats).not.toBeNull();
    if (stats) {
      expect(stats.count).toBeGreaterThan(0);
      expect(stats.average).toBeGreaterThan(0);
      expect(stats.median).toBeGreaterThan(0);
      expect(stats.min).toBeGreaterThan(0);
      expect(stats.max).toBeGreaterThan(0);
      expect(stats.p25).toBeGreaterThan(0);
      expect(stats.p75).toBeGreaterThan(0);
      expect(stats.min).toBeLessThanOrEqual(stats.median);
      expect(stats.median).toBeLessThanOrEqual(stats.max);
    }
  });

  it("should return salary comparison data", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const data = await caller.salary.compare({
      jobTitle: "Software Engineer",
      level: "Senior",
    });

    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    // Verify data structure
    const firstEntry = data[0];
    expect(firstEntry).toHaveProperty("companyId");
    expect(firstEntry).toHaveProperty("jobTitle");
    expect(firstEntry).toHaveProperty("level");
    expect(firstEntry).toHaveProperty("baseSalary");
    expect(firstEntry).toHaveProperty("bonus");
    expect(firstEntry).toHaveProperty("equity");
    expect(firstEntry).toHaveProperty("totalCompensation");
  });

  it("should filter salary data by company ID", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // Get all data first to find a company ID
    const allData = await caller.salary.compare({
      jobTitle: "Software Engineer",
      level: "Entry",
    });

    if (allData.length > 0) {
      const companyId = allData[0].companyId;

      // Filter by this company
      const filtered = await caller.salary.compare({
        jobTitle: "Software Engineer",
        level: "Entry",
        companyIds: [companyId],
      });

      expect(Array.isArray(filtered)).toBe(true);
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((d: any) => d.companyId === companyId)).toBe(true);
    }
  });

  it("should return salary data for a specific company", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // Use company ID 1 (should exist from seeding)
    const salaryData = await caller.salary.getByCompany(1);

    expect(Array.isArray(salaryData)).toBe(true);
    // Company 1 should have salary data from seeding
    if (salaryData.length > 0) {
      expect(salaryData[0]).toHaveProperty("companyId", 1);
      expect(salaryData[0]).toHaveProperty("jobTitle");
      expect(salaryData[0]).toHaveProperty("level");
    }
  });

  it("should return empty array for non-existent company", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const salaryData = await caller.salary.getByCompany(999999);

    expect(Array.isArray(salaryData)).toBe(true);
    expect(salaryData.length).toBe(0);
  });

  it("should return null for non-existent job title and level combination", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.salary.stats({
      jobTitle: "Non-Existent Job",
      level: "Non-Existent Level",
    });

    expect(stats).toBeNull();
  });
});
