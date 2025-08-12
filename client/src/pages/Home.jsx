import SummaryCard from "../components/SummaryCard";
import QuickActions from "../components/QuickActions";
import RecentActivities from "../components/RecentActivities";

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Activities" value={2} subtitle="Total logged" />
        <SummaryCard title="Customers" value={1} subtitle="Total tracked" />
        <SummaryCard title="Reports" value={0} subtitle="Generated" />
        <SummaryCard title="Training Hours" value={10} subtitle="This quarter" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <QuickActions />
        </div>
        <div className="bg-white p-6 rounded-xl border">
          <RecentActivities />
        </div>
      </div>
    </>
  );
}
