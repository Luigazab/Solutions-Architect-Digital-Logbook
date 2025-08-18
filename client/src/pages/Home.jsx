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
        <SummaryCard title="Activities" value={stats.activities} subtitle="Total logged">
          <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M249.9 66.8c10.4-14.3 7.2-34.3-7.1-44.7s-34.3-7.2-44.7 7.1l-106 145.7-37.5-37.5c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c6.6 6.6 15.8 10 25.1 9.3s17.9-5.5 23.4-13.1l128-176zm128 136c10.4-14.3 7.2-34.3-7.1-44.7s-34.3-7.2-44.7 7.1l-170 233.7-69.5-69.5c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c6.6 6.6 15.8 10 25.1 9.3s17.9-5.5 23.4-13.1l192-264z"/></svg>
        </SummaryCard>
        <SummaryCard title="Customers" value={stats.customers} subtitle="Total tracked">
          <svg className="w-10 h-10" viewBox="0 0 24 24" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg"><path d="M20 20H4c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h16c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3M4 6c-.551 0-1 .449-1 1v10c0 .551.449 1 1 1h16c.551 0 1-.449 1-1V7c0-.551-.449-1-1-1zm6 9H6a1 1 0 1 1 0-2h4a1 1 0 1 1 0 2m0-4H6a1 1 0 1 1 0-2h4a1 1 0 1 1 0 2"/><circle cx="16" cy="10.5" r="2"/><path d="M16 13.356c-1.562 0-2.5.715-2.5 1.429 0 .357.938.715 2.5.715 1.466 0 2.5-.357 2.5-.715 0-.714-.98-1.429-2.5-1.429"/></svg>
        </SummaryCard>
        <SummaryCard title="Certificates" value={stats.certificates} subtitle="Earned">
          <svg className="w-10 h-10" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 14.5H9a.5.5 0 0 0 .8.4zm2-1.5.3-.4a.5.5 0 0 0-.6 0zm2 1.5-.3.4a.5.5 0 0 0 .8-.4zm-2-3.5A2.5 2.5 0 0 1 9 8.5H8a3.5 3.5 0 0 0 3.5 3.5zM14 8.5a2.5 2.5 0 0 1-2.5 2.5v1A3.5 3.5 0 0 0 15 8.5zM11.5 6A2.5 2.5 0 0 1 14 8.5h1A3.5 3.5 0 0 0 11.5 5zm0-1A3.5 3.5 0 0 0 8 8.5h1A2.5 2.5 0 0 1 11.5 6zM9 10.5v4h1v-4zm.8 4.4 2-1.5-.6-.8-2 1.5zm1.4-1.5 2 1.5.6-.8-2-1.5zm2.8 1.1v-4h-1v4zM15 5V1.5h-1V5zm-1.5-5h-12v1h12zM0 1.5v12h1v-12zM1.5 15H8v-1H1.5zM0 13.5A1.5 1.5 0 0 0 1.5 15v-1a.5.5 0 0 1-.5-.5zM1.5 0A1.5 1.5 0 0 0 0 1.5h1a.5.5 0 0 1 .5-.5zM15 1.5A1.5 1.5 0 0 0 13.5 0v1a.5.5 0 0 1 .5.5zM3 5h5V4H3zm0 3h3V7H3z" fill="#000"/></svg>
        </SummaryCard>
        <SummaryCard title="Industries" value={stats.industries} subtitle="Served">
          <svg className="w-10 h-10"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60.272 60.272" xmlSpace="preserve"><path d="m31.577 1.863 12.462 8.139v48.577H31.577zm13.438 35.012v21.449h15.258V41.749zm6.442 16.786-4.662-1.357V48.28l4.662 1.692zm0-7.037-4.662-1.358v-4.022l4.662 1.694zm5.849 8.73-4.664-1.355v-4.026l4.664 1.695zm0-7.036-4.663-1.356v-4.024l4.665 1.692v3.688zM14.75 11.527v32.208l-2.203 1.439V34.417l-1.398.578v-10.73L.974 28.757V39.21L0 39.614v18.965h30.154V1.694zM1.907 30.804l3.434-1.589v4.132l-3.434 1.526zm.255 6.697 3.433-1.591v4.135l-3.433 1.524zm3.537 14.844-3.433 1.528v-4.071l3.433-1.589zm0-6.296-3.433 1.529v-4.071l3.433-1.588zm.489-17.237 3.434-1.589v4.133l-3.434 1.525zm.255 6.696 3.433-1.589v4.133l-3.433 1.527zm3.835 14.868-3.434 1.527v-4.069l3.434-1.591zm0-6.295-3.434 1.525v-4.067l3.434-1.59zm10.999.716-4.749 2.973v-4.408l4.749-3.072zm0-7.448-4.749 2.971v-4.41l4.749-3.072zm0-7.45-4.749 2.974v-4.411l4.749-3.074zm0-7.449-4.749 2.97v-4.408l4.749-3.074zm0-7.451-4.749 2.972v-4.409l4.749-3.073zm7.036 25.396-5.51 3.448V39.3l5.51-3.566zm0-7.45-5.51 3.449V31.85l5.51-3.568zm0-7.45-5.51 3.449v-4.542l5.51-3.569zm0-7.45-5.51 3.449v-4.543l5.51-3.568zm0-7.451-5.51 3.449V9.5l5.51-3.568z"/></svg>
        </SummaryCard>
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
