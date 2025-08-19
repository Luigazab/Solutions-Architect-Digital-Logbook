import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Loader from '../components/Loader';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    contact_number: '',
    title: '',
    department: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user from auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      if (!user) throw new Error('No user found');

      setUser(user);

      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profile) {
        setProfile(profile);
        setFormData({
          full_name: profile.full_name || '',
          email: profile.email || user.email || '',
          contact_number: profile.contact_number || '',
          title: profile.title || '',
          department: profile.department || ''
        });
      } else {
        // Create new profile if doesn't exist
        const newProfile = {
          user_id: user.id,
          full_name: '',
          email: user.email,
          contact_number: '',
          title: '',
          department: ''
        };
        
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;
        
        setProfile(createdProfile);
        setFormData({
          full_name: '',
          email: user.email,
          contact_number: '',
          title: '',
          department: ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveProfile = async () => {
    try {
        setSaving(true);
        setMessage({ type: '', text: '' });

        const profileData = {
            user_id: user.id,
            full_name: formData.full_name,
            email: formData.email,
            contact_number: formData.contact_number,
            title: formData.title,
            department: formData.department
        };

      // Use upsert to either update existing profile or create new one
        const { data, error } = await supabase
            .from('profiles')
            .upsert(profileData, {
            onConflict: 'user_id'
            })
            .select()
            .single();

        if (error) throw error;

        // Update auth email if changed
        if (formData.email !== user.email) {
            const { error: authError } = await supabase.auth.updateUser({
            email: formData.email
            });
            if (authError) throw authError;
        }

        setProfile(data);
        setEditing(false);
        setMessage({ type: 'success', text: 'Profile saved successfully!' });
    } catch (error) {
        console.error('Error saving profile:', error);
        setMessage({ type: 'error', text: 'Failed to save profile changes' });
    } finally {
        setSaving(false);
    }
  };

  const changePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
        return;
      }

      setSaving(true);
      setMessage({ type: '', text: '' });

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordChange(false);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ type: 'error', text: 'Failed to change password' });
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      full_name: profile?.full_name || '',
      email: profile?.email || user?.email || '',
      contact_number: profile?.contact_number || '',
      title: profile?.title || '',
      department: profile?.department || ''
    });
    setEditing(false);
  };

  if (loading) {
    <Loader />;
  }

  return (
    <div className=" py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center justify-center text-slate-600 rounded-full hover:text-amber-500 transition-all duration-200 hover:ring-1 hover:ring-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400">
                  <svg className="w-12 h-12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M463 448.2c-22.1-38.4-63.6-64.2-111-64.2h-64c-47.4 0-88.9 25.8-111 64.2 35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8M64 320C64 178.6 178.6 64 320 64s256 114.6 256 256-114.6 256-256 256S64 461.4 64 320m256 16c39.8 0 72-32.2 72-72s-32.2-72-72-72-72 32.2-72 72 32.2 72 72 72"/></svg>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                  <p className="text-sm text-gray-500">Manage your account information</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {!editing ? (
                    <button onClick={() => setEditing(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>
                        Edit Profile
                    </button>
                ) : (
                  <>
                    <button onClick={cancelEdit}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="-28 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m64 388 132-132L64 124l32-32 132 132L360 92l32 32-132 132 132 132-32 32-132-132L96 420z"/></svg>
                        Cancel
                    </button>
                    <button onClick={saveProfile} disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="-3 -3 24 24" xmlns="http://www.w3.org/2000/svg" ><path d="M2 0h11.22a2 2 0 0 1 1.345.52l2.78 2.527A2 2 0 0 1 18 4.527V16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m0 2v14h14V4.527L13.22 2zm4 8h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2m0 2v4h6v-4zm7-9a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0V4a1 1 0 0 1 1-1M5 3h5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m1 3h3V5H6z"/></svg>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'error' 
              ? 'bg-red-50 border border-red-200 text-red-700' 
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            <div className="flex">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.7 7.2c-.4-.4-1-.4-1.4 0l-7.5 7.5-3.1-3.1c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l3.8 3.8c.2.2.4.3.7.3s.5-.1.7-.3l8.2-8.2c.4-.4.4-1 0-1.4"/></svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="-28 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m64 388 132-132L64 124l32-32 132 132L360 92l32 32-132 132 132 132-32 32-132-132L96 420z"/></svg>
              )}
              {message.text}
            </div>
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
          </div>
          <div className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {editing ? (
                  <input type="text"name="full_name" value={formData.full_name} onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="flex items-center">
                    <svg  className="w-5 h-5 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8M6 8a6 6 0 1 1 12 0A6 6 0 0 1 6 8m2 10a3 3 0 0 0-3 3 1 1 0 1 1-2 0 5 5 0 0 1 5-5h8a5 5 0 0 1 5 5 1 1 0 1 1-2 0 3 3 0 0 0-3-3z"  fill="currentColor"/></svg>
                    <span className="text-gray-900">{profile?.full_name || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {editing ? (
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clipRule="evenodd" d="m1 3.5.5-.5h13l.5.5v9l-.5.5h-13l-.5-.5zm1 1.035V12h12V4.536L8.31 8.9H7.7zM13.03 4H2.97L8 7.869z"/></svg>
                    <span className="text-gray-900">{profile?.email || user?.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                {editing ? (
                  <input type="tel" name="contact_number" value={formData.contact_number} onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                ) : (
                  <div className="flex items-center">
                    <svg  className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24" data-name="Line Color" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v3.93a2 2 0 0 1-2.29 2A18 18 0 0 1 3.14 5.29 2 2 0 0 1 5.13 3H9a1 1 0 0 1 1 .89 10.7 10.7 0 0 0 1 3.78 1 1 0 0 1-.42 1.26l-.86.49a1 1 0 0 0-.33 1.46 14.1 14.1 0 0 0 3.69 3.69 1 1 0 0 0 1.46-.33l.49-.86a1 1 0 0 1 1.3-.38 10.7 10.7 0 0 0 3.78 1 1 1 0 0 1 .89 1"/></svg>
                    <span className="text-gray-900">{profile?.contact_number || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                {editing ? (
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.5h-3v-1a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3m-9-1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1h-4Zm10 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5.05h3v1.05a1 1 0 0 0 2 0v-1.05h6v1.05a1 1 0 0 0 2 0v-1.05h3Zm0-7H4v-2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1Z"/></svg>
                    <span className="text-gray-900">{profile?.title || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                {editing ? (
                  <input type="text" name="department" value={formData.department} onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M14 8h1a1 1 0 0 0 0-2h-1a1 1 0 0 0 0 2m0 4h1a1 1 0 0 0 0-2h-1a1 1 0 0 0 0 2M9 8h1a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2m0 4h1a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2m12 8h-1V3a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v17H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2m-8 0h-2v-4h2Zm5 0h-3v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5H6V4h12Z"/></svg>
                    <span className="text-gray-900">{profile?.department || 'Not provided'}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                <p>Account created: {new Date(user?.created_at).toLocaleDateString()}</p>
                {profile?.updated_at && (
                  <p>Last updated: {new Date(profile.updated_at).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
              <button onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M13 7h-1V5a4 4 0 1 0-8 0v2H3L2 8v6l1 1h10l1-1V8zM5 5a3 3 0 1 1 6 0v2H5zm8 9H3V8h10z"/></svg>
                {showPasswordChange ? 'Cancel' : 'Change Password'}
              </button>
            </div>
          </div>
          
          {showPasswordChange && (
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              
              <div className="flex justify-end">
                <button onClick={changePassword} disabled={saving || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}