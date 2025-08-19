export default function SummaryCard({ title, value, subtitle, children }){
    return(
        <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between">
        {/* <div className="bg-base-100 p-6 rounded-xl border border-base-300 flex justify-between"> */}
            <div>
                <h2 className="text-sm font-medium text-gray-950">{title}</h2>
                <p className="text-2xl font-semibold mt-1">{value}</p>
                <p className="text-sm text-gray-400">{subtitle}</p>
            </div>
            <div className="flex items-center">
                {children}
            </div>
        </div>
    );
}