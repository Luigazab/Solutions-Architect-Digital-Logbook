import {Title, Subtitle} from "../components/Text";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { getCategoryBadgeClasses } from "../utils/colors";
import { Link, useNavigate } from "react-router-dom";
import { activityService } from "../api/activity";

export default function RecentActivities(){
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                const { data, error } = await activityService.fetchActivities();

                if (error) {
                    console.error("Error fetching activities:", error);
                    setLoading(false);
                    return;
                }
                setActivities(data);
            } catch (err) {
                console.error("Error fetching activities:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchActivities();
    }, []);


    const handleActivityClick = (activityId) => {
        navigate(`/view-edit-activity?id=${activityId}`);
    };

    return(
        <>
            <Title>Recent Activities</Title>
            <Subtitle>Latest logged activities</Subtitle>
            <div className="space-y-4">
                {loading ? (
                    <Loader/>
                ) : activities.slice(0,5).map((activity, index) => (
                    <ActivitiesContent 
                        key={index}
                        onClick={() => handleActivityClick(activity.id)}
                        activityName={activity.title}
                        solArch={activity.user_profile?.full_name}
                        activityDate={new Date(activity.created_at).toLocaleDateString()}
                        activityTime={`${activity.start_time} - ${activity.end_time}`} 
                        activityMode={activity.mode}
                        badge={activity.category.category_name}
                        badgeColor={getCategoryBadgeClasses(activity.category.color)}
                    />
                ))}
            </div>
            <Link to="report">
            <div className="text-center mt-4">
                <div className="inline-block w-full text-sm border border-gray-400 py-2 rounded-lg hover:bg-gray-800 hover:text-white">View All Activities</div>
            </div>
            </Link>
        </>
    );
}

export function ActivitiesContent({onClick, activityName, solArch, activityDate, activityTime, activityMode, badge, badgeColor}){
    return(
        <div className="border border-gray-300 hover:bg-blue-100 hover:border-blue-300 hover:shadow-lg p-4 rounded-xl cursor-pointer" onClick={onClick}>
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
                <span><span className={`${badgeColor} truncate`}>{badge}</span></span>
            </div>
        </div>
    );
}