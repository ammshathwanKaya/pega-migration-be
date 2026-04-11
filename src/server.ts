import express from "express";
import cors from "cors";
import morgan from "morgan";
import apiRoutes from "./routes/api.routes";

const app = express();

app.use(cors());
app.use(morgan("tiny"));

app.use(
  express.json({
    limit: "50mb",
  }),
);

app.use("/projects", apiRoutes);

export default app;
