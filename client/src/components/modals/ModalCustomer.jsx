import Modal from "../../layouts/Modal";
import TextInput from "../TextInput"

export default function ModalCustomer({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a new customer record">
      <form className="space-y-4">
        <TextInput label="Customer Name" placeholder="Company name" />
        <TextInput label="Industry" placeholder="e.g., Healthcare, Finance" />
        <TextInput label="Contact Person" placeholder="e.g., Enterprise, SMB" />
        <TextInput label="Location" placeholder="City, Region" />
        <TextInput label="Website" placeholder="https://example.com" type="url" />

        <div className="flex justify-end gap-2 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create Customer</button>
        </div>
      </form>
    </Modal>
  );
}
