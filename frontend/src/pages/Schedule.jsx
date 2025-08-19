"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { getCategoryBadgeClasses } from '../utils/colors';

// Loading Spinner Component
function LoadingSpinner({ size = "sm" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
    </div>
  );
}

// Error Display Component
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <div className="flex items-center justify-center mb-2">
        <svg className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-800 font-medium">Error loading data</p>
      </div>
      <p className="text-red-600 text-sm mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

// Utility functions
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const isSameDay = (date1, date2) => {
  return formatDate(date1) === formatDate(date2);
};

const generateCalendarGrid = (month, activitiesData) => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const startDate = new Date(firstDay);
  
  // Start from Sunday of the week containing the first day
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  const grid = [];
  const currentDate = new Date(startDate);
  
  // Generate 6 weeks (42 days) to ensure full calendar grid
  for (let i = 0; i < 42; i++) {
    const isCurrentMonth = currentDate.getMonth() === monthIndex;
    const dateKey = formatDate(currentDate);
    const activityCount = activitiesData.filter(activity => 
      formatDate(new Date(activity.date)) === dateKey
    ).length;
    
    grid.push({
      date: new Date(currentDate),
      isCurrentMonth,
      activities: activityCount
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return grid;
};

// Calendar Navigation
function CalendarNav({ currentMonth, onPrev, onToday, onNext, loading }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <svg className="w-5 h-5" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4.5 1a.5.5 0 0 1 .5.5V2h5v-.5a.5.5 0 0 1 1 0V2h1.5A1.5 1.5 0 0 1 14 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 1 12.5v-9A1.5 1.5 0 0 1 2.5 2H4v-.5a.5.5 0 0 1 .5-.5M10 3v.5a.5.5 0 0 0 1 0V3h1.5a.5.5 0 0 1 .5.5V5H2V3.5a.5.5 0 0 1 .5-.5H4v.5a.5.5 0 0 0 1 0V3zM2 6v6.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V6zm5 1.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M9.5 7a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m1.5.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m.5 1.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M9 9.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M7.5 9a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M5 9.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M3.5 9a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M3 11.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m2.5-.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m1.5.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m2.5-.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1" fill="currentColor"/></svg>
        {currentMonth}
        {loading && <LoadingSpinner size="sm" />}
      </div>
      <div className="flex items-center gap-2 justify-between">
        <button onClick={onPrev} disabled={loading}
          className="px-3 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Previous
        </button>
        <button onClick={onToday} disabled={loading}
          className="px-3 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Today
        </button>
        <button onClick={onNext} disabled={loading}
          className="px-3 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Next
        </button>
      </div>
    </div>
  );
}

// Single Day Cell
function CalendarDay({ day, isToday, activities, onSelect, isCurrentMonth, isSelected }) {
  return (
    <div
      onClick={() => onSelect(day.date)}
      className={`border rounded h-20 p-1 relative cursor-pointer transition-colors ${
        isSelected 
          ? "border-2 border-indigo-500 bg-indigo-100" 
          : isToday 
            ? "border-2 border-amber-500 bg-amber-50" 
            : "hover:bg-gray-100"
      } ${!isCurrentMonth ? "text-gray-300 bg-gray-50" : ""}`}
    >
      <div className={`text-sm ${
        isSelected 
          ? "font-bold text-indigo-700" 
          : isToday 
            ? "font-bold text-amber-600" 
            : ""
      }`}>
        {day.date.getDate()}
      </div>
      {activities > 0 && isCurrentMonth && (
        <span className={`absolute bottom-1 left-1 text-[10px] rounded px-1 ${
          isSelected 
            ? "text-indigo-700 bg-indigo-200" 
            : "text-amber-600 bg-amber-100"
        }`}>
          {activities} activit{activities > 1 ? "ies" : "y"}
        </span>
      )}
    </div>
  );
}

// Calendar Grid
function CalendarGrid({ days, today, onSelect, selectedDate }) {
  return (
    <div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-500 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="font-medium py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-sm">
        {days.map((day, idx) => (
          <CalendarDay
            key={idx}
            day={day}
            activities={day.activities}
            isCurrentMonth={day.isCurrentMonth}
            isToday={isSameDay(today, day.date)}
            isSelected={selectedDate && isSameDay(selectedDate, day.date)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ activity }) {
  
  return (
    <li className="border p-3 rounded-md shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">
          {activity.start_time} – {activity.end_time}
        </span>
        <span
          className={getCategoryBadgeClasses(activity.categories?.color)}
        >
          {activity.categories?.category_name}
        </span>
      </div>
      <p className="font-medium text-gray-900">{activity.title}</p>
      <p className="text-xs text-gray-500 mt-1">Solution Architect: {activity.solarch}</p>
    </li>
  );
}

// Right Panel
function RightPanel({ activities, selectedDate, loading, error, onRetry }) {
  if (error) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6 text-gray-700">
      {!selectedDate ? (
        <div className="flex flex-col items-center text-center justify-center text-gray-500">
          <svg className="w-10 h-10 m-2" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4.5 1a.5.5 0 0 1 .5.5V2h5v-.5a.5.5 0 0 1 1 0V2h1.5A1.5 1.5 0 0 1 14 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 1 12.5v-9A1.5 1.5 0 0 1 2.5 2H4v-.5a.5.5 0 0 1 .5-.5M10 3v.5a.5.5 0 0 0 1 0V3h1.5a.5.5 0 0 1 .5.5V5H2V3.5a.5.5 0 0 1 .5-.5H4v.5a.5.5 0 0 0 1 0V3zM2 6v6.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V6zm5 1.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M9.5 7a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m1.5.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m.5 1.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M9 9.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M7.5 9a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M5 9.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0M3.5 9a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M3 11.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m2.5-.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m1.5.5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m2.5-.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1" fill="currentColor"/></svg>
          <h2 className="text-lg font-semibold text-black">Select a date</h2>
          <p>Click on a date to view activities</p>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Activities on {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h2>
          
          {loading ? (
            <div className="py-8">
              <LoadingSpinner size="md" />
              <p className="text-center text-gray-500 mt-2">Loading activities...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8">
              <svg className="h-12 w-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500">No activities scheduled</p>
              <a href="log-activity" className="inline-flex items-center border rounded-lg p-2 bg-slate-700 font-medium text-neutral-100 hover:bg-slate-800 hover:text-neutral-200">Log Activity</a>
            </div>
          ) : (
            <ul className="space-y-3">
              {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// Main Page
export default function ActivityCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activities, setActivities] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [month, setMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [dayLoading, setDayLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dayError, setDayError] = useState(null);

  // Load activities for the month with caching
  const fetchMonthData = useCallback(async (targetMonth) => {
    setLoading(true);
    setError(null);
    
    try {
      const startOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
      const endOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from("activities")
        .select("id, title, solarch, date, start_time, end_time, categories ( category_name, color )")
        .gte("date", formatDate(startOfMonth))
        .lte("date", formatDate(endOfMonth));

      if (error) throw error;

      setAllActivities(data || []);
      setCalendarData(generateCalendarGrid(targetMonth, data || []));
    } catch (err) {
      console.error("Error fetching month data:", err);
      setError(err.message || "Failed to load calendar data");
      setCalendarData(generateCalendarGrid(targetMonth, []));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonthData(month);
  }, [month, fetchMonthData]);

  // Load activities for a selected day
  const fetchDayActivities = async (date) => {
    setSelectedDate(date);
    setDayLoading(true);
    setDayError(null);

    try {
      const dateKey = formatDate(date);
      
      // First try to get from cached data
      const cachedActivities = allActivities.filter(activity => 
        formatDate(new Date(activity.date)) === dateKey
      );
      
      if (cachedActivities.length > 0 || allActivities.length > 0) {
        setActivities(cachedActivities.sort((a, b) => a.start_time.localeCompare(b.start_time)));
      } else {
        // Fallback to direct query if no cached data
        const { data, error } = await supabase
          .from("activities")
          .select("id, title, solarch, date, start_time, end_time, categories ( category_name, color )")
          .gte("date", dateKey)
          .lte("date", dateKey)
          .order("start_time");

        if (error) throw error;
        setActivities(data || []);
      }
    } catch (err) {
      console.error("Error fetching day activities:", err);
      setDayError(err.message || "Failed to load activities");
      setActivities([]);
    } finally {
      setDayLoading(false);
    }
  };

  const handleRetryMonth = () => {
    fetchMonthData(month);
  };

  const handleRetryDay = () => {
    if (selectedDate) {
      fetchDayActivities(selectedDate);
    }
  };

  const navigateMonth = (direction) => {
    if (loading) return;
    
    const newMonth = new Date(month);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else if (direction === 'next') {
      newMonth.setMonth(newMonth.getMonth() + 1);
    } else if (direction === 'today') {
      newMonth.setFullYear(new Date().getFullYear(), new Date().getMonth(), 1);
    }
    setMonth(newMonth);
    setSelectedDate(null); // Clear selection when changing months
  };

  if (error) {
    return (
      <main className="p-6">
        <ErrorMessage message={error} onRetry={handleRetryMonth} />
      </main>
    );
  }

  return (
    <main className="p-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 min-h-screen">
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <CalendarNav
          currentMonth={month.toLocaleString("default", { month: "long", year: "numeric" })}
          onPrev={() => navigateMonth('prev')}
          onToday={() => navigateMonth('today')}
          onNext={() => navigateMonth('next')}
          loading={loading}
        />
        <CalendarGrid 
          days={calendarData} 
          today={new Date()} 
          onSelect={fetchDayActivities}
          selectedDate={selectedDate}
        />
      </div>

      <RightPanel 
        activities={activities} 
        selectedDate={selectedDate}
        loading={dayLoading}
        error={dayError}
        onRetry={handleRetryDay}
      />
    </main>
  );
}