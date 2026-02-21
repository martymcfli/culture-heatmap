import { getDb } from "./db";
import { companies, salaryData, jobOpenings, companyNews } from "../drizzle/schema";
import { eq, inArray } from "drizzle-orm";

export interface ComparisonData {
  company: any;
  aggregateScore: any;
  salaryData: any[];
  jobOpenings: any[];
  recentNews: any[];
  financialMetrics?: any;
}

/**
 * Fetch comprehensive comparison data for multiple companies
 */
export async function getComparisonData(companyIds: number[]): Promise<ComparisonData[]> {
  const db = await getDb();
  if (!db || companyIds.length === 0) return [];

  const { getAggregateScore, getJobOpenings, getCompanyNews, getSalaryDataByCompany } = await import('./db');

  const companyList = await db
    .select()
    .from(companies)
    .where(inArray(companies.id, companyIds));

  const comparisonData = await Promise.all(
    companyList.map(async (company) => {
      const [aggregateScore, salaries, jobs, news] = await Promise.all([
        getAggregateScore(company.id),
        getSalaryDataByCompany(company.id),
        getJobOpenings(company.id),
        getCompanyNews(company.id, 5),
      ]);

      return {
        company,
        aggregateScore,
        salaryData: salaries || [],
        jobOpenings: jobs || [],
        recentNews: news || [],
      };
    })
  );

  return comparisonData;
}

/**
 * Get salary comparison across multiple companies for a specific role
 */
export async function getSalaryComparisonForRole(
  companyIds: number[],
  jobTitle: string,
  level: string
) {
  const db = await getDb();
  if (!db) return [];

  const salaries = await db
    .select()
    .from(salaryData)
    .where(
      inArray(salaryData.companyId, companyIds) &&
      eq(salaryData.jobTitle, jobTitle) &&
      eq(salaryData.level, level)
    );

  return salaries;
}

/**
 * Get company metrics summary for comparison
 */
export async function getCompanyMetricsSummary(companyIds: number[]) {
  const db = await getDb();
  if (!db) return [];

  const { getAggregateScore } = await import('./db');

  const companyList = await db
    .select()
    .from(companies)
    .where(inArray(companies.id, companyIds));

  const metrics = await Promise.all(
    companyList.map(async (company) => {
      const score = await getAggregateScore(company.id);
      return {
        id: company.id,
        name: company.name,
        industry: company.industry,
        location: `${company.headquartersCity}, ${company.headquartersState}`,
        size: company.sizeRange,
        ...score,
      };
    })
  );

  return metrics;
}

/**
 * Get companies with similar characteristics
 */
export async function getSimilarCompanies(
  companyId: number,
  limit: number = 5
): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  const { getAggregateScore } = await import('./db');

  // Get the reference company
  const refCompany = await db
    .select()
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  if (!refCompany.length) return [];

  const reference = refCompany[0];
  const refScore = await getAggregateScore(companyId);

  // Get all companies
  const allCompanies = await db.select().from(companies);

  // Score similarity based on industry, size, and location
  const similarities = await Promise.all(
    allCompanies
      .filter((c) => c.id !== companyId)
      .map(async (company) => {
        const score = await getAggregateScore(company.id);

        let similarityScore = 0;

        // Industry match (40 points)
        if (company.industry === reference.industry) {
          similarityScore += 40;
        }

        // Size range match (30 points)
        if (company.sizeRange === reference.sizeRange) {
          similarityScore += 30;
        }

        // Location match (15 points)
        if (
          company.headquartersCity === reference.headquartersCity &&
          company.headquartersState === reference.headquartersState
        ) {
          similarityScore += 15;
        }

        // Culture score proximity (15 points - max 5 point difference)
        if (score && refScore) {
          const scoreDiff = Math.abs(
            (score.overallRating || 0) - (refScore.overallRating || 0)
          );
          if (scoreDiff <= 1) {
            similarityScore += 15;
          } else if (scoreDiff <= 2) {
            similarityScore += 10;
          } else if (scoreDiff <= 3) {
            similarityScore += 5;
          }
        }

        return {
          company,
          score,
          similarityScore,
        };
      })
  );

  // Sort by similarity score and return top N
  return similarities
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit)
    .map((item) => ({
      ...item.company,
      aggregateScore: item.score,
      similarityScore: item.similarityScore,
    }));
}
