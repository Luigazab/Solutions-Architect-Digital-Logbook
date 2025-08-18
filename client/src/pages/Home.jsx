"use client";
import { useState, useEffect } from "react";
import SummaryCard from "../components/SummaryCard";
import QuickActions from "../components/QuickActions";
import RecentActivities from "../components/RecentActivities";
import { supabase } from "../supabaseClient";

export default function Home() {
  const [stats, setStats] = useState({
    activities: 0,
    customers: 0,
    certificates: 0,
    industries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: activityCount, error: activityError } = await supabase
          .from("activities")
          .select("*");
        if (activityError) throw activityError;

        const { data, error } = await supabase
          .from("customers")
          .select("*");
        if (error) throw error;

        const industryCounts = {};
        data.forEach(customer => {
          industryCounts[customer.industry] = (industryCounts[customer.industry] || 0) + 1;
        });

        setStats({
          activities: activityCount.length,
          customers: data.length,
          industries: Object.keys(industryCounts).length || 0,
          certificates: activityCount.filter(activity => activity.category === 'technical_training').length,
        });
      } catch (err) {
        console.error("Data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Activities" value={stats.activities} subtitle="Total logged" />
        <SummaryCard title="Customers" value={stats.customers} subtitle="Total tracked" />
        <SummaryCard title="Certificates" value={stats.certificates} subtitle="Earned" />
        <SummaryCard title="Industries" value={stats.industries} subtitle="Served" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <QuickActions />
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <RecentActivities />
        </div>
      </div>
    </>
  );
}
