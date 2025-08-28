import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Loader from '../components/Loader';
import { activityService } from '../api/activity';
import TextInput from '../components/TextInput';
import SelectField from '../components/Dropdown';
import { getPreviewClass } from '../utils/colors';
import { Link } from 'react-router-dom';
import ModalAccountManager from '../components/modals/ModalAccountManager';
import ModalUser from '../components/modals/ModalUser';
import ModalCategory from '../components/modals/ModalCategory';


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profiles');
  const [profiles, setProfiles] = useState([]);
  const [accountManagers, setAccountManagers] = useState([]);
  const [showModalAccountManager, setShowModalAccountManager] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ id: '', category_name: '', color: 'blue' });
  const [showModalCategory, setShowModalCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModalUser, setShowModalUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch profiles
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch account managers
  const fetchAccountManagers = async () => {
    setLoading(true);
    try {
      const{data} = await activityService.fetchAccountManagers();
      if (!data.error) setAccountManagers(data);
    } catch (error) {
      console.error('Error fetching account managers:', error);
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('category_name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new category
  const addCategory = async () => {
    if (!newCategory.id || !newCategory.category_name) return;
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([newCategory]);
      
      if (error) throw error;
      
      setShowModal(false);
      setNewCategory({ id: '', category_name: '', color: 'blue' });
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    switch (activeTab) {
      case 'profiles':
        fetchProfiles();
        break;
      case 'managers':
        fetchAccountManagers();
        break;
      case 'categories':
        fetchCategories();
        break;
      default:
        break;
    }
  }, [activeTab]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const handleAccountManagerModalClose = () => {
    setShowModalAccountManager(false);
    setSelectedManager(null);
    setModalMode('add');
    fetchAccountManagers();
  };

  const handleAddAccountManager = () => {
    setModalMode('add');
    setSelectedManager(null);
    setShowModalAccountManager(true);
  };

  const handleViewManager = (manager) => {
    setModalMode('view');
    setSelectedManager(manager);
    setShowModalAccountManager(true);
  };
  const handleUserModalClose = () => {
    setShowModalUser(false);
    setSelectedUser(null);
    fetchProfiles();
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModalUser(true);
  };

  const handleCategoryModalClose = () => {
    setShowModalCategory(false);
    setSelectedCategory(null);
    fetchCategories();
  };

  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    setShowModalCategory(true);
  };

  const ProfilesTable = () => (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Users</h3>
        <Link to="/add-member" className="bg-sky-950 text-white px-4 py-2 rounded-lg hover:scale-99 hover:text-amber-200 flex items-center gap-2">
          Add New User
        </Link>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-orange-50 text-left">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3 truncate">Sol Arch</th>
              <th className="px-6 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {profiles.map((profile) => (
              <tr key={profile.id} onClick={() => handleViewUser(profile)} className="hover:bg-blue-50 cursor-pointer transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{profile.full_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{profile.contact_number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{profile.department}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    profile.is_solarch 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.is_solarch ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    {formatDate(profile.created_at)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ManagersTable = () => (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Account Manager</h3>
        <button onClick={handleAddAccountManager} className="bg-sky-950 text-white px-4 py-2 rounded-lg hover:scale-99 flex items-center gap-2">
          Add Account Manager
        </button>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-orange-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-left">Position</th>
              <th className="px-6 py-3 text-left">Created</th>
              <th className="px-6 py-3 text-left">Created By</th>
              <th className="px-6 py-3 text-left">Updated</th>
              <th className="px-6 py-3 text-left">Updated By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {accountManagers.map((manager) => (
              <tr key={manager.id} className="hover:bg-blue-50 cursor-pointer transition-colors duration-150" onClick={() => handleViewManager(manager)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">{manager.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    {manager.department}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{manager.position}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    {formatDate(manager.created_at)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{manager.added_by_profile?.full_name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{manager.updated_at ? formatDate(manager.updated_at) : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{manager.updated_by_profile?.full_name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const CategoriesTable = () => (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Categories</h3>
        <button onClick={() => setShowModal(true)}  className="bg-sky-950 text-white px-4 py-2 rounded-lg hover:scale-99 flex items-center gap-2">
          Add Category
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow">
          <thead className="bg-orange-50">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Category Name</th>
              <th className="px-6 py-3 text-left">Color</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-blue-50" onClick={() => handleViewCategory(category)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{category.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.category_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 border-gray-300 ${getPreviewClass(category.color)}`}></div>
                    <span className="text-sm text-gray-900">{category.color}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6 rounded-2xl shadow">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Configuration</h1>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('profiles')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profiles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}>
              User Profiles
            </button>
            <button onClick={() => setActiveTab('managers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'managers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}>
              Account Managers
            </button>
            <button onClick={() => setActiveTab('categories')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}>
              Categories
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <Loader/>
          ) : (
            <>
              {activeTab === 'profiles' && <ProfilesTable />}
              {activeTab === 'managers' && <ManagersTable />}
              {activeTab === 'categories' && <CategoriesTable />}
            </>
          )}
        </div>
      </div>
      <ModalAccountManager isOpen={showModalAccountManager} onClose={handleAccountManagerModalClose} manager={selectedManager} mode={modalMode} />
      <ModalUser isOpen={showModalUser} onClose={handleUserModalClose} user={selectedUser} />
      <ModalCategory isOpen={showModalCategory} onClose={handleCategoryModalClose} category={selectedCategory} />
      {/* Add Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Category</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor={newCategory.id} className="block text-sm font-medium">Category ID</label>
                <input type="text" value={newCategory.id} readOnly className='mt-1 block w-full rounded-md p-2 bg-gray-300 text-gray-600' />
              </div>
              <TextInput label='Category Name' type='text' value={newCategory.category_name} onChange={(e) => {
                const name = e.target.value;
                const slug = name.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9\_]/g, ''); 
                  setNewCategory({
                    ...newCategory,
                    category_name: name,
                    id: slug
                  });}} placeholder='Enter category name' />
              <SelectField label='Color' value={newCategory.color} onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                selectmessage={"Please select a color"}
                allowEmpty={false}
                options={[
                    {value: "red", label: "Red"}, {value: "orange", label: "Orange"},
                    {value: "amber", label: "Amber"}, {value: "yellow", label: "Yellow"},
                    {value: "lime", label: "Lime"}, {value: "green", label: "Green"},
                    {value: "emerald", label: "Emerald"}, {value: "teal", label: "Teal"},
                    {value: "cyan", label: "Cyan"}, {value: "sky", label: "Sky"},
                    {value: "blue", label: "Blue"}, {value: "indigo", label: "Indigo"},
                    {value: "violet", label: "Violet"}, {value: "purple", label: "Purple"},
                    {value: "fuchsia", label: "Fuchsia"}, {value: "pink", label: "Pink"},
                    {value: "rose", label: "Rose"}, {value: "stone", label: "Stone"},
                    {value: "neutral", label: "Neutral"}, {value: "zinc", label: "Zinc"},
                    {value: "gray", label: "Gray"}, {value: "slate", label: "Slate"},
                  ]} classfield={"flex items-center gap-3"}> 
                <div className={`w-10 h-10 rounded border border-gray-300 ${getPreviewClass(newCategory.color)}`}/>
              </SelectField>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={addCategory} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
