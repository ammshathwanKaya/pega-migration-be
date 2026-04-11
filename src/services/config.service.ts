import { prisma } from "../lib/prisma";

export const getOpenAIConfig = async () => {
  const config = await prisma.openAIConfig.findFirst();

  if (!config || !config.apiKey) {
    throw new Error("OpenAI API key is missing or not configured");
  }

  return config;
};
