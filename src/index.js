import "dotenv/config";
import express from "express";
import connectToDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import logger from "./logger.js";

const app = express();

// DB Connection
connectToDB();

// Use Morgan for logging HTTP requests with a custom format
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const [method, url, status, responseTime] = message.trim().split(" ");
        const logObject = {
          method,
          url,
          status,
          responseTime: responseTime.replace('ms', ''), // Remove 'ms' for numeric value
        };

        logger.info(`${logObject.method.toUpperCase()} ${logObject.url} ${logObject.status} - ${logObject.responseTime}ms`);
      },
    },
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
}));

// Routes Import
import userRoutes from "./routes/user.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import courseRouter from "./routes/course.routes.js";


// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/course", courseRouter);


app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the Asha Learnalogy API"
  })
})

app.get("*", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found"
  })
})

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log("⚙️  Server is running on port 8000");
})