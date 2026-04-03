import React, { useState } from 'react';
import api from '../services/api';

const ReportModal = ({ isOpen, onClose, onIssueReported }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Road'); // Default to Road
  const [landmark, setLandmark] = useState('');
  
  // States for location and loading
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null; // Don't render anything if the modal is closed

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLocating(true);

    // 1. Ask the browser for the user's exact GPS coordinates
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // 2. We got the coordinates! 
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          setIsSubmitting(true);
          
          // 3. Send the form data AND the hidden GPS data to FastAPI
          // Make sure this matches your exact backend POST route (e.g., '/issues' or '/issues/create')
          await api.post('/issues/create', {
            title: title,
            description: description,
            category: category,
            landmark: landmark,
            latitude: lat,
            longitude: lng
          });

          // 4. Success! Clean up the form, close the modal, and refresh the dashboard
          setTitle('');
          setDescription('');
          setLandmark('');
          setIsSubmitting(false);
          setIsLocating(false);
          onClose(); // Close modal
          onIssueReported(); // Tell Dashboard to fetch the fresh data
          
        } catch (err) {
          console.error(err);
          setError('Failed to submit issue. Please try again.');
          setIsSubmitting(false);
          setIsLocating(false);
        }
      },
      (geoError) => {
        setError('Please allow location access to report an issue.');
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Report an Issue</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl font-bold">&times;</button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Road">Road</option>
              <option value="Water">Water</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input 
              type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Massive Pothole"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              required value={description} onChange={(e) => setDescription(e.target.value)} rows="3"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nearest Landmark (Optional)</label>
            <input 
              type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g., Opposite SBI Bank"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLocating || isSubmitting}
            className={`w-full text-white py-2 px-4 rounded-md font-semibold transition ${
              (isLocating || isSubmitting) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLocating ? 'Acquiring GPS...' : isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;