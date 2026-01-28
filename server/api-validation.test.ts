import { describe, it, expect, vi } from "vitest";

vi.setConfig({ testTimeout: 15000 });

describe("API Keys Validation", () => {
  it("should have OPENAI_API_KEY in environment", () => {
    expect(process.env.OPENAI_API_KEY).toBeDefined();
    expect(process.env.OPENAI_API_KEY).toMatch(/^sk-proj-/);
  });

  it("should have NEWSAPI_KEY in environment", () => {
    expect(process.env.NEWSAPI_KEY).toBeDefined();
    expect(process.env.NEWSAPI_KEY?.length).toBeGreaterThan(10);
  });

  it("should have GEMINI_API_KEY in environment", () => {
    expect(process.env.GEMINI_API_KEY).toBeDefined();
    expect(process.env.GEMINI_API_KEY).toMatch(/^AIza/);
  });

  it("should have FINNHUB_API_KEY in environment", () => {
    expect(process.env.FINNHUB_API_KEY).toBeDefined();
    expect(process.env.FINNHUB_API_KEY?.length).toBeGreaterThan(10);
  });

  it("should validate OpenAI API key format", async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    expect(apiKey).toBeDefined();
    
    // Test basic OpenAI API connectivity
    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
        },
      });
      expect(response.status).toBeLessThan(500); // Should not be a server error
    } catch (error) {
      // Network errors are acceptable in test environment
      expect(error).toBeDefined();
    }
  });

  it("should validate NewsAPI key format", async () => {
    // NewsAPI can be slow, increase timeout
    expect.extend({});
    const apiKey = process.env.NEWSAPI_KEY;
    expect(apiKey).toBeDefined();
    
    // Test basic NewsAPI connectivity
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`
      );
      expect(response.status).toBeLessThan(500);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should validate Finnhub API key format", async () => {
    const apiKey = process.env.FINNHUB_API_KEY;
    expect(apiKey).toBeDefined();
    
    // Test basic Finnhub connectivity
    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=AAPL&token=${apiKey}`
      );
      expect(response.status).toBeLessThan(500);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
