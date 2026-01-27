import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  companies: router({
    list: publicProcedure.query(async () => {
      const { getCompaniesWithAggregateScores } = await import('./db');
      return getCompaniesWithAggregateScores(100, 0);
    }),
    
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const { getCompanyWithScores } = await import('./db');
        return getCompanyWithScores(input);
      }),
    
    search: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const { searchCompanies } = await import('./db');
        return searchCompanies(input, 20);
      }),
    
    filter: publicProcedure
      .input(z.object({
        location: z.string().optional(),
        industry: z.string().optional(),
        sizeRange: z.string().optional(),
        minScore: z.number().optional(),
        maxScore: z.number().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const { getFilteredCompanies } = await import('./db');
        return getFilteredCompanies(input);
      }),
  }),

  jobs: router({
    getByCompany: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const { getJobOpenings } = await import('./db');
        return getJobOpenings(input);
      }),
  }),

  news: router({
    getByCompany: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const { getCompanyNews } = await import('./db');
        return getCompanyNews(input, 10);
      }),

    getByIndustry: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const { getIndustryNews } = await import('./db');
        return getIndustryNews(input, 10);
      }),
  }),

  favorites: router({
    list: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      const { getUserFavorites } = await import('./db');
      return getUserFavorites(ctx.user.id);
    }),

    add: publicProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { addFavorite } = await import('./db');
        return addFavorite(ctx.user.id, input);
      }),

    remove: publicProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { removeFavorite } = await import('./db');
        return removeFavorite(ctx.user.id, input);
      }),

    check: publicProcedure
      .input(z.number())
      .query(async ({ input, ctx }) => {
        if (!ctx.user) return false;
        const { isFavorite } = await import('./db');
        return isFavorite(ctx.user.id, input);
      }),
  }),

  comparisons: router({
    list: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      const { getSavedComparisons } = await import('./db');
      return getSavedComparisons(ctx.user.id);
    }),

    save: publicProcedure
      .input(z.object({
        comparisonName: z.string(),
        companyIds: z.array(z.number()),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { saveComparison } = await import('./db');
        return saveComparison({
          userId: ctx.user.id,
          comparisonName: input.comparisonName,
          companyIds: JSON.stringify(input.companyIds),
          notes: input.notes,
        });
      }),

    update: publicProcedure
      .input(z.object({
        id: z.number(),
        comparisonName: z.string().optional(),
        companyIds: z.array(z.number()).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { updateComparison } = await import('./db');
        return updateComparison(input.id, {
          comparisonName: input.comparisonName,
          companyIds: input.companyIds ? JSON.stringify(input.companyIds) : undefined,
          notes: input.notes,
        });
      }),

    delete: publicProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error('Not authenticated');
        const { deleteComparison } = await import('./db');
        return deleteComparison(input);
      }),
  }),

  reviews: router({
    submit: publicProcedure
      .input(z.object({
        companyId: z.number(),
        rating: z.number().min(1).max(5),
        title: z.string().max(255).optional(),
        reviewText: z.string().optional(),
        pros: z.string().optional(),
        cons: z.string().optional(),
        jobTitle: z.string().max(255).optional(),
        employmentStatus: z.enum(["current", "former", "interviewing"]).optional(),
        workLifeBalance: z.number().min(1).max(5).optional(),
        compensationBenefits: z.number().min(1).max(5).optional(),
        careerOpportunities: z.number().min(1).max(5).optional(),
        cultureValues: z.number().min(1).max(5).optional(),
        seniorManagement: z.number().min(1).max(5).optional(),
      }))
      .mutation(async ({ input }) => {
        const { submitReview } = await import('./db');
        return submitReview(input);
      }),

    getByCompany: publicProcedure
      .input(z.object({
        companyId: z.number(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const { getCompanyReviews } = await import('./db');
        return getCompanyReviews(input.companyId, input.limit || 20, input.offset || 0);
      }),

    getStats: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const { getReviewStats } = await import('./db');
        return getReviewStats(input);
      }),

    flag: publicProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        const { flagReview } = await import('./db');
        return flagReview(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
