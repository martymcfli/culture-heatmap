import { getDb } from "./db";
import { salaryData } from "../drizzle/schema";
import { sql } from "drizzle-orm";

export interface SalaryTrend {
  role: string;
  jobTitle: string;
  avgBaseSalary: number;
  avgTotalCompensation: number;
  minBaseSalary: number;
  maxBaseSalary: number;
  count: number;
}

export interface SalaryInsights {
  trends: SalaryTrend[];
  jobTitlesList: string[];
  levelsList: string[];
  overallStats: {
    avgBaseSalary: number;
    avgTotalCompensation: number;
    medianBaseSalary: number;
    highestPayingRole: string;
  };
}

/**
 * Get salary trends aggregated by job title and level
 */
export async function getSalaryTrends(
  filters?: {
    jobTitle?: string;
    level?: string;
    minSalary?: number;
    maxSalary?: number;
  }
): Promise<SalaryInsights> {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }
    // Fetch all salary data
    let allData = await db.select().from(salaryData);

    // Apply filters if provided
    if (filters?.jobTitle) {
      allData = allData.filter(
        (r: any) => r.jobTitle?.toLowerCase().includes(filters.jobTitle!.toLowerCase())
      );
    }
    if (filters?.level) {
      allData = allData.filter((r: any) => r.level === filters.level);
    }
    if (filters?.minSalary) {
      allData = allData.filter((r: any) => {
        const salary = Number(r.baseSalary || 0);
        return salary >= filters.minSalary!;
      });
    }
    if (filters?.maxSalary) {
      allData = allData.filter((r: any) => {
        const salary = Number(r.baseSalary || 0);
        return salary <= filters.maxSalary!;
      });
    }

    // Aggregate by job title and level
    const trendMap = new Map<string, SalaryTrend>();
    const jobTitlesSet = new Set<string>();
    const levelsSet = new Set<string>();
    let totalBaseSalary = 0;
    let totalCompensation = 0;
    let salaryCount = 0;

    for (const record of allData) {
      if (!record.jobTitle || !record.level || !record.baseSalary) continue;

      jobTitlesSet.add(record.jobTitle);
      levelsSet.add(record.level);

      const key = `${record.jobTitle}|${record.level}`;
      const baseSalary = Number(record.baseSalary);
      const totalComp = Number(record.totalCompensation || baseSalary);

      const existing = trendMap.get(key) || {
        role: record.level,
        jobTitle: record.jobTitle,
        avgBaseSalary: 0,
        avgTotalCompensation: 0,
        minBaseSalary: baseSalary,
        maxBaseSalary: baseSalary,
        count: 0,
      };

      existing.minBaseSalary = Math.min(existing.minBaseSalary, baseSalary);
      existing.maxBaseSalary = Math.max(existing.maxBaseSalary, baseSalary);
      existing.count += 1;
      existing.avgBaseSalary =
        (existing.avgBaseSalary * (existing.count - 1) + baseSalary) / existing.count;
      existing.avgTotalCompensation =
        (existing.avgTotalCompensation * (existing.count - 1) + totalComp) / existing.count;

      trendMap.set(key, existing);
      totalBaseSalary += baseSalary;
      totalCompensation += totalComp;
      salaryCount += 1;
    }

    const trends = Array.from(trendMap.values()).sort(
      (a: any, b: any) => b.avgTotalCompensation - a.avgTotalCompensation
    );

    // Calculate overall stats
    const sortedSalaries = allData
      .map((r: any) => Number(r.baseSalary || 0))
      .filter((s: number) => s > 0)
      .sort((a: number, b: number) => a - b);

    const medianBaseSalary =
      sortedSalaries.length > 0
        ? sortedSalaries[Math.floor(sortedSalaries.length / 2)]
        : 0;

    const highestTrend = trends[0];

    return {
      trends,
      jobTitlesList: Array.from(jobTitlesSet).sort(),
      levelsList: Array.from(levelsSet).sort(),
      overallStats: {
        avgBaseSalary: salaryCount > 0 ? totalBaseSalary / salaryCount : 0,
        avgTotalCompensation: salaryCount > 0 ? totalCompensation / salaryCount : 0,
        medianBaseSalary,
        highestPayingRole: highestTrend?.jobTitle || "N/A",
      },
    };
  } catch (error) {
    console.error("Error fetching salary trends:", error);
    return {
      trends: [],
      jobTitlesList: [],
      levelsList: [],
      overallStats: {
        avgBaseSalary: 0,
        avgTotalCompensation: 0,
        medianBaseSalary: 0,
        highestPayingRole: "N/A",
      },
    };
  }
}

/**
 * Get salary range for a specific job title
 */
export async function getSalaryRangeByRole(jobTitle: string): Promise<{
  min: number;
  max: number;
  avg: number;
  count: number;
}> {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }
    const data = await db
      .select()
      .from(salaryData)
      .where(sql`LOWER(${salaryData.jobTitle}) LIKE LOWER(${`%${jobTitle}%`})`);

    const salaries = data
      .map((r: any) => Number(r.baseSalary || 0))
      .filter((s: number) => s > 0);

    if (salaries.length === 0) {
      return { min: 0, max: 0, avg: 0, count: 0 };
    }

    return {
      min: Math.min(...salaries),
      max: Math.max(...salaries),
      avg: salaries.reduce((a, b) => a + b, 0) / salaries.length,
      count: salaries.length,
    };
  } catch (error) {
    console.error("Error fetching salary range:", error);
    return { min: 0, max: 0, avg: 0, count: 0 };
  }
}

/**
 * Format salary as USD currency
 */
export function formatSalary(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
