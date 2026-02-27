import express from "express";
import { getAllUsers, updateUserRole } from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizedRoles } from "../middlewares/role.middleware.js";

export const UserRouter = express.Router();

UserRouter.get("/", authMiddleware, authorizedRoles("ADMIN", "MANAGER"), getAllUsers);

UserRouter.put("/:id/role", authMiddleware, authorizedRoles("ADMIN"), updateUserRole);

