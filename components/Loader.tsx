import React from 'react';

const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
    <p className="mt-4 text-lg font-semibold text-text-primary">Analyzing your skin...</p>
    <p className="mt-2 text-sm text-text-secondary">This may take a moment.</p>
  </div>
);

export default Loader;