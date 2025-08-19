import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Supabase client (service role key for secure backend calls)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Example route: get activities
app.get("/api/activities", async (req, res) => {
  const { data, error } = await supabase.from("activities").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
