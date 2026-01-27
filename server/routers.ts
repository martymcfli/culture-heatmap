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
});

export type AppRouter = typeof appRouter;
