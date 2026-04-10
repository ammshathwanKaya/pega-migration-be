import { parseStringPromise } from "xml2js";
import { analyzeWithAI } from "../services/openai.service";
import axios from "axios";
import { prisma } from "../lib/prisma";
import { Request, Response } from "express";

type ParsedFile = {
  filename: string;
  content: unknown;
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

    if (!project.files || project.files.length === 0) {
      return res.json({
        message: "No files found to analyze",
      });
    }

    const parsedFiles: ParsedFile[] = [];

    for (const file of project.files) {
      try {
        const fileRes = await axios.get<string>(file.path);

        let parsed: unknown;

        try {
          parsed = await parseStringPromise(fileRes.data);
        } catch {
          parsed = fileRes.data;
        }

        parsedFiles.push({
          filename: file.filename,
          content: parsed,
        });
      } catch (err) {
        console.error("File fetch failed:", file.path);
      }
    }

    if (parsedFiles.length === 0) {
      return res.status(400).json({
        error: "Failed to fetch any valid files",
      });
    }

    const userInput = `
User Message:
${message || "No additional message"}

Files:
${JSON.stringify(parsedFiles, null, 2)}
    `;

    const result = await analyzeWithAI(userInput);

    res.json({ data: result });
  } catch (error) {
    console.error("Analyse error:", error);
    res.status(500).json({ error: "Failed to analyze" });
  }
};
