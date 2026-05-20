import React from 'react';

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="loader-modal">
        <div className="loader-text"></div>
      </div>
    </div>
  );
}

export default Loader;