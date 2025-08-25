import {Title, Subtitle} from "../components/Text";
import { Link } from "react-router-dom";

export default function QuickActions(){
    return(
        <>
            <Title>Quick Actions</Title>
            <Subtitle>Get started with tracking your activities</Subtitle>
            <div className="grid grid-cols-2 gap-4 ">
                <Link to="/log-activity">
                <div className="flex flex-col items-center justify-center text-white bg-sky-950 hover:bg-gray-900 hover:text-amber-300 py-4 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Log Activity
                </div>
                </Link>
                <Link to="/schedule">
                <div className="flex flex-col items-center justify-center border border-gray-300 py-4 rounded-xl hover:bg-blue-50 hover:text-sky-900 hover:shadow-lg">
                    <svg className="w-5 h-5" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4.5 1a.5.5 0 0 1 .5.5V2h5v-.5a.5.5 0 0 1 1 0V2h1.5A1.5 1.5 0 0 1 14 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 1 12.5v-9A1.5 1.5 0 0 1 2.5 2H4v-.5a.5.5 0 0 1 .5-.5M10 3v.5a.5.5 0 0 0 1 0V3h1.5a.5.5 0 0 1 .5.5V5H2V3.5a.5.5 0 0 1 .5-.5H4v.5a.5.5 0 0 0 1 0V3zM2 6v6.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V6zm5 1.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M9.5 7a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m1.5.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m.5 1.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M9 9.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M7.5 9a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M5 9.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M3.5 9a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M3 11.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m2.5-.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m1.5.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m2.5-.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1" fill="currentColor"/></svg>
                    View Calendar
                </div>
                </Link>
                <Link to="/customer">
                <div className="flex flex-col items-center justify-center border border-gray-300 py-4 rounded-xl hover:bg-blue-50 hover:text-sky-900 hover:shadow-lg">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="7" r="5" stroke="currentColor" strokeWidth="2"/><path d="M17 14h.352a3 3 0 0 1 2.976 2.628l.391 3.124A2 2 0 0 1 18.734 22H5.266a2 2 0 0 1-1.985-2.248l.39-3.124A3 3 0 0 1 6.649 14H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Customers
                </div>
                </Link>
                <Link to="/report">
                <div  className="flex flex-col items-center justify-center border border-gray-300 py-4 rounded-xl hover:bg-blue-50 hover:text-sky-900 hover:shadow-lg">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path fill="#FFF" fillOpacity=".01" fillRule="nonzero" d="M1 1h22v22H1z"/><path stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" d="M21.167 3.292H2.833v5.5h18.334z"/><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m2.833 19.805 5.58-5.637 3.016 2.887 3.687-3.68 2.053 2.002"/><path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M21.167 8.412v11.917M2.833 8.412v6.417m4.132 5.879h14.202M8.792 6.042h9.625M5.583 6.04h.459"/></g></svg>
                    Reports
                </div>
                </Link>
            </div>
        </>
    );
}