import React from 'react';
import './ShimmerBorder.css';

const ShimmerBorder = ({ 
  children, 
  className = '', 
  shimmerColor = 'var(--accent-primary)',
  borderRadius = '8px',
  ...props 
}) => {
  return (
    <div 
      className={`shimmer-border ${className}`}
      style={{
        '--shimmer-color': shimmerColor,
        '--border-radius': borderRadius
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default ShimmerBorder;
