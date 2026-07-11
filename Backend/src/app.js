const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

// Routes
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.get("/api/health", (req, res) => {
    res.json({ message: "SkillBridge API is running 🚀" });
});

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// Serve the built React frontend (all-in-one deployment).
// Present after `npm run build` in Frontend/ — skipped in local dev where Vite serves it.
const clientDist = path.join(__dirname, "..", "..", "Frontend", "dist");
if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));

    // Send index.html for any non-API GET so client-side routing works.
    app.use((req, res, next) => {
        if (req.method !== "GET" || req.path.startsWith("/api")) return next();
        res.sendFile(path.join(clientDist, "index.html"));
    });
}

module.exports = app;
