import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { uploadToSupabase } from "../helper/upload-helper";

// types
type CreateProjectBody = {
  name: string;
  description?: string;
  sourceType?: "pega" | "salesforce";
};

type UpdateProjectBody = {
  name?: string;
  description?: string;
};

// GET /projects
export const getProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        files: {
          select: {
            id: true,
            filename: true,
            path: true,
            createdAt: true,
          },
        },
      },
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /projects/:id
export const getProjectById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    res.json(project);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /projects
export const createProject = async (
  req: Request<unknown, unknown, CreateProjectBody>,
  res: Response,
) => {
  try {
    const { name, description, sourceType } = req.body;

    const allowedTypes = ["pega", "salesforce"];

    if (sourceType && !allowedTypes.includes(sourceType)) {
      return res.status(400).json({
        error: `Invalid sourceType. Allowed values: ${allowedTypes.join(", ")}`,
      });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        sourceType: sourceType || "pega",
      },
    });

    res.status(201).json(project);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /projects/:id
export const updateProject = async (
  req: Request<{ id: string }, unknown, UpdateProjectBody>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { name, description },
    });

    res.json(updatedProject);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /projects/:id
export const deleteProject = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    await prisma.file.deleteMany({
      where: { projectId: id },
    });

    await prisma.project.delete({
      where: { id },
    });

    res.json({ message: "Project and related files deleted successfully" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /projects/:id/upload
export const uploadFiles = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const id = req.params.id;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const result = await uploadToSupabase(file);

        return prisma.file.create({
          data: {
            filename: file.originalname,
            path: result.url,
            projectId: id,
          },
        });
      }),
    );

    res.json({
      message: "Files uploaded successfully",
      uploadedFiles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
