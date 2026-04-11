import { parseStringPromise } from "xml2js";
import { analyzeWithAI } from "../services/openai.service";
import axios from "axios";
import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

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

    const result = await analyzeWithAI(
      userInput,
      otherProjectMetadata,
      project.files,
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
