import { useState, useEffect } from "react";
import Modal from "../../layouts/Modal";
import TextInput from "../TextInput";
import SelectField from "../Dropdown";
import { customerService } from "../../api/customerService";

export default function ModalCustomer({ isOpen, onClose, customer=null, mode="add", accountManagers = [] }) {
  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    address: "",
    location: "",
    contact_person: "",
    designation: "",
    contact_number: "",
    email: "",
    website: "",
    account_manager: ""
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if(isOpen){
      if (customer && mode === "view") {
        setFormData({
          company_name: customer.company_name || "",
          industry: customer.industry || "",
          address: customer.address || "",
          location: customer.location || "",
          contact_person: customer.contact_person || "",
          designation: customer.designation || "",
          contact_number: customer.contact_number || "",
          email: customer.email || "",
          website: customer.website || "",
          account_manager: customer.account_manager?.id || ""
        });
        setIsEditing(false);
      }else if(mode === "add"){
        resetForm();
        setIsEditing(false);
      }
    }
  }, [isOpen, customer, mode]);

  const resetForm = () => {
    setFormData({
      company_name: "",
      industry: "",
      address: "",
      location: "",
      contact_person: "",
      designation: "",
      contact_number: "",
      email: "",
      website: "",
      account_manager: ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalUrl = formData.website.trim();
      if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }

      const customerData = { ...formData, website: finalUrl, account_manager: formData.account_manager || null };

      if ( mode === "add") {
        await customerService.createCustomer(customerData);
        resetForm();
      } else {
        await customerService.updateCustomer(customer.id, customerData);
        setIsEditing(false);
      }
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!customer?.id) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${customer.company_name}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from("customers").delete().eq('id', customer.id);
      
      if (error) throw error;
      
      onClose();
    } catch (error) {
      alert(`Error deleting customer: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  const getTitle = () => {
    if(mode === "add") return "Create New Customer";
    if(isEditing) return "Edit Customer";
    return "Customer Details";
  };

  const isViewMode = mode === "view" && !isEditing;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={getTitle()}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextInput label="Company Name" name="company_name" placeholder="Company name" value={formData.company_name} onChange={handleChange} disabled={isViewMode} required={true} />
        <TextInput label="Industry" name="industry" placeholder="e.g., Healthcare, Finance" value={formData.industry} onChange={handleChange} disabled={isViewMode} required={true} />
        <TextInput label="Address" name="address" placeholder="Street, Bldg. Unit." value={formData.address} onChange={handleChange} disabled={isViewMode} required={true} />
        <TextInput label="Location" name="location" placeholder="City, Region" value={formData.location} onChange={handleChange} disabled={isViewMode} required={true} />

        <div className="grid grid-cols-2 gap-2">
          <TextInput label="Contact Person" name="contact_person" placeholder="Contact person name" value={formData.contact_person} onChange={handleChange} disabled={isViewMode} />
          <TextInput label="Designation" name="designation" placeholder="IT Manager, Admin" value={formData.designation} onChange={handleChange} disabled={isViewMode} />
          <TextInput label="Contact Number" name="contact_number" placeholder="+63 912 456 7890" type="tel" value={formData.contact_number} onChange={handleChange} disabled={isViewMode} />
          <TextInput label="Contact Email" name="email" placeholder="email@example.com" type="text" value={formData.email} onChange={handleChange} disabled={isViewMode} />
        </div>

        <TextInput label="Website" name="website" placeholder="https://example.com" value={formData.website} onChange={handleChange} disabled={isViewMode}/>
        <SelectField label="Account Manager" name="account_manager" value={formData.account_manager} onChange={handleChange} selectmessage="Select Account Manager (Optional)" allowEmpty={true} disabled={isViewMode}
            options={accountManagers.map(manager => ({ value: manager.id, label: `${manager.name} - ${manager.position}` }))}/>
        {mode === "view" && customer && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-gray-900">Customer Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Created:</span>
                <p className="text-gray-900">{formatDate(customer.created_at)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Created by:</span>
                <p className="text-gray-900">{customer.added_by_profile.full_name || '-'}</p>
              </div>
              {customer.updated_at && (
                <>
                  <div>
                    <span className="font-medium text-gray-600">Last Updated:</span>
                    <p className="text-gray-900">{formatDate(customer.updated_at)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Updated by:</span>
                    <p className="text-gray-900">{customer.updated_by_profile.full_name || '-'}</p>
                  </div>
                </>
              )}
            </div>
            
            <div className="pt-2 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-2 text-sm">
                {customer.website && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Website:</span>
                    <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                      {customer.website}
                    </a>
                  </div>
                )}
                {customer.account_manager && (
                  <div>
                    <span className="font-medium text-gray-600">Current Account Manager:</span>
                    <p className="text-gray-900">
                      {customer.account_manager.name} - {customer.account_manager.position}
                      <span className="text-gray-500 text-xs ml-2">({customer.account_manager.department})</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between gap-2 mt-4">
          <div>
            {mode === "view" && !loading &&(
              <button type="button" onClick={handleDelete} className= "px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded" disabled={loading}>Delete</button>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded hover:scale-99">Cancel</button>
            {isViewMode ? (
              <button type="button" onClick={(e) => {e.preventDefault(); setIsEditing(true);}} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded">
                Edit Customer
              </button>
            ) : (
            <button type="submit" className="px-4 py-2 bg-sky-950 hover:scale-99 text-white rounded" disabled={loading}>
              {loading ? (mode === "add" ? "Creating..." : "Updating...") : (mode === "add" ? "Create Customer" : "Update Customer")}
            </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}