import express from "express";
import { authMiddleware, checkOrgOrAdmin } from "../middleware/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblem } from "../controllers/problem.controller.js";

const problemRoutes = express.Router();

problemRoutes.post("/create-problem", authMiddleware, checkOrgOrAdmin, createProblem);

problemRoutes.get("/get-all-problems", authMiddleware, getAllProblems);

problemRoutes.get("/get-problem/:id", authMiddleware, getProblemById);

problemRoutes.put("/update-problem/:id", authMiddleware, checkOrgOrAdmin, updateProblem);

problemRoutes.delete("/delete-problem/:id", authMiddleware, checkOrgOrAdmin, deleteProblem);

problemRoutes.get("/get-solved-problems", authMiddleware, getAllProblemsSolvedByUser);

problemRoutes.get("/get-hackathon-problems/:id", authMiddleware, getAllProblemsSolvedByUser);

export default problemRoutes;