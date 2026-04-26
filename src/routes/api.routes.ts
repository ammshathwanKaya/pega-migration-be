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
import {
  analyzeProject,
  getOpenAIConfigController,
  getProjectAnalysis,
  saveOpenAIConfig,
  validateOpenAIKey,
} from "../controllers/openai.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/config", saveOpenAIConfig);
router.get("/config", getOpenAIConfigController);

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
router.get("/:id/analysis", getProjectAnalysis);
router.post("/validate", validateOpenAIKey);

export default router;
