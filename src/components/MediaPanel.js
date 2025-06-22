import React, { useState } from 'react';

const MediaPanel = ({
  activeBreakpoints,
  customBreakpoints,
  onToggleBreakpoint,
  onToggleAll,
  onAddCustom,
  onRemoveCustom
}) => {
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const defaultBreakpoints = ['480px', '735px', '1024px', '1440px'];

  const handleAddCustom = () => {
    if (customInput.trim()) {
      let breakpoint = customInput.trim();
      // Eğer px yoksa ekle
      if (!breakpoint.endsWith('px')) {
        breakpoint += 'px';
      }
      onAddCustom(breakpoint);
      setCustomInput('');
      setShowCustomInput(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddCustom();
    } else if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomInput('');
    }
  };

  const allActive = Object.values(activeBreakpoints).every(Boolean);
  const someActive = Object.values(activeBreakpoints).some(Boolean);

  return (
    <div className="glass-panel p-6 scrollable">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white/90">📱 Screen Sizes</h2>
        <div className="flex gap-3">
          <button
            onClick={() => onToggleAll(true)}
            className={`glass-button text-sm ${allActive ? 'animate-glow' : ''}`}
          >
            <span className="mr-2">✅</span>
            Enable All
          </button>
          <button
            onClick={() => onToggleAll(false)}
            className={`glass-button text-sm ${!someActive ? 'animate-glow' : ''}`}
          >
            <span className="mr-2">❌</span>
            Disable All
          </button>
        </div>
      </div>

      {/* Default Breakpoints - Horizontal layout */}
      <div className="flex flex-wrap gap-3 mb-6">
        {defaultBreakpoints.map((breakpoint) => (
          <button
            key={breakpoint}
            onClick={() => onToggleBreakpoint(breakpoint)}
            className={`glass-toggle text-center transition-all duration-300 ${
              activeBreakpoints[breakpoint] ? 'active' : ''
            }`}
          >
            <div className="font-bold text-base">{breakpoint}</div>
          </button>
        ))}
        
        {/* Custom input right next to it */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="600px"
            className="glass-input w-24 text-center"
            onFocus={() => setShowCustomInput(true)}
          />
          <button
            onClick={handleAddCustom}
            className="glass-button-primary text-sm"
          >
            <span className="mr-1">➕</span>
            Add
          </button>
        </div>
      </div>

      {/* Custom Breakpoints */}
      {customBreakpoints.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white/80 mb-3">🎨 Custom Sizes</h3>
          <div className="flex flex-wrap gap-2">
            {customBreakpoints.map((breakpoint) => (
              <div
                key={breakpoint}
                className={`glass-toggle custom flex items-center gap-2 ${
                  activeBreakpoints[breakpoint] ? 'active' : ''
                }`}
              >
                <button
                  onClick={() => onToggleBreakpoint(breakpoint)}
                  className="flex-1 text-left font-medium text-sm"
                >
                  {breakpoint}
                </button>
                <button
                  onClick={() => onRemoveCustom(breakpoint)}
                  className="text-red-300 hover:text-red-100 text-sm transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPanel; 