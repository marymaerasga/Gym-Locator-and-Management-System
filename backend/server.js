import path from "path";
import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
const PORT = 5000;
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import gymOwnerRoutes from "./routes/gymOwnerRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import trainerRoutes from "./routes/trainerRoutes.js";

connectDB();

const app = express();

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": [
        "https://gymlocator.co",
        "https://res.cloudinary.com/",
        "https://maps.gstatic.com",
        "https://maps.googleapis.com",
        "data:",
      ],
      "script-src": [
        "self",
        "https://maps.googleapis.com",
        "https://gymlocator.co",
      ],
      "connect-src": [
        "self",
        "https://maps.googleapis.com",
        "https://gymlocator.co",
      ],
      upgradeInsecureRequests: [],
    },
    reportOnly: false,
  })
);

app.disable("x-powered-by");

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// app.use(cors());

app.use(cookieParser());

app.use("/api", publicRoutes);
app.use("/api/users", userRoutes);
app.use("/api/gymowner", gymOwnerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/trainer", trainerRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// POST /api/users** - Register a user
// POST /api/users/auth** - Authenticate a user and get token
// POST /api/users/logout** - Logout user and clear cookie
// GET /api/users/profile** - Get user profile
// PUT /api/users/profile** - Update profile
// GET /api/search/ratings** - Search Player Profile
