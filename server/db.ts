import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, companies, cultureScores, cultureTrends, layoffEvents, anonymousReviews, InsertAnonymousReview } from "../drizzle/schema";
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
  
  // Calculate average across all sources
  const avg = (field: keyof typeof scores[0]) => {
    const values = scores
      .map(s => parseFloat(String(s[field] || 0)))
      .filter(v => !isNaN(v));
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  };
  
  return {
    overallRating: avg('overallRating'),
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
  
  if (filters.industry) {
    results = results.filter(c => c.industry === filters.industry);
  }
  
  if (filters.sizeRange) {
    results = results.filter(c => c.sizeRange === filters.sizeRange);
  }
  
  // Filter by score if needed
  if (filters.minScore !== undefined || filters.maxScore !== undefined) {
    const filtered = [];
    for (const company of results) {
      const aggregate = await getAggregateScore(company.id);
      if (!aggregate) continue;
      
      const score = aggregate.overallRating;
      if (filters.minScore !== undefined && score < filters.minScore) continue;
      if (filters.maxScore !== undefined && score > filters.maxScore) continue;
      
      filtered.push(company);
    }
    results = filtered;
  }
  
  // Apply pagination
  const offset = filters.offset || 0;
  const limit = filters.limit || 100;
  return results.slice(offset, offset + limit);
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

// TODO: add feature queries here as your schema grows.
