import React, { useState, useMemo, useCallback } from 'react';
import URLInput from './components/URLInput';
import MediaPanel from './components/MediaPanel';
import ResponsiveViewer from './components/ResponsiveViewer';

function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeBreakpoints, setActiveBreakpoints] = useState({
    '480px': true,
    '735px': true,
    '1024px': true,
    '1440px': true
  });
  const [customBreakpoints, setCustomBreakpoints] = useState([]);

  const handleUrlChange = useCallback(async (newUrl) => {
    if (!newUrl.trim()) {
      setUrl('');
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if URL is valid
      const urlObj = new URL(newUrl);
      setUrl(newUrl);
    } catch (err) {
      setError('Invalid URL format. Please enter a valid URL.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleBreakpoint = useCallback((breakpoint) => {
    setActiveBreakpoints(prev => ({
      ...prev,
      [breakpoint]: !prev[breakpoint]
    }));
  }, []);

  const toggleAllBreakpoints = useCallback((active) => {
    const allBreakpoints = [
      '480px',
      '735px',
      '1024px',
      '1440px',
      ...customBreakpoints
    ];
    
    const newActiveBreakpoints = {};
    allBreakpoints.forEach(bp => {
      newActiveBreakpoints[bp] = active;
    });
    
    setActiveBreakpoints(newActiveBreakpoints);
  }, [customBreakpoints]);

  const addCustomBreakpoint = useCallback((breakpoint) => {
    if (breakpoint && !customBreakpoints.includes(breakpoint)) {
      setCustomBreakpoints(prev => [...prev, breakpoint]);
      setActiveBreakpoints(prev => ({
        ...prev,
        [breakpoint]: true
      }));
    }
  }, [customBreakpoints]);

  const removeCustomBreakpoint = useCallback((breakpoint) => {
    setCustomBreakpoints(prev => prev.filter(bp => bp !== breakpoint));
    setActiveBreakpoints(prev => {
      const newState = { ...prev };
      delete newState[breakpoint];
      return newState;
    });
  }, []);

  const allBreakpoints = useMemo(() => [
    '480px',
    '735px', 
    '1024px',
    '1440px',
    ...customBreakpoints
  ], [customBreakpoints]);

  const activeBreakpointsList = useMemo(() => 
    allBreakpoints.filter(bp => activeBreakpoints[bp]),
    [allBreakpoints, activeBreakpoints]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6 relative overflow-hidden app-container">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-300/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 mx-auto space-y-6 scrollable">
        {/* URL Input */}
        <URLInput 
          url={url} 
          onUrlChange={handleUrlChange}
          isLoading={isLoading}
        />

        {/* Error Message */}
        {error && (
          <div className="glass-panel p-4 bg-red-500/20 border-red-400/30 animate-glow">
            <div className="flex items-center gap-3 text-red-200">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Media Panel */}
        <MediaPanel
          activeBreakpoints={activeBreakpoints}
          customBreakpoints={customBreakpoints}
          onToggleBreakpoint={toggleBreakpoint}
          onToggleAll={toggleAllBreakpoints}
          onAddCustom={addCustomBreakpoint}
          onRemoveCustom={removeCustomBreakpoint}
        />

        {/* Responsive Viewer */}
        {url && !error && (
          <ResponsiveViewer
            url={url}
            breakpoints={activeBreakpointsList}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="glass-panel p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
            <div className="text-white/80 text-lg">Checking URL...</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 