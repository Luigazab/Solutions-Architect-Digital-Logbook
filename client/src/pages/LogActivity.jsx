"use client";
import { useState } from "react";
import {Title, Subtitle} from "../components/Text";
import SelectField from "../components/Dropdown";
import TextArea from "../components/TextArea";
import TextInput from "../components/TextInput";
import ModalCustomer from "../components/modals/ModalCustomer";
import ModalAccountManager from "../components/modals/ModalAccountManager";

export default function LogActivity() {
  const [category, setCategory] = useState("");
  const [customer, setCustomer] = useState("");
  const [showModalCustomer, setShowModalCustomer] = useState(false);
  const [accountManager, setAccountManager] = useState("");
  const [showModalAccountManager, setShowModalAccountManager] = useState(false);

  return (
    <>
      <div className="max-w-2xl mx-auto p-2 space-y-4">
        <a href="/" className="text-lg font-semibold text-neutral-800 hover:underline">&larr; Back to Dashboard</a>
        <div className="bg-white p-6 rounded-xl border shadow-md">
          <Title>Log Activity</Title>
          <Subtitle>Record your daily activity</Subtitle>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField 
                label="Activity Category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  {value: "", label: "Select Category"},
                  {value: "clientVisit", label: "Client Visit"},
                  {value: "meetingsAttended", label: "Meetings Attended"},
                  {value: "enablement", label: "Enablement"},
                  {value: "attendedEvent", label: "Attended Event"},
                  {value: "technicalTraining", label: "Technical Training"},
                  {value: "knowledgeTransfer", label: "Knowledge Transfer"},
                ]}
              />
              <SelectField label="Solutions Architect" name=""
                options={[
                  {value: "", label: "Select SolArch"},
                  {value: "reggie", label: "Reggie"},
                  {value: "klien", label: "Klien"},
                  {value: "rommel", label: "Rommel"},
                ]}
              />
            </div>
            <TextInput label="Title" type="text" placeholder="Bried title for this activity" />
            <TextArea label="Description" placeholder="Detailed description of the activity" />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TextInput label="Date" type="date" />
              <TextInput label="Start Time" type="time" />
              <TextInput label="End Time" type="time" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField label="Mode"
                options={[
                  {value: "virtual", label: "Virtual"},
                  {value: "onsite", label: "Onsite"},
                ]}
              />
              <SelectField label="Participants"
                options={[
                  {value: "internal", label: "Internal"},
                  {value: "external", label: "External"},
                ]}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField classfield="flex gap-2 mt-1" label="Customer" name="customer" value={customer} onChange={(e) => setCustomer(e.target.value)}
                options={[
                  {value: "", label: "Select Customer"},
                ]}
                >
                <button type="button" onClick={() => setShowModalCustomer(true)} className="bg-white border border-neutral-300 hover:bg-gray-800 hover:text-white px-3 rounded"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></button>
              </SelectField>
              <ModalCustomer isOpen={showModalCustomer} onClose={() => setShowModalCustomer(false)} />
              <SelectField classfield="flex gap-2 mt-1" label="Account Manager" name="accountManager" value={accountManager} onChange={(e) => setAccountManager(e.target.value)}
                options={[
                  {value: "", label: "Select Account Manager"},
                ]}
                >
                <button type="button" onClick={() => setShowModalAccountManager(true)} className="bg-white border border-neutral-300 hover:bg-gray-800 hover:text-white px-3 rounded"> <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></button>
              </SelectField>
              <ModalAccountManager isOpen={showModalAccountManager} onClose={() => setShowModalAccountManager(false)} />
            </div>

            {/* Conditionals parts related to the category selector/dropdown */}
            {(category === "clientVisit" || category === "meetingsAttended") && (
              <div className="space-y-4">
                <TextInput label="Meeting Participants" placeholder="Add participant name" classfield="flex gap-2 mt-1">
                  <button type="button" class="bg-gray-800 text-white px-3 rounded"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg></button>
                </TextInput>
                <TextInput label="Technologies Discussed" placeholder="Add technology" classfield="flex gap-2 mt-1">
                  <button type="button" class="bg-gray-800 text-white px-3 rounded"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg></button>
                </TextInput>

                <TextArea label="Outcomes" placeholder="Key outcomes and decisions" />
                <TextArea label="Action Items" placeholder="Next steps and action items" />
              </div>
            )}

            {(category === "enablement" || category === "knowledgeTransfer") && (
              <TextInput label="Knowledge Area" type="text" placeholder="Area of Knowledge shared/received" />
            )}

            {category === "technicalTraining" && (
              <div className="space-y-4">
                <TextInput label="Training Provider" type="text" placeholder="e.g., Oracle, Fortinet, Peplink, Internal Team" />
                <TextInput label="Certifications Earned" type="text" placeholder="Certification Name (If applicable)" />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-black">Save Activity</button>
              <a href="/" className="border border-gray-300 px-6 py-2 rounded-md text-gray-700 hover:bg-gray-100">Cancel</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
