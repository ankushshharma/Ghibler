import { useState } from 'react';
import axios from 'axios';
import { Loader2, Plus, AlertTriangle } from 'lucide-react';

const ImageBlender = () => {
  const [prompt, setPrompt] = useState('Blend these images into a ghibli style image');
  const [urls, setUrls] = useState(['', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [apiError, setApiError] = useState(null); // New state for API errors


  const updateUrl = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneratedImage('');
    setApiError(null); // Clear any previous errors

    // Input validation
    if (!import.meta.env.VITE_API_TOKEN) {
      setApiError("API Token is missing. Please set the VITE_API_TOKEN environment variable.");
      return;
    }

    const filteredUrls = urls.filter(url => url.trim() !== ''); // Filter out empty URLs


    try {
      setIsLoading(true);
      console.log('Making API call with:', {
        prompt,
        urls: filteredUrls,
        token: import.meta.env.VITE_API_TOKEN ? 'Token exists' : 'Token missing'
      });

      const response = await axios.post('https://api.picogen.io/v1/job/blend', {
        prompt,
        urls: filteredUrls
      }, {
        headers: {
          'Content-Type': 'application/json',
          'API-Token': import.meta.env.VITE_API_TOKEN
        }
      });

      console.log('API response:', response);
      setGeneratedImage(response.data.result?.url || '');
    } catch (err) {
      console.error('Error generating image:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);

        // Specific error handling for insufficient balance
        if (err.response.data && Array.isArray(err.response.data) && err.response.data[0] === 'e_account_balance_insufficient') {
          setApiError("Insufficient account balance. Please add credits to your Picogen account.");
        } else {
          setApiError(`API Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`); // Generic API error
        }
      } else {
        setApiError(`Network Error: ${err.message}`); // Handle network errors
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Image Blender</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URLs</label>
          <div className="space-y-2">
            {urls.map((url, index) => (
              <input
                key={index}
                type="url"
                value={url}
                onChange={(e) => updateUrl(index, e.target.value)}
                placeholder={`Image ${index + 1} URL`}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || apiError} // Disable button if loading or an error exists
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-2 ${isLoading || apiError ? 'cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              Sending...
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Send images
            </>
          )}
        </button>
      </form>

      {apiError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded-md flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <p>{apiError}</p>
        </div>
      )}


      {generatedImage && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Generated Image</h2>
          <img
            src={generatedImage}
            alt="Blended result"
            className="w-full rounded-lg border"
          />
        </div>
      )}
    </div>
  );
};

export default ImageBlender;