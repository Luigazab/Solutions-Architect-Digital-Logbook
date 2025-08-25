"use client";
import { useEffect, useState } from "react";
import {Title, Subtitle} from "../components/Text";
import SelectField from "../components/Dropdown";
import TextArea from "../components/TextArea";
import TextInput from "../components/TextInput";
import ModalCustomer from "../components/modals/ModalCustomer";
import ModalAccountManager from "../components/modals/ModalAccountManager";
import { activityService } from "../api/activity";

export default function LogActivity() {
  const [category, setCategory] = useState(""); // state for activity category
  const [customer, setCustomer] = useState(""); // state for customer selection
  const [customers, setCustomers] = useState([]); 
  const [showModalCustomer, setShowModalCustomer] = useState(false);// state for customer modal visibility
  const [accountManager, setAccountManager] = useState();// state for account manager selection
  const [accountManagers, setAccountManagers] = useState([]);
  const [showModalAccountManager, setShowModalAccountManager] = useState(false);// state for account manager modal visibility
  const [solutionsArchitects, setSolutionsArchitects] = useState([]); // state for solutions architects
  const [currentUser, setCurrentUser] = useState(null); // state for current logged-in user

  useEffect(() => {
    loadDropdownData();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try{
      const user = await activityService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error getting current user:", error);
    }
  };

  const loadDropdownData = async () => {
    try {
      const [customersResult, managersResult, solarcsResult] = await Promise.all([
        activityService.fetchCustomers(),
        activityService.fetchAccountManagers(),
        activityService.fetchSolutionsArchitects()
      ]);

      if (!customersResult.error) setCustomers(customersResult.data);
      if (!managersResult.error) setAccountManagers(managersResult.data);
      if (!solarcsResult.error) setSolutionsArchitects(solarcsResult.data);
    } catch (error) {
      console.error("Error loading dropdown data:", error);
    }
  };

  const handleAccountManagerModalClose = () => {
    setShowModalAccountManager(false); 
    // Re-fetch account managers
    loadDropdownData();
  }
  
  const handleCustomerModalClose = () => {
    setShowModalCustomer(false); 
    // Re-fetch customers
    loadDropdownData();
  }

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

    if(!currentUser) {
      alert("Error: User not authenticated");
      return;
    }

    const selectedSolarch = solutionsArchitects.find(sa => sa.id === form.solarch);

    if(!selectedSolarch){
      alert("Please select a Solutions Architect");
      return;
    }

    const payload = {
      category: form.category,
      user: selectedSolarch.user_id,
      title: form.title,
      description: form.description,
      date: form.date,
      start_time: form.startTime,
      end_time: form.endTime,
      mode: form.mode,
      participants: form.participants,
      customer: form.customer,
      account_manager: form.accountManager,
      meeting_participants: form.meetingParticipants,
      technologies_used: form.technologiesDiscussed,
      outcomes: form.outcomes,
      action_items: form.actionItems,
      knowledge_area: form.knowledgeArea,
      training_provider: form.trainingProvider,
      certifications_earned: form.certificationsEarned,
      added_by: currentUser.id,
      updated_by: currentUser.id,
    };
    
    const { error } = await activityService.insertActivity(payload);
    if (error) {
      alert("Error saving activity: " + error.message);
    }
    else {//save activity successfully and clears the form
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
        <button onClick={() => window.history.back()} className="text-md text-neutral-800 hover:font-semibold">&larr; Back to Dashboard</button>
        <div className="bg-white p-6 rounded-xl shadow-2xl">
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
                  handleChange(e)
                }}
                selectmessage={"Select Activity Category"}
                options={[
                  {value: "client_visit", label: "Client Visit"},
                  {value: "meetings_attended", label: "Meetings Attended"},
                  {value: "enablement", label: "Enablement"},
                  {value: "attended_event", label: "Attended Event"},
                  {value: "technical_training", label: "Technical Training"},
                  {value: "knowledge_transfer", label: "Knowledge Transfer"},
                ]}
              />
              <SelectField label="Solutions Architect" name="solarch" value={form.solarch} onChange={handleChange} selectmessage={"Select Solutions Architect"}
                options={solutionsArchitects.map(solarch => ({ 
                  value: solarch.id, 
                  label: solarch.full_name 
                }))}
              />
            </div>
            <TextInput label="Title" name="title" value={form.title} onChange={handleChange} type="text" placeholder="Brief title for this activity" />
            <TextArea label="Description" name="description"  value={form.description} onChange={handleChange} placeholder="Detailed description of the activity" />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TextInput label="Date" name="date" value={form.date} onChange={handleChange} type="date" />
              <TextInput label="Start Time" name="startTime" value={form.startTime} type="time" onChange={handleChange} />
              <TextInput label="End Time" name="endTime" value={form.endTime} onChange={handleChange} type="time" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField label="Mode" value={form.mode} onChange={handleChange} name="mode" selectmessage="Select Virtual or Onsite"
                options={[
                  {value: "virtual", label: "Virtual"},
                  {value: "onsite", label: "Onsite"},
                ]}
              />
              <SelectField label="Participants" value={form.participants} onChange={handleChange} name="participants" selectmessage={"Select Internal or External"}
                options={[
                  {value: "internal", label: "Internal"},
                  {value: "external", label: "External"},
                ]}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField classfield="flex gap-2 mt-1" selectmessage="Select Customer" label="Customer" name="customer" value={form.customer} onChange={(e) => {setCustomer(e.target.value); handleChange(e)}}
                options={customers.map(customer => ({ value: customer.id, label: customer.company_name }))}
                >
                <button type="button" onClick={() => setShowModalCustomer(true)} className="bg-white border border-neutral-300 hover:bg-gray-800 hover:text-white px-3 rounded"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></button>
              </SelectField>
              
              <SelectField classfield="flex gap-2 mt-1" selectmessage="Select Account Manager" label="Account Manager" name="accountManager" value={form.accountManager} onChange={(e) => {setAccountManager(e.target.value); handleChange(e)}}
                options={accountManagers.map(manager => ({ value: manager.id, label: manager.name }))}
                >
                <button type="button" onClick={() => setShowModalAccountManager(true)} className="bg-white border border-neutral-300 hover:bg-gray-800 hover:text-white px-3 rounded"> <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></button>
              </SelectField>
              
            </div>

            {/* Conditionals parts related to the category selector/dropdown */}
            {(category === "client_visit" || category === "meetings_attended") && (
              <div className="space-y-4">
                <TextInput label="Meeting Participants" placeholder="Add participant name" name="meetingParticipants" value={form.meetingParticipants} onChange={handleChange} classfield="flex gap-2 mt-1">
                  <button type="button" className="bg-gray-800 text-white px-3 rounded"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></button>
                </TextInput>
                <TextInput label="Technologies Discussed" placeholder="Add technology" name="technologiesDiscussed" value={form.technologiesDiscussed} onChange={handleChange} classfield="flex gap-2 mt-1">
                  <button type="button" className="bg-gray-800 text-white px-3 rounded"><svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></button>
                </TextInput>

                <TextArea label="Outcomes" name="outcomes" value={form.outcomes} onChange={handleChange} placeholder="Key outcomes and decisions" />
                <TextArea label="Action Items" name="actionItems" value={form.actionItems} onChange={handleChange} placeholder="Next steps and action items" />
              </div>
            )}

            {(category === "enablement" || category === "knowledge_transfer") && (
              <TextInput label="Knowledge Area" name="knowledgeArea" type="text" value={form.knowledgeArea} onChange={handleChange} placeholder="Area of Knowledge shared/received" />
            )}

            {category === "technical_training" && (
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
          <ModalCustomer isOpen={showModalCustomer} onClose={ handleCustomerModalClose } />
          <ModalAccountManager isOpen={showModalAccountManager} onClose={ handleAccountManagerModalClose} />
        </div>
      </div>
    </>
  );
}