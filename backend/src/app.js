import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import investmentRoutes from "./routes/investmentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import referralRoutes from "./routes/referralRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import roiRoutes from "./routes/roiRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.js";
import path from "path";
import { fileURLToPath } from "url";

const app =
    express();

app.use(json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(helmet());

app.use(morgan("dev"));
app.use(
"/api/docs",
swaggerUi.serve,
swaggerUi.setup(swaggerDocument)
);
app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/investments",
    investmentRoutes
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use(
    "/api/referrals",
    referralRoutes
);
app.use(
  "/api/roi-history",
  roiRoutes
);
app.use(
  "/api/plans",
  planRoutes
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// React build folder
const frontendPath = path.join(
  __dirname,
  "../../frontend/dist"
);

app.use(express.static(frontendPath));

// React Router support
app.use((req, res) => {
  res.sendFile(
    path.join(frontendPath, "index.html")
  );
});


app.use(errorHandler);

export default
    app;