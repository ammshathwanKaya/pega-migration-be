import OpenAI from "openai";
import { analysePrompt } from "../openai/prompts";
import { simpleAnalysisSchema } from "../openai/schemas";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeWithAI = async (userInput: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: analysePrompt,
      },
      {
        role: "user",
        content: userInput,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: simpleAnalysisSchema,
    },
  });

  const raw =
    typeof response.choices[0].message.content === "string"
      ? response.choices[0].message.content
      : JSON.stringify(response.choices[0].message.content);

  try {
    return JSON.parse(raw || "{}");
  } catch (error) {
    console.error("Invalid JSON from AI:", raw);
    throw new Error("Invalid AI response");
  }
};
