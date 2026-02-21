import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 1): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];

  const user: AuthenticatedUser = {
    id: userId,
    openId: `user-${userId}`,
    email: `user${userId}@example.com`,
    name: `User ${userId}`,
    loginMethod: "manus",
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
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

describe("Job Openings API", () => {
  it("should fetch job openings for a company", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const jobs = await caller.jobs.getByCompany(1);

    expect(Array.isArray(jobs)).toBe(true);
  });
});

describe("News API", () => {
  it("should fetch company news", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const news = await caller.news.getByCompany(1);

    expect(Array.isArray(news)).toBe(true);
  });

  it("should fetch industry news", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const news = await caller.news.getByIndustry("Technology");

    expect(Array.isArray(news)).toBe(true);
  });
});

describe("Favorites API", () => {
  it("should list user favorites", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const favorites = await caller.favorites.list();

    expect(Array.isArray(favorites)).toBe(true);
  });

  it("should check if company is favorited", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const isFav = await caller.favorites.check(1);

    expect(typeof isFav).toBe("boolean");
  });

  it("should add a company to favorites", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.favorites.add(1);

    expect(result).toBeDefined();
  });

  it("should remove a company from favorites", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.favorites.remove(1);

    expect(result).toBeDefined();
  });
});

describe("Comparisons API", () => {
  it("should list user saved comparisons", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const comparisons = await caller.comparisons.list();

    expect(Array.isArray(comparisons)).toBe(true);
  });

  it("should save a new comparison", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.comparisons.save({
      comparisonName: "Tech Giants Comparison",
      companyIds: [1, 2, 3],
      notes: "Comparing top tech companies",
    });

    expect(result).toBeDefined();
  });

  it("should update a saved comparison", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First save a comparison
    const saved = await caller.comparisons.save({
      comparisonName: "Original Name",
      companyIds: [1, 2],
    });

    // Then update it
    if (saved && "insertId" in saved) {
      const updated = await caller.comparisons.update({
        id: saved.insertId,
        comparisonName: "Updated Name",
        notes: "Updated notes",
      });

      expect(updated).toBeDefined();
    }
  });

  it("should delete a saved comparison", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First save a comparison
    const saved = await caller.comparisons.save({
      comparisonName: "To Delete",
      companyIds: [1, 2],
    });

    // Then delete it
    if (saved && "insertId" in saved) {
      const deleted = await caller.comparisons.delete(saved.insertId);

      expect(deleted).toBeDefined();
    }
  });
});

describe("Authentication", () => {
  it("should require authentication for favorites", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.favorites.add(1);
      expect(true).toBe(false); // Should throw
    } catch (error) {
      expect((error as Error).message).toContain("Not authenticated");
    }
  });

  it("should require authentication for comparisons", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.comparisons.save({
        comparisonName: "Test",
        companyIds: [1, 2],
      });
      expect(true).toBe(false); // Should throw
    } catch (error) {
      expect((error as Error).message).toContain("Not authenticated");
    }
  });
});
