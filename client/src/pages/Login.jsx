import TextInput from "../components/TextInput";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";



export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");  
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) navigate("/");
        };
        checkSession();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            setError(error.message);
        } else {
            navigate("/"); 
        }
    }

    return (
        <div className="flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold">Login</h2>
                <p>Welcome back! Please enter your details to login to the system.</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <TextInput label="Email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} ></TextInput>
                <TextInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" ></TextInput>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200">
                    Login
                </button>
            </form>
        </div>
        </div>
    );
}