import express from "express"
import { createCampaign, deleteCampaign, getCampaigns, updateCampaign } from "../controllers/campaign.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const CampaignRouter = express.Router();

CampaignRouter.post("/", authMiddleware, createCampaign);
CampaignRouter.get("/", authMiddleware, getCampaigns);
CampaignRouter.put("/:id", authMiddleware, updateCampaign);
CampaignRouter.delete("/:id", authMiddleware, deleteCampaign);
