"use client";
import { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import { Title, Subtitle, Description } from "../components/Text";
import ModalCustomer from "../components/modals/ModalCustomer";

export default function Customer(){
    const [customer, setCustomer] = useState("");
    const [customers, setCustomers] = useState("");
    const [showModalCustomer, setShowModalCustomer] = useState(false);  
    useEffect(() => {
        const fetchCustomers = async () => {
            const { data, error } = await supabase
            .from("customers")
            .select("id, company_name");
            if (!error) setCustomers(data || []);
        };
        fetchCustomers();
    }, []);

    const handleCustomerModalClose = () => {
        setShowModalCustomer(false); 
        // Re-fetch customer
        supabase
          .from("customers")
          .select("id, company_name")
          .then(({ data, error }) => {
            if (!error) setCustomers(data || []);
        });
    }
    return(
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <SummaryCard title="Total Customers" value={6} subtitle="Tracked">
                    <svg className="w-10 h-10" viewBox="0 0 24 24" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg"><path d="M20 20H4c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3h16c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3M4 6c-.551 0-1 .449-1 1v10c0 .551.449 1 1 1h16c.551 0 1-.449 1-1V7c0-.551-.449-1-1-1zm6 9H6a1 1 0 1 1 0-2h4a1 1 0 1 1 0 2m0-4H6a1 1 0 1 1 0-2h4a1 1 0 1 1 0 2"/><circle cx="16" cy="10.5" r="2"/><path d="M16 13.356c-1.562 0-2.5.715-2.5 1.429 0 .357.938.715 2.5.715 1.466 0 2.5-.357 2.5-.715 0-.714-.98-1.429-2.5-1.429"/></svg>
                </SummaryCard>
                <SummaryCard title="Total Industry" value={9} subtitle="From All Activities">
                    <svg className="w-10 h-10"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60.272 60.272" xml:space="preserve"><path d="m31.577 1.863 12.462 8.139v48.577H31.577zm13.438 35.012v21.449h15.258V41.749zm6.442 16.786-4.662-1.357V48.28l4.662 1.692zm0-7.037-4.662-1.358v-4.022l4.662 1.694zm5.849 8.73-4.664-1.355v-4.026l4.664 1.695zm0-7.036-4.663-1.356v-4.024l4.665 1.692v3.688zM14.75 11.527v32.208l-2.203 1.439V34.417l-1.398.578v-10.73L.974 28.757V39.21L0 39.614v18.965h30.154V1.694zM1.907 30.804l3.434-1.589v4.132l-3.434 1.526zm.255 6.697 3.433-1.591v4.135l-3.433 1.524zm3.537 14.844-3.433 1.528v-4.071l3.433-1.589zm0-6.296-3.433 1.529v-4.071l3.433-1.588zm.489-17.237 3.434-1.589v4.133l-3.434 1.525zm.255 6.696 3.433-1.589v4.133l-3.433 1.527zm3.835 14.868-3.434 1.527v-4.069l3.434-1.591zm0-6.295-3.434 1.525v-4.067l3.434-1.59zm10.999.716-4.749 2.973v-4.408l4.749-3.072zm0-7.448-4.749 2.971v-4.41l4.749-3.072zm0-7.45-4.749 2.974v-4.411l4.749-3.074zm0-7.449-4.749 2.97v-4.408l4.749-3.074zm0-7.451-4.749 2.972v-4.409l4.749-3.073zm7.036 25.396-5.51 3.448V39.3l5.51-3.566zm0-7.45-5.51 3.449V31.85l5.51-3.568zm0-7.45-5.51 3.449v-4.542l5.51-3.569zm0-7.45-5.51 3.449v-4.543l5.51-3.568zm0-7.451-5.51 3.449V9.5l5.51-3.568z"/></svg>
                </SummaryCard>
                <SummaryCard title="Industry with most count" value={5} subtitle="WOW">
                    <svg className="w-10 h-10" viewBox="0 0 24 24" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg"><path d="M17.657 5.304c-3.124-3.073-8.189-3.073-11.313 0a7.78 7.78 0 0 0 0 11.13L12 21.999l5.657-5.565a7.78 7.78 0 0 0 0-11.13M12 13.499c-.668 0-1.295-.26-1.768-.732a2.503 2.503 0 0 1 0-3.536c.472-.472 1.1-.732 1.768-.732s1.296.26 1.768.732a2.503 2.503 0 0 1 0 3.536c-.472.472-1.1.732-1.768.732"/></svg>
                </SummaryCard>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
                <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-4">
                    <Title>Activity Details</Title>
                    <label className="flex items-center gap-2 h-10 w-full max-w-lg rounded-md border border-input bg-background px-3 py-2 text-base text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 md:text-sm">
                        <svg className="w-5 h-5 text-gray-500" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-.691 3.516a4.5 4.5 0 1 1 .707-.707l2.838 2.837a.5.5 0 0 1-.708.708z" fill="#000"/>
                        </svg>
                        <input type="text" placeholder="Search customers..." className="w-full bg-transparent outline-none placeholder:text-muted-foreground" />
                    </label>
                    <div className="flex justify-end md:gap-2">
                        <button type="button" onClick={() => setShowModalCustomer(true)}  className="inline-flex items-center border rounded-lg p-2 bg-slate-700 font-medium text-neutral-100 hover:bg-slate-800 hover:text-neutral-200">Add Customer</button>
                        <button className="inline-flex items-center border rounded-lg p-2 bg-emerald-700 font-medium text-neutral-100 hover:bg-teal-800 hover:text-neutral-200">Export CSV</button>
                    </div>
                </div>
                <table class="w-full text-left space-y-4">
                    <thead>
                        <tr class="text-gray-500 text-sm">
                        <th class="py-2"></th>
                        <th class="py-2">Company Name</th>
                        <th class="py-2">Industry</th>
                        <th class="py-2">Location</th>
                        <th class="py-2">Contact Person</th>
                        <th class="py-2">Email</th>
                        <th class="py-2">Contact Number</th>
                        <th class="py-2">Account Manager</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-t hover:bg-gray-200">
                        <td class="py-2">Aug 13, 2025</td>
                        <td>Example</td>
                        <td><span class="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs">Academe</span></td>
                        <td>Bacolod</td>
                        <td>Joshua Baba</td>
                        <td>pretty@gmail.com</td>
                        <td>+63 98234 92342</td>
                        <td>Sir Nyanners</td>
                        </tr>
                        <tr class="border-t hover:bg-gray-200">
                        <td class="py-2">Aug 2, 2025</td>
                        <td>Sample title</td>
                        <td><span class="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs">Manufacturer</span></td>
                        <td>Bacoor</td>
                        <td>Nicholas Junior</td>
                        <td>Sample@gmail.com</td>
                        <td>+634 5495 343 439</td>
                        <td>Maam nekorini</td>
                        </tr>
                    </tbody>
                    </table>
                    <ModalCustomer isOpen={showModalCustomer} onClose={ handleCustomerModalClose } />
            </div>

        </>
    )
}