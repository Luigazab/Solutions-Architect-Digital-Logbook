import { Link, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";

export default function Navbar(){
    const location = useLocation();
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");

    const links =[
        { name: "Home", path: "/" },
        { name: "Log Activity", path: "/log-activity" },
        { name: "Schedule", path: "/schedule" },
        { name: "Reports", path: "/reports" },
        { name: "Certification", path: "/certifications" },
        { name: "Customer Information", path: "/customer" },
    ];

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error.message);
        } else {
            navigate("/auth"); // Redirect to login after signing out
        }
    }
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserEmail(data?.user?.email || "");
        });
    }, []);

    return(
        <nav className="bg-sky-950 text-white px-4 py-4 shadow-sm shadow-gray-300 flex justify-between items-center">
            <Link to="/">
                <div>
                    <h1 className="text-2xl font-bold leading-tight">SolArch</h1>
                    <p className="text-sm text-slate-300">Solution Architect Activity Tracker</p>
                </div>
            </Link>

            <div className="flex items-center space-x-6 text-md leading-tight">
                {links.map(link => (
                    <Link key={link.name} to={link.path} className={`${
                        location.pathname === link.path ? "text-lg font-semibold text-orange-200 p-2"
                        : "text-slate-500 hover:text-sky-50 hover:font-medium"
                    }`}>
                        {link.name}
                    </Link>
                ))}
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm">{userEmail}</span>
                <button onClick={handleSignOut} className="bg-gray-100 text-sm font-medium text-gray-800 border border-gray-300 px-4 py-2 rounded hover:bg-slate-300">
                    Sign Out
                </button>
                {/* <button
                className="bg-primary text-primary-content px-4 py-2 rounded-lg"
                onClick={() => {
                    const html = document.documentElement;
                    html.setAttribute('data-theme', html.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
                }}
                >
                Toggle Theme
                </button> */}
            </div>
        </nav>
    );
}