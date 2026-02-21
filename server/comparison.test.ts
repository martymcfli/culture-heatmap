import { describe, it, expect, beforeAll } from "vitest";
import { getComparisonData, getCompanyMetricsSummary, getSimilarCompanies } from "./comparison-helpers";
import { getAIRecommendations, getAISimilarCompanies } from "./recommendation-service";

describe("Comparison Features", () => {
  it("should fetch comparison data for multiple companies", async () => {
    const comparisonData = await getComparisonData([1, 2, 3]);
    
    expect(comparisonData).toBeDefined();
    expect(Array.isArray(comparisonData)).toBe(true);
    
    if (comparisonData.length > 0) {
      const data = comparisonData[0];
      expect(data).toHaveProperty("company");
      expect(data).toHaveProperty("aggregateScore");
      expect(data).toHaveProperty("salaryData");
      expect(data).toHaveProperty("jobOpenings");
      expect(data).toHaveProperty("recentNews");
    }
  });

  it("should get company metrics summary", async () => {
    const metrics = await getCompanyMetricsSummary([1, 2]);
    
    expect(Array.isArray(metrics)).toBe(true);
    
    if (metrics.length > 0) {
      const metric = metrics[0];
      expect(metric).toHaveProperty("id");
      expect(metric).toHaveProperty("name");
      expect(metric).toHaveProperty("industry");
      expect(metric).toHaveProperty("location");
    }
  });

  it("should find similar companies", async () => {
    const similar = await getSimilarCompanies(1, 3);
    
    expect(Array.isArray(similar)).toBe(true);
    expect(similar.length).toBeLessThanOrEqual(3);
  });
});

describe("Recommendation Features", () => {
  it("should get AI recommendations with preferences", async () => {
    const recommendations = await getAIRecommendations(
      {
        preferredIndustry: "Technology",
        minCultureScore: 4.0,
        priorities: ["work-life-balance", "compensation"],
      },
      3
    );

    expect(Array.isArray(recommendations)).toBe(true);
    expect(recommendations.length).toBeLessThanOrEqual(3);
    
    if (recommendations.length > 0) {
      const rec = recommendations[0];
      expect(rec).toHaveProperty("name");
      expect(rec).toHaveProperty("industry");
    }
  });

  it("should get AI similar companies", async () => {
    const similar = await getAISimilarCompanies(1, 3);
    
    expect(Array.isArray(similar)).toBe(true);
    expect(similar.length).toBeLessThanOrEqual(3);
    
    if (similar.length > 0) {
      const company = similar[0];
      expect(company).toHaveProperty("name");
      expect(company).toHaveProperty("industry");
    }
  });

  it("should handle empty preferences gracefully", async () => {
    const recommendations = await getAIRecommendations({}, 5);
    
    expect(Array.isArray(recommendations)).toBe(true);
  });

  it("should exclude specified companies from recommendations", async () => {
    const recommendations = await getAIRecommendations(
      {
        excludeCompanyIds: [1, 2, 3],
      },
      5
    );

    expect(Array.isArray(recommendations)).toBe(true);
    
    // Verify excluded companies are not in results
    const excludedIds = [1, 2, 3];
    recommendations.forEach((rec: any) => {
      expect(excludedIds).not.toContain(rec.id);
    });
  });
});
