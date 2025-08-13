import Modal from "../../layouts/Modal";
import TextInput from "../TextInput"

export default function ModalAccountManager({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a new account manager">
      <form className="space-y-4">
        <TextInput label="Account Manager Name" placeholder="Account manager name" />
        <TextInput label="Department" placeholder="e.g., TSD, SFD, FAD, HRD" />
        <TextInput label="Branch" placeholder="e.g., Cavite, Cebu, Clark" />

        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create Customer</button>
        </div>
      </form>
    </Modal>
  );
}
