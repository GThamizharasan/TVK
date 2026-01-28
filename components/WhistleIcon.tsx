
import React from 'react';

const WhistleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.5,6C15.57,6 14,7.57 14,9.5V11H2V17H14V16.5L17.5,20C18.88,20 20,18.88 20,17.5V11C21.1,11 22,10.1 22,9V6H17.5M16,11H14V9.5C14,8.67 14.67,8 15.5,8H16V11M18,17.5C18,17.78 17.78,18 17.5,18L16,16.5V13H18V17.5M20,9H18V8H20V9Z" />
    <circle cx="8" cy="14" r="1.5" fill="white" />
  </svg>
);

export default WhistleIcon;
