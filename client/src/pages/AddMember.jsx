import { useState } from "react";
import { supabase } from "../supabaseClient";
import Loader from "../components/Loader";
import { Title, Subtitle } from "../components/Text";
import TextInput from "../components/TextInput";
import SelectField from "../components/Dropdown";

export default function AddMember() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        full_name: "",
        contact_number: "",
        title: "",
        department: "",
        is_solarch: false
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange= (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
        // Step 1: Create user in auth.users
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            email_confirm: true // Auto-confirm email
        });

        if (authError) {
            throw new Error(`Authentication error: ${authError.message}`);
        }

        // Step 2: Create profile in public.profiles
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
            user_id: authData.user.id,
            full_name: formData.full_name,
            email: formData.email,
            contact_number: formData.contact_number,
            title: formData.title,
            department: formData.department,
            is_solarch: formData.is_solarch
            });

        if (profileError) {
            // If profile creation fails, we should clean up the auth user
            await supabase.auth.admin.deleteUser(authData.user.id);
            throw new Error(`Profile creation error: ${profileError.message}`);
        }

        setSuccess('Member added successfully!');
        setFormData({
            email: '',
            password: '',
            full_name: '',
            contact_number: '',
            title: '',
            department: '',
            is_solarch: false
        });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white shadow-md rounded-lg px-8 py-6">
                <div className="flex flex-col items-center text-center">
                    <Title>Add New Member</Title>
                    <Subtitle>Create a new user account and profile</Subtitle>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 text-sm">{success}</p>
                    </div>
                )}

                <div className="space-y-4">
                    <TextInput htmlFor="full_name" label={"Full Name *"} name="full_name" id="full_name" value={formData.full_name} onChange={handleInputChange} placeholder={"Enter full name"} required={true}></TextInput>
                    <TextInput htmlFor="email" label={"Email Address *"} name="email" id="email" value={formData.email} onChange={handleInputChange} placeholder={"Enter email address"} required={true}></TextInput>
                    <TextInput htmlFor="password" type="password" label={"Password *"} name="password" id="password" value={formData.password} onChange={handleInputChange} minlength={6} placeholder={"Enter password (min 6 characters)"} required={true}></TextInput>
                    <TextInput htmlFor="contact_number" type="tel" label={"Contact Number"} name="contact_number" id="contact_number" value={formData.contact_number} onChange={handleInputChange} placeholder={"Enter contact number"}></TextInput>
                    <TextInput htmlFor="title" label={"Job Title"} name="title" id="title" value={formData.title} onChange={handleInputChange} placeholder={"Enter job title"}></TextInput>
                    <SelectField htmlFor="department" label={"Department"} name="department" value={formData.department} onChange={handleInputChange} selectmessage={"Select Department"}
                        options={[
                            { value: "Engineering", label: "Engineering" },
                            { value: "Marketing", label: "Marketing" },
                            { value: "Sales", label: "Sales" },
                            { value: "HR", label: "Human Resources" },
                            { value: "Finance", label: "Finance" },
                            { value: "Operations", label: "Operations" },
                            { value: "Customer Support", label: "Customer Support" }
                    ]}/>
                    
                    {/* Solutions Architect Checkbox */}
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="is_solarch"
                            name="is_solarch"
                            checked={formData.is_solarch}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-sky-950 bg-gray-100 border-gray-300 rounded focus:ring-sky-950 focus:ring-2"
                        />
                        <label htmlFor="is_solarch" className="text-sm font-medium text-gray-700">
                            Solutions Architect
                        </label>
                    </div>

                    <button onClick={handleSubmit} disabled={loading}
                        className={`w-full py-2 px-4 rounded-md font-medium text-white ${
                            loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-sky-950 hover:bg-slate-900 hover:text-amber-200 hover:scale-99 focus:outline-none focus:ring-2 focus:ring-sky-950 focus:ring-offset-2'
                        } transition-colors duration-200`}>
                        {loading ? 'Adding Member...' : 'Add Member'}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <button onClick={() => window.history.back()}
                        className="text-amber-600 hover:text-sky-800 text-sm font-medium">
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}