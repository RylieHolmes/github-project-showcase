import React from 'react';

const CodeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10.5 4.5a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3zM4.125 6.375a.75.75 0 000 1.5h15.75a.75.75 0 000-1.5H4.125zM10.5 18a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3zM4.125 16.125a.75.75 0 000 1.5h15.75a.75.75 0 000-1.5H4.125zM14.25 10.125a.75.75 0 000 1.5h5.625a.75.75 0 000-1.5H14.25zM4.125 10.125a.75.75 0 000 1.5h5.625a.75.75 0 000-1.5H4.125z"
      clipRule="evenodd"
    />
    <path d="M3.75 3A1.75 1.75 0 002 4.75v14.5A1.75 1.75 0 003.75 21h16.5A1.75 1.75 0 0022 19.25V4.75A1.75 1.75 0 0020.25 3H3.75zm.75 1.75v14.5h15V4.75h-15z" />
  </svg>
);

export default CodeIcon;
