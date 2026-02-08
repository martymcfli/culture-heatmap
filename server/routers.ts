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
        industries: z.array(z.string()).optional(),
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

  salary: router({
    getByCompany: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const { getSalaryDataByCompany } = await import('./db');
        return getSalaryDataByCompany(input);
      }),

    compare: publicProcedure
      .input(z.object({
        jobTitle: z.string().optional(),
        level: z.string().optional(),
        companyIds: z.array(z.number()).optional(),
      }))
      .query(async ({ input }) => {
        const { getSalaryComparison } = await import('./db');
        return getSalaryComparison(input);
      }),

    stats: publicProcedure
      .input(z.object({
        jobTitle: z.string(),
        level: z.string(),
      }))
      .query(async ({ input }) => {
        const { getSalaryStats } = await import('./db');
        return getSalaryStats(input.jobTitle, input.level);
      }),

    jobTitles: publicProcedure
      .query(async () => {
        const { getUniqueJobTitles } = await import('./db');
        return getUniqueJobTitles();
      }),

    levels: publicProcedure
      .query(async () => {
        const { getUniqueLevels } = await import('./db');
        return getUniqueLevels();
      }),

    trends: publicProcedure
      .input(z.object({
        jobTitle: z.string().optional(),
        level: z.string().optional(),
        minSalary: z.number().optional(),
        maxSalary: z.number().optional(),
      }).optional())
      .query(async ({ input }) => {
        const { getSalaryTrends } = await import('./salary-insights');
        return getSalaryTrends(input);
      }),

    rangeByRole: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const { getSalaryRangeByRole } = await import('./salary-insights');
        return getSalaryRangeByRole(input);
      }),
  }),

  recommendations: router({
    getAIRecommendations: publicProcedure
      .input(z.object({
        preferredIndustry: z.string().optional(),
        preferredLocation: z.string().optional(),
        preferredSize: z.string().optional(),
        minCultureScore: z.number().optional(),
        maxCultureScore: z.number().optional(),
        priorities: z.array(z.string()).optional(),
        excludeCompanyIds: z.array(z.number()).optional(),
        limit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const { getAIRecommendations } = await import('./recommendation-service');
        return getAIRecommendations(input, input.limit || 5);
      }),

    getSimilarCompanies: publicProcedure
      .input(z.object({
        companyId: z.number(),
        limit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const { getAISimilarCompanies } = await import('./recommendation-service');
        return getAISimilarCompanies(input.companyId, input.limit || 5);
      }),
  }),

  comparison: router({
    getComparisonData: publicProcedure
      .input(z.array(z.number()))
      .query(async ({ input }) => {
        const { getComparisonData } = await import('./comparison-helpers');
        return getComparisonData(input);
      }),

    getMetricsSummary: publicProcedure
      .input(z.array(z.number()))
      .query(async ({ input }) => {
        const { getCompanyMetricsSummary } = await import('./comparison-helpers');
        return getCompanyMetricsSummary(input);
      }),

    getSalaryComparison: publicProcedure
      .input(z.object({
        companyIds: z.array(z.number()),
        jobTitle: z.string(),
        level: z.string(),
      }))
      .query(async ({ input }) => {
        const { getSalaryComparisonForRole } = await import('./comparison-helpers');
        return getSalaryComparisonForRole(input.companyIds, input.jobTitle, input.level);
      }),
  }),

  glassdoor: router({
    getCompanyInterviews: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const { getCompanyInterviews } = await import('./db');
        return getCompanyInterviews(input, 20);
      }),

    getInterviewsByJobTitle: publicProcedure
      .input(z.object({
        companyId: z.number(),
        jobTitle: z.string(),
      }))
      .query(async ({ input }) => {
        const { getInterviewsByJobTitle } = await import('./db');
        return getInterviewsByJobTitle(input.companyId, input.jobTitle, 10);
      }),

    getMetrics: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const { getGlassdoorMetrics } = await import('./db');
        return getGlassdoorMetrics(input);
      }),

    fetchAndCache: publicProcedure
      .input(z.object({
        companyId: z.number(),
        companyName: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { fetchGlassdoorCompanyInterviews, fetchGlassdoorCompanyData } = await import('./glassdoor-service');
        const { addInterviewData, upsertGlassdoorMetrics } = await import('./db');

        try {
          // Fetch interviews
          const interviews = await fetchGlassdoorCompanyInterviews(input.companyName);
          for (const interview of interviews) {
            await addInterviewData({
              companyId: input.companyId,
              glassdoorInterviewId: interview.id,
              jobTitle: interview.jobTitle,
              interviewType: interview.interviewType,
              difficulty: interview.difficulty,
              duration: interview.duration,
              questions: JSON.stringify(interview.questions),
              experience: interview.experience,
              outcome: interview.outcome,
              interviewDate: interview.interviewDate ? new Date(interview.interviewDate) : undefined,
            });
          }

          // Fetch company metrics
          const companyData = await fetchGlassdoorCompanyData(input.companyName);
          if (companyData) {
            await upsertGlassdoorMetrics({
              companyId: input.companyId,
              companyName: input.companyName,
              overallRating: companyData.overallRating ? companyData.overallRating.toString() : undefined,
              ceoApproval: companyData.ceoApproval ? companyData.ceoApproval.toString() : undefined,
              recommendToFriend: companyData.recommendToFriend ? companyData.recommendToFriend.toString() : undefined,
              salaryMin: companyData.salaryEstimate?.min,
              salaryMax: companyData.salaryEstimate?.max,
              salaryCurrency: companyData.salaryEstimate?.currency,
              interviewCount: interviews.length,
              lastSyncedAt: new Date(),
            });
          }

          return { success: true, interviewsCount: interviews.length };
        } catch (error) {
          console.error('[Glassdoor] Error fetching and caching data:', error);
          return { success: false, error: 'Failed to fetch Glassdoor data' };
        }
      }),
  }),

  demo: router({
    getCompanies: publicProcedure.query(async () => {
      const { getDemoCompanies } = await import('./demo-data');
      return getDemoCompanies();
    }),

    getCompanyById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const { getDemoCompanyById } = await import('./demo-data');
        return getDemoCompanyById(input);
      }),

    filterCompanies: publicProcedure
      .input(z.object({
        location: z.string().optional(),
        industry: z.string().optional(),
        minScore: z.number().optional(),
        maxScore: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const { filterDemoCompanies } = await import('./demo-data');
        return filterDemoCompanies(input);
      }),
  }),

  linkedinJobs: router({
    search: publicProcedure
      .input(z.object({
        query: z.string().optional(),
        page: z.number().optional(),
        num_pages: z.number().optional(),
        country: z.string().optional(),
        date_posted: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const { searchJSearchJobs } = await import('./jsearch-jobs-service');
        return searchJSearchJobs(input);
      }),

    getJobDetails: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const { getLinkedInJobDetails } = await import('./linkedin-jobs-service');
        return getLinkedInJobDetails(input);
      }),
  }),

  chatbot: router({
    chat: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string(),
        })),
        companyContext: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { chatWithOP } = await import('./chatbot-service');
        const response = await chatWithOP(input.messages, input.companyContext);
        return { response };
      }),
  }),


});

export type AppRouter = typeof appRouter;
