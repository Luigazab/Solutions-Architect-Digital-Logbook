import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SummaryCard from "../components/SummaryCard";
import { Title, Subtitle, Description} from "../components/Text";
import Loader from "../components/Loader";
import { getCategoryBadgeClasses, getColorClasses } from '../utils/colors';
import { activityService } from '../api/activity';
import { excelExportService } from '../api/excelExport';
import SelectField from "../components/Dropdown";

export default function Report(){
    const navigate = useNavigate();
    const [summary, setSummary] = useState({
        totalActivities: 0,
        averageActivities: 0,
        totalCertifications: 0,
    });
    const [breakdown, setBreakdown] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customerStats, setCustomerStats] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [architectCertStats, setArchitectCertStats] = useState([]);

    
    // Filter states
    const [filters, setFilters] = useState({
        timeframe: '', solarch: '', category: ''
    });

    // Options for dropdowns
    const [filterOptions, setFilterOptions] = useState({
        timeframes: [
            { value: 'last_week', label: 'Last Week' },
            { value: 'last_month', label: 'Last Month' },
            { value: 'last_3_months', label: 'Last 3 Months' },
            { value: 'last_6_months', label: 'Last 6 Months' },
            { value: 'last_year', label: 'Last Year' }
        ],
        solarches: [],
        categories: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Update summary and breakdown when activities or filters change
        if (activities.length > 0) {
            const filtered = getFilteredActivities();
            const summaryStats = activityService.generateSummary(filtered);
            setSummary(summaryStats);
            
            const categoryBreakdown = activityService.generateCategoryBreakdown(filtered);
            setBreakdown(categoryBreakdown);
            
            const customerStatistics = activityService.generateCustomerStats(filtered);
            setCustomerStats(customerStatistics);

             const certCounts = filtered
            .filter(a => a.category?.category_name === "Technical Training")
            .reduce((acc, activity) => {
                const solarch = activity.solarch || "Unknown";
                acc[solarch] = (acc[solarch] || 0) + 1;
                return acc;
            }, {});

        const statsArray = Object.entries(certCounts).map(([solarch, count]) => ({
            solarch,
            role: "Solution Architect",
            value: count
        }));

        setArchitectCertStats(statsArray);
        }
    }, [activities, filters, searchTerm]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: activitiesData, error } = await activityService.fetchActivities();
            
            if (error) {
                console.error("Error fetching activities:", error);
                setLoading(false);
                return;
            }

            setActivities(activitiesData);

            // Extract unique solution architects and categories for filter options
            const uniqueSolarches = [...new Set(activitiesData.map(a => a.solarch))];
            const uniqueCategories = [...new Set(activitiesData.map(a => a.category?.category_name).filter(Boolean))];
            
            setFilterOptions(prev => ({
                ...prev,
                solarches: uniqueSolarches.map(s => ({ value: s.toLowerCase(), label: s })),
                categories: uniqueCategories.map(c => ({ value: c.toLowerCase().replace(' ', '_'), label: c }))
            }));

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getCustomerInitials = (companyName) => {
        if (!companyName) return "??";
        return companyName
            .split(' ')
            .map(word => word[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    };

    const formatLastActivity = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return "1 day ago";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    // Enhanced filtering function
    const getFilteredActivities = () => {
        return activities.filter(activity => {
            // Text search filter
            const matchesSearch = !searchTerm || 
                activity.customer?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                activity.solarch.toLowerCase().includes(searchTerm.toLowerCase());

            // Solution Architect filter
            const matchesSolarch = !filters.solarch || 
                activity.solarch.toLowerCase() === filters.solarch;

            // Category filter
            const matchesCategory = !filters.category || 
                activity.category?.category_name?.toLowerCase().replace(' ', '_') === filters.category;

            // Timeframe filter
            let matchesTimeframe = true;
            if (filters.timeframe) {
                const activityDate = new Date(activity.date);
                const now = new Date();
                
                switch (filters.timeframe) {
                    case 'last_week':
                        matchesTimeframe = activityDate >= new Date(now.setDate(now.getDate() - 7));
                        break;
                    case 'last_month':
                        matchesTimeframe = activityDate >= new Date(now.setMonth(now.getMonth() - 1));
                        break;
                    case 'last_3_months':
                        matchesTimeframe = activityDate >= new Date(now.setMonth(now.getMonth() - 3));
                        break;
                    case 'last_6_months':
                        matchesTimeframe = activityDate >= new Date(now.setMonth(now.getMonth() - 6));
                        break;
                    case 'last_year':
                        matchesTimeframe = activityDate >= new Date(now.setFullYear(now.getFullYear() - 1));
                        break;
                    default:
                        matchesTimeframe = true;
                }
            }

            return matchesSearch && matchesSolarch && matchesCategory && matchesTimeframe;
        });
    };

    const filteredActivities = getFilteredActivities();

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            timeframe: '', solarch: '', category: ''
        });
        setSearchTerm('');
    };

    // Updated export handlers using the service
    const handleExportExcel = () => {
        try {
            excelExportService.exportActivitiesToExcel(
                filteredActivities, filters, summary, breakdown, customerStats
            );
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Error creating Excel file. Please try again.');
        }
    };

    const handleExportCSV = () => {
        try {
            const filename = `activities-report-${new Date().toISOString().split('T')[0]}.csv`;
            excelExportService.exportToCSV(filteredActivities, filename);
        } catch (error) {
            console.error('Error exporting to CSV:', error);
            alert('Error creating CSV file. Please try again.');
        }
    };

    const handleRowClick = (activityId) => {
        navigate(`/view-edit-activity?id=${activityId}`);
    };

    return(
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 min-h-[380px] md:max-h-[380px]">
                <SummaryCard title="Total Activities" value={summary.totalActivities} subtitle="Tracked"><span><svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M249.9 66.8c10.4-14.3 7.2-34.3-7.1-44.7s-34.3-7.2-44.7 7.1l-106 145.7-37.5-37.5c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c6.6 6.6 15.8 10 25.1 9.3s17.9-5.5 23.4-13.1l128-176zm128 136c10.4-14.3 7.2-34.3-7.1-44.7s-34.3-7.2-44.7 7.1l-170 233.7-69.5-69.5c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c6.6 6.6 15.8 10 25.1 9.3s17.9-5.5 23.4-13.1l192-264z"/></svg></span></SummaryCard>
                <SummaryCard title="Average Activities" value={summary.averageActivities} subtitle="Per month"><svg class="w-5 h-5" viewBox="0 0 52 52" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"><path d="M39.55 26A10.5 10.5 0 1 0 50 36.5 10.5 10.5 0 0 0 39.55 26m0 16.14a5.65 5.65 0 1 1 5.6-5.64 5.64 5.64 0 0 1-5.6 5.64M23 15.5a10.48 10.48 0 1 0-3.07 7.43A10.5 10.5 0 0 0 23 15.5m-10.5 5.64a5.65 5.65 0 1 1 4-1.65 5.63 5.63 0 0 1-4.01 1.65Zm26.71-15A.8.8 0 0 0 38.49 5h-3a.83.83 0 0 0-.64.4l-22 40.41a.78.78 0 0 0 0 .78.79.79 0 0 0 .68.39h3a.8.8 0 0 0 .64-.4l22-40.41Z"/></svg></SummaryCard>
                <SummaryCard title="Total Certifications" value={summary.totalCertifications} subtitle="Attained Certification"><svg class="w-5 h-5" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 14.5H9a.5.5 0 0 0 .8.4zm2-1.5.3-.4a.5.5 0 0 0-.6 0zm2 1.5-.3.4a.5.5 0 0 0 .8-.4zm-2-3.5A2.5 2.5 0 0 1 9 8.5H8a3.5 3.5 0 0 0 3.5 3.5zM14 8.5a2.5 2.5 0 0 1-2.5 2.5v1A3.5 3.5 0 0 0 15 8.5zM11.5 6A2.5 2.5 0 0 1 14 8.5h1A3.5 3.5 0 0 0 11.5 5zm0-1A3.5 3.5 0 0 0 8 8.5h1A2.5 2.5 0 0 1 11.5 6zM9 10.5v4h1v-4zm.8 4.4 2-1.5-.6-.8-2 1.5zm1.4-1.5 2 1.5.6-.8-2-1.5zm2.8 1.1v-4h-1v4zM15 5V1.5h-1V5zm-1.5-5h-12v1h12zM0 1.5v12h1v-12zM1.5 15H8v-1H1.5zM0 13.5A1.5 1.5 0 0 0 1.5 15v-1a.5.5 0 0 1-.5-.5zM1.5 0A1.5 1.5 0 0 0 0 1.5h1a.5.5 0 0 1 .5-.5zM15 1.5A1.5 1.5 0 0 0 13.5 0v1a.5.5 0 0 1 .5.5zM3 5h5V4H3zm0 3h3V7H3z" fill="#000"/></svg></SummaryCard>
                
                <div className="bg-white p-4 rounded-xl sm:col-span-3 md:col-span-1 shadow md:row-span-2">
                    <div className="flex flex-col justify-between">
                        <div className="flex justify-between items-center">
                            <div>
                                <Title>Certifications</Title>
                                <Description>per Solution Architect</Description>
                            </div>
                            <span><svg className="w-10 h-10" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M688 264c0-4.4-3.6-8-8-8H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8zm-8 136H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8M480 544H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8m-48 308H208V148h560v344c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h264c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8m356.8-74.4c29-26.3 47.2-64.3 47.2-106.6 0-79.5-64.5-144-144-144s-144 64.5-144 144c0 42.3 18.2 80.3 47.2 106.6-57 32.5-96.2 92.7-99.2 162.1-.2 4.5 3.5 8.3 8 8.3h48.1c4.2 0 7.7-3.3 8-7.6C564 871.2 621.7 816 692 816s128 55.2 131.9 124.4c.2 4.2 3.7 7.6 8 7.6H880c4.6 0 8.2-3.8 8-8.3-2.9-69.5-42.2-129.6-99.2-162.1M692 591c44.2 0 80 35.8 80 80s-35.8 80-80 80-80-35.8-80-80 35.8-80 80-80"/></svg></span>
                        </div>
                        <hr className="mb-4" />
                        <div className="flex-grow space-y-4 overflow-y-auto">
                            {architectCertStats.length > 0 ? (
                                architectCertStats.map((stat, idx) => (
                                    <div key={idx}>
                                        {ArchitectCertReport(stat.solarch, stat.solarch, stat.role, stat.value)}
                                        <hr />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No Technical Training records yet.</p>
                            )}
                        </div>
                        <div className="flex justify-end mt-4">
                            <a href="certificate.html" className="bg-gray-100 text-sm font-medium text-gray-800 border border-gray-300 px-4 py-2 rounded hover:bg-slate-800 hover:text-neutral-200">View Certificates</a>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 sm:col-span-3 md:col-span-2 lg:col-span-1 rounded-xl shadow">
                    <h3 className="text-2xl font-semibold mb-4">Activities Breakdown</h3>
                    <ul className="space-y-2">
                        {breakdown.map((b) => (
                            <li key={`${b.category_name}-${b.color}`} className="flex justify-between items-center">  
                                <span className={getCategoryBadgeClasses(b.color)}>{b.category_name}</span>
                                <span className={`text-${b.color}-700`}>{b.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="bg-white p-4 sm:col-span-3 md:col-span-2 rounded-xl shadow">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <Title>Top Customers</Title>
                            <Description>Most active clients this period</Description>
                        </div>
                        <svg className="w-10 h-10" viewBox="0 0 512 512" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M430.641 347.807h15.417a3.753 3.753 0 0 0 3.752-3.752v-23.08a3.75 3.75 0 0 0-3.752-3.751H65.942a3.75 3.75 0 0 0-3.752 3.751v23.08a3.753 3.753 0 0 0 3.752 3.752h15.416V468.12H430.64V347.807zM256 276.611v18.354c0 5.799 4.701 10.499 10.5 10.499h155.344c5.798 0 10.499-4.7 10.499-10.499v-18.354h-27.159v4.559a8.49 8.49 0 0 1-8.49 8.49h-8.135a8.49 8.49 0 0 1-8.49-8.49v-4.559h-71.794v4.559a8.49 8.49 0 0 1-8.49 8.49h-8.134a8.49 8.49 0 0 1-8.49-8.49v-4.559zm176.343-30.298c0-5.799-4.701-10.5-10.499-10.5H266.5c-5.799 0-10.5 4.701-10.5 10.5v17.399h176.343zm-86.361-28.029c.975 1.95 3.756 1.95 4.73 0l13.118-26.235c33.93-7.134 59.407-37.227 59.407-73.278 0-43.146-36.488-77.771-80.29-74.7-37.472 2.627-67.539 33.376-69.396 70.893-1.868 37.724 24.195 69.702 59.313 77.085zm-28.961-105.217 18.185 18.185 44.468-44.468 12.268 12.27-56.735 56.735-30.453-30.452zM62.19 186.001v89.035a8.1 8.1 0 0 0 8.1 8.1h54.168v22.329h31.394v-22.329h54.169a8.1 8.1 0 0 0 8.1-8.1v-89.035a8.1 8.1 0 0 0-8.1-8.099H70.29a8.1 8.1 0 0 0-8.1 8.099m18.842 13.27a4.43 4.43 0 0 1 4.431-4.43h109.385a4.43 4.43 0 0 1 4.43 4.43v62.494a4.43 4.43 0 0 1-4.43 4.431H85.463a4.43 4.43 0 0 1-4.431-4.431z"/></svg>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader />
                        </div>
                    ) : customerStats.length > 0 ? (
                        <>
                            <div className="max-h-64 md:max-h-24 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                {customerStats.map((customer, index) => {
                                    const colors = getColorClasses(customer.color);
                                    const gradientClass = `bg-gradient-to-r from-${customer.color}-50 to-${customer.color}-100`;
                                    const borderClass = `border-${customer.color}-200`;
                                    
                                    return (
                                        <div key={customer.company_name} className={`flex items-center justify-between p-3 ${gradientClass} rounded-lg border ${borderClass} hover:shadow-md transition-all duration-200 cursor-pointer`}>
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-10 h-10 bg-${customer.color}-500 rounded-lg flex items-center justify-center shadow-sm`}>
                                                    <span className="text-white font-bold text-sm">
                                                        {getCustomerInitials(customer.company_name)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{customer.company_name}</h4>
                                                    <p className="text-sm text-gray-600">{customer.location} • Last activity: {formatLastActivity(customer.lastActivity)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-lg font-bold ${colors.text}`}>{customer.count}</div>
                                                <div className="text-xs text-gray-500">{customer.count === 1 ? 'activity' : 'activities'}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-200">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Total Active Customers</span>
                                    <span className="font-semibold text-gray-900">{customerStats.length}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.196-2.196M17 20H7m10 0v-2a3 3 0 00-3-3m0 0a3 3 0 00-3 3v2m3-6a3 3 0 100-6 3 3 0 000 6m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p>No customer activities in selected period</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow">
                <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                    <div>
                        <Title>Activity Details</Title>
                        <Subtitle>Click row to view/edit activity details</Subtitle>
                    </div>
                    
                    <label className="flex items-center gap-2 h-10 w-full max-w-lg rounded-md border border-input bg-background px-3 py-2 text-base text-muted-foreground focus-within:ring-teal-800 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 md:text-sm">
                        <svg className="w-5 h-5 text-gray-500" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-.691 3.516a4.5 4.5 0 1 1 .707-.707l2.838 2.837a.5.5 0 0 1-.708.708z" fill="#000"/></svg>
                        <input type="text" placeholder="Search activities..." className="w-full bg-transparent outline-none placeholder:text-muted-foreground" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    </label>
                    
                    <div className="flex justify-end md:gap-2">
                        <a href="log-activity" className="inline-flex items-center border rounded-lg p-2 bg-slate-700 font-medium text-neutral-100 hover:bg-slate-800 hover:text-neutral-200">Log Activity</a>
                        <button onClick={handleExportExcel} className="inline-flex items-center border rounded-lg p-2 bg-emerald-700 font-medium text-neutral-100 hover:bg-teal-800 hover:text-neutral-200 transition-colors mr-2">
                            Export Excel
                        </button>
                        <button onClick={handleExportCSV} className="inline-flex items-center border rounded-lg p-2 bg-blue-600 font-medium text-neutral-100 hover:bg-blue-700 hover:text-neutral-200 transition-colors">
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="flex flex-wrap justify-start gap-4 p-2 border-b border-gray-200">
                    <SelectField label="Timeframe" name="timeframe" value={filters.timeframe} selectmessage="All time"
                        options={filterOptions.timeframes}
                        onChange={(e) => handleFilterChange('timeframe', e.target.value)}/>
                    <SelectField label="Solutions Architect" name="solarch" value={filters.solarch} selectmessage="All Solutions Architects"
                        options={filterOptions.solarches}
                        onChange={(e) => handleFilterChange('solarch', e.target.value)}/>
                    <SelectField label="Category" name="category" value={filters.category} selectmessage="All Categories" 
                        options={filterOptions.categories}
                        onChange={(e) => handleFilterChange('category', e.target.value)}/>
                    
                    {/* Clear Filters Button */}
                    {(filters.timeframe || filters.solarch || filters.category || searchTerm) && (
                        <div className="flex items-end">
                            <button onClick={clearFilters}
                                className="px-3 py-2 text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors">
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Filter Summary */}
                {(filters.timeframe || filters.solarch || filters.category) && (
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg mt-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                            <span className="text-sm font-medium text-blue-800">
                                Showing {filteredActivities.length} of {activities.length} activities
                            </span>
                        </div>
                    </div>
                )}
                
                <div className="overflow-x-auto w-full mt-4">
                    <table className="w-full text-left border-t min-w-full border-gray-200 space-x-8 space-y-4">
                        <thead>
                            <tr className="text-gray-500 text-sm">
                                <th className="py-3">#</th>
                                <th className="py-3">Date</th>
                                <th className="py-3">Solution Architect</th>
                                <th className="py-3">Activity</th>
                                <th className="py-3">Category</th>
                                <th className="py-3">Location</th>
                                <th className="py-3">Customer</th>
                                <th className="py-3">Additional Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-8">
                                        <Loader /> 
                                    </td>
                                </tr>
                            ) : filteredActivities.length > 0 ? (
                                filteredActivities.map((activity, index) => (
                                    <tr key={activity.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer"
                                        onClick={() => handleRowClick(activity.id)}
                                        title="Click to view/edit activity details"
                                    >
                                        <td className="py-3 px-2 text-gray-500">{index + 1}</td>
                                        <td className="py-3 px-2">{new Date(activity.date).toLocaleDateString()}</td>
                                        <td className="py-3 px-2 font-medium truncate">{activity.solarch}</td>
                                        <td className="py-3 px-2 max-w-lg">{activity.title} | {activity.description} | {activity.start_time}-{activity.end_time}</td>
                                        <td className="py-3 px-2 truncate">
                                            <span className={getCategoryBadgeClasses(activity.category?.color)}>
                                                {activity.category?.category_name}
                                            </span>
                                        </td>
                                        <td className="py-3 px-2 text-gray-600">{activity.customer?.location}</td>
                                        <td className="py-3 px-2 text-gray-600">{activity.customer?.company_name || "No customer"}</td>
                                        <td className="py-3 px-2 text-sm text-gray-500 max-w-xs">
                                            {activity.meeting_participants && (
                                                <div className="mb-1">
                                                    <span className="mb-1 font-medium">Participants:</span> {activity.meeting_participants}
                                                </div>
                                            )}
                                            {activity.technologies_discussed && (
                                                <div className="mb-1">
                                                    <span className="mb-1 font-medium">Tech:</span> {activity.technologies_discussed}
                                                </div>
                                            )}

                                            {activity.outcomes && (
                                                <div className="mb-1">
                                                    <span className="font-medium">Outcomes:</span> {activity.outcomes}
                                                </div>
                                            )}
                                            {activity.action_items && (
                                                <div className="mb-1">
                                                    <span className="font-medium">Action Items:</span> {activity.action_items}
                                                </div>
                                            )}
                                            {activity.knowledge_area && (
                                                <div className="mb-1">
                                                    <span className="font-medium">Knowledge:</span> {activity.knowledge_area}
                                                </div>
                                            )}
                                            {activity.training_provider && (
                                                <div className="mb-1">
                                                    <span className="font-medium">Provider:</span> {activity.training_provider}
                                                </div>
                                            )}
                                            {activity.certifications_earned && (
                                                <div className="mb-1">
                                                    <span className="font-medium text-green-600">Cert:</span> {activity.certifications_earned}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-8 text-gray-500">
                                        {searchTerm || filters.timeframe || filters.solarch || filters.category 
                                            ? `No activities found matching the current filters` 
                                            : "No activities found for the selected period."
                                        }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export function ArchitectCertReport( altText, name, role, value) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <div>
                    <h4 className="text-slate-900 font-semibold">{name}</h4>
                    <p className="text-sm text-slate-700">{role}</p>
                </div>
            </div>
            <Title>{value}</Title>
        </div>
    );
}