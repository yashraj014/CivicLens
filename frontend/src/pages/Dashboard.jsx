import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import MapWidget from '../components/MapWidget';
import api from '../services/api';
import ReportModal from '../components/ReportModal';
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  
  // 1. Create a state variable to store the issues from the database
  const [issues, setIssues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. Fetch the issues as soon as the Dashboard loads
  const fetchIssues = async () => {
  try {
    const response = await api.get('/issues/fetch'); // Remember to use your exact endpoint!
    setIssues(response.data);
  } catch (error) {
    console.error("Failed to fetch issues:", error);
  }
};

useEffect(() => {
  fetchIssues();
}, []); // The empty array means this only runs once when the page loads

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      
      {/* Header (Keep exactly the same) */}
      <header className="bg-blue-800 text-white p-4 shadow-md flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold tracking-wide">CivicLens</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium">Welcome, {user?.full_name}</span>
          <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-bold shadow-sm transition duration-150 ease-in-out">
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Side: The Map */}
        <div className="w-2/3 lg:w-3/5 h-full relative border-r border-gray-300 shadow-inner">
          {/* 3. Pass the fetched issues down into the Map component */}
          <MapWidget issues={issues} /> 
        </div>

        {/* Right Side: The Sidebar */}
        <div className="w-1/3 lg:w-2/5 h-full bg-white flex flex-col overflow-y-auto relative">
  <div className="p-5 border-b border-gray-200 bg-gray-50 sticky top-0 z-10 shadow-sm flex justify-between items-center">
    <div>
      <h2 className="text-xl font-bold text-gray-800">Live Reports</h2>
      <p className="text-sm text-gray-500 mt-1">Monitoring {issues.length} infrastructure issues</p>
    </div>

    {/* NEW BUTTON! */}
    <button 
      onClick={() => setIsModalOpen(true)}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm font-semibold text-sm"
    >
      + Report Issue
    </button>
  </div>
          
          <div className="p-5 flex flex-col gap-4">
            {/* 4. Loop through the issues and generate a card for each one */}
            {issues.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No issues reported yet.</p>
            ) : (
              issues.map((issue) => (
                <div key={issue.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-800">{issue.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 truncate">{issue.description}</p>
                  <p className="text-xs font-medium text-blue-600 mt-2">Category: {issue.category}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">
                      {issue.status}
                    </span>
                    <span className="text-xs text-gray-500">{issue.upvote_count} Upvotes</span>
                  </div>
                </div>
              ))
            )}
          </div>
          
        </div>
      </main>
      <ReportModal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
  onIssueReported={fetchIssues} 
/>
    </div>
  );
};

export default Dashboard;