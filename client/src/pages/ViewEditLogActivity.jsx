import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Title, Subtitle } from "../components/Text";
import SelectField from "../components/Dropdown";
import TextArea from "../components/TextArea";
import TextInput from "../components/TextInput";
import ModalCustomer from "../components/modals/ModalCustomer";
import ModalAccountManager from "../components/modals/ModalAccountManager";
import Loader from "../components/Loader";
import { activityService } from "../api/activity";

export default function ViewEditActivity() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activityId = searchParams.get('id');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // State for dropdowns
  const [customers, setCustomers] = useState([]);
  const [accountManagers, setAccountManagers] = useState([]);
  const [showModalCustomer, setShowModalCustomer] = useState(false);
  const [showModalAccountManager, setShowModalAccountManager] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [solutionsArchitects, setSolutionsArchitects] = useState([]);

  const [originalActivity, setOriginalActivity] = useState(null);
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

  useEffect(() => {
    if (activityId) {
      loadActivity();
      loadDropdownData();
      getCurrentUser();
    }
  }, [activityId]);

  const getCurrentUser = async () => {
    try {
      const user = await activityService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error getting current user:", error);
    }
  };

  const loadActivity = async () => {
    try {
      setLoading(true);
      const { data: activity, error } = await activityService.fetchActivityById(activityId);
      
      if (error) {
        alert("Error loading activity: " + error.message);
        navigate('/');
        return;
      }

      setOriginalActivity(activity);
      
      // Map database fields to form fields
      const formData = {
        category: activity.category?.id || "",
        solarch: activity.user_profile?.id || "",
        title: activity.title || "",
        description: activity.description || "",
        date: activity.date || "",
        startTime: activity.start_time || "",
        endTime: activity.end_time || "",
        mode: activity.mode || "",
        participants: activity.participants || "",
        customer: activity.customer?.id || "",
        accountManager: activity.account_manager?.id || "",
        meetingParticipants: activity.meeting_participants || "",
        technologiesDiscussed: activity.technologies_used || "",
        outcomes: activity.outcomes || "",
        actionItems: activity.action_items || "",
        knowledgeArea: activity.knowledge_area || "",
        trainingProvider: activity.training_provider || "",
        certificationsEarned: activity.certifications_earned || "",
      };
      
      setForm(formData);
    } catch (error) {
      console.error("Error loading activity:", error);
      alert("Error loading activity");
      navigate('/');
    } finally {
      setLoading(false);
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (!currentUser) {
        alert("Error: User not authenticated");
        return;
      }

      // Find the selected solutions architect to get their user_id
      const selectedSolarch = solutionsArchitects.find(sa => sa.id === form.solarch);
      
      
      const payload = {
        category: form.category,
        user: selectedSolarch?.user_id,
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
        updated_by: currentUser.id,
        updated_at: new Date().toISOString()
      };

      const { error } = await activityService.updateActivity(activityId, payload);
      
      if (error) {
        alert("Error updating activity: " + error.message);
      } else {
        alert("Activity updated successfully!");
        setIsEditing(false);
        loadActivity(); // Reload to show updated data
      }
    } catch (error) {
      console.error("Error saving activity:", error);
      alert("Error saving activity");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalActivity) {
      // Reset form to original values
      const formData = {
        category: originalActivity.category?.id || "",
        solarch: originalActivity.user_profile?.id || "",
        title: originalActivity.title || "",
        description: originalActivity.description || "",
        date: originalActivity.date || "",
        startTime: originalActivity.start_time || "",
        endTime: originalActivity.end_time || "",
        mode: originalActivity.mode || "",
        participants: originalActivity.participants || "",
        customer: originalActivity.customer?.id || "",
        accountManager: originalActivity.account_manager?.id || "",
        meetingParticipants: originalActivity.meeting_participants || "",
        technologiesDiscussed: originalActivity.technologies_used || "",
        outcomes: originalActivity.outcomes || "",
        actionItems: originalActivity.action_items || "",
        knowledgeArea: originalActivity.knowledge_area || "",
        trainingProvider: originalActivity.training_provider || "",
        certificationsEarned: originalActivity.certifications_earned || "",
      };
      setForm(formData);
    }
    setIsEditing(false);
  };
  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this activity? This action cannot be undone."
    );
    
    if (!isConfirmed) return;

    try {
      setDeleting(true);
      const { error } = await activityService.deleteActivity(activityId);
      
      if (error) {
        alert("Error deleting activity: " + error.message);
      } else {
        alert("Activity deleted successfully!");
        navigate('/');
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      alert("Error deleting activity: " + error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleAccountManagerModalClose = () => {
    setShowModalAccountManager(false);
    loadDropdownData(); // Refresh data
  };

  const handleCustomerModalClose = () => {
    setShowModalCustomer(false);
    loadDropdownData(); // Refresh data
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-2 space-y-4">
        <div className="bg-white p-6 rounded-xl shadow-2xl">
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (!originalActivity) {
    return (
      <div className="max-w-2xl mx-auto p-2 space-y-4">
        <div className="bg-white p-6 rounded-xl shadow-2xl text-center">
          <Title>Activity Not Found</Title>
          <p className="text-gray-600 mb-4">The requested activity could not be found.</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-black"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Get category value for conditional rendering
  const categoryValue = form.category;
  const categoryName = originalActivity.category?.category_name?.toLowerCase().replace(' ', '_');

  return (
    <>
      <div className="max-w-2xl mx-auto p-2 space-y-4">
        <button 
          onClick={() => window.history.back()}
          className="text-md text-neutral-800 hover:font-semibold"
        >
          &larr; Return
        </button>
        
        <div className="bg-white p-6 rounded-xl shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Title>{isEditing ? 'Edit Activity' : 'View Activity'}</Title>
              <Subtitle>
                {isEditing ? 'Make changes to the activity details' : 'Activity details and information'}
              </Subtitle>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)}
                  className="border rounded-lg px-4 py-2 bg-slate-700 font-medium text-neutral-100 hover:bg-slate-800 hover:text-amber-200 transition-colors">
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving}
                    className="border rounded-lg py-2 px-4 bg-emerald-700 font-medium text-neutral-100 hover:bg-teal-800 hover:text-neutral-200 transition-colors">
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={handleCancel} disabled={saving}
                    className="border border-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSave}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField label="Activity Category" name="category"
                value={form.category}
                onChange={handleChange}
                disabled={!isEditing}
                selectmessage="Select Activity Category"
                options={[
                  {value: "client_visit", label: "Client Visit"},
                  {value: "meetings_attended", label: "Meetings Attended"},
                  {value: "enablement", label: "Enablement"},
                  {value: "attended_event", label: "Attended Event"},
                  {value: "technical_training", label: "Technical Training"},
                  {value: "knowledge_transfer", label: "Knowledge Transfer"},
                ]}/>
              <SelectField label="Solutions Architect" name="solarch" 
                value={form.solarch} 
                onChange={handleChange}
                disabled={!isEditing}
                selectmessage="Select Solutions Architect"
                options={solutionsArchitects.map(solarch => ({ 
                  value: solarch.id, 
                  label: solarch.full_name 
                }))}/>
            </div>

            <TextInput label="Title" name="title" value={form.title} onChange={handleChange} disabled={!isEditing}type="text" placeholder="Brief title for this activity" />
            
            <TextArea label="Description" name="description"  value={form.description} onChange={handleChange}disabled={!isEditing} placeholder="Detailed description of the activity" />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <TextInput label="Date" name="date" value={form.date} onChange={handleChange}disabled={!isEditing}type="date" />
              <TextInput label="Start Time" name="startTime" value={form.startTime} type="time" onChange={handleChange}disabled={!isEditing}/>
              <TextInput label="End Time" name="endTime" value={form.endTime} onChange={handleChange}disabled={!isEditing}type="time" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField label="Mode" value={form.mode} 
                onChange={handleChange} 
                name="mode"
                disabled={!isEditing}
                selectmessage="Select Virtual or Onsite"
                options={[
                  {value: "virtual", label: "Virtual"},
                  {value: "onsite", label: "Onsite"},
                ]}/>
              <SelectField label="Participants" 
                value={form.participants} 
                onChange={handleChange} 
                name="participants"
                disabled={!isEditing}
                selectmessage="Select Internal or External"
                options={[
                  {value: "internal", label: "Internal"},
                  {value: "external", label: "External"},
                ]}/>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField 
                classfield={isEditing ? "flex gap-2 mt-1" : ""}
                selectmessage="Select Customer" 
                label="Customer" 
                name="customer" 
                value={form.customer} 
                onChange={handleChange}
                disabled={!isEditing}
                options={customers.map(customer => ({ 
                  value: customer.id, 
                  label: customer.company_name 
                }))}
              >
                {isEditing && (
                  <button type="button" onClick={() => setShowModalCustomer(true)} className="bg-white border border-neutral-300 hover:bg-gray-800 hover:text-white px-3 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  </button>
                )}
              </SelectField>
              
              <SelectField 
                classfield={isEditing ? "flex gap-2 mt-1" : ""}
                selectmessage="Select Account Manager" label="Account Manager" name="accountManager" value={form.accountManager} 
                onChange={handleChange}
                disabled={!isEditing}
                options={accountManagers.map(manager => ({ 
                  value: manager.id, 
                  label: manager.name 
                }))}>
                {isEditing && (
                  <button type="button" onClick={() => setShowModalAccountManager(true)} 
                    className="bg-white border border-neutral-300 hover:bg-gray-800 hover:text-white px-3 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  </button>
                )}
              </SelectField>
            </div>

            {/* Conditional sections based on category */}
            {(categoryName === "client_visit" || categoryName === "meetings_attended") && (
              <div className="space-y-4">
                <TextInput label="Meeting Participants" placeholder="Participant names" name="meetingParticipants" value={form.meetingParticipants} onChange={handleChange}disabled={!isEditing}/>
                <TextInput label="Technologies Discussed" placeholder="Technologies" name="technologiesDiscussed" value={form.technologiesDiscussed} onChange={handleChange} disabled={!isEditing} />
                <TextArea label="Outcomes" name="outcomes" value={form.outcomes} onChange={handleChange} disabled={!isEditing} placeholder="Key outcomes and decisions" />
                <TextArea label="Action Items" name="actionItems" value={form.actionItems} onChange={handleChange} disabled={!isEditing} placeholder="Next steps and action items" />
              </div>
            )}

            {(categoryName === "enablement" || categoryName === "knowledge_transfer") && (
              <TextInput label="Knowledge Area" name="knowledgeArea" type="text" value={form.knowledgeArea} onChange={handleChange} disabled={!isEditing} placeholder="Area of Knowledge shared/received" />
            )}

            {categoryName === "technical_training" && (
              <div className="space-y-4">
                <TextInput label="Training Provider" name="trainingProvider" type="text" value={form.trainingProvider} onChange={handleChange} disabled={!isEditing} placeholder="e.g., Oracle, Fortinet, Peplink, Internal Team" />
                <TextInput label="Certifications Earned" name="certificationsEarned" type="text" value={form.certificationsEarned} onChange={handleChange} disabled={!isEditing} placeholder="Certification Name (If applicable)" />
              </div>
            )}

            {/* Display-only info when not editing */}
            {!isEditing && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Activity Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <div className="font-medium">{originalActivity.created_at ? new Date(originalActivity.created_at).toLocaleString() : 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Modified:</span>
                    <div className="font-medium">{originalActivity.updated_at ? new Date(originalActivity.updated_at).toLocaleString() : 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Created by:</span>
                    <div className="font-medium">{originalActivity.added_by_profile?.full_name || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Modified by:</span>
                    <div className="font-medium">{originalActivity.updated_by_profile?.full_name || 'N/A'}</div>
                  </div>
                </div>
              </div>
            )}
            {!isEditing && (
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                <button onClick={handleDelete} disabled={deleting} className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 transition-colors disabled:opacity-50 flex items-center gap-2">
                  {deleting ? (<>Deleting...</>) : (<>Delete Activity</>)}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Modals */}
        <ModalCustomer isOpen={showModalCustomer} onClose={handleCustomerModalClose} />
        <ModalAccountManager isOpen={showModalAccountManager} onClose={handleAccountManagerModalClose} />
      </div>
    </>
  );
}