import React from 'react';

const DashboardLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-200">
          Authenticating...
        </p>
        <p className="text-sm text-gray-300 mt-2">Please wait a moment</p>
      </div>
    </div>
  );
};

export default DashboardLoader;