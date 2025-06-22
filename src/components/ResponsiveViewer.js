import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import WebViewer from './WebViewer';

const ResponsiveViewer = ({ url, breakpoints }) => {
  const [selectedBreakpoint, setSelectedBreakpoint] = useState(breakpoints[0] || null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getBreakpointWidth = useCallback((breakpoint) => {
    return parseInt(breakpoint);
  }, []);

  const getBreakpointHeight = useCallback(() => {
    return 600; // Fixed 600px height
  }, []);

  const sortedBreakpoints = useMemo(() =>
    [...breakpoints].sort((a, b) => getBreakpointWidth(a) - getBreakpointWidth(b)),
    [breakpoints, getBreakpointWidth]
  );

  // Set first breakpoint as default if none selected
  useEffect(() => {
    if (sortedBreakpoints.length > 0 && !selectedBreakpoint) {
      setSelectedBreakpoint(sortedBreakpoints[0]);
    }
  }, [sortedBreakpoints, selectedBreakpoint]);

  if (!url || breakpoints.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 scrollable">
      {/* Full View - All viewports displayed side by side */}
      <div className="glass-panel p-6">
        <div className="glass-header px-6 py-4 flex items-center justify-between mb-6">
          <div className="text-lg font-semibold text-white/90">
            Full View - All Viewports
          </div>
          <div className="text-sm text-white/60">
            {sortedBreakpoints.length} viewports
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/5 to-white/10 p-6">
          <div ref={containerRef} className="flex flex-wrap justify-start items-start gap-8">
            {sortedBreakpoints.map((breakpoint) => {
              const viewportWidth = getBreakpointWidth(breakpoint);
              const viewportHeight = getBreakpointHeight();

              // Only scale if the viewport is wider than the container.
              const scale = containerWidth > 0 && viewportWidth > containerWidth
                ? containerWidth / viewportWidth
                : 1;

              const wrapperStyle = {
                width: `${viewportWidth * scale}px`,
                height: `${viewportHeight * scale}px`,
              };

              const viewportStyle = {
                width: `${viewportWidth}px`,
                height: `${viewportHeight}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              };

              return (
                <div key={breakpoint} className="flex flex-col items-center">
                  <div className="text-sm font-medium text-white/80 mb-3 text-center">
                    {breakpoint}
                    <div className="text-xs text-white/60 mt-1">
                      {viewportWidth} × {viewportHeight}
                    </div>
                    {scale < 1 && (
                      <div className="text-xs text-yellow-400/80 mt-1">
                        (scaled to {Math.round(scale * 100)}%)
                      </div>
                    )}
                  </div>
                  <div style={wrapperStyle}>
                    <div
                      className="bg-white rounded-lg shadow-xl overflow-hidden outline outline-white/20"
                      style={viewportStyle}
                    >
                      <WebViewer url={url} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveViewer; 