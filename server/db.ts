import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, companies, cultureScores, cultureTrends, layoffEvents, anonymousReviews, InsertAnonymousReview, jobOpenings, InsertJobOpening, companyNews, InsertCompanyNews, userFavorites, InsertUserFavorite, savedComparisons, InsertSavedComparison, salaryData, SalaryData, interviewData, InsertInterviewData, glassdoorMetrics, InsertGlassdoorMetrics } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Company queries
export async function getCompanies(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(companies).limit(limit).offset(offset);
}

export async function getCompanyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchCompanies(query: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  // Get all companies and filter in memory
  const allCompanies = await db.select().from(companies);
  return allCompanies
    .filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, limit);
}

export async function getCompanyWithScores(companyId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const company = await getCompanyById(companyId);
  if (!company) return undefined;
  
  const scores = await db.select().from(cultureScores)
    .where(eq(cultureScores.companyId, companyId));
  
  const trends = await db.select().from(cultureTrends)
    .where(eq(cultureTrends.companyId, companyId));
  
  const layoffs = await db.select().from(layoffEvents)
    .where(eq(layoffEvents.companyId, companyId));
  
  return { company, scores, trends, layoffs };
}

export async function getAggregateScore(companyId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const scores = await db.select().from(cultureScores)
    .where(eq(cultureScores.companyId, companyId));
  
  if (scores.length === 0) return null;
  
  // Fetch company to get turnover metrics
  const company = await db.select().from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);
  
  // Calculate average across all sources
  const avg = (field: keyof typeof scores[0]) => {
    const values = scores
      .map(s => parseFloat(String(s[field] || 0)))
      .filter(v => !isNaN(v));
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  };
  
  // Calculate base overall rating with turnover adjustment
  let baseOverallRating = avg('overallRating');
  
  if (company && company.length > 0) {
    const turnoverRate = company[0].turnoverRate ? parseFloat(String(company[0].turnoverRate)) : null;
    if (turnoverRate !== null) {
      let adjustment = 0;
      if (turnoverRate <= 10) adjustment = 0.3;
      else if (turnoverRate <= 20) adjustment = 0;
      else if (turnoverRate <= 30) adjustment = -0.1;
      else if (turnoverRate <= 40) adjustment = -0.3;
      else adjustment = -0.5;
      baseOverallRating = Math.max(1, Math.min(5, baseOverallRating + adjustment));
    }
  }
  
  return {
    overallRating: baseOverallRating,
    workLifeBalance: avg('workLifeBalance'),
    compensationBenefits: avg('compensationBenefits'),
    careerOpportunities: avg('careerOpportunities'),
    cultureValues: avg('cultureValues'),
    seniorManagement: avg('seniorManagement'),
    ceoApproval: avg('ceoApproval'),
    recommendToFriend: avg('recommendToFriend'),
  };
}

export async function getFilteredCompanies(filters: {
  location?: string;
  industry?: string;
  industries?: string[];
  sizeRange?: string;
  minScore?: number;
  maxScore?: number;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  // Get all companies and filter in memory
  let results = await db.select().from(companies);
  
  if (filters.location) {
    results = results.filter(c => 
      `${c.headquartersCity}, ${c.headquartersState}`.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }
  
  // Support both single industry and multiple industries
  if (filters.industries && filters.industries.length > 0) {
    results = results.filter(c => c.industry && filters.industries!.includes(c.industry));
  } else if (filters.industry) {
    results = results.filter(c => c.industry === filters.industry);
  }
  
  if (filters.sizeRange) {
    results = results.filter(c => c.sizeRange === filters.sizeRange);
  }
  
  // Always fetch aggregate scores for all filtered companies
  const companiesWithScores = [];
  for (const company of results) {
    const aggregate = await getAggregateScore(company.id);
    if (!aggregate) continue;
    
    const score = aggregate.overallRating;
    if (filters.minScore !== undefined && score < filters.minScore) continue;
    if (filters.maxScore !== undefined && score > filters.maxScore) continue;
    
    companiesWithScores.push({ ...company, aggregateScore: aggregate });
  }
  
  // Apply pagination
  const offset = filters.offset || 0;
  const limit = filters.limit || 100;
  return companiesWithScores.slice(offset, offset + limit);
}

export async function getCompaniesWithAggregateScores(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  const allCompanies = await db.select().from(companies);
  
  const companiesWithScores = await Promise.all(
    allCompanies.map(async (company) => {
      const aggregate = await getAggregateScore(company.id);
      return { ...company, aggregateScore: aggregate };
    })
  );
  
  return companiesWithScores.slice(offset, offset + limit);
}

// Anonymous reviews queries
export async function submitReview(reviewData: {
  companyId: number;
  rating: number;
  title?: string;
  reviewText?: string;
  pros?: string;
  cons?: string;
  jobTitle?: string;
  employmentStatus?: string;
  workLifeBalance?: number;
  compensationBenefits?: number;
  careerOpportunities?: number;
  cultureValues?: number;
  seniorManagement?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  
  // Convert numbers to strings for decimal fields
  const review: InsertAnonymousReview = {
    companyId: reviewData.companyId,
    rating: reviewData.rating.toString(),
    title: reviewData.title,
    reviewText: reviewData.reviewText,
    pros: reviewData.pros,
    cons: reviewData.cons,
    jobTitle: reviewData.jobTitle,
    employmentStatus: reviewData.employmentStatus,
    workLifeBalance: reviewData.workLifeBalance?.toString(),
    compensationBenefits: reviewData.compensationBenefits?.toString(),
    careerOpportunities: reviewData.careerOpportunities?.toString(),
    cultureValues: reviewData.cultureValues?.toString(),
    seniorManagement: reviewData.seniorManagement?.toString(),
  };
  
  const result = await db.insert(anonymousReviews).values(review);
  return result;
}

export async function getCompanyReviews(companyId: number, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(anonymousReviews)
    .where(eq(anonymousReviews.companyId, companyId))
    .orderBy(desc(anonymousReviews.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getReviewStats(companyId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const reviews = await db.select()
    .from(anonymousReviews)
    .where(eq(anonymousReviews.companyId, companyId));
  
  if (reviews.length === 0) return null;
  
  const avg = (field: keyof typeof reviews[0]) => {
    const values = reviews
      .map(r => parseFloat(String(r[field] || 0)))
      .filter(v => !isNaN(v));
    return values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : "0";
  };
  
  return {
    totalReviews: reviews.length,
    averageRating: avg('rating'),
    averageWorkLifeBalance: avg('workLifeBalance'),
    averageCompensation: avg('compensationBenefits'),
    averageCareer: avg('careerOpportunities'),
    averageCulture: avg('cultureValues'),
    averageManagement: avg('seniorManagement'),
  };
}

export async function flagReview(reviewId: number) {
  const db = await getDb();
  if (!db) return null;
  
  return db.update(anonymousReviews)
    .set({ isFlagged: 1 })
    .where(eq(anonymousReviews.id, reviewId));
}

// Job Openings queries
export async function getJobOpenings(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(jobOpenings)
    .where(eq(jobOpenings.companyId, companyId))
    .orderBy(desc(jobOpenings.postedDate));
}

export async function addJobOpening(job: InsertJobOpening) {
  const db = await getDb();
  if (!db) return null;
  
  return db.insert(jobOpenings).values(job);
}

// Company News queries
export async function getCompanyNews(companyId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(companyNews)
    .where(eq(companyNews.companyId, companyId))
    .orderBy(desc(companyNews.publishedDate))
    .limit(limit);
}

export async function getIndustryNews(industryCategory: string, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(companyNews)
    .where(eq(companyNews.industryCategory, industryCategory))
    .orderBy(desc(companyNews.publishedDate))
    .limit(limit);
}

export async function addNews(news: InsertCompanyNews) {
  const db = await getDb();
  if (!db) return null;
  
  return db.insert(companyNews).values(news);
}

// User Favorites queries
export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const favorites = await db.select()
    .from(userFavorites)
    .where(eq(userFavorites.userId, userId));
  
  const companyIds = favorites.map(f => f.companyId);
  if (companyIds.length === 0) return [];
  
  return db.select().from(companies).where(eq(companies.id, companyIds[0]));
}

export async function addFavorite(userId: number, companyId: number) {
  const db = await getDb();
  if (!db) return null;
  
  return db.insert(userFavorites).values({ userId, companyId });
}

export async function removeFavorite(userId: number, companyId: number) {
  const db = await getDb();
  if (!db) return null;
  
  return db.delete(userFavorites)
    .where(eq(userFavorites.userId, userId) && eq(userFavorites.companyId, companyId));
}

export async function isFavorite(userId: number, companyId: number) {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db.select()
    .from(userFavorites)
    .where(eq(userFavorites.userId, userId) && eq(userFavorites.companyId, companyId))
    .limit(1);
  
  return result.length > 0;
}

// Saved Comparisons queries
export async function getSavedComparisons(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(savedComparisons)
    .where(eq(savedComparisons.userId, userId))
    .orderBy(desc(savedComparisons.savedAt));
}

export async function saveComparison(comparison: InsertSavedComparison) {
  const db = await getDb();
  if (!db) return null;
  
  return db.insert(savedComparisons).values(comparison);
}

export async function updateComparison(id: number, updates: Partial<InsertSavedComparison>) {
  const db = await getDb();
  if (!db) return null;
  
  return db.update(savedComparisons)
    .set(updates)
    .where(eq(savedComparisons.id, id));
}

export async function deleteComparison(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  return db.delete(savedComparisons)
    .where(eq(savedComparisons.id, id));
}

// Salary Data queries
export async function getSalaryDataByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(salaryData)
    .where(eq(salaryData.companyId, companyId))
    .orderBy(salaryData.jobTitle, salaryData.level);
}

export async function getSalaryComparison(filters: {
  jobTitle?: string;
  level?: string;
  companyIds?: number[];
}) {
  const db = await getDb();
  if (!db) return [];
  
  let allData = await db.select().from(salaryData);
  
  if (filters.jobTitle) {
    allData = allData.filter(d => d.jobTitle === filters.jobTitle);
  }
  if (filters.level) {
    allData = allData.filter(d => d.level === filters.level);
  }
  if (filters.companyIds && filters.companyIds.length > 0) {
    allData = allData.filter(d => filters.companyIds!.includes(d.companyId));
  }
  
  return allData;
}

export async function getSalaryStats(jobTitle: string, level: string) {
  const db = await getDb();
  if (!db) return null;
  
  const data = await db.select()
    .from(salaryData)
    .where(eq(salaryData.jobTitle, jobTitle) && eq(salaryData.level, level));
  
  if (data.length === 0) return null;
  
  const salaries = data.map(d => parseFloat(String(d.totalCompensation || 0)));
  const sorted = salaries.sort((a, b) => a - b);
  
  return {
    count: data.length,
    min: Math.min(...salaries),
    max: Math.max(...salaries),
    median: sorted[Math.floor(sorted.length / 2)],
    average: salaries.reduce((a, b) => a + b, 0) / salaries.length,
    p25: sorted[Math.floor(sorted.length * 0.25)],
    p75: sorted[Math.floor(sorted.length * 0.75)],
  };
}

export async function getUniqueJobTitles() {
  const db = await getDb();
  if (!db) return [];
  
  const data = await db.select({ jobTitle: salaryData.jobTitle }).from(salaryData);
  const uniqueSet = new Set(data.map(d => d.jobTitle));
  const unique = Array.from(uniqueSet);
  return unique.sort();
}

export async function getUniqueLevels() {
  const db = await getDb();
  if (!db) return [];
  
  const data = await db.select({ level: salaryData.level }).from(salaryData);
  const uniqueSet = new Set(data.map(d => d.level));
  const unique = Array.from(uniqueSet);
  return unique.sort();
}

// TODO: add feature queries here as your schema grows.


// Glassdoor Interview Data queries
export async function addInterviewData(interview: InsertInterviewData) {
  const db = await getDb();
  if (!db) return null;
  
  return db.insert(interviewData).values(interview);
}

export async function getCompanyInterviews(companyId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(interviewData)
    .where(eq(interviewData.companyId, companyId))
    .orderBy(desc(interviewData.createdAt))
    .limit(limit);
}

export async function getInterviewsByJobTitle(companyId: number, jobTitle: string, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(interviewData)
    .where(eq(interviewData.companyId, companyId) && eq(interviewData.jobTitle, jobTitle))
    .orderBy(desc(interviewData.createdAt))
    .limit(limit);
}

// Glassdoor Metrics queries
export async function upsertGlassdoorMetrics(metrics: InsertGlassdoorMetrics) {
  const db = await getDb();
  if (!db) return null;
  
  const existing = await db.select()
    .from(glassdoorMetrics)
    .where(eq(glassdoorMetrics.companyId, metrics.companyId))
    .limit(1);
  
  if (existing.length > 0) {
    return db.update(glassdoorMetrics)
      .set({
        ...metrics,
        updatedAt: new Date(),
      })
      .where(eq(glassdoorMetrics.companyId, metrics.companyId));
  } else {
    return db.insert(glassdoorMetrics).values(metrics);
  }
}

export async function getGlassdoorMetrics(companyId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select()
    .from(glassdoorMetrics)
    .where(eq(glassdoorMetrics.companyId, companyId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function getGlassdoorMetricsByName(companyName: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select()
    .from(glassdoorMetrics)
    .where(eq(glassdoorMetrics.companyName, companyName))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function updateGlassdoorMetricsSync(companyId: number, syncTime: Date) {
  const db = await getDb();
  if (!db) return null;
  
  return db.update(glassdoorMetrics)
    .set({ lastSyncedAt: syncTime })
    .where(eq(glassdoorMetrics.companyId, companyId));
}
