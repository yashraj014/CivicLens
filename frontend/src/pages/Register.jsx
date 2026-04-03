import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [fullname,setFullName]=useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault(); 
    setError('');

    try {
  
      const response = await api.post('/users/register', {
        email: email,
        password: password,
        full_name:fullname
      });

     const loginResponse = await api.post('/users/login', {
        email: email,
        password: password
      });
      const token = loginResponse.data.access_token;

      
      localStorage.setItem('token', token); 
      
      const userResponse = await api.get('/users/me');
      
     
      login(token, userResponse.data.user);

    } catch (err) {
      console.error(err);
      // If FastAPI sends a 400 "Email Already Registered", display it to the user!
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to register. Please check your details and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">CivicLens</h2>
        
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              required 
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              required 
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              required 
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
         
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-semibold"
          >
            Sign Up
          </button>
        </form>
         <p className="mt-4 text-center text-sm text-gray-600">
  Already have an account? <a href="/login" className="text-blue-600 hover:underline">Sign in here</a>
</p>
      </div>
     
    </div>
  );
};

export default Register;