// TODO : Upload file and get insight can be done in another agent
import { parseStringPromise } from "xml2js";
import { analyzeWithAI, validateApiKey } from "../services/openai.service";
import axios from "axios";
import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { getOpenAIConfig } from "../services/config.service";

type ParsedFile = {
  filename: string;
  chunks: string[];
};

const CHUNK_SIZE = 3000; // safe chunk
const MAX_CHUNKS_PER_FILE = 5; // limit per file
const MAX_TOTAL_INPUT = 1_000_000;

const chunkText = (text: string, size: number): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
};

export const validateOpenAIKey = async (
  req: Request<unknown, unknown, { apiKey: string }>,
  res: Response,
) => {
  const { apiKey } = req.body;

  try {
    const isValid = await validateApiKey(apiKey);

    if (isValid) {
      return res.status(200).json({ message: "API Key is valid" });
    } else {
      return res.status(401).json({ error: "Invalid OpenAI API Key" });
    }
  } catch (error) {
    console.error("Error validating API key:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while validating the API key" });
  }
};

export const analyzeProject = async (
  req: Request<{ id: string }, unknown, { message?: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const project = await prisma.project.findUnique({
      where: { id },
      include: { files: true },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (!project.files.length) {
      return res.json({ message: "No files found to analyze" });
    }

    const parsedFiles: ParsedFile[] = [];

    for (const file of project.files) {
      try {
        const fileRes = await axios.get<string>(file.path);

        let parsed: string;

        try {
          const xmlParsed = await parseStringPromise(fileRes.data);
          parsed = JSON.stringify(xmlParsed);
        } catch {
          parsed = fileRes.data;
        }

        const chunks = chunkText(parsed, CHUNK_SIZE).slice(
          0,
          MAX_CHUNKS_PER_FILE,
        );

        parsedFiles.push({
          filename: file.filename,
          chunks,
        });
      } catch (err) {
        console.error("File fetch failed:", file.path);
      }
    }

    if (!parsedFiles.length) {
      return res.status(400).json({
        error: "Failed to fetch any valid files",
      });
    }

    const fileSummaries = parsedFiles.map((file) => ({
      filename: file.filename,
      chunks: file.chunks.map((c, i) => `Chunk ${i + 1}: ${c}`),
    }));

    const userInput = `
User Message:
${message || "No additional message"}

Project:
${project.name}

Files:
${fileSummaries
  .map((f) => `File: ${f.filename}\n${f.chunks.join("\n\n")}`)
  .join("\n\n---\n\n")}
`;

    if (userInput.length > MAX_TOTAL_INPUT) {
      return res.status(400).json({
        error: "Input too large even after chunking",
      });
    }

    const { files, ...otherProjectMetadata } = project;

    let config;

    try {
      config = await getOpenAIConfig();
    } catch (err: any) {
      return res.status(400).json({
        error: err.message,
      });
    }

    const result = await analyzeWithAI(
      userInput,
      otherProjectMetadata,
      project.files,
      config.apiKey,
      config.model,
    );

    const savedAnalysis = await prisma.analysis.upsert({
      where: {
        projectId: project.id,
      },
      update: {
        data: result,
      },
      create: {
        projectId: project.id,
        data: result,
      },
    });

    res.json({
      data: savedAnalysis,
    });
  } catch (error) {
    console.error("Analyse error:", error);
    res.status(500).json({ error: "Failed to analyze" });
  }
};

export const getProjectAnalysis = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const analysis = await prisma.analysis.findUnique({
      where: {
        projectId: id,
      },
    });

    if (!analysis) {
      return res.status(404).json({
        error: "Analysis not found for this project",
      });
    }

    res.json({
      data: analysis,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch analysis" });
  }
};

export const saveOpenAIConfig = async (req: Request, res: Response) => {
  try {
    const { apiKey, model } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: "API key is required" });
    }

    const existing = await prisma.openAIConfig.findFirst();

    let config;

    if (existing) {
      config = await prisma.openAIConfig.update({
        where: { id: existing.id },
        data: { apiKey, model },
      });
    } else {
      config = await prisma.openAIConfig.create({
        data: { apiKey, model },
      });
    }

    res.json({ data: config });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save config" });
  }
};

export const getOpenAIConfigController = async (
  req: Request,
  res: Response,
) => {
  try {
    const config = await prisma.openAIConfig.findFirst();

    if (!config) {
      return res.status(404).json({
        error: "OpenAI config not found",
      });
    }

    res.json({
      data: {
        id: config.id,
        model: config.model,
        hasApiKey: !!config.apiKey,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch OpenAI config",
    });
  }
};
