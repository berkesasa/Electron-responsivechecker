import React, { useState, useEffect } from 'react';

const URLInput = ({ url, onUrlChange, isLoading = false }) => {
  const [inputValue, setInputValue] = useState(url);

  // Update input when URL prop changes
  useEffect(() => {
    setInputValue(url);
  }, [url]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    let processedUrl = inputValue.trim();
    
    // Fix URL
    if (processedUrl && !processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }
    
    onUrlChange(processedUrl);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e);
    }
  };

  return (
    <div className="glass-panel p-6">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com"
          className={`glass-input flex-1 text-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          autoComplete="off"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`glass-button-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Loading...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>🚀</span>
              <span>Load</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default URLInput; 