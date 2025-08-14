import {Title, Subtitle} from "../components/Text";

export default function RecentActivities(){
    return(
        <>
            <Title>Pending Activites</Title>
            <Subtitle>Pending and ongoing logged activites</Subtitle>
            <div className="space-y-4">
                <ActivitiesContent activityName="Example" solArch="Sir me" activityDate="Aug 13, 2025" activityTime="11:47:00" activityMode="Virtual" badge="Meetings Attended"/>
                <ActivitiesContent activityName="Another Sample" solArch="Sir you" activityDate="Aug 2, 2025" activityTime="04:00:00" activityMode="Onsite" badge="Client Visit" />
            </div>
            <div className="text-center mt-4">
                <a href="all_activities.php" className="inline-block w-full text-sm border border-gray-400 py-2 rounded-lg hover:bg-gray-800 hover:text-white">View All Activities</a>
            </div>
        </>
    );
}

export function ActivitiesContent({activityName, solArch, activityDate, activityTime, activityMode, badge}){
    return(
        <div className="border border-gray-300 hover:bg-slate-100 hover:shadow-lg p-4 rounded-xl">
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
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full self-start">{badge}</span>
            </div>
        </div>
    );
}