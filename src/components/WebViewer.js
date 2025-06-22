import React, { useState, useEffect, useRef, memo } from 'react';

const WebViewer = memo(({ url }) => {
  const webviewRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    // Reset error state when url changes
    setHasError(false);

    const handleLoadFinish = () => {
      setHasError(false);
    };

    const handleLoadFail = (event) => {
      if (event.errorCode === -3 || event.isMainFrame === false) return;
      setHasError(true);
    };

    webview.addEventListener('did-finish-load', handleLoadFinish);
    webview.addEventListener('did-fail-load', handleLoadFail);

    return () => {
      webview.removeEventListener('did-finish-load', handleLoadFinish);
      webview.removeEventListener('did-fail-load', handleLoadFail);
    };
  }, [url]);

  return (
    <div className="relative w-full h-full bg-white">
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100">
          <div className="text-center text-red-600">
            <div className="text-2xl mb-2">⚠️</div>
            <div className="text-sm font-semibold">Failed to load content</div>
          </div>
        </div>
      )}
      
      <webview
        ref={webviewRef}
        src={url}
        className="w-full h-full border-0"
        style={{ visibility: hasError ? 'hidden' : 'visible' }}
        allowpopups="true"
      />
    </div>
  );
});

WebViewer.displayName = 'WebViewer';

export default WebViewer; 