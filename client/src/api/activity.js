import { supabase } from '../supabaseClient';

export const activityService ={
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
    return { data, error: null };
  },

  fetchSolutionsArchitects: async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
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
    const { data, error } = await supabase
      .from('activities')
      .select(`*,
        category:categories (id, category_name, color),
        customer:customers (id, company_name, industry, location),
        account_manager:account_managers (id, name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error fetching activity by ID: ${error.message}`);
      return {data: null, error: error.message};
    }
    return { data, error: null };
  },

  async insertActivity(payload) {
    const { data, error } = await supabase
      .from('activities')
      .insert([payload])
      .select();
    return { data, error};
  },

  async updateActivity(id, payload) {
    const { data, error } = await supabase
      .from('activities')
      .update(payload)
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