import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Glassdoor Integration", { timeout: 15000 }, () => {
  it("should fetch company interviews from cache", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Test with a valid company ID - should return cached data or empty array
    const interviews = await caller.glassdoor.getCompanyInterviews(1);

    expect(Array.isArray(interviews)).toBe(true);
    expect(interviews).toBeDefined();
  });

  it("should fetch Glassdoor metrics for a company", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const metrics = await caller.glassdoor.getMetrics(1);

    // Metrics may be null if not cached, but should not throw
    expect(metrics === null || typeof metrics === "object").toBe(true);

    if (metrics) {
      expect(metrics).toHaveProperty("companyId");
      expect(metrics).toHaveProperty("companyName");
    }
  });

  it("should fetch interviews by job title", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const interviews = await caller.glassdoor.getInterviewsByJobTitle({
      companyId: 1,
      jobTitle: "Software Engineer",
    });

    expect(Array.isArray(interviews)).toBe(true);
    expect(interviews).toBeDefined();
  });

  it("should handle fetchAndCache mutation gracefully", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.glassdoor.fetchAndCache({
      companyId: 1,
      companyName: "Google",
    });

    expect(result).toHaveProperty("success");
    expect(typeof result.success).toBe("boolean");
    
    // Result can be success or failure depending on API rate limits
    if (result.success) {
      expect(result).toHaveProperty("interviewsCount");
      expect(typeof result.interviewsCount).toBe("number");
    } else {
      expect(result).toHaveProperty("error");
    }
  });

  it("should handle invalid company gracefully", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.glassdoor.fetchAndCache({
      companyId: 9999,
      companyName: "NonExistentCompanyXYZ123",
    });

    // Should either succeed with 0 interviews or fail gracefully
    expect(result).toHaveProperty("success");
    expect(typeof result.success).toBe("boolean");
  });

  it("should return properly structured interview data if available", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const interviews = await caller.glassdoor.getCompanyInterviews(1);

    if (interviews && interviews.length > 0) {
      const interview = interviews[0];
      expect(interview).toHaveProperty("id");
      expect(interview).toHaveProperty("companyId");
      expect(interview).toHaveProperty("jobTitle");
      expect(interview).toHaveProperty("interviewType");
      expect(interview).toHaveProperty("difficulty");
    }
  });
});
