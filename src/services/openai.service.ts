import OpenAI from "openai";
import { analysePrompt } from "../openai/prompts";
import { pegaAnalysisSchema } from "../openai/schemas";
import { File, Project } from "../../generated/prisma/browser";
import { randomUUID } from "crypto";

export const analyzeWithAI = async (
  userInput: string,
  project: Project,
  files: File[],
  apiKey: string,
  model: string = "gpt-4o-mini",
) => {
  const openai = new OpenAI({
    apiKey,
  });

  const response = await openai.chat.completions.create({
    model,
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
      json_schema: pegaAnalysisSchema,
    },
  });

  const raw =
    typeof response.choices[0].message.content === "string"
      ? response.choices[0].message.content
      : JSON.stringify(response.choices[0].message.content);

  try {
    const data = JSON.parse(raw || "{}");
    const analysis = data?.analysis;
    return {
      analysis: { ...analysis, projectId: project?.id, id: randomUUID() },
      project,
      files,
    };
  } catch (error) {
    console.error("Invalid JSON from AI:", raw);
    throw new Error("Invalid AI response");
  }
};

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  const openai = new OpenAI({
    apiKey,
  });

  try {
    const response = await openai.models.list();
    if (response && response.data) {
      return true;
    }
  } catch (error) {
    console.error("Error validating API key:", error);
    return false;
  }

  return false;
};
