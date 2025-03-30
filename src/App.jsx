import React, { useState, useEffect } from 'react';
import GivePrompt from './GivePrompt';
import CheckResults from './CheckResults';
import axios from 'axios';
import { PICOGEN_API_TOKEN } from './config';

const App = () => {
  const [activeTab, setActiveTab] = useState('givePrompt');
  const [jobId, setJobId] = useState(null); // Removed test ID
  const [generationsLeft, setGenerationsLeft] = useState(5); // Add balance state
  
  // Add useEffect to log job ID changes
  useEffect(() => {
    console.log('App component - Current job ID:', jobId);
  }, [jobId]);

  useEffect(() => {
    axios.get('https://api.picogen.io/v1/account/info', {
      headers: {
        'API-Token': PICOGEN_API_TOKEN // Use environment variable
      }
    })
    .then(response => {
      const balance = response.data[1]?.balance || 0;
      setGenerationsLeft(Math.floor(balance / 8));
    })
    .catch(error => {
      console.error('API Error:', error);
      setGenerationsLeft(0);
    });
  }, []);


  const handleJobIdReceived = (id) => {
    console.log('Job ID received in App component:', id);
    setJobId(id);
    // Automatically switch to results tab when job ID is received
    setActiveTab('checkResults');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ghibliSky to-ghibliBeige pb-16">
      {/* Header with Ghibli-inspired cloud decoration */}
      <div className="relative overflow-hidden">
        {/* Updated balance display */}
        <div className="absolute right-4 top-4 z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md animate-fade-in">
          <span className="font-semibold text-ghibliDeep">
            {generationsLeft !== null ? 
              `Image Generations left: ${generationsLeft}` :
              <div className="h-4 w-32 bg-gray-200 rounded-full animate-pulse"></div>
            }
          </span>
        </div>
        <div className="cloud-left absolute left-0 top-10 opacity-70"></div>
        <div className="cloud-right absolute right-0 top-16 opacity-70"></div>
        
        {/* Logo Section */}
        <div className="flex items-center justify-center pt-12 pb-8 animate-float">
          <div className="relative">
            <h1 className="text-5xl font-display font-bold text-ghibliDeep drop-shadow-lg">
              Ghibler
            </h1>
            <div className="absolute -bottom-3 left-0 w-full h-1 bg-ghibliGreen rounded-full"></div>
          </div>
        </div>
        <p className="text-center text-ghibliDark opacity-80 mb-10 font-body italic animate-fade-in">
          Create magical Ghibli-inspired images with the power of AI
        </p>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-full p-1 shadow-md">
            <button
              className={`py-2 px-8 font-semibold rounded-full transition-all duration-300 ${
                activeTab === 'givePrompt'
                  ? 'bg-ghibliGreen text-white shadow-inner'
                  : 'text-ghibliDark hover:bg-ghibliGreen/10'
              }`}
              onClick={() => setActiveTab('givePrompt')}
            >
              Create Magic
            </button>
            <button
              className={`py-2 px-8 font-semibold rounded-full transition-all duration-300 ${
                activeTab === 'checkResults'
                  ? 'bg-ghibliGreen text-white shadow-inner'
                  : 'text-ghibliDark hover:bg-ghibliGreen/10'
              }`}
              onClick={() => setActiveTab('checkResults')}
            >
              View Magic
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-ghibli animate-slide-up">
          {activeTab === 'givePrompt' && (
            <GivePrompt
              onJobIdReceived={handleJobIdReceived}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'checkResults' && <CheckResults jobId={jobId} />}
        </div>
        
        {/* Decorative Elements */}
        <div className="soot-sprite-1 animate-float-slow"></div>
        <div className="soot-sprite-2 animate-float-delay"></div>
      </div>
    </div>
  );
};

export default App;