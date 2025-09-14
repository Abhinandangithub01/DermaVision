import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-surface border-b border-border-color sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104l-2.25 1.5a1.5 1.5 0 00-.673.563l-2.25 3.75a1.5 1.5 0 00.22 1.875l2.25 2.25a1.5 1.5 0 002.121 0l3.75-3.75a1.5 1.5 0 00.563-.673l1.5-2.25a1.5 1.5 0 00-1.875-2.22l-2.25.22a1.5 1.5 0 01-1.4-.75l-.75-1.5a1.5 1.5 0 00-1.327-.896zM15 10.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-text-primary ml-3">DermaVision</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;