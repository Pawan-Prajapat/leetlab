import express from "express";
import { authMiddleware } from "../middleware/auth.middleware";

const hackathonRoutes = express.Router();

hackathonRoutes.get("/get-all",authMiddleware, getAllHackathon);
hackathonRoutes.get("/run-upcoming",authMiddleware, getCurrUpHackathon);
hackathonRoutes.get("/:hackathonId",authMiddleware, getHackathonDetails);
hackathonRoutes.post("/create",authMiddleware, createHackathon);
hackathonRoutes.post("/:hackathonId/add-problem",authMiddleware, addProblemToHackathon);
hackathonRoutes.put("/update/:hackathonId",authMiddleware, updateHackathon);
hackathonRoutes.delete("/:hackathonId",authMiddleware, deleteHackathon);
hackathonRoutes.delete("/:hackathonId/remove-problem",authMiddleware, removeProblemFromHackathon);

export default hackathonRoutes;