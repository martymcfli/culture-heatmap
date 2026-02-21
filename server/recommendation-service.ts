import { invokeLLM } from "./_core/llm";
import { getDb } from "./db";
import { companies } from "../drizzle/schema";

/**
 * Get AI-powered company recommendations based on user preferences
 */
export async function getAIRecommendations(
  userPreferences: {
    preferredIndustry?: string;
    preferredLocation?: string;
    preferredSize?: string;
    minCultureScore?: number;
    maxCultureScore?: number;
    priorities?: string[]; // e.g., ["work-life-balance", "compensation", "career-growth"]
    excludeCompanyIds?: number[];
  },
  limit: number = 5
): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  const { getAggregateScore } = await import('./db');

  // Get all companies with scores
  const allCompanies = await db.select().from(companies);

  const companiesWithScores = await Promise.all(
    allCompanies.map(async (company) => {
      const score = await getAggregateScore(company.id);
      return { ...company, aggregateScore: score };
    })
  );

  // Filter based on basic preferences
  let filtered = companiesWithScores;

  if (userPreferences.preferredIndustry) {
    filtered = filtered.filter(
      (c) => c.industry === userPreferences.preferredIndustry
    );
  }

  if (userPreferences.preferredLocation) {
    filtered = filtered.filter(
      (c) =>
        `${c.headquartersCity}, ${c.headquartersState}`.toLowerCase() ===
        userPreferences.preferredLocation?.toLowerCase()
    );
  }

  if (userPreferences.preferredSize) {
    filtered = filtered.filter((c) => c.sizeRange === userPreferences.preferredSize);
  }

  if (userPreferences.minCultureScore || userPreferences.maxCultureScore) {
    filtered = filtered.filter((c) => {
      const score = c.aggregateScore?.overallRating || 0;
      if (
        userPreferences.minCultureScore &&
        score < userPreferences.minCultureScore
      )
        return false;
      if (
        userPreferences.maxCultureScore &&
        score > userPreferences.maxCultureScore
      )
        return false;
      return true;
    });
  }

  if (userPreferences.excludeCompanyIds?.length) {
    filtered = filtered.filter(
      (c) => !userPreferences.excludeCompanyIds?.includes(c.id)
    );
  }

  if (filtered.length === 0) {
    return [];
  }

  // Use OpenAI to rank and explain recommendations
  const companiesDescription = filtered
    .slice(0, 20) // Limit to top 20 for LLM processing
    .map(
      (c) =>
        `- ${c.name} (${c.industry}, ${c.headquartersCity}, ${c.headquartersState}, Size: ${c.sizeRange}, Culture Score: ${c.aggregateScore?.overallRating || "N/A"}/5, Work-Life Balance: ${c.aggregateScore?.workLifeBalance || "N/A"}/5, Compensation: ${c.aggregateScore?.compensationBenefits || "N/A"}/5)`
    )
    .join("\n");

  const prioritiesText =
    userPreferences.priorities?.join(", ") || "overall culture fit";

  const promptText = `You are a career advisor helping someone find the best company to work for.

Given these companies:
${companiesDescription}

User priorities: ${prioritiesText}

Rank the top ${Math.min(limit, filtered.length)} companies that best match the user's priorities. For each company, provide:
1. Ranking position (1-${Math.min(limit, filtered.length)})
2. Company name
3. Why it's a good match (1-2 sentences)
4. Key strengths for this user's priorities

Format as JSON array with objects containing: rank, name, matchReason, keyStrengths`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful career advisor. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: promptText,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "recommendations",
          strict: true,
          schema: {
            type: "object",
            properties: {
              recommendations: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    rank: { type: "number" },
                    name: { type: "string" },
                    matchReason: { type: "string" },
                    keyStrengths: { type: "string" },
                  },
                  required: ["rank", "name", "matchReason", "keyStrengths"],
                  additionalProperties: false,
                },
              },
            },
            required: ["recommendations"],
            additionalProperties: false,
          },
        },
      },
    });

    // Parse the response and match with company data
    const content = response.choices?.[0]?.message?.content;
    if (!content || typeof content !== 'string') return filtered.slice(0, limit);

    const parsed = JSON.parse(content as string);
    const recommendations = parsed.recommendations || [];

    // Enrich with full company data
    const enrichedRecommendations = recommendations.map(
      (rec: any): any => {
        const company = filtered.find(
          (c) => c.name.toLowerCase() === rec.name.toLowerCase()
        );
        return {
          ...company,
          aiMatchReason: rec.matchReason,
          aiKeyStrengths: rec.keyStrengths,
          rank: rec.rank,
        };
      }
    );

    return enrichedRecommendations.filter((r: any) => r.id); // Only return matched companies
  } catch (error) {
    console.error("[Recommendation] Error calling OpenAI:", error);
    // Fallback to simple sorting by culture score
    return filtered
      .sort(
        (a, b) =>
          (b.aggregateScore?.overallRating || 0) -
          (a.aggregateScore?.overallRating || 0)
      )
      .slice(0, limit);
  }
}

/**
 * Get similar companies to a given company using AI analysis
 */
export async function getAISimilarCompanies(
  companyId: number,
  limit: number = 5
): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  const { getAggregateScore } = await import('./db');

  // Get reference company
  const { eq } = await import('drizzle-orm');
  const refCompany = await db
    .select()
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  if (!refCompany.length) return [];

  const reference = refCompany[0];
  const refScore = await getAggregateScore(companyId);

  // Get all other companies
  const allCompanies = await db.select().from(companies);

  const companiesWithScores = await Promise.all(
    allCompanies
      .filter((c) => c.id !== companyId)
      .map(async (company) => {
        const score = await getAggregateScore(company.id);
        return { ...company, aggregateScore: score };
      })
  );

  // Use OpenAI to find similar companies
  const referenceDesc = `${reference.name} is a ${reference.industry} company with ${reference.sizeRange} employees located in ${reference.headquartersCity}, ${reference.headquartersState}. Culture Score: ${refScore?.overallRating || "N/A"}/5, Work-Life Balance: ${refScore?.workLifeBalance || "N/A"}/5, Compensation: ${refScore?.compensationBenefits || "N/A"}/5`;

  const companiesDescription = companiesWithScores
    .slice(0, 30)
    .map(
      (c) =>
        `- ${c.name} (${c.industry}, ${c.headquartersCity}, ${c.headquartersState}, Size: ${c.sizeRange}, Culture: ${c.aggregateScore?.overallRating || "N/A"}/5)`
    )
    .join("\n");

  const promptText = `You are a career advisor. Given this company:

${referenceDesc}

Find the top ${limit} most similar companies from this list based on industry, company culture, size, and location:

${companiesDescription}

For each similar company, explain why it's similar in 1-2 sentences.

Format as JSON array with objects containing: name, similarity_reason`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful career advisor. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: promptText,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "similar_companies",
          strict: true,
          schema: {
            type: "object",
            properties: {
              similar_companies: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    similarity_reason: { type: "string" },
                  },
                  required: ["name", "similarity_reason"],
                  additionalProperties: false,
                },
              },
            },
            required: ["similar_companies"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content || typeof content !== 'string') return companiesWithScores.slice(0, limit);

    const parsed = JSON.parse(content as string);
    const similarList = parsed.similar_companies || [];

    const enrichedSimilar = similarList
      .map((item: any) => {
        const company = companiesWithScores.find(
          (c) => c.name.toLowerCase() === item.name.toLowerCase()
        );
        return {
          ...company,
          aiSimilarityReason: item.similarity_reason,
        };
      })
      .filter((c: any) => c && c.id); return enrichedSimilar;
  } catch (error) {
    console.error("[Similar Companies] Error calling OpenAI:", error);
    // Fallback to simple similarity
    const { getSimilarCompanies } = await import('./comparison-helpers');
    return getSimilarCompanies(companyId, limit);
  }
}
