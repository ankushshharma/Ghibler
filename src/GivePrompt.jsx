import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PICOGEN_API_TOKEN } from './config';

const GivePrompt = ({ onJobIdReceived, setActiveTab }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobIdLocal, setJobIdLocal] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    console.log('API KEY on load:', PICOGEN_API_TOKEN ? '*** (token exists)' : 'MISSING API TOKEN');
  }, []);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt first');
      return;
    }
    
    setLoading(true);
    setError(null);
    setJobIdLocal(null);
    
    const apiUrl = 'https://api.picogen.io/v1/job/generate';
    const apiToken = PICOGEN_API_TOKEN;
    
    // Removed test mode block completely
    
    const data = {
      prompt: prompt,
      ratio: "16:9"
    };

    try {
      const response = await axios.post(apiUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          'API-Token': apiToken
        }
      });

      if (response.data && response.data[1] && response.data[1].id) {
        console.log('Job ID:', response.data[1].id);
        setJobIdLocal(response.data[1].id);
        onJobIdReceived(response.data[1].id);
        setIsExpanded(false);
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        setError('Failed to get job ID from the API response.');
        console.error('Unexpected API response:', response.data);
      }
    } catch (err) {
      setError(`Error generating image: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckResults = () => {
    setActiveTab('checkResults');
  };

  const handleExpandCollapse = () => {
    if (!loading) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="relative">
      <h2 
        className="text-2xl font-display font-bold mb-6 text-ghibliDeep transition-all duration-500 flex items-center"
        onClick={handleExpandCollapse}
      >
        {isExpanded ? 'Describe Your Magical Scene' : 'Your Magic is Being Created!'}
        <span className={`ml-2 text-ghibliGreen transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          {jobIdLocal ? '↑' : ''}
        </span>
      </h2>
      
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="relative mb-6 group">
          <label htmlFor="prompt" className="block text-ghibliDark font-medium mb-2 group-focus-within:text-ghibliGreen transition-colors duration-300">
            Your Imagination:
          </label>
          <div className="relative">
            <textarea
              id="prompt"
              className="shadow appearance-none border-2 border-ghibliBeige rounded-xl w-full py-3 px-4 text-ghibliDark leading-tight focus:outline-none focus:ring-2 focus:ring-ghibliGreen focus:border-transparent transition-all duration-300 hover:shadow-lg resize-none h-32"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe a Ghibli-inspired scene with magical creatures, lush landscapes, or whimsical characters..."
            />
            <div className="absolute bottom-3 right-3 text-sm text-ghibliDark/50">
              {prompt.length} / 500
            </div>
          </div>
          <p className="mt-2 text-sm text-ghibliDark/70 italic">
            Try to be descriptive and include details about the setting, characters, and mood.
          </p>
        </div>
      </div>
      
      {showSuccessMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded animate-fade-in">
          <p className="font-medium">Success! Your image is being generated.</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded animate-fade-in">
          <p className="font-medium">{error}</p>
        </div>
      )}
      
      <div className="flex flex-wrap items-center gap-4 mt-6">
        <button
          className={`relative overflow-hidden bg-ghibliBlue text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ghibliBlue transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          onClick={handleGenerateImage}
          disabled={loading}
        >
          <span className="relative z-10 flex items-center justify-center">
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Magic...
              </>
            ) : (
              'Generate Magical Scene'
            )}
          </span>
          <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -translate-x-full hover:translate-x-0 transition-transform duration-300"></span>
        </button>

        {jobIdLocal && (
          <button
            className="bg-ghibliGreen text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ghibliGreen transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            onClick={handleCheckResults}
          >
            See Your Magic
          </button>
        )}
      </div>
      
      <p className="mt-8 text-sm text-ghibliDark/60 italic">
        Images are generated using AI technology and inspired by the magical worlds of Studio Ghibli.
      </p>
    </div>
  );
};

export default GivePrompt;