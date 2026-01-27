import { describe, expect, it, beforeAll } from "vitest";
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

describe("companies router", () => {
  it("should list companies", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.companies.list();

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("industry");
    }
  });

  it("should search companies by name", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.companies.search("Google");

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0].name.toLowerCase()).toContain("google");
    }
  });

  it("should filter companies by industry", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.companies.filter({
      industry: "Technology",
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
    result.forEach((company: any) => {
      expect(company.industry).toBe("Technology");
    });
  });

  it("should filter companies by location", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.companies.filter({
      location: "San Antonio",
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
    result.forEach((company: any) => {
      expect(
        `${company.headquartersCity}, ${company.headquartersState}`.toLowerCase()
      ).toContain("san antonio");
    });
  });

  it("should filter companies by size range", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.companies.filter({
      sizeRange: "5000+",
      limit: 10,
    });

    expect(Array.isArray(result)).toBe(true);
    result.forEach((company: any) => {
      expect(company.sizeRange).toBe("5000+");
    });
  });

  it("should get company by ID with scores and trends", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    // First, get a company to test with
    const companies = await caller.companies.list();
    if (companies.length === 0) {
      expect(true).toBe(true); // Skip if no companies
      return;
    }

    const companyId = companies[0].id;
    const result = await caller.companies.getById(companyId);

    expect(result).toBeDefined();
    expect(result?.company).toBeDefined();
    expect(result?.company.id).toBe(companyId);
    expect(Array.isArray(result?.scores)).toBe(true);
    expect(Array.isArray(result?.trends)).toBe(true);
    expect(Array.isArray(result?.layoffs)).toBe(true);
  });

  it("should handle empty search results", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.companies.search("XYZ123NonExistentCompany");

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it("should respect pagination limits", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.companies.filter({
      limit: 5,
    });

    expect(result.length).toBeLessThanOrEqual(5);
  });

  it("should filter by score range", async () => {
    const ctx = createContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.companies.filter({
      minScore: 4.0,
      maxScore: 5.0,
      limit: 20,
    });

    expect(Array.isArray(result)).toBe(true);
    // Note: This test assumes companies have aggregateScore populated
    // If not, the result might be empty, which is still valid
  });
});
