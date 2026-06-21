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

const app =
    express();

app.use(json());
app.use(cors());
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



app.use(errorHandler);

export default
    app;