import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md p-6 border border-gray-200 ${
        hover ? 'card-hover' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
