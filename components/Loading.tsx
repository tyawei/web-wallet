import React from 'react';

const Loading = ({ 
  size = 40, 
  color = '#007bff', 
  visible = false,
  text = '加载中...'
}) => {
  if (!visible) return null;

  return (
    <div style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        zIndex: "999",
        top: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }}>
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        style={{ animation: 'rotate 2s linear infinite' }}
      >
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="113"
          strokeDashoffset="113"
        >
          <animate
            attributeName="stroke-dashoffset"
            dur="1.5s"
            values="113;0;113"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-opacity"
            dur="1.5s"
            values="1;0.3;1"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      {text && <span style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>{text}</span>}
    </div>
    </div>
  );
};

export default Loading