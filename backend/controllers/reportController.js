import * as ReportModel from "../models/reportModel.js";

export async function fetchSummary(req, res) {
  try {
    const summary = await ReportModel.getSummary();
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function fetchCategoryBreakdown(req, res) {
  try {
    const breakdown = await ReportModel.getCategoryBreakdown();
    res.json(breakdown);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function fetchReportTable(req, res) {
  try {
    const tableData = await ReportModel.getReportTable();
    res.json(tableData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
