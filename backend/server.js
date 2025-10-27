import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./db/db.js";
import adminRoutes from "./routes/admin.route.js";
import projectRoutes from "./routes/project.routes.js";
import projectEventRoutes from "./routes/projectEvent.routes.js";

dotenv.config();

const app = express();

// Configure CORS for production
const corsOptions = {
  origin: [
    "http://localhost:5173", // Local development
    "http://localhost:3000", // Local development alternate
    process.env.FRONTEND_URL, // Production frontend URL
    "https://*.vercel.app", // Allow all Vercel preview deployments
  ].filter(Boolean),
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to database
connectDb();

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects", projectEventRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to the Admin Backend API",
    status: "running"
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;