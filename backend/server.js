import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { connectDB } from './config/db.js';
import userRouter from './routes/userRouter.js';
import authRouter from './routes/authRouter.js';
import contactRouter from "./routes/contactRouter.js";
import bookingRouter from "./routes/bookingRouter.js";
import adminRouter from "./routes/adminRoutes.js";
import "./cron/cron_job_automator.js";
import activityRoutes from './routes/activity_Router.js';
import mlRoutes from "./routes/ml_Routes.js";
import parkingRoutes from "./routes/parkingRoutes.js";

const app = express();
app.set("trust proxy", 1);
const port = process.env.PORT || 5000;

//middlewares
const allowedOrigins = [
  "http://localhost:3000",
  "https://campus-park.vercel.app",
  "https://campus-park-admin.vercel.app",
  "https://campuspark-gate-scanning.netlify.app"
];

// BULLET-PROOF CUSTOM CORS MIDDLEWARE
// The 'cors' package doesn't play nicely with Fastly/Railway edge caching for preflight requests in this setup.
app.use((req, res, next) => {
  const origin = req.headers.origin || req.headers.host;
  
  // Always reflect the origin if it exists, otherwise fallback to frontend url
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  
  // Important for proxies/caching: tell them the response varies based on Origin
  res.setHeader("Vary", "Origin, Access-Control-Request-Headers");

  // Intercept OPTIONS preflight requests immediately
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DEBUG LOGGING
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

//db
connectDB();

//routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/contact", contactRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use('/api/activities', activityRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/parking", parkingRoutes);

//uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// // Serve Admin Panel (CRA builds to /build)
// app.use("/admin", express.static(path.join(process.cwd(), "../admin/build")));
// app.get("/admin/*", (req, res) => {
//   res.sendFile(path.join(process.cwd(), "../admin/build", "index.html"));
// });

// // Serve User App (Vite builds to /dist)
// app.use("/", express.static(path.join(process.cwd(), "../frontend/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(process.cwd(), "../frontend/dist", "index.html"));
// });

// SOCKET.IO SETUP
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      callback(null, origin || true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

// EXPORT io (IMPORTANT)
export { io };

// Start server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});