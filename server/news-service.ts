import { invokeLLM } from "./_core/llm";
import { addNews } from "./db";
import { InsertCompanyNews } from "../drizzle/schema";

/**
 * Fetch and summarize news for a company using AI
 */
export async function generateCompanyNews(
  companyName: string,
  industryCategory: string,
  companyId?: number
): Promise<InsertCompanyNews | null> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a financial news analyst. Generate a realistic recent news item about the company. 
          Return ONLY valid JSON with no additional text.`,
        },
        {
          role: "user",
          content: `Generate a recent news headline and summary for ${companyName} (${industryCategory} industry). 
          Include realistic details about company announcements, earnings, partnerships, or industry trends.
          
          Return JSON with this exact structure:
          {
            "headline": "News headline (max 100 chars)",
            "summary": "2-3 sentence summary",
            "sentiment": "positive" | "negative" | "neutral",
            "sourceName": "TechCrunch" | "Bloomberg" | "Reuters" | "CNBC" (pick one),
            "relevanceScore": 0.85
          }`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "company_news",
          strict: true,
          schema: {
            type: "object",
            properties: {
              headline: {
                type: "string",
                description: "News headline",
              },
              summary: {
                type: "string",
                description: "News summary",
              },
              sentiment: {
                type: "string",
                enum: ["positive", "negative", "neutral"],
                description: "Sentiment of the news",
              },
              sourceName: {
                type: "string",
                description: "News source name",
              },
              relevanceScore: {
                type: "number",
                description: "Relevance score 0-1",
              },
            },
            required: ["headline", "summary", "sentiment", "sourceName", "relevanceScore"],
            additionalProperties: false,
          },
        },
      },
    });

    if (!response.choices[0]?.message.content) {
      return null;
    }

    const newsData = JSON.parse(response.choices[0].message.content as string);

    const newsItem: InsertCompanyNews = {
      companyId: companyId,
      industryCategory,
      headline: newsData.headline,
      summary: newsData.summary,
      sourceName: newsData.sourceName,
      sentiment: newsData.sentiment,
      relevanceScore: String(newsData.relevanceScore),
      publishedDate: new Date(),
    };

    return newsItem;
  } catch (error) {
    console.error("Error generating company news:", error);
    return null;
  }
}

/**
 * Generate industry news using AI
 */
export async function generateIndustryNews(
  industryCategory: string
): Promise<InsertCompanyNews | null> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a financial news analyst. Generate a realistic recent industry news item. 
          Return ONLY valid JSON with no additional text.`,
        },
        {
          role: "user",
          content: `Generate a recent industry news headline and summary for the ${industryCategory} sector. 
          Include realistic details about market trends, regulations, innovations, or major announcements.
          
          Return JSON with this exact structure:
          {
            "headline": "Industry news headline (max 100 chars)",
            "summary": "2-3 sentence summary",
            "sentiment": "positive" | "negative" | "neutral",
            "sourceName": "TechCrunch" | "Bloomberg" | "Reuters" | "CNBC" | "Wall Street Journal" (pick one),
            "relevanceScore": 0.8
          }`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "industry_news",
          strict: true,
          schema: {
            type: "object",
            properties: {
              headline: {
                type: "string",
                description: "News headline",
              },
              summary: {
                type: "string",
                description: "News summary",
              },
              sentiment: {
                type: "string",
                enum: ["positive", "negative", "neutral"],
                description: "Sentiment of the news",
              },
              sourceName: {
                type: "string",
                description: "News source name",
              },
              relevanceScore: {
                type: "number",
                description: "Relevance score 0-1",
              },
            },
            required: ["headline", "summary", "sentiment", "sourceName", "relevanceScore"],
            additionalProperties: false,
          },
        },
      },
    });

    if (!response.choices[0]?.message.content) {
      return null;
    }

    const newsData = JSON.parse(response.choices[0].message.content as string);

    const newsItem: InsertCompanyNews = {
      industryCategory,
      headline: newsData.headline,
      summary: newsData.summary,
      sourceName: newsData.sourceName,
      sentiment: newsData.sentiment,
      relevanceScore: String(newsData.relevanceScore),
      publishedDate: new Date(),
    };

    return newsItem;
  } catch (error) {
    console.error("Error generating industry news:", error);
    return null;
  }
}

/**
 * Seed news for multiple companies
 */
export async function seedCompanyNews(companies: Array<{ id: number; name: string; industry: string }>) {
  console.log("Seeding company news using AI...");

  for (const company of companies) {
    try {
      const newsItem = await generateCompanyNews(company.name, company.industry, company.id);
      if (newsItem) {
        await addNews(newsItem);
        console.log(`✓ Generated news for ${company.name}`);
      }
    } catch (error) {
      console.error(`Failed to generate news for ${company.name}:`, error);
    }
  }

  console.log("Company news seeding complete!");
}

/**
 * Seed industry news
 */
export async function seedIndustryNews(industries: string[]) {
  console.log("Seeding industry news using AI...");

  for (const industry of industries) {
    try {
      const newsItem = await generateIndustryNews(industry);
      if (newsItem) {
        await addNews(newsItem);
        console.log(`✓ Generated news for ${industry}`);
      }
    } catch (error) {
      console.error(`Failed to generate news for ${industry}:`, error);
    }
  }

  console.log("Industry news seeding complete!");
}
