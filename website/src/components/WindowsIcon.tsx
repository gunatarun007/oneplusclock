import React from 'react';

export const WindowsIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 88 88" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 12.402l35.687-4.86.016 34.423-35.67.243L0 12.402zm35.67 33.528l.027 34.453L.027 75.58 0 46.16l35.67-.23zm4.326-39.027L87.914 0v41.527l-47.918.375V6.903zm47.918 39.522V88L39.996 81.165l-.074-34.99 48.072.25z"/>
  </svg>
);
