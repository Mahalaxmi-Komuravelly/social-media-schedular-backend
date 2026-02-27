import express from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
export const AnalyticsRouter = express.Router();

AnalyticsRouter.get("/", authMiddleware, getAnalytics);