import { supabase } from '../supabaseClient';

export const activityService ={
  async getCurrentUser() {
    const {data: { user }, error} = await supabase.auth.getUser();

    if (error || !user){
      throw new Error('User noot authenticated');
    }
    return { id: user.id, email:user.email};
  },

  async fetchActivities() {
    const { data, error } = await supabase
      .from('activities')
      .select(`*,
        category:categories (category_name, color),
        customer:customers (company_name, industry, location),
        account_manager:account_managers (name)
      `)
      .order('date', { ascending: false });

    if (error) {
      throw new Error(`Error fetching activities: ${error.message}`);
      return {data: [], error: error.message};
    }
    const enrichedData = await Promise.all(
      data.map(async (activity) => {
        if(activity.user){
          const{data: profile } = await supabase
            .from('profiles')
            .select('id, full_name, user_id, title')
            .eq('user_id', activity.user)
            .single();
          return{
            ...activity,
            user_profile: profile
          };
        }
        return activity;
      })
    );
    return { data: enrichedData, error: null };
  },

  async fetchActivitiesByDateRange(startDate, endDate){
    const {data, error} = await supabase
      .from('activities')
      .select(`*,
        category:categories (category_name, color),
        customer:customers (company_name, industry, location),
        account_manager:account_managers (name)
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', {ascending:true});

    if(error){
      throw new Error(`Error fetching activities by date range: ${error.message}`);
    }
    const enrichedData = await Promise.all(
      data.map(async (activity) => {
        if(activity.user){
          const{data: profile } = await supabase
            .from('profiles')
            .select('id, full_name, user_id, title')
            .eq('user_id', activity.user)
            .single();
          return{
            ...activity,
            user_profile: profile
          };
        }
        return activity;
      })
    );
    return { data: enrichedData, error: null };
  },


  fetchSolutionsArchitects: async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_id, full_name')
        .eq('is_solarch', true)
        .order('full_name', { ascending: true });

      if (error) {
        console.error("Error fetching solutions architects:", error);
        return { data: [], error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error in fetchSolutionsArchitects:", error);
      return { data: [], error };
    }
  },

  async fetchActivityById(id) {
  // First, get the activity data
  const { data, error } = await supabase
    .from('activities')
    .select(`
      *,
      category:categories (id, category_name, color),
      customer:customers (id, company_name, industry, location),
      account_manager:account_managers (id, name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching activity by ID: ${error.message}`);
  }

  // Collect all unique user_ids that need profiles
  const userIds = new Set();
  if (data.user) userIds.add(data.user);  // Changed from data.user
  if (data.added_by) userIds.add(data.added_by);
  if (data.updated_by) userIds.add(data.updated_by);

  // Fetch all needed profiles in one query
  let profiles = {};
  if (userIds.size > 0) {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, user_id')
      .in('user_id', Array.from(userIds));

    if (!profileError && profileData) {
      // Create a lookup map by user_id
      profiles = profileData.reduce((acc, profile) => {
        acc[profile.user_id] = profile;
        return acc;
      }, {});
    }
  }

  // Enrich the activity data with profile information
  const enrichedActivity = {
    ...data,
    user_profile: profiles[data.user] || null,    // Changed from data.user
    added_by_profile: profiles[data.added_by] || null,
    updated_by_profile: profiles[data.updated_by] || null
  };

  return { data: enrichedActivity, error: null };
},

  async insertActivity(payload) {
    const { data, error } = await supabase
      .from('activities')
      .insert([payload])
      .select();
    return { data, error};
  },

  async updateActivity(id, payload) {

    const currentUser = await this.getCurrentUser();
    const updatedPayload = {
      ...payload,
      updated_by: currentUser.id
    };

    const { data, error } = await supabase
      .from('activities')
      .update(updatedPayload)
      .eq('id', id)
      .select();
    return { data, error};
  },

  async deleteActivity(id) {
    const { data, error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id)
    return { data, error};
  },

  async fetchCustomers() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('company_name');
    return { data: data || [], error };
  },
  
  async fetchAccountManagers() {
    const { data, error } = await supabase
      .from('account_managers')
      .select('*')
      .order('name');
    return { data: data || [], error };
  },
  
  generateSummary(activities) {
    const totalActivities = activities.length;
    const averageActivities = totalActivities > 0 ? totalActivities / 30 : 0; 
    const totalCertifications = activities.filter(activity => activity.category?.category_name === 'Technical Training').length;

    return {
      totalActivities,
      averageActivities: Math.round(averageActivities * 100) / 100, // Round to 2 decimal places
      totalCertifications,
    };
  },


  //For Activities Breakdown
  generateCategoryBreakdown(activities) {
    const categories = {};
    activities.forEach(activity => {
      const catKey = activity.category?.category_name || 'Uncategorized';
      if (!categories[catKey]) {
        categories[catKey] = { count: 0, color: activity.category?.color || '#000' };
      }
      categories[catKey].count++;
    });

    return Object.entries(categories).map(([name, info]) => ({
      category_name: name,
      count: info.count,
      color: info.color,
    }));
  },


  //For top customers panel
  generateCustomerStats(activities){
    const customerActivity = {};
    activities.forEach(activity => {
      if (activity.customer && activity.customer.company_name) {
        const customerKey = activity.customer.company_name;
        if (!customerActivity[customerKey]) {
          customerActivity[customerKey] = { 
            company_name: activity.customer.company_name,
            location: activity.customer.location || 'Unknown',
            count: 0,
            lastActivity: activity.date || 'N/A'
          };
        }
        customerActivity[customerKey].count++;

        if (new Date(activity.date) > new Date(customerActivity[customerKey].lastActivity)) {
          customerActivity[customerKey].lastActivity = activity.date;
        }
      }
    });

    const colors = ['blue', 'green', 'pink', 'orange', 'purple','teal', 'cyan', 'indigo'];

    return Object.values(customerActivity).sort((a, b) => b.count - a.count).map((customer, index) => ({
      ...customer,
      rank: index + 1,
      color: colors[index % colors.length],
    }));
  }
};