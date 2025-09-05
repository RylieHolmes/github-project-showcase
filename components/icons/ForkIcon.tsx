
import React from 'react';

const ForkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
        aria-hidden="true"
    >
        <path fillRule="evenodd" d="M8.25 3.75a.75.75 0 01.75.75v3.75h3a.75.75 0 010 1.5h-3v4.5a.75.75 0 01-1.5 0v-4.5h-3a.75.75 0 010-1.5h3V4.5a.75.75 0 01.75-.75zM15 8.25a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zM15 12a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75zM15 15.75a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M4.5 3.75A2.25 2.25 0 002.25 6v12A2.25 2.25 0 004.5 20.25h15A2.25 2.25 0 0021.75 18V6A2.25 2.25 0 0019.5 3.75h-15zm15 1.5h-15a.75.75 0 00-.75.75v12c0 .414.336.75.75.75h15a.75.75 0 00.75-.75V6a.75.75 0 00-.75-.75z" clipRule="evenodd" />
    </svg>
);

export default ForkIcon;
