import { Router } from "express";
import multer from "multer";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  uploadFiles,
} from "../controllers/project.controller";
import { analyzeProject } from "../controllers/openai.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// project routes
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

// upload
router.post("/:id/upload", upload.array("files"), uploadFiles);

// AI route
router.post("/analyse/:id", analyzeProject);

export default router;
