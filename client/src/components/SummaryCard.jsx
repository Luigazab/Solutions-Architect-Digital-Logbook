export default function SummaryCard({ title, value, subtitle }){
    return(
        <div className="bg-white p-5 rounded-xl border">
            <h2 className="text-sm font-medium text-gray-950">{title}</h2>
            <p className="text-2xl font-semibold mt-1">{value}</p>
            <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
    );
}