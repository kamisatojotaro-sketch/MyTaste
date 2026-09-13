import React from 'react';

export default function EqualizerBars({ className = '', color }) {
  const style = color ? { background: color } : {};
  return (
    <div className={`equalizer-container ${className}`}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="equalizer-bar" style={style} />
      ))}
    </div>
  );
}
