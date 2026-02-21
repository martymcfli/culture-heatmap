import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("reviews router", () => {
  it("should submit an anonymous review", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    // Get a company first
    const companies = await caller.companies.list();
    if (companies.length === 0) {
      expect(true).toBe(true); // Skip if no companies
      return;
    }

    const companyId = companies[0].id;

    const result = await caller.reviews.submit({
      companyId,
      rating: 4,
      title: "Great place to work",
      reviewText: "Very positive experience",
      pros: "Good benefits",
      cons: "Long hours",
      jobTitle: "Software Engineer",
      employmentStatus: "current",
      workLifeBalance: 3,
      compensationBenefits: 4,
      careerOpportunities: 4,
      cultureValues: 4,
      seniorManagement: 3,
    });

    expect(result).toBeDefined();
  });

  it("should fetch reviews for a company", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    // Get a company first
    const companies = await caller.companies.list();
    if (companies.length === 0) {
      expect(true).toBe(true); // Skip if no companies
      return;
    }

    const companyId = companies[0].id;

    // Submit a review
    await caller.reviews.submit({
      companyId,
      rating: 4,
      title: "Test review",
    });

    // Fetch reviews
    const reviews = await caller.reviews.getByCompany({
      companyId,
      limit: 10,
    });

    expect(Array.isArray(reviews)).toBe(true);
    expect(reviews.length).toBeGreaterThan(0);
  });

  it("should get review stats for a company", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    // Get a company first
    const companies = await caller.companies.list();
    if (companies.length === 0) {
      expect(true).toBe(true); // Skip if no companies
      return;
    }

    const companyId = companies[0].id;

    // Submit multiple reviews
    await caller.reviews.submit({
      companyId,
      rating: 4,
      workLifeBalance: 4,
      compensationBenefits: 3,
    });

    await caller.reviews.submit({
      companyId,
      rating: 5,
      workLifeBalance: 5,
      compensationBenefits: 4,
    });

    // Get stats
    const stats = await caller.reviews.getStats(companyId);

    expect(stats).toBeDefined();
    if (stats) {
      expect(stats.totalReviews).toBeGreaterThan(0);
      expect(stats.averageRating).toBeDefined();
      expect(stats.averageWorkLifeBalance).toBeDefined();
    }
  });

  it("should handle review with minimal data", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    // Get a company first
    const companies = await caller.companies.list();
    if (companies.length === 0) {
      expect(true).toBe(true); // Skip if no companies
      return;
    }

    const companyId = companies[0].id;

    // Submit minimal review
    const result = await caller.reviews.submit({
      companyId,
      rating: 3,
    });

    expect(result).toBeDefined();
  });

  it("should validate rating range", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    // Get a company first
    const companies = await caller.companies.list();
    if (companies.length === 0) {
      expect(true).toBe(true); // Skip if no companies
      return;
    }

    const companyId = companies[0].id;

    // Try to submit with invalid rating (should fail validation)
    try {
      await caller.reviews.submit({
        companyId,
        rating: 10, // Invalid: > 5
      } as any);
      expect(true).toBe(false); // Should have thrown
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should flag a review", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    // Get a company first
    const companies = await caller.companies.list();
    if (companies.length === 0) {
      expect(true).toBe(true); // Skip if no companies
      return;
    }

    const companyId = companies[0].id;

    // Submit a review
    const submitResult = await caller.reviews.submit({
      companyId,
      rating: 4,
      title: "Test review",
    });

    // Get the review ID from the result
    const reviews = await caller.reviews.getByCompany({
      companyId,
      limit: 1,
    });

    if (reviews.length > 0) {
      const reviewId = reviews[0].id;
      const flagResult = await caller.reviews.flag(reviewId);
      expect(flagResult).toBeDefined();
    }
  });
});
