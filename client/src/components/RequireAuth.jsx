import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Loader from "./Loader";

export default function RequireAuth({ children }) {
    const [loading, setLoading] = useState(true);
    const [showLoader, setShowLoader] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let loaderTimeout= setTimeout(() => 
            setShowLoader(true), 500
        );
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate("/auth", { replace: true }); // Redirect to login if not authenticated
            } else{
                setAuthenticated(true);
            }
            clearTimeout(loaderTimeout);
            setLoading(false);
            setShowLoader(false);
        };
        checkSession();

        return () => clearTimeout(loaderTimeout); // Cleanup timeout on unmount
    }, [navigate]);

    if (loading && showLoader && location.pathname !== "/auth") return <Loader />;

    return authenticated ? children : null; // Render children if authenticated
}