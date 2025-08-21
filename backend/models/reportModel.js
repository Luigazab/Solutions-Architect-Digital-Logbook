import supabase from "../supabaseClient.js";

// 🔹 Get summary stats
export async function getSummary() {
  const [{ count: activityCount }, { count: customerCount }] = await Promise.all([
    supabase.from("activities").select("*", { count: "exact", head: true }),
    supabase.from("customers").select("*", { count: "exact", head: true })
  ]);

  return { activityCount, customerCount };
}

// 🔹 Breakdown by category
export async function getCategoryBreakdown() {
  const { data, error } = await supabase
    .from("activities")
    .select("category:categories(category_name, color)");

  if (error) throw error;

  // aggregate counts
  const breakdown = {};
  data.forEach((row) => {
    const cat = row.category.category_name;
    if (!breakdown[cat]) {
      breakdown[cat] = { count: 0, color: row.category.color };
    }
    breakdown[cat].count++;
  });

  return Object.entries(breakdown).map(([name, obj]) => ({
    category: name,
    count: obj.count,
    color: obj.color,
  }));
}

// 🔹 Full report table (with joins)
export async function getReportTable() {
  const { data, error } = await supabase
    .from("activities")
    .select(`
      id,
      title,
      created_at,
      customer:customers(name),
      category:categories(category_name, color)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
