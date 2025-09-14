
import React from 'react';

const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-blue"></div>
    <p className="mt-4 text-lg font-semibold text-brand-dark">Analyzing your skin...</p>
    <p className="mt-2 text-sm text-gray-600">This may take a moment.</p>
  </div>
);

export default Loader;
