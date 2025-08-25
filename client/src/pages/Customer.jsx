"use client";
import { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import { Title, Subtitle } from "../components/Text";
import ModalCustomer from "../components/modals/ModalCustomer";
import ModalAccountManager from "../components/modals/ModalAccountManager";
import Loader from "../components/Loader";
import { customerService } from "../api/customerService";
import { activityService } from "../api/activity";

export default function Customer() {
    const [customers, setCustomers] = useState([]);
    const [accountManagers, setAccountManagers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [summary, setSummary] = useState({ totalCustomers: 0, totalIndustries: 0, topIndustry: { name: "", count: 0 } });
    const [loading, setLoading] = useState(true);
    const [showModalCustomer, setShowModalCustomer] = useState(false);
    const [showModalAccountManager, setShowModalAccountManager] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const data = await customerService.fetchCustomers();
            setCustomers(data);
            setFilteredCustomers(data);
            setSummary(customerService.calculateSummary(data));
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAccountManagers = async () => {
        try {
            const { data } = await activityService.fetchAccountManagers();
            if (!data.error) setAccountManagers(data);
        } catch (error) {
            console.error("Error loading account managers:", error);
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setFilteredCustomers(customerService.filterCustomers(customers, term));
    };

    const handleRowClick = (e, customer) => {
        e.preventDefault();
        setEditingCustomer(customer);
        setShowModalCustomer(true);
    };

    const handleCustomerModalClose = () => {
        setShowModalCustomer(false);
        setEditingCustomer(null);
        fetchCustomers();
    };

    const handleAccountManagerModalClose = () => {
        setShowModalAccountManager(false);
        fetchAccountManagers();
    };

    const handleExportCSV = () => {
        customerService.exportToCSV(filteredCustomers, "customers.csv");
    };

    useEffect(() => {
        fetchCustomers();
        fetchAccountManagers();
    }, []);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <SummaryCard title="Total Customers" value={summary.totalCustomers} subtitle="Tracked">
                    <svg className="w-10 h-10" viewBox="0 0 24 24" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg"><path d="M20 20H4c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h16c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3M4 6c-.551 0-1 .449-1 1v10c0 .551.449 1 1 1h16c.551 0 1-.449 1-1V7c0-.551-.449-1-1-1zm6 9H6a1 1 0 1 1 0-2h4a1 1 0 1 1 0 2m0-4H6a1 1 0 1 1 0-2h4a1 1 0 1 1 0 2"/><circle cx="16" cy="10.5" r="2"/><path d="M16 13.356c-1.562 0-2.5.715-2.5 1.429 0 .357.938.715 2.5.715 1.466 0 2.5-.357 2.5-.715 0-.714-.98-1.429-2.5-1.429"/></svg>
                </SummaryCard>
                <SummaryCard title="Total Industry" value={summary.totalIndustries} subtitle="From All Activities">
                    <svg className="w-10 h-10"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60.272 60.272" xml:space="preserve"><path d="m31.577 1.863 12.462 8.139v48.577H31.577zm13.438 35.012v21.449h15.258V41.749zm6.442 16.786-4.662-1.357V48.28l4.662 1.692zm0-7.037-4.662-1.358v-4.022l4.662 1.694zm5.849 8.73-4.664-1.355v-4.026l4.664 1.695zm0-7.036-4.663-1.356v-4.024l4.665 1.692v3.688zM14.75 11.527v32.208l-2.203 1.439V34.417l-1.398.578v-10.73L.974 28.757V39.21L0 39.614v18.965h30.154V1.694zM1.907 30.804l3.434-1.589v4.132l-3.434 1.526zm.255 6.697 3.433-1.591v4.135l-3.433 1.524zm3.537 14.844-3.433 1.528v-4.071l3.433-1.589zm0-6.296-3.433 1.529v-4.071l3.433-1.588zm.489-17.237 3.434-1.589v4.133l-3.434 1.525zm.255 6.696 3.433-1.589v4.133l-3.433 1.527zm3.835 14.868-3.434 1.527v-4.069l3.434-1.591zm0-6.295-3.434 1.525v-4.067l3.434-1.59zm10.999.716-4.749 2.973v-4.408l4.749-3.072zm0-7.448-4.749 2.971v-4.41l4.749-3.072zm0-7.45-4.749 2.974v-4.411l4.749-3.074zm0-7.449-4.749 2.97v-4.408l4.749-3.074zm0-7.451-4.749 2.972v-4.409l4.749-3.073zm7.036 25.396-5.51 3.448V39.3l5.51-3.566zm0-7.45-5.51 3.449V31.85l5.51-3.568zm0-7.45-5.51 3.449v-4.542l5.51-3.569zm0-7.45-5.51 3.449v-4.543l5.51-3.568zm0-7.451-5.51 3.449V9.5l5.51-3.568z"/></svg>
                </SummaryCard>
                <SummaryCard title="Industry with most count" value={summary.topIndustry.count} subtitle={summary.topIndustry.name || "N/A"}>
                    <svg className="w-10 h-10" viewBox="0 0 24 24" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg"><path d="M17.657 5.304c-3.124-3.073-8.189-3.073-11.313 0a7.78 7.78 0 0 0 0 11.13L12 21.999l5.657-5.565a7.78 7.78 0 0 0 0-11.13M12 13.499c-.668 0-1.295-.26-1.768-.732a2.503 2.503 0 0 1 0-3.536c.472-.472 1.1-.732 1.768-.732s1.296.26 1.768.732a2.503 2.503 0 0 1 0 3.536c-.472.472-1.1.732-1.768.732"/></svg>
                </SummaryCard>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
                <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-4">
                    <div>
                        <Title>Customer Information</Title>
                        <Subtitle>Right-click row to view/edit customer details</Subtitle>
                    </div>
                    <label className="flex items-center gap-2 h-10 w-full max-w-lg rounded-md border border-input bg-background px-3 py-2 text-base text-muted-foreground focus-within:ring-teal-800 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 md:text-sm">
                        <svg className="w-5 h-5 text-gray-500" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-.691 3.516a4.5 4.5 0 1 1 .707-.707l2.838 2.837a.5.5 0 0 1-.708.708z" fill="#000"/>
                        </svg>
                        <input type="text" placeholder="Search customers..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} className="w-full bg-transparent outline-none placeholder:text-muted-foreground" />
                    </label>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setShowModalCustomer(true)} className="inline-flex items-center border rounded-lg p-2 bg-slate-700 font-medium text-neutral-100 hover:bg-slate-800">Add Customer</button>
                        <button type="button" onClick={() => setShowModalAccountManager(true)} className="inline-flex items-center border rounded-lg p-2 bg-blue-700 font-medium text-neutral-100 hover:bg-blue-800">Add Account Manager</button>
                        <details className="relative">
                            <summary className="cursor-pointer inline-flex items-center border rounded-lg py-2 px-4 bg-emerald-700 font-medium text-neutral-100 hover:bg-teal-800 transition-colors">Export ↓</summary>
                            <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black/25 z-50">
                                <ul className="py-1">
                                    <li><button className="w-full text-left px-4 py-2 hover:bg-blue-50" onClick={handleExportCSV}><div className="font-semibold text-gray-800">CSV Export</div><Subtitle>Download customer data</Subtitle></button></li>
                                </ul>
                            </div>
                        </details>
                    </div>
                </div>
                
                <div className="overflow-x-auto w-full">
                    <table className="w-full min-w-full text-left border-t border-gray-200">
                        <thead>
                            <tr className="text-gray-500 text-sm">
                                <th className="py-2">#</th>
                                <th className="py-2">Company Name</th>
                                <th className="py-2">Address</th>
                                <th className="py-2">Industry</th>
                                <th className="py-2">Location</th>
                                <th className="py-2">Contact Person</th>
                                <th className="py-2">Contact Details</th>
                                <th className="py-2">Website</th>
                                <th className="py-2">Account Manager</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" className="text-center py-4"><Loader /></td></tr>
                            ) : filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer, index) => (
                                    <tr key={customer.id} onContextMenu={(e) => handleRowClick(e, customer)} className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer" title="Right-click to view/edit customer details">
                                        <td className="py-3 text-gray-400">{index + 1}</td>
                                        <td className="py-3 px-2 font-semibold">{customer.company_name}</td>
                                        {customer.address &&<td className="py-3 px-2 max-w-xs text-xs hover:scale-140 hover:bg-white/50 transition"> {customer.address}</td> || <td></td>}
                                        <td className="py-3 px-2 truncate">{customer.industry}</td>
                                        <td className="py-3 px-2">{customer.location}</td>
                                        <td className="py-3 px-2">
                                            <div className="font-semibold">{customer.contact_person}</div>
                                            {customer.designation && <div className="text-gray-500 text-sm">{customer.designation}</div>}
                                        </td>
                                        <td className="py-3 px-2">
                                            <div className="font-semibold">{customer.email}</div>
                                            {customer.contact_number && <div className="text-gray-500 text-sm">{customer.contact_number}</div>}
                                        </td>
                                        <td className="py-3 px-2">
                                            <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-sky-600 underline text-xs">
                                                {customer.website}
                                            </a>
                                        </td>
                                        <td className="py-3 px-2">
                                            {customer.account_manager ? (
                                                <div>
                                                    <div className="font-medium">{customer.account_manager.name}</div>
                                                    <div className="text-xs text-gray-500">{customer.account_manager.department}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm truncate">No one assigned yet</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8" className="text-center py-4 text-gray-500">No customers found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <ModalCustomer isOpen={showModalCustomer} onClose={handleCustomerModalClose} editingCustomer={editingCustomer} accountManagers={accountManagers} />
                <ModalAccountManager isOpen={showModalAccountManager} onClose={handleAccountManagerModalClose} />
            </div>
        </>
    );
}