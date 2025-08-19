import {Title, Subtitle} from "../components/Text";
import { supabase } from "../supabaseClient";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { getCategoryBadgeClasses } from "../utils/colors";

export default function RecentActivities(){
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('activities')
                    .select(`*, category:categories (category_name, color)`)
                    .order('created_at', { ascending: false })
                    .limit(5);
                if (error) throw error;
                setActivities(data);
            } catch (err) {
                console.error("Error fetching activities:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchActivities();
    }, []);
    return(
        <>
            <Title>Recent Activities</Title>
            <Subtitle>Latest logged activities</Subtitle>
            <div className="space-y-4 overflow-auto md:max-h-44">
                {loading ? (
                    <Loader/>
                ) : activities.map((activity, index) => (
                    <ActivitiesContent 
                        key={index}
                        activityName={activity.title}
                        solArch={activity.solarch}
                        activityDate={new Date(activity.created_at).toLocaleDateString()}
                        activityTime={new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        activityMode={activity.mode}
                        badge={activity.category.category_name}
                        badgeColor={getCategoryBadgeClasses(activity.category.color)}
                    />
                ))}
            </div>
            <div className="text-center mt-4">
                <a href="report" className="inline-block w-full text-sm border border-gray-400 py-2 rounded-lg hover:bg-gray-800 hover:text-white">View All Activities</a>
            </div>
        </>
    );
}

export function ActivitiesContent({activityName, solArch, activityDate, activityTime, activityMode, badge, badgeColor}){
    return(
        <div className="border border-gray-300 hover:bg-blue-100 hover:border-blue-300 hover:shadow-lg p-4 rounded-xl">
            <div className="flex justify-between">
                <div>
                    <h4 className="font-semibold">{activityName}</h4>
                    <p className="text-sm text-gray-500">{solArch}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                        <span>{activityDate}</span>
                        <span>{activityTime}</span>
                        <span>{activityMode}</span>
                    </p>
                </div>
                <span><span className={badgeColor}>{badge}</span></span>
            </div>
        </div>
    );
}