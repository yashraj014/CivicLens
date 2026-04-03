import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // NEW: State for the secret code
  const [authoritySecret, setAuthoritySecret] = useState(''); 
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = {
        full_name: fullName,
        email: email,
        password: password,
        authority_secret: authoritySecret.trim() !== '' ? authoritySecret : null 
      };

      await api.post('/users/register', payload);

      await login(email, password); 
      
      navigate('/');
      
    } catch (err) {
      console.error("Full error:", err);
      
      let errorMessage = 'Registration failed. Please try again.';

      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;

        if (Array.isArray(detail)) {
          errorMessage = detail[0].msg; 
        } 

        else if (typeof detail === 'string') {
          errorMessage = detail;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-slate-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-blue-900 tracking-tight">CivicLens</h1>
          <p className="text-slate-500 mt-2">Join your community dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* NEW: Authority Secret Field (Visually separated so citizens ignore it) */}
          <div className="pt-4 mt-4 border-t border-slate-200">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              City Officials Only (Optional)
            </label>
            <input 
              type="password" value={authoritySecret} onChange={(e) => setAuthoritySecret(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none transition-all text-sm placeholder:text-slate-400"
              placeholder="Enter Authority Access Code"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Leave blank if you are registering as a regular citizen.
            </p>
          </div>

          <button 
            type="submit" disabled={isLoading}
            className={`w-full text-white py-2.5 rounded-lg font-bold transition-all shadow-md mt-4 ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;