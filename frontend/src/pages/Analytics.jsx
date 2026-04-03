import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const Analytics = () => {
  const { user, logout } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics/summary');
        setAnalytics(response.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Colors for the Donut Chart
  const COLORS = ['#e11d48', '#fbbf24', '#10b981']; // Red (Reported), Yellow (In Progress), Green (Resolved)

  if (loading) return <div className="p-10 text-center">Loading City Intelligence...</div>;
  if (!analytics) return <div className="p-10 text-center text-red-500">Failed to load data.</div>;

  // Format data for Recharts
  // 1. Add a quick console log so we can see exactly what FastAPI sent
  console.log("Backend sent this:", analytics);

  // 2. Add the || {} fallback
  const categoryData = Object.entries(analytics?.by_category || {}).map(([name, value]) => ({ name, value }));
  const statusData = Object.entries(analytics?.by_status || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-black tracking-tight text-slate-900">CivicLens</h1>
          <nav className="hidden md:flex gap-4">
            <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Dashboard
            </Link>
            <Link to="/analytics" className="text-sm font-medium text-slate-900 bg-slate-100 px-3 py-1 rounded-md">
              Analytics
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-600">{user?.full_name}</span>
          <button onClick={logout} className="text-slate-500 hover:text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header Titles */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">City Intelligence</h2>
          <p className="text-slate-500 mt-2 text-lg">Real-time infrastructure analytics and resolution metrics.</p>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Total */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-l-blue-600 border-y border-r border-slate-200 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Reports</p>
              <p className="text-4xl font-black text-slate-900">{analytics.total}</p>
            </div>
          </div>

          {/* Card 2: Pending */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-l-yellow-500 border-y border-r border-slate-200 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Resolution</p>
              <p className="text-4xl font-black text-slate-900">
                {(analytics.by_status['Reported'] || 0) + (analytics.by_status['In Progress'] || 0)}
              </p>
            </div>
          </div>

          {/* Card 3: Resolved */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-l-green-500 border-y border-r border-slate-200 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Recently Solved</p>
              <p className="text-4xl font-black text-slate-900">{analytics.by_status['Resolved'] || 0}</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Bar Chart: Categories */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Reports by Category</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="value" fill="#334155" radius={[4, 4, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart: Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Issue Status Breakdown</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle" 
                    formatter={(value, entry) => (
                      <span className="text-slate-700 font-medium ml-1">
                        {value}: <span className="font-bold text-slate-900">{entry.payload.value}</span>
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Analytics;