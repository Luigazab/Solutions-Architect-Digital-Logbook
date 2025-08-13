"use client";
import { useState } from "react";
import {Title, Subtitle} from "../components/Text";
import SelectField from "../components/Dropdown";
import TextArea from "../components/TextArea";
import TextInput from "../components/TextInput";
import ModalCustomer from "../components/modals/ModalCustomer";
import ModalAccountManager from "../components/modals/ModalAccountManager";
import { insertActivity } from "../api/activity";

export default function LogActivity() {
  const [category, setCategory] = useState(""); // state for activity category
  const [customer, setCustomer] = useState(""); // state for customer selection
  const [showModalCustomer, setShowModalCustomer] = useState(false);// state for customer modal visibility
  const [accountManager, setAccountManager] = useState("");// state for account manager selection
  const [showModalAccountManager, setShowModalAccountManager] = useState(false);// state for account manager modal visibility

  const [form, setForm] = useState({
    category: "",
    solarch: "",
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    mode: "",
    participants: "",
    customer: "",
    accountManager: "",
    meetingParticipants: "",
    technologiesDiscussed: "",
    outcomes: "",
    actionItems: "",
    knowledgeArea: "",
    trainingProvider: "",
    certificationsEarned: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const {error} = await insertActivity(form);
    if (error) {
      alert("Error saving activity: " + error.message);
    }
    else {
      alert("Activity saved successfully!");
      setForm({
        category: "",
        solarch: "",
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        mode: "",
        participants: "",
        customer: "",
        accountManager: "",
        meetingParticipants: "",
        technologiesDiscussed: "",
        outcomes: "",
        actionItems: "",
        knowledgeArea: "",
        trainingProvider: "",
        certificationsEarned: "",
      });
      setCategory("");
      setCustomer("");
      setAccountManager("");
    }
  }

  return (
    <>
      <div className="max-w-2xl mx-auto p-2 space-y-4">
        <a href="/" className="text-lg font-semibold text-neutral-800 hover:underline">&larr; Back to Dashboard</a>
        <div className="bg-white p-6 rounded-xl border shadow-md">
          <Title>Log Activity</Title>
          <Subtitle>Record your daily activity</Subtitle>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField 
                label="Activity Category"
                name="category"
                value={form.category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  handleChange(e);
                }}
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
              <SelectField label="Solutions Architect" name="solarch" value={form.solarch} onChange={handleChange}
                options={[
                  {value: "", label: "Select SolArch"},
                  {value: "reggie", label: "Reggie"},
                  {value: "klien", label: "Klien"},
                  {value: "rommel", label: "Rommel"},
                ]}
              />
            </div>
            <TextInput label="Title" name="title" value={form.title} onChange={handleChange} type="text" placeholder="Bried title for this activity" />
            <TextArea label="Description" name="description"  value={form.description} onChange={handleChange} placeholder="Detailed description of the activity" />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TextInput label="Date" name="date" value={form.date} onChange={handleChange} type="date" />
              <TextInput label="Start Time" name="startTime" value={form.startTime} type="time" onChange={handleChange} />
              <TextInput label="End Time" name="endTime" value={form.endTime} onChange={handleChange} type="time" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField label="Mode" value={form.mode} onChange={handleChange} name="mode"
                options={[
                  {value: "virtual", label: "Virtual"},
                  {value: "onsite", label: "Onsite"},
                ]}
              />
              <SelectField label="Participants" value={form.participants} onChange={handleChange} name="participants"
                options={[
                  {value: "internal", label: "Internal"},
                  {value: "external", label: "External"},
                ]}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField classfield="flex gap-2 mt-1" label="Customer" name="customer" value={form.customer} onChange={(e) => {setCustomer(e.target.value); handleChange(e)}}
                options={[
                  {value: "", label: "Select Customer"},
                ]}
                >
                <button type="button" onClick={() => setShowModalCustomer(true)} className="bg-white border border-neutral-300 hover:bg-gray-800 hover:text-white px-3 rounded"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></button>
              </SelectField>
              
              <SelectField classfield="flex gap-2 mt-1" label="Account Manager" name="accountManager" value={form.accountManager} onChange={(e) => {setAccountManager(e.target.value); handleChange(e)}}
                options={[
                  {value: "", label: "Select Account Manager"},
                ]}
                >
                <button type="button" onClick={() => setShowModalAccountManager(true)} className="bg-white border border-neutral-300 hover:bg-gray-800 hover:text-white px-3 rounded"> <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></button>
              </SelectField>
              
            </div>

            {/* Conditionals parts related to the category selector/dropdown */}
            {(category === "clientVisit" || category === "meetingsAttended") && (
              <div className="space-y-4">
                <TextInput label="Meeting Participants" placeholder="Add participant name" name="meetingParticipants" value={form.meetingParticipants} onChange={handleChange} classfield="flex gap-2 mt-1">
                  <button type="button" class="bg-gray-800 text-white px-3 rounded"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg></button>
                </TextInput>
                <TextInput label="Technologies Discussed" placeholder="Add technology" name="technologiesDiscussed" value={form.technologiesDiscussed} onChange={handleChange} classfield="flex gap-2 mt-1">
                  <button type="button" class="bg-gray-800 text-white px-3 rounded"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg></button>
                </TextInput>

                <TextArea label="Outcomes" name="outcomes" value={form.outcomes} onChange={handleChange} placeholder="Key outcomes and decisions" />
                <TextArea label="Action Items" name="actionItems" value={form.actionItems} onChange={handleChange} placeholder="Next steps and action items" />
              </div>
            )}

            {(category === "enablement" || category === "knowledgeTransfer") && (
              <TextInput label="Knowledge Area" name="knowledgeArea" type="text" value={form.knowledgeArea} onChange={handleChange} placeholder="Area of Knowledge shared/received" />
            )}

            {category === "technicalTraining" && (
              <div className="space-y-4">
                <TextInput label="Training Provider" name="trainingProvider" type="text" value={form.trainingProvider} onChange={handleChange} placeholder="e.g., Oracle, Fortinet, Peplink, Internal Team" />
                <TextInput label="Certifications Earned" name="certificationsEarned" type="text" value={form.certificationsEarned} onChange={handleChange} placeholder="Certification Name (If applicable)" />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-black">Save Activity</button>
              <a href="/" className="border border-gray-300 px-6 py-2 rounded-md text-gray-700 hover:bg-gray-100">Cancel</a>
            </div>
          </form>
          <ModalCustomer isOpen={showModalCustomer} onClose={() => setShowModalCustomer(false)} />
            <ModalAccountManager isOpen={showModalAccountManager} onClose={() => setShowModalAccountManager(false)} />
        </div>
      </div>
    </>
  );
}
