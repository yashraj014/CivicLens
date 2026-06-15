import React, { useState } from 'react';
import api from '../services/api';

const ReportModal = ({ isOpen, onClose, onIssueReported }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Road');
  const [landmark, setLandmark] = useState('');
  
  // NEW: States for the image file and its visual preview
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // NEW: Handle when a user selects a photo
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Creates a temporary local URL to show a preview!
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLocating(true);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          setIsLocating(false);
          setIsSubmitting(true);
          
          let finalImageUrl = null;

          // STEP 1: If they attached a photo, upload it FIRST
          if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);

            const uploadRes = await api.post('/issues/upload-image', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            finalImageUrl = uploadRes.data.image_url; // Grab the URL FastAPI gave us
          }

          // STEP 2: Send the full report data, including the new image URL
          await api.post('/issues/create', { 
            title: title,
            description: description,
            category: category,
            landmark: landmark,
            latitude: lat,
            longitude: lng,
            image_url: finalImageUrl // This will be null if they didn't upload a photo, which is totally fine!
          });

          // Success! Clean everything up
          setTitle('');
          setDescription('');
          setLandmark('');
          setImageFile(null);
          setImagePreview(null);
          setIsSubmitting(false);
          
          onClose(); 
          onIssueReported(); 
          
        } catch (err) {
          console.error(err);
          setError('Failed to submit issue. Please try again.');
          setIsSubmitting(false);
        }
      },
      (geoError) => {
        setError('Please allow location access to report an issue.');
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Report an Issue</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl font-bold">&times;</button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* NEW: Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo Evidence (Optional)</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {/* Image Preview Window */}
            {imagePreview && (
              <div className="mt-3 rounded-md overflow-hidden border border-gray-200 h-32 w-full flex justify-center bg-gray-50">
                <img src={imagePreview} alt="Preview" className="object-cover h-full w-full" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value="Road">Road</option>
              <option value="Water">Water</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Massive Pothole" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Landmark</label>
            <input type='text' required value={landmark} onChange={(e) => setLandmark(e.target.value)} rows="3" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"></input>
          </div>

          <button 
            type="submit" 
            disabled={isLocating || isSubmitting}
            className={`w-full text-white py-2 px-4 rounded-md font-semibold transition ${
              (isLocating || isSubmitting) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLocating ? 'Acquiring GPS...' : isSubmitting ? 'Uploading & Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;