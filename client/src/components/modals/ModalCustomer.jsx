import Modal from "../../layouts/Modal";
import TextInput from "../TextInput"
import { useState } from "react";
import { supabase } from "../../supabaseClient";

export default function ModalCustomer({ isOpen, onClose }) {
  const[name, setName] = useState("");
  const[industry, setIndustry] = useState("");
  const[contactPerson, setContactPerson] = useState("");
  const[contactNumber, setContactNumber] = useState("");
  const[contactEmail, setContactEmail] = useState("");
  const[location, setLocation] = useState("");
  const[website, setWebsite] = useState("");
  const[loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); 
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("customers").insert([{
      company_name: name,
      industry,
      contact_person: contactPerson,
      contact_number: contactNumber,
      email: contactEmail,
      location,
      website,
      added_by: user?.id,
      updated_by: user?.id
    }]);
    setLoading(false);
    if (!error) {
      onClose();
      setName("");
      setIndustry("");
      setContactPerson("");
      setContactNumber("");
      setContactEmail("");
      setLocation("");
      setWebsite("");
    } else {
      alert(error.message);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a new customer record">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextInput label="Company Name" placeholder="Company name" value={name} onChange={e => setName(e.target.value)} />
        <TextInput label="Industry" placeholder="e.g., Healthcare, Finance" value={industry} onChange={e => setIndustry(e.target.value)} />
        <TextInput label="Contact Person" placeholder="e.g., Enterprise, SMB" value={contactPerson} onChange={e => setContactPerson(e.target.value)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput label="Contact Number" placeholder="+63 9123 456 7890" value={contactNumber} onChange={e => setContactNumber(e.target.value)} />
          <TextInput label="Contact Email" placeholder="Enter contact person's email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
          <TextInput label="Location" placeholder="City, Region" value={location} onChange={e => setLocation(e.target.value)} />
          <TextInput label="Website" placeholder="https://example.com" type="url" value={website} onChange={e => setWebsite(e.target.value)} />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}> {loading ? "Creating..." : "Create Customer"}</button>
        </div>
      </form>
    </Modal>
  );
}
