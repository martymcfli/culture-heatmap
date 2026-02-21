import { describe, expect, it } from "vitest";
import { invokeLLM } from "./server/_core/llm";

describe("OpenAI Integration", () => {
  it("should successfully call OpenAI API with valid credentials", async () => {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say 'OpenAI integration successful' and nothing else." },
      ],
    });

    expect(response).toBeDefined();
    expect(response.choices).toBeDefined();
    expect(response.choices.length).toBeGreaterThan(0);
    expect(response.choices[0].message).toBeDefined();
    expect(response.choices[0].message.content).toContain("successful");
  });

  it("should handle structured JSON responses", async () => {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        {
          role: "user",
          content: "Extract the company name and sentiment from: 'Apple announced record profits with positive outlook'",
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "news_extraction",
          strict: true,
          schema: {
            type: "object",
            properties: {
              company: { type: "string", description: "The company name" },
              sentiment: {
                type: "string",
                enum: ["positive", "negative", "neutral"],
                description: "The sentiment of the news",
              },
            },
            required: ["company", "sentiment"],
            additionalProperties: false,
          },
        },
      },
    });

    expect(response).toBeDefined();
    expect(response.choices).toBeDefined();
    expect(response.choices.length).toBeGreaterThan(0);

    const content = response.choices[0].message.content;
    expect(content).toBeDefined();

    const parsed = JSON.parse(content as string);
    expect(parsed.company).toBeDefined();
    expect(parsed.sentiment).toBeDefined();
    expect(["positive", "negative", "neutral"]).toContain(parsed.sentiment);
  });
});
