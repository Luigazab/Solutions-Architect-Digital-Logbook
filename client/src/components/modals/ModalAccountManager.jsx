import Modal from "../../layouts/Modal";
import TextInput from "../TextInput"
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function ModalAccountManager({ isOpen, onClose, manager = null, mode = "add" }) {
  const[name, setName] = useState("");
  const[position, setPosition ] = useState("");
  const[department, setDepartment] = useState("");
  const[loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() =>{
    if (isOpen){
      if (manager && mode === "view"){
        setName(manager.name || "");
        setPosition(manager.position || "");
        setDepartment(manager.department || "");
        setIsEditing(false);
      } else if (mode === "add"){
        setName("");
        setPosition("");
        setDepartment("");
        setIsEditing(false);
      }
    }
  }, [isOpen, manager, mode]);

  const handleClose = () =>{
    setIsEditing(false);
    onClose();
  }

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);
    try{
      const { data: { user } } = await supabase.auth.getUser();

      if (mode === "add"){
        const { error } = await supabase .from("account_managers") .insert([{name, position, department, added_by: user?.id, updated_by: user?.id }]);
        if(error) throw error;

        setName("");
        setPosition("");
        setDepartment("");
      }else{
        const { error } = await supabase .from("account_managers") .update({name, position, department, added_by: user?.id, updated_at: new Date().toISOString() }).eq('id', manager.id);
        if (error) throw error;

        setIsEditing(false);
      }
      onClose();
    } catch(error) {
      alert(error.message);
    } finally{
      setLoading(false);
    }
  }

  const getTitle = () => {
    if(mode==="add") return "Add a new account manager";
    if(isEditing) return "Edit account manager";
    return "Account Manager Details"
  }

  const isViewMode = mode === "view" && !isEditing;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={getTitle()}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextInput label="Account Manager Name" placeholder="Account manager name" value={name} onChange={e => setName(e.target.value)} disabled={isViewMode} required={true} />
        <TextInput label="Position" placeholder="e.g., Manager, Team Lead" value={position} onChange={e => setPosition(e.target.value)} disabled={isViewMode} required={true} />
        <TextInput label="Department" placeholder="e.g., Sales Force, Technical" value={department} onChange={e => setDepartment(e.target.value)} disabled={isViewMode} required={true} />

        {mode === "view" && manager && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Created:</span>
                <p className="text-gray-900">{new Date(manager.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Created by:</span>
                <p className="text-gray-900">{manager.added_by_profile?.full_name || '-'}</p>
              </div>
              {manager.updated_at && (
                <>
                  <div>
                    <span className="font-medium text-gray-600">Updated:</span>
                    <p className="text-gray-900">{new Date(manager.updated_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Updated by:</span>
                    <p className="text-gray-900">{manager.updated_by_profile?.full_name || '-'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          {isViewMode ? (
            <button type="button" onClick={() => setIsEditing(true)} className="px-4 py-2 bg-sky-600 hover:scale-99 text-white rounded">Edit</button>
          ) : (
            <button type="submit" className="px-4 py-2 bg-sky-950 hover:scale-99 text-white rounded" disabled={loading}> {loading ? "Creating..." : mode === "add" ? "Create Account Manager" : "Update Account Manager"}</button>
          )}
        </div>
      </form>
    </Modal>
  );
}