import Modal from "../../layouts/Modal";
import TextInput from "../TextInput";
import SelectField from "../Dropdown";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function ModalUser({ isOpen, onClose, user = null, mode = "view" }) {
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [isSolarch, setIsSolarch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFullName(user.full_name || "");
      setTitle(user.title || "");
      setEmail(user.email || "");
      setContactNumber(user.contact_number || "");
      setDepartment(user.department || "");
      setIsSolarch(user.is_solarch || false);
      setIsEditing(false);
    }
  }, [isOpen, user]);

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          title,
          email,
          contact_number: contactNumber,
          department,
          is_solarch: isSolarch,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;

      setIsEditing(false);
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!user?.id) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${user.full_name}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq('id', user.id);

      if (error) throw error;

      onClose();
    } catch (error) {
      alert(`Error deleting user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const getTitle = () => {
    if (isEditing) return "Edit user";
    return "User Details";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isViewMode = !isEditing;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={getTitle()}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextInput label="Full Name" placeholder="Enter full name" value={fullName} onChange={e => setFullName(e.target.value)} disabled={isViewMode} required={true} />
        
        <TextInput label="Title" placeholder="e.g., Software Engineer, Project Manager" value={title} onChange={e => setTitle(e.target.value)} disabled={isViewMode} /> 
        <TextInput label="Email Address" type="email" placeholder="user@example.com" value={email} onChange={e => setEmail(e.target.value)} disabled={isViewMode} required={true} />
        
        <TextInput label="Contact Number" placeholder="Phone number" value={contactNumber} onChange={e => setContactNumber(e.target.value)} disabled={isViewMode} /> 
        <SelectField label="Department" value={department} onChange={(e) => setDepartment(e.target.value)} disabled={isViewMode} selectmessage="Select Department" allowEmpty={false} options={[
            { value: "Executive Office Department", label: "Executive Office Department" },
            { value: "Administrative Office Department", label: "Administrative Office Department" },
            { value: "Human Resource Department", label: "Human Resource Department" },
            { value: "Finance & Accounting Department", label: "Finance & Accounting Department" },
            { value: "Purchasing Department", label: "Purchasing Department" },
            { value: "Marketing Department", label: "Marketing Department" },
            { value: "Sales Force Department", label: "Sales Force Department" },
            { value: "Warehouse & Logistics Department", label: "Warehouse & Logistics Department" },
            { value: "Data Center Facilities Department", label: "Data Center Facilities Department" },
            { value: "MIaaS Cloud Department", label: "MIaaS Cloud Department" },
            { value: "Technical Services Department", label: "Technical Services Department" },
            { value: "Product/Solutions Management", label: "Product/Solutions Management" },
          ]}/>

        {/* Solutions Architect Checkbox */}
        <div className="flex items-center space-x-3">
          <input type="checkbox" id="is_solarch" name="is_solarch" checked={isSolarch} onChange={(e) => setIsSolarch(e.target.checked)} disabled={isViewMode} className="w-4 h-4 text-sky-950 bg-gray-100 border-gray-300 rounded focus:ring-sky-950 focus:ring-2"/>
          <label htmlFor="is_solarch" className="text-sm font-medium text-gray-700">
            Solutions Architect?
            <br />
            <span className="text-xs text-gray-500">Check to add user to activity tracking</span>
          </label>
        </div>

        {user && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Created:</span>
                <p className="text-gray-900">{formatDate(user.created_at)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">User ID:</span>
                <p className="text-gray-900 font-mono text-xs">{user.id}</p>
              </div>
              {user.updated_at && (
                <>
                  <div>
                    <span className="font-medium text-gray-600">Updated:</span>
                    <p className="text-gray-900">{formatDate(user.updated_at)}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between gap-2 mt-4">
          <div>
            {!loading && (
              <button type="button" onClick={handleDelete} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded"disabled={loading}>
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            {isViewMode ? (
              <button type="button" onClick={(e) => { e.preventDefault(); setIsEditing(true);}}className="px-4 py-2 bg-sky-600 hover:scale-99 text-white rounded">
                Edit
              </button>
            ) : (
              <button type="submit" className="px-4 py-2 bg-sky-950 hover:scale-99 text-white rounded" disabled={loading} >
                {loading ? "Updating..." : "Update User"}
              </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}