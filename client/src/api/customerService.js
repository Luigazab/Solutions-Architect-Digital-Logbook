import { supabase } from "../supabaseClient";

export const customerService = {
  async enrichWithProfiles(data, userIdFields = ['added_by', 'updated_by']) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return data;
    }

    const items = Array.isArray(data) ? data : [data];
    const userIds = new Set();

    // Collect all unique user_ids that need profiles
    items.forEach(item => {
      userIdFields.forEach(field => {
        if (item[field]) userIds.add(item[field]);
      });
    });

    // Fetch all needed profiles in one query
    let profiles = {};
    if (userIds.size > 0) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, user_id, title')
        .in('user_id', Array.from(userIds));

      if (!profileError && profileData) {
        // Create a lookup map by user_id
        profiles = profileData.reduce((acc, profile) => {
          acc[profile.user_id] = profile;
          return acc;
        }, {});
      }
    }

    // Enrich the data with profile information
    const enrichedItems = items.map(item => {
      const enriched = { ...item };
      
      userIdFields.forEach(field => {
        if (item[field]) {
          enriched[`${field}_profile`] = profiles[item[field]] || null;
        }
      });

      return enriched;
    });

    return Array.isArray(data) ? enrichedItems : enrichedItems[0];
  },
  async fetchCustomers() {
    const { data, error } = await supabase
      .from("customers")
      .select(`
        *,
        account_manager:account_managers(id, name, position, department)
      `)
      .order("created_at", { ascending: false });
    
    if (error) throw error;

    const enrichedData = await this.enrichWithProfiles(data || []);
    return enrichedData;
  },

  async createCustomer(customerData) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("customers")
      .insert([{
        ...customerData,
        added_by: user?.id,
        updated_by: user?.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCustomer(id, customerData) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("customers")
      .update({
        ...customerData,
        updated_by: user?.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async assignAccountManager(customerId, accountManagerId) {
    return this.updateCustomer(customerId, { account_manager_id: accountManagerId });
  },

  calculateSummary(customers) {
    const industryCounts = {};
    customers.forEach(customer => {
      industryCounts[customer.industry] = (industryCounts[customer.industry] || 0) + 1;
    });

    const totalIndustries = Object.keys(industryCounts).length;
    const topIndustry = Object.entries(industryCounts).sort((a, b) => b[1] - a[1])[0] || ["", 0];

    return {
      totalCustomers: customers.length,
      totalIndustries,
      topIndustry: { name: topIndustry[0], count: topIndustry[1] }
    };
  },

  filterCustomers(customers, searchTerm) {
    if (!searchTerm.trim()) return customers;
    
    const lowerTerm = searchTerm.toLowerCase();
    return customers.filter(customer => 
      Object.values(customer).some(value => 
        String(value || "").toLowerCase().includes(lowerTerm)
      )
    );
  },

  exportToCSV(data, filename) {
    if (!data.length) return;
    
    const csvRows = [];
    const headers = Object.keys(data[0]).filter(key => 
      !key.includes('account_manager') && !key.includes('_profile')
    );
    headers.push('account_manager_name', 'account_manager_department');
    csvRows.push(headers.join(","));
    
    for (const row of data) {
      const values = headers.map(h => {
        if (h === 'account_manager_name') {
          return `"${row.account_manager?.name || ""}"`;
        }
        if (h === 'account_manager_department') {
          return `"${row.account_manager?.position || ""}"`;
        }
        return `"${row[h] ?? ""}"`;
      });
      csvRows.push(values.join(","));
    }
    
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};