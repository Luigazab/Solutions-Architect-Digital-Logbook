import express from "express";
import { fetchSummary, fetchCategoryBreakdown, fetchReportTable } from "../controllers/reportController.js";

const router = express.Router();

router.get("/summary", fetchSummary);
router.get("/breakdown", fetchCategoryBreakdown);
router.get("/table", fetchReportTable);

export default router;
