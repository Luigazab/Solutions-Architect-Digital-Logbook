import { useState, useEffect } from "react";
import Modal from "../../layouts/Modal";
import TextInput from "../TextInput";
import SelectField from "../Dropdown";
import { customerService } from "../../api/customerService";

export default function ModalCustomer({ isOpen, onClose, editingCustomer = null, accountManagers = [] }) {
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

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        company_name: editingCustomer.company_name || "",
        industry: editingCustomer.industry || "",
        address: editingCustomer.address || "",
        location: editingCustomer.location || "",
        contact_person: editingCustomer.contact_person || "",
        designation: editingCustomer.designation || "",
        contact_number: editingCustomer.contact_number || "",
        email: editingCustomer.email || "",
        website: editingCustomer.website || "",
        account_manager: editingCustomer.account_manager?.id || ""
      });
    } else {
      resetForm();
    }
  }, [editingCustomer, isOpen]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalUrl = formData.website.trim();
      if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }

      const customerData = { ...formData, website: finalUrl, account_manager: formData.account_manager || null };

      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.id, customerData);
      } else {
        await customerService.createCustomer(customerData);
      }

      onClose();
      resetForm();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editingCustomer ? "Edit Customer" : "Create New Customer"}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextInput label="Company Name" name="company_name" placeholder="Company name" value={formData.company_name} onChange={handleChange} required />
        <TextInput label="Industry" name="industry" placeholder="e.g., Healthcare, Finance" value={formData.industry} onChange={handleChange} />
        <TextInput label="Address" name="address" placeholder="Street, Bldg. Unit." value={formData.address} onChange={handleChange} />
        <TextInput label="Location" name="location" placeholder="City, Region" value={formData.location} onChange={handleChange} />

        <div className="grid grid-cols-2 gap-2">
          <TextInput label="Contact Person" name="contact_person" placeholder="Contact person name" value={formData.contact_person} onChange={handleChange} />
          <TextInput label="Designation" name="designation" placeholder="IT Manager, Admin" value={formData.designation} onChange={handleChange} />
          <TextInput label="Contact Number" name="contact_number" placeholder="+63 912 456 7890" type="tel" value={formData.contact_number} onChange={handleChange} />
          <TextInput label="Contact Email" name="email" placeholder="email@example.com" type="text" value={formData.email} onChange={handleChange} />
        </div>

        <TextInput label="Website" name="website" placeholder="https://example.com" value={formData.website} onChange={handleChange} />
        {editingCustomer && (
          <SelectField label="Account Manager" name="account_manager" value={formData.account_manager} onChange={handleChange} selectmessage="Select Account Manager (Optional)" allowEmpty={true}
            options={accountManagers.map(manager => ({ value: manager.id, label: `${manager.name} - ${manager.position}` }))}/>

        )

        }

        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
            {loading ? (editingCustomer ? "Updating..." : "Creating...") : (editingCustomer ? "Update Customer" : "Create Customer")}
          </button>
        </div>
      </form>
    </Modal>
  );
}