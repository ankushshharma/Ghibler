import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PICOGEN_API_TOKEN } from './config';

const CheckResults = ({ jobId }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [jobStatus, setJobStatus] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!jobId) return;
      
      console.log('Fetching image for job ID:', jobId);
      
      setLoading(true);
      setError(null);
      setLoadingProgress(0);

      // Simulate progressive loading
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 800);

      // Use test job ID for development if no job ID is provided
      const testMode = true; // Set to true during development
      const testJobId = "W6xW2pLFnvh";
      const apiUrl = `https://api.picogen.io/v1/job/get/${jobId}`;
      const apiToken = PICOGEN_API_TOKEN;

      try {
        //console.log('Making API request to:', apiUrl);
        const response = await axios.get(apiUrl, {
          headers: {
            'API-Token': apiToken
          }
        });

        // Log the full response for debugging
        //console.log('Full API Response:', response.data);
        
        // Simplified response handling based on the actual API response structure
        if (response.data && Array.isArray(response.data) && response.data.length >= 2) {
          const dataObj = response.data[1]; // The second element contains the job data
          
          if (dataObj && dataObj.status === "completed" && dataObj.result) {
            console.log('Image URL found:', dataObj.result);
            setImageUrl(dataObj.result);
            setLoadingProgress(100);
            setJobStatus('completed');
          } 
          else if (dataObj && dataObj.status === "processing") {
            console.log('Image is still processing, will retry in 5 seconds');
            setJobStatus('processing');
            
            if (retryCount < 10) {
              setTimeout(() => {
                setRetryCount(prev => prev + 1);
              }, 5000);
            } else {
              setError('Image generation is taking longer than expected. Please check back later.');
            }
          }
          else {
            setError('Failed to get image URL from the API response.');
            console.error('Unexpected API response structure:', response.data);
          }
        } 
        else if (response.data && response.data.result) {
          // Direct object with result
          console.log('Image URL found in direct object');
          setImageUrl(response.data.result);
          setLoadingProgress(100);
        } else {
          setError('Failed to get image URL from the API response.');
          console.error('Unexpected API response structure:', response.data);
        }
      } catch (err) {
        setError(`Error fetching image: ${err.message}`);
        console.error('Error:', err);
      } finally {
        clearInterval(progressInterval);
        setLoading(false);
      }
    };

    fetchImage();
  }, [jobId, retryCount]);

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'ghibler_magical_scene.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="relative">
      <h2 className="text-2xl font-display font-bold mb-6 text-ghibliDeep">Your Magical Creation</h2>

      {!jobId ? (
        <div className="bg-ghibliBeige/50 rounded-xl p-8 text-center animate-fade-in">
          <div className="totoro-placeholder mb-4"></div>
          <p className="text-ghibliDark">Please enter a prompt and generate an image first.</p>
          <p className="mt-2 text-sm text-ghibliDark/70">Your magical creations will appear here!</p>
        </div>
      ) : (
        <>
          {loading && (
            <div className="text-center p-8 animate-fade-in">
              <div className="mb-4 relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-ghibliBeige">
                  <div style={{ width: `${loadingProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-ghibliGreen transition-all duration-500 ease-out"></div>
                </div>
                <p className="text-ghibliDark animate-pulse">Summoning your magical scene... {Math.round(loadingProgress)}%</p>
              </div>
              <div className="dust-sprite animate-bounce-slow"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded animate-fade-in">
              <p className="font-medium">{error}</p>
              <p className="mt-2">Please try again or check your connection.</p>
            </div>
          )}

          {/* Add this new processing loader */}
          {jobStatus === 'processing' && (
            <div className="text-center p-8 animate-fade-in">
              <div className="mb-4 relative pt-1">
                <div className="flex justify-center">
                  <svg className="animate-spin h-12 w-12 text-ghibliGreen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-ghibliDark mt-4 animate-pulse">
                  Still crafting your magic...<br/>
                  <span className="text-sm">Auto-checking again in 5 seconds</span>
                </p>
              </div>
              <div className="dust-sprite animate-bounce-slow"></div>
            </div>
          )}

          {imageUrl && (
            <div className="animate-fade-in">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-ghibliGreen to-ghibliBlue rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative bg-white rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={imageUrl}
                    alt="Generated Ghibli-inspired Scene"
                    className="w-full h-auto rounded-lg transform transition duration-500 group-hover:scale-[1.01]"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <button
                  className="bg-ghibliGreen text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ghibliGreen transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex items-center"
                  onClick={handleDownload}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Save Your Magic
                </button>
                
                <button
                  className="bg-white text-ghibliDark border-2 border-ghibliDark font-bold py-3 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ghibliDark transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex items-center"
                  onClick={() => window.open(imageUrl, '_blank')}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  Open Full Size
                </button>
              </div>
              
              <div className="mt-6 p-4 bg-ghibliBeige/30 rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-ghibliDeep">Share Your Creation</h3>
                <div className="flex justify-center space-x-4">
                  <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                    </svg>
                  </button>
                  <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                    </svg>
                  </button>
                  <button className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.919-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {!imageUrl && !loading && jobId && (
            <div className="text-center p-8 animate-fade-in">
              <div className="kodama-waiting mb-4"></div>
              <p className="text-ghibliDark">Your image is still being created. Please wait a moment...</p>
              <p className="mt-2 text-sm text-ghibliDark/70">Magic takes time to perfect!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CheckResults;