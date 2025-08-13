import Modal from "../../layouts/Modal";
import TextInput from "../TextInput"
import { useState } from "react";
import { supabase } from "../../supabaseClient";

export default function ModalAccountManager({ isOpen, onClose }) {
  const[name, setName] = useState("");
  const[department, setDepartment ] = useState("");
  const[branch, setBranch] = useState("");
  const[loading, setLoading] = useState(false);

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase .from("account_managers") .insert([{name, department, branch}]);
    setLoading(false);;
    if (!error) {
      onClose();
      setName("");
      setDepartment("");
      setBranch("");
    } else {
      alert(error.message);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a new account manager">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextInput label="Account Manager Name" placeholder="Account manager name" value={name} onChange={e => setName(e.target.value)}  />
        <TextInput label="Department" placeholder="e.g., TSD, SFD, FAD, HRD" value={department} onChange={e => setDepartment(e.target.value)} />
        <TextInput label="Branch" placeholder="e.g., Cavite, Cebu, Clark" value={branch} onChange={e => setBranch(e.target.value)} />

        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}> {loading ? "Creating..." : "Create Account Manager"}</button>
        </div>
      </form>
    </Modal>
  );
}
