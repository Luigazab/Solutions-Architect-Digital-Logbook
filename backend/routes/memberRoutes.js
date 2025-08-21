import express from "express";
import { createMember, listMembers } from "../controllers/memberController.js";

const router = express.Router();

router.post("/", createMember);
router.get("/", listMembers);

export default router;
