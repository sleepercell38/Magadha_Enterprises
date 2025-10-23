import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./db/db.js";
import adminRoutes from "./routes/admin.route.js";
import projectRoutes from "./routes/project.routes.js";
import projectEventRoutes from "./routes/projectEvent.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDb();

app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects", projectEventRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Admin Backend API");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));