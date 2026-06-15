import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import MapWidget from '../components/MapWidget';
import api from '../services/api';
import ReportModal from '../components/ReportModal';

// ==========================================
// 1. CITIZEN VIEW (3-Column Social Feed Layout)
// ==========================================
const CitizenView = ({ issues, analytics, selectedPosition, setSelectedPosition, handleUpvote, setIsModalOpen }) => {
  const pending = (analytics?.by_status?.['Reported'] || 0) + (analytics?.by_status?.['In Progress'] || 0);
  const resolved = analytics?.by_status?.['Resolved'] || 0;

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] custom-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Actions & Stats */}
        <div className="lg:col-span-3 space-y-6">
          <div className="sticky top-8 space-y-6">
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Report New Issue
            </button>
            
            {analytics && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Neighborhood Stats</h3>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-sm font-semibold text-slate-600">Total Reports</span>
                  <span className="text-lg font-black text-slate-800">{analytics.total}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <span className="text-sm font-semibold text-yellow-700">Action Required</span>
                  <span className="text-lg font-black text-yellow-600">{pending}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                  <span className="text-sm font-semibold text-green-700">Resolved</span>
                  <span className="text-lg font-black text-green-600">{resolved}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER COLUMN: The Feed */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b-2 border-slate-100">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Community Feed</h2>
            <span className="bg-white text-slate-500 text-xs font-bold px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              {issues.length} Updates
            </span>
          </div>

          <div className="space-y-5 pb-10">
            {issues.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
                <span className="text-4xl block mb-3">🌿</span>
                <p className="text-slate-500 font-bold">All clear!</p>
                <p className="text-slate-400 text-sm mt-1">No issues reported in your area.</p>
              </div>
            ) : (
              issues.map((issue) => (
                <div 
                  key={issue.id} 
                  onClick={() => setSelectedPosition([issue.latitude, issue.longitude])}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider">
                      {issue.category}
                    </span>
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded ${
                      issue.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                      issue.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                    {issue.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {issue.description}
                  </p>
                  
                  {issue.image_url && (
                    <div className="mt-4 rounded-xl overflow-hidden h-48 w-full bg-slate-100 border border-slate-200">
                      <img src={issue.image_url} alt="Evidence" className="object-cover h-full w-full hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  
                  <div className="mt-5 flex justify-between items-center pt-4 border-t border-slate-100">
                    <p className="text-xs font-medium text-slate-400 flex items-center group-hover:text-blue-500 transition-colors">
                      <span className="mr-1.5">📍</span> View location
                    </p>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleUpvote(issue.id); }}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                      {issue.upvote_count}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Map Widget */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 h-[500px] flex flex-col">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Location Radar</h3>
            <div className="flex-1 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
              <MapWidget issues={issues} selectedPosition={selectedPosition} />
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-3 font-medium">Click any feed item to zoom to its location.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// 2. AUTHORITY VIEW (Dashboard Layout)
// ==========================================
const AuthorityView = ({ issues, analytics, handleStatusChange, selectedPosition, setSelectedPosition }) => (
  <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4 lg:p-8">
    <div className="max-w-[1600px] mx-auto space-y-8">
      
      {/* Top Section: Dashboard Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-2">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Authority Workspace</h2>
          <p className="text-slate-500 font-medium mt-1">Manage and resolve civic reports.</p>
        </div>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Reports</p>
              <p className="text-4xl font-black text-slate-800 mt-2">{analytics.total}</p>
            </div>
            <div className="h-14 w-14 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-2xl">📊</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-yellow-500 uppercase tracking-widest">Requires Action</p>
              <p className="text-4xl font-black text-slate-800 mt-2">
                {(analytics.by_status?.['Reported'] || 0) + (analytics.by_status?.['In Progress'] || 0)}
              </p>
            </div>
            <div className="h-14 w-14 bg-yellow-50 rounded-xl border border-yellow-100 flex items-center justify-center text-2xl">⚠️</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-green-500 uppercase tracking-widest">Resolved</p>
              <p className="text-4xl font-black text-slate-800 mt-2">{analytics.by_status?.['Resolved'] || 0}</p>
            </div>
            <div className="h-14 w-14 bg-green-50 rounded-xl border border-green-100 flex items-center justify-center text-2xl">✅</div>
          </div>
        </div>
      )}

      {/* Main Grid: Map & Table Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Compact Map */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 h-[600px] flex flex-col sticky top-8">
            <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">Live Locator</h3>
            <div className="flex-1 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <MapWidget issues={issues} selectedPosition={selectedPosition} />
            </div>
          </div>
        </div>

        {/* Right Column: Triage Table */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
            <div className="p-5 border-b border-slate-200 bg-white/80 backdrop-blur-sm z-10">
              <h3 className="text-lg font-bold text-slate-800">Triage Queue</h3>
            </div>
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-left border-collapse table-fixed">
                <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm border-b border-slate-200">
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="p-4 w-1/3">Issue Details</th>
                    <th className="p-4 text-center w-20">Evidence</th>
                    <th className="p-4 w-24">Category</th>
                    <th className="p-4 w-28">Status</th>
                    <th className="p-4 text-right w-48">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {issues.length === 0 ? (
                    <tr><td colSpan="5" className="p-12 text-center text-slate-500 font-medium">Queue is empty.</td></tr>
                  ) : (
                    issues.map(issue => (
                      <tr 
                        key={issue.id} 
                        onClick={() => setSelectedPosition([issue.latitude, issue.longitude])}
                        className="hover:bg-slate-50 cursor-pointer transition-colors group"
                      >
                        <td className="p-4">
                          <p className="font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{issue.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1">{issue.description}</p>
                        </td>
                        
                        <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                          {issue.image_url ? (
                            <a href={issue.image_url} target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-80 transition-opacity">
                              <img src={issue.image_url} alt="Evidence" className="h-10 w-10 object-cover rounded-lg border border-slate-200 shadow-sm mx-auto" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic">None</span>
                          )}
                        </td>

                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold block truncate">{issue.category}</span>
                        </td>
                        
                        <td className="p-4">
                          <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded inline-block ${
                            issue.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                            issue.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {issue.status}
                          </span>
                        </td>
                        
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-2">
                            {issue.status === 'Reported' && (
                              <button onClick={() => handleStatusChange(issue.id, 'In Progress')} className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:shadow-sm whitespace-nowrap">
                                Start Work
                              </button>
                            )}
                            {issue.status !== 'Resolved' && (
                              <button onClick={() => handleStatusChange(issue.id, 'Resolved')} className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:shadow-sm whitespace-nowrap">
                                Resolve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
);

// ==========================================
// 3. MAIN DASHBOARD CONTAINER
// ==========================================
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  
  const [issues, setIssues] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

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

  const refreshDashboard = () => {
    fetchIssues();
    fetchAnalytics();
  };

  const handleUpvote = async (issueId) => {
    try {
      const response = await api.post(`/issues/${issueId}/upvote`);
      const updatedIssue = response.data;
      setIssues((prev) => prev.map((issue) => issue.id === issueId ? updatedIssue : issue));
    } catch (error) {
      console.error("Failed to upvote:", error);
    }
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      const response = await api.patch(`/issues/${issueId}/status`, { status: newStatus });
      const updatedIssue = response.data;
      setIssues((prev) => prev.map((issue) => issue.id === issueId ? updatedIssue : issue));
      fetchAnalytics();
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to update status.");
    }
  };

  useEffect(() => {
    fetchIssues();
    fetchAnalytics();
  }, [fetchIssues, fetchAnalytics]); 

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F8FAFC] overflow-hidden font-sans">
      
      {/* Universal Header */}
      <header className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center z-20 shadow-md">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black tracking-tight text-white">CivicLens</h1>
          {user?.is_authority && (
            <span className="bg-blue-600 text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-md tracking-widest whitespace-nowrap">Authority</span>
          )}
        </div>
        
        <div className="flex items-center gap-5">
          <Link 
            to="/analytics" 
            className="flex items-center gap-2 text-slate-300 hover:text-white text-sm font-bold transition-colors whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Data Portal
          </Link>

          <div className="h-5 w-px bg-slate-700 hidden sm:block"></div>

          <span className="font-bold hidden sm:block text-slate-300 text-sm whitespace-nowrap">
            {user?.full_name}
          </span>
          <button onClick={logout} className="bg-slate-800 hover:bg-red-500 text-slate-200 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Router */}
      {user?.is_authority ? (
        <AuthorityView 
          issues={issues} 
          analytics={analytics} 
          handleStatusChange={handleStatusChange} 
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
        />
      ) : (
        <CitizenView 
          issues={issues}
          analytics={analytics}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
          handleUpvote={handleUpvote}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      {/* Global Modals */}
      <ReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onIssueReported={refreshDashboard} 
      />
    </div>
  );
};

export default Dashboard;