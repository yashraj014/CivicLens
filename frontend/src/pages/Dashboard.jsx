import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MapWidget from '../components/MapWidget';
import api from '../services/api';
import ReportModal from '../components/ReportModal';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  
  // 1. State variables
  const [issues, setIssues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  // 2. Fetch Functions (Wrapped in useCallback to stabilize dependencies)
  const fetchIssues = useCallback(async () => {
    try {
      const response = await api.get('/issues/fetch'); 
      setIssues(response.data);
    } catch (error) {
      console.error("Failed to fetch issues:", error);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await api.get('/analytics/summary'); 
      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  }, []);

  // Helper function to update everything at once after a new report
  const refreshDashboard = () => {
    fetchIssues();
    fetchAnalytics();
  };

  // 3. Upvote Logic (Local State Update)
  const handleUpvote = async (issueId) => {
    try {
      const response = await api.post(`/issues/${issueId}/upvote`);
      const updatedIssue = response.data;
      
      setIssues((prevIssues) => 
        prevIssues.map((issue) => 
          issue.id === issueId ? updatedIssue : issue
        )
      );
    } catch (error) {
      console.error("Failed to upvote:", error);
      alert(error.response?.data?.detail || "Failed to upvote issue.");
    }
  };

  // 4. NEW: Authority Status Update Logic
  const handleStatusChange = async (issueId, newStatus) => {
    try {
      // Send the PATCH request to your backend route
      const response = await api.patch(`/issues/${issueId}/status`, {
        status: newStatus 
      });
      
      // Grab the updated issue from the response
      const updatedIssue = response.data;
      
      // Instantly update the card in React's memory
      setIssues((prevIssues) => 
        prevIssues.map((issue) => 
          issue.id === issueId ? updatedIssue : issue
        )
      );

      // Refresh the Analytics cards so the Pending/Resolved numbers update!
      fetchAnalytics();

    } catch (error) {
      console.error(`Failed to mark as ${newStatus}:`, error);
      alert(error.response?.data?.detail || "Failed to update status.");
    }
  };

  // 5. Initial Load
  useEffect(() => {
    fetchIssues();
    fetchAnalytics();
  }, [fetchIssues, fetchAnalytics]); 

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      
      {/* Header */}
      <header className="bg-blue-800 text-white p-4 shadow-md flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold tracking-wide">CivicLens</h1>
        
        <div className="flex items-center gap-4">
          {/* NEW: Prominent Analytics Button */}
          <Link 
            to="/analytics" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-bold shadow border border-blue-500 transition duration-150 ease-in-out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </Link>

          {/* Separator Line */}
          <div className="h-6 w-px bg-blue-600 mx-1 hidden sm:block"></div>

          <span className="font-medium hidden sm:block">Welcome, {user?.full_name}</span>
          
          <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-bold shadow-sm transition duration-150 ease-in-out">
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Side: The Map */}
        <div className="w-2/3 lg:w-3/5 h-full relative border-r border-gray-300 shadow-inner">
          {/* Pass the selectedPosition down! */}
          <MapWidget issues={issues} selectedPosition={selectedPosition} /> 
        </div>

        {/* Right Side: The Sidebar */}
        <div className="w-1/3 lg:w-2/5 h-full bg-white flex flex-col overflow-y-auto relative">
          
          {/* Header & Analytics Section */}
          <div className="p-5 border-b border-gray-200 bg-gray-50 sticky top-0 z-10 shadow-sm">
            
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Live Reports</h2>
                <p className="text-sm text-gray-500 mt-1">Monitoring infrastructure</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm font-semibold text-sm"
              >
                + Report Issue
              </button>
            </div>
          </div>
          
          {/* Issues Feed */}
          <div className="p-5 flex flex-col gap-4">
            {issues.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No issues reported yet.</p>
            ) : (
              issues.map((issue) => (
                <div 
                  key={issue.id} 
                  // 1. Make the card clickable and change the cursor so the user knows
                  onClick={() => setSelectedPosition([issue.latitude, issue.longitude])}
                  className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
                >
                  <h3 className="font-semibold text-gray-800">{issue.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 truncate">{issue.description}</p>
                  <p className="text-xs font-medium text-blue-600 mt-2">Category: {issue.category}</p>
                  
                  {issue.image_url && (
                    <div className="mt-3 rounded-md overflow-hidden h-32 w-full bg-gray-100 border border-gray-200 shadow-inner">
                      <img 
                        src={issue.image_url} 
                        alt="Issue evidence" 
                        className="object-cover h-full w-full"
                      />
                    </div>
                  )}
                  
                  <div className="mt-3 flex justify-between items-center">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded">
                      {issue.status}
                    </span>
                    
                    <button 
                      // 2. Stop the card click from happening when we click Upvote!
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleUpvote(issue.id);
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors bg-gray-100 hover:bg-blue-50 px-2 py-1 rounded"
                    >
                      <span>▲</span> 
                      {issue.upvote_count} {issue.upvote_count === 1 ? 'Upvote' : 'Upvotes'}
                    </button>
                  </div>

                  {/* Authority-Only Control Panel */}
                  {user?.is_authority && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2 items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">
                        Authority Actions:
                      </span>
                      
                      {/* Only show "In Progress" if it's currently "Reported" */}
                      {issue.status === 'Reported' && (
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleStatusChange(issue.id, 'In Progress');
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-bold py-1 px-3 rounded transition-colors shadow-sm"
                        >
                          Mark In Progress
                        </button>
                      )}

                      {/* Only show "Resolve" if it's not already resolved */}
                      {issue.status !== 'Resolved' && (
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleStatusChange(issue.id, 'Resolved');
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1 px-3 rounded transition-colors shadow-sm"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
          
        </div>
      </main>

      {/* Notice onIssueReported now triggers the combined refreshDashboard function */}
      <ReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onIssueReported={refreshDashboard} 
      />
    </div>
  );
};

export default Dashboard;