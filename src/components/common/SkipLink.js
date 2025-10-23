// src/components/common/SkipLink.js
import React from 'react';

const SkipLink = ({ targetId = 'main-content', children = 'Skip to main content' }) => {
  const handleClick = (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView();
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="btn btn-primary position-absolute"
      style={{
        top: '-100px',
        left: '10px',
        zIndex: 9999,
        transition: 'top 0.3s'
      }}
      onFocus={(e) => {
        e.target.style.top = '10px';
      }}
      onBlur={(e) => {
        e.target.style.top = '-100px';
      }}
    >
      {children}
    </a>
  );
};

export default SkipLink;
