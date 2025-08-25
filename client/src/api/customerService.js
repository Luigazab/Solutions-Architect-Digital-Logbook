import { supabase } from "../supabaseClient";

export const customerService = {
  async fetchCustomers() {
    const { data, error } = await supabase
      .from("customers")
      .select(`
        *,
        account_manager:account_managers(id, name, position, department)
      `)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
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
        updated_by: user?.id
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
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));
    
    for (const row of data) {
      const values = headers.map(h => `"${row[h] ?? ""}"`);
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