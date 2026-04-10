import express from "express";
import cors from "cors";
import morgan from "morgan";
import { prisma } from "./lib/prisma";
import multer from "multer";

const app = express();

app.use(cors());
app.use(morgan("tiny"));

app.use(express.json());

const upload = multer({
  dest: "uploads/",
});

app.get("/projects", async (req, res) => {
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
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: id },
    });
    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/projects", async (req, res) => {
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
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, sourceType } = req.body;

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    const allowedTypes = ["pega", "salesforce"];

    if (sourceType && !allowedTypes.includes(sourceType)) {
      return res.status(400).json({
        error: `Invalid sourceType. Allowed values: ${allowedTypes.join(", ")}`,
      });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        ...(sourceType && { sourceType }),
      },
    });

    res.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/projects/:id/upload", upload.array("files"), async (req, res) => {
  try {
    const id = req.params.id as string;

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

    await prisma.file.createMany({
      data: files.map((file) => ({
        filename: file.originalname,
        path: file.path,
        projectId: id,
      })),
    });

    res.json({
      message: "Files uploaded successfully",
      files,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default app;
