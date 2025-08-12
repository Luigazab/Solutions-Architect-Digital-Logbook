import SummaryCard from "../components/SummaryCard";

export default function LogActivity() {
  return (
    <>
      <div className="p-5 max-w-8xl mx-auto space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard title="Activities" value={2} subtitle="Total logged" />
          <SummaryCard title="Customers" value={1} subtitle="Total tracked" />
          <SummaryCard title="Reports" value={0} subtitle="Generated" />
          <SummaryCard title="Training Hours" value={10} subtitle="This quarter" />
        </div>
      </div>
    </>
  );
}
