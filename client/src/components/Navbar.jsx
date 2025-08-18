import { Link, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import Loader from "./Loader";

export default function Navbar(){
    const location = useLocation();
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const links = [
        { name: "Home", path: "/" },
        { name: "Log Activity", path: "/log-activity" },
        { name: "Schedule", path: "/schedule" },
        { name: "Reports", path: "/report" },
        { name: "Certification", path: "/certification" },
        { name: "Customer Information", path: "/customer" },
    ];

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error.message);
        } else {
            setUserEmail("");
            setIsAuthenticated(false);
            navigate("/auth"); // Redirect to login after signing out
        }
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const closeUserDropdown = () => {
        setIsUserDropdownOpen(false);
    };

    const userDropdownItems = [
        { name: "Profile", path: "/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
        { name: "Settings", path: "/settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" },
        { name: "Add Member", path: "/add-member", icon: "M17,19 L17,16.5 C17,16.2238576 17.2238576,16 17.5,16 C17.7761424,16 18,16.2238576 18,16.5 L18,19 L20.5,19 C20.7761424,19 21,19.2238576 21,19.5 C21,19.7761424 20.7761424,20 20.5,20 L18,20 L18,22.5 C18,22.7761424 17.7761424,23 17.5,23 C17.2238576,23 17,22.7761424 17,22.5 L17,20 L14.5,20 C14.2238576,20 14,19.7761424 14,19.5 C14,19.2238576 14.2238576,19 14.5,19 L17,19 Z M14.0425135,13.5651442 C13.4188979,13.8445863 12.7275984,14 12,14 C11.2738711,14 10.5838946,13.8452135 9.96126583,13.5668358 L5.87929558,15.4222768 C5.34380416,15.665682 5,16.1996113 5,16.7878265 L5,17.5 C5,18.3284271 5.67157288,19 6.5,19 L11.5,19 C11.7761424,19 12,19.2238576 12,19.5 C12,19.7761424 11.7761424,20 11.5,20 L6.5,20 C5.11928813,20 4,18.8807119 4,17.5 L4,16.7878265 C4,15.8074678 4.57300693,14.9175857 5.46549264,14.5119103 L8.92215823,12.9406987 C7.75209123,12.0255364 7,10.6005984 7,9 C7,6.23857625 9.23857625,4 12,4 C14.7614237,4 17,6.23857625 17,9 C17,10.5929224 16.2551051,12.0118652 15.0946468,12.927497 L17.6966094,14.0402775 C17.9505071,14.1488619 18.0683068,14.4427117 17.9597225,14.6966094 C17.8511381,14.9505071 17.5572883,15.0683068 17.3033906,14.9597225 L14.0425135,13.5651442 L14.0425135,13.5651442 Z M12,13 C14.209139,13 16,11.209139 16,9 C16,6.790861 14.209139,5 12,5 C9.790861,5 8,6.790861 8,9 C8,11.209139 9.790861,13 12,13 Z" }
    ];

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUserEmail(user.email || "");
                    setIsAuthenticated(true);
                } else {
                    setUserEmail("");
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error getting user:", error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        getUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUserEmail(session.user.email || "");
                setIsAuthenticated(true);
            } else {
                setUserEmail("");
                setIsAuthenticated(false);
                setIsUserDropdownOpen(false);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <nav className="bg-sky-950 text-white px-4 py-4 shadow-sm shadow-gray-300 flex justify-between items-center">
                <Link to="/">
                    <div>
                        <h1 className="text-2xl font-bold leading-tight">SolArch</h1>
                        <p className="hidden text-sm text-slate-300 md:block">Solution Architect Activity Tracker</p>
                    </div>
                </Link>
                <div className="flex items-center">
                    <Loader />
                </div>
            </nav>
        );
    }

    return(
        <>
            <nav className="bg-sky-950 text-white px-4 py-4 shadow-sm shadow-gray-300 flex justify-between items-center relative z-50">
                <Link to="/">
                    <div>
                        <h1 className="text-2xl font-bold leading-tight">SolArch</h1>
                        <p className="hidden text-sm text-slate-300 md:block">Solution Architect Activity Tracker</p>
                    </div>
                </Link>

                {/* Desktop Navigation - Only show if authenticated */}
                {isAuthenticated && (
                    <div className="hidden items-center space-x-6 text-md leading-tight lg:flex">
                        {links.map(link => (
                            <Link 
                                key={link.name} 
                                to={link.path} 
                                className={`transition-all duration-200 ${
                                    location.pathname === link.path 
                                        ? "text-lg font-semibold text-amber-400 p-2 border-b-2 border-amber-400"
                                        : "text-slate-300 hover:text-amber-200 hover:font-medium px-2 py-1 rounded-md hover:bg-sky-900"
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Right side content */}
                <div className="flex items-center gap-4">
                    {isAuthenticated && (
                        <>
                            <div className="relative">
                                <button onClick={toggleUserDropdown} className="flex items-center justify-center text-amber-400 rounded-full hover:text-amber-500 transition-all duration-200 hover:ring-2 hover:ring-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400" aria-label="User menu">
                                    <svg className="w-10 h-10" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M463 448.2c-22.1-38.4-63.6-64.2-111-64.2h-64c-47.4 0-88.9 25.8-111 64.2 35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8M64 320C64 178.6 178.6 64 320 64s256 114.6 256 256-114.6 256-256 256S64 461.4 64 320m256 16c39.8 0 72-32.2 72-72s-32.2-72-72-72-72 32.2-72 72 32.2 72 72 72"/></svg>
                                </button>
                                {isUserDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm text-gray-600 truncate">{userEmail}</p>
                                        </div>
                                        {userDropdownItems.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.path}
                                                onClick={closeUserDropdown}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-900 transition-colors duration-150"
                                            >
                                                <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                                </svg>
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Desktop Sign Out Button */}
                            <button onClick={handleSignOut} className="flex items-center justify-between bg-amber-400 text-sm font-medium text-sky-950 px-4 py-2 rounded-full hover:bg-amber-500 hover:text-sky-950 hover:ring-1 hover:ring-amber-400 transition-all duration-300 shadow-md hover:shadow-lg transform">
                                <svg className="w-4 h-4 hidden md:block" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M1 1h7v1H2v11h6v1H1zm9.854 3.146 3.34 3.34-3.327 3.603-.734-.678L12.358 8H4V7h8.293l-2.147-2.146z" fill="currentColor"/></svg>
                                Sign Out
                            </button>
                            {/* Mobile menu button - Only show if authenticated */}
                            <button
                                onClick={toggleMobileMenu}
                                className="lg:hidden p-2 rounded-md hover:bg-sky-900 transition-colors duration-200"
                                aria-label="Toggle mobile menu"
                            >
                                <svg className={`w-6 h-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>

                            
                        </>
                    )}
                </div>
            </nav>



            {/* Mobile Sidebar Overlay */}
            {isAuthenticated && (isMobileMenuOpen || isUserDropdownOpen) && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
                    onClick={() => {
                        closeMobileMenu();
                        closeUserDropdown();
                    }}
                ></div>
            )}

            {/* Mobile Sidebar */}
            {isAuthenticated && (
                <div className={`fixed top-0 right-0 h-full w-80 bg-sky-950 text-white transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    <div className="p-6">
                        {/* Sidebar Header */}
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-amber-400">Menu</h2>
                                <p className="text-sm text-slate-300 mt-1">{userEmail}</p>
                            </div>
                            <button
                                onClick={closeMobileMenu}
                                className="p-2 rounded-full hover:bg-sky-800 transition-colors duration-200"
                                aria-label="Close menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation Links */}
                        
                        <nav className="space-y-2">
                            {links.map(link => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={closeMobileMenu}
                                    className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                                        location.pathname === link.path
                                            ? "bg-amber-600 text-sky-950 font-semibold shadow-lg"
                                            : "text-slate-300 hover:bg-sky-800 hover:text-white hover:pl-6"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Mobile Sign Out Button */}
                        <div className="mt-8 pt-8 border-t border-sky-700">
                            <button onClick={() => {closeMobileMenu();handleSignOut();}}
                                className="w-full bg-amber-600 text-sky-950 font-semibold py-3 px-4 rounded-lg hover:bg-amber-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}