import { Link, useLocation } from "react-router-dom"

export default function Navbar(){
    const location = useLocation();

    const links =[
        { name: "Home", path: "/" },
        { name: "Log Activity", path: "/log-activity" },
        { name: "Schedule", path: "/schedule" },
        { name: "Reports", path: "/reports" },
        { name: "Certification", path: "/certifications" },
        { name: "Customer Information", path: "/customers" },
    ];

    return(
        <nav className="bg-[#003D69] text-white px-4 py-4 shadow-sm shadow-gray-300 flex justify-between items-center">
            <Link to="/">
                <div>
                    <h1 className="text-2xl font-bold leading-tight">SolArch</h1>
                    <p className="text-sm text-slate-300">Solution Architect Activity Tracker</p>
                </div>
            </Link>

            <div className="flex items-center space-x-6 text-md leading-tight">
                {links.map(link => (
                    <Link key={link.name} to={link.path} className={`${
                        location.pathname === link.path ? "bg-orange-200 font-semibold text-orange-900 p-2 rounded"
                        : "text-neutral-100 hover:underline"
                    }`}>
                        {link.name}
                    </Link>
                ))}
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm">Sampleemail@gmail.com</span>
                <Link to="/auth" className="bg-gray-100 text-sm font-medium text-gray-800 border border-gray-300 px-4 py-2 rounded hover:bg-slate-300">
                    Sign Out
                </Link>
            </div>
        </nav>
    );
}